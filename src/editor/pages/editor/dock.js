(function() {
    editor.dock = {
        refreshLayout: (initial, missingPercentageX, missingPercentageY) => {
            //Our percentages
            missingPercentageX = missingPercentageX || 0;
            missingPercentageY = missingPercentageY || [0];

            //Set the horizontal grid layout then loop through each item
            let percentages = "";
            for (let ID = 0; ID < editor.layout.layout.length; ID++) {
                //Add the percentage + the missing part
                editor.layout.layout[ID].size += missingPercentageX / editor.layout.layout.length;

                percentages += editor.layout.layout[ID].size + "% ";
                //Get the "Sub Dock" which is the vertical part of the dock
                let subDock = editor.dock.element.children[ID];
                //If there is no "Sub Dock" add one
                if (!subDock) {
                    subDock = document.createElement("div");
                    subDock.style.display = "grid";
                    subDock.style.gridTemplateRows = "var(--dockGridVertical)";

                    editor.dock.element.appendChild(subDock);
                }

                let rowPercentage = "";
                editor.layout.layout[ID].contents.forEach((window) => {
                    //Updatte window size to compensate for missing percentage
                    window.size += (missingPercentageY[ID] || 0) / editor.layout.layout[ID].contents.length;

                    //Then update column size
                    rowPercentage += window.size + "% ";
                    if (!window.content.resized) return;
                    window.content.resized();
                });

                //Set the grid property
                subDock.style.setProperty("--dockGridVertical", rowPercentage);
            }

            editor.dock.element.style.setProperty("--dockGridHorizontal", percentages);

            if (initial) return;

            //Check for holes in the layout
            let backIndent = 0;
            let percentageGoneX = 0;
            let percentageGoneY = [];
            let hadToRemove = false;
            for (let X = 0; X < editor.dock.element.children.length; X++) {
                //Make sure it has a window or 2 in it
                if (editor.dock.element.children[X].children.length > 0) {
                    //Loop over each window and subtract the indent
                    percentageGoneY.push(100);

                    for (let index = 0; index < editor.layout.layout[X].contents.length; index++) {
                        //Wowzers
                        const window = editor.layout.layout[X].contents[index];
                        window.content.dockedColumn -= backIndent;
                        percentageGoneY[X] -= window.size;

                        if (percentageGoneY[X] > 0) {
                            hadToRemove = true;
                        }
                    }
                }
                //If there are no windows remove them and account for that
                else {
                    editor.dock.element.children[X].parentNode.removeChild(editor.dock.element.children[X]);
                    percentageGoneX += editor.layout.layout[X].size;
                    editor.layout.layout.splice(X, 1);

                    //move our X back and add an indent
                    backIndent += 1;
                    X -= 1;

                    //tick this for later
                    hadToRemove = true;
                }
            }

            //If we had to remove something refresh the layout without removal code
            if (hadToRemove) {
                editor.dock.refreshLayout(true, percentageGoneX, percentageGoneY);
            }
        },

        dockWindowDiv: (window, column, rowOveride, adjancency) => {
            if (window.windowDiv.parentNode) {
                window.windowDiv.parentNode.removeChild(window.windowDiv);
            }

            window.docked = true;
            window.dockedColumn = column;
            if (rowOveride !== undefined && editor.dock.element.children[column].children[rowOveride]) {
                console.log(adjancency);
                editor.dock.element.children[column].children[rowOveride].insertAdjacentElement(adjancency, window.windowDiv);
            } else {
                editor.dock.element.children[column].appendChild(window.windowDiv);
            }
        },

        dockWindow: (window, column, row, newColumn, columnBefore, useRows) => {
            let adjancency = "beforebegin";

            if (newColumn) {
                //Differentiate between rows and columns
                if (useRows) {
                    //Resize the columns
                    const halfSize = editor.layout.layout[column].contents[row].size / 2;
                    editor.layout.layout[column].contents.splice(columnBefore ? row : row + 1, 0, { size: halfSize, content: window });
                    editor.layout.layout[column].contents[row + (columnBefore ? 1 : 0)].size = halfSize;

                    //row = columnBefore ? row : row + 1;
                    adjancency = columnBefore ? "beforebegin" : "afterend";
                } else {
                    //Resize the columns
                    const halfSize = editor.layout.layout[column].size / 2;
                    editor.layout.layout.splice(columnBefore ? column : column + 1, 0, { size: halfSize, contents: [{ size: 100, content: window }] });
                    editor.layout.layout[column + (columnBefore ? 1 : 0)].size = halfSize;

                    const subDock = document.createElement("div");
                    subDock.style.display = "grid";
                    subDock.style.gridTemplateRows = "var(--dockGridVertical)";

                    editor.dock.element.children[column].insertAdjacentElement(columnBefore ? "beforebegin" : "afterend", subDock);

                    //MOVE COLUMNS THAT NEED TO BE MOVED!
                    for (let columnPush = column + 1; columnPush < editor.layout.layout.length; columnPush++) {
                        const column = editor.layout.layout[columnPush];
                        column.contents.forEach((window) => {
                            window.content.dockedColumn = columnPush;
                        });
                    }

                    column = columnBefore ? column : column + 1;
                }
            }

            editor.dock.dockWindowDiv(window, column, row, adjancency);

            editor.dock.refreshLayout();
        },

        undockWindow: (window) => {
            if (window.windowDiv.parentNode) {
                window.windowDiv.parentNode.removeChild(window.windowDiv);
            }

            window.docked = false;
            document.body.appendChild(window.windowDiv);

            //Update data for the layout
            if (editor.layout.layout[window.dockedColumn])
                editor.layout.layout[window.dockedColumn].contents.splice(
                    editor.layout.layout[window.dockedColumn].contents.findIndex((element) => window == element.content),
                    1
                );
            editor.dock.refreshLayout();

            //finally set the dockedColumn
            window.dockedColumn = 0;
        },

        closeDockWindowUI: () => {
            editor.dock.overlayElement.style.opacity = "0%";
            editor.dock.overlayElement.style.visibility = "hidden";
            editor.dock.overlayElement.style.pointerEvents = "none";
            editor.dock.overlayElement.style.backdropFilter = "";

            //Remove the children. Execute order 66
            editor.dock.overlayElement.innerHTML = "";
        },

        dockWindowUI: (targetWindow, callback) => {
            let percentages = "";

            //Make our overlay visible
            editor.dock.overlayElement.style.opacity = "80%";
            editor.dock.overlayElement.style.visibility = "visible";
            editor.dock.overlayElement.style.pointerEvents = "auto";
            editor.dock.overlayElement.style.backdropFilter = "blur(4px)";

            for (let ID = 0; ID < editor.layout.layout.length; ID++) {
                percentages += `1.5% ${editor.layout.layout[ID].size - 3}% 1.5% `;

                //Our pushers these let us append elements to either side
                let leftPusher = document.createElement("div");
                leftPusher.style.margin = "8px";
                leftPusher.style.marginLeft = "0px";
                leftPusher.style.backgroundColor = "var(--text-1)";
                leftPusher.style.opacity = "50%";

                leftPusher.onclick = () => {
                    editor.dock.dockWindow(targetWindow, ID, 0, true, true);
                    editor.dock.closeDockWindowUI();
                    callback();
                };

                let rightPusher = document.createElement("div");
                rightPusher.style.margin = "8px";
                rightPusher.style.marginRight = "0px";
                rightPusher.style.backgroundColor = "var(--text-1)";
                rightPusher.style.opacity = "50%";

                rightPusher.onclick = () => {
                    editor.dock.dockWindow(targetWindow, ID, 0, true, false);
                    editor.dock.closeDockWindowUI();
                    callback();
                };

                //Get the "Sub Dock" which is the vertical part of the dock
                let subDock = document.createElement("div");
                subDock.style.display = "grid";
                subDock.style.gridTemplateRows = "var(--dockGridVertical)";

                editor.dock.overlayElement.appendChild(leftPusher);
                editor.dock.overlayElement.appendChild(subDock);
                editor.dock.overlayElement.appendChild(rightPusher);

                let rowPercentage = "";
                for (let rowID = 0; rowID < editor.layout.layout[ID].contents.length; rowID++) {
                    const window = editor.layout.layout[ID].contents[rowID];

                    rowPercentage += `1.5% ${window.size - 3}% 1.5% `;

                    //Our up and down pushers these push elements up and down
                    const topPusher = document.createElement("div");
                    topPusher.style.marginLeft = "8px";
                    topPusher.style.marginRight = "8px";
                    topPusher.style.backgroundColor = "var(--text-1)";
                    topPusher.style.opacity = "50%";

                    topPusher.onclick = () => {
                        editor.dock.dockWindow(targetWindow, ID, rowID, true, true, true);
                        editor.dock.closeDockWindowUI();
                        callback();
                    };

                    const bottomPusher = document.createElement("div");
                    bottomPusher.style.marginLeft = "8px";
                    bottomPusher.style.marginRight = "8px";
                    bottomPusher.style.backgroundColor = "var(--text-1)";
                    bottomPusher.style.opacity = "50%";

                    bottomPusher.onclick = () => {
                        editor.dock.dockWindow(targetWindow, ID, rowID, true, false, true);
                        editor.dock.closeDockWindowUI();
                        callback();
                    };

                    const row = document.createElement("div");
                    row.style.margin = "8px";
                    row.style.backgroundColor = "var(--text-1)";
                    row.style.opacity = "50%";

                    //If we click the center box add the tab, and close the docking UI
                    row.onclick = () => {
                        window.content.__addTab(targetWindow);
                        editor.dock.closeDockWindowUI();
                        callback();
                    };

                    subDock.appendChild(topPusher);
                    subDock.appendChild(row);
                    subDock.appendChild(bottomPusher);
                }

                //Set the grid property
                subDock.style.setProperty("--dockGridVertical", rowPercentage);
            }

            editor.dock.overlayElement.style.setProperty("--dockGridHorizontal", percentages);
        },
    };
})();