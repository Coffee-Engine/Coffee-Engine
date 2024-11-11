(function () {
    editor.editorPage = {};

    editor.editorPage.initilize = () => {
        console.log("Initilizing Editor Page");

        editor.changePage();

        editor.currentPage.root = document.createElement("div");

        editor.currentPage.root.style.position = "absolute";
        editor.currentPage.root.style.top = "0px";
        editor.currentPage.root.style.left = "0px";
        editor.currentPage.root.style.width = "100%";
        editor.currentPage.root.style.height = "100%";

        editor.currentPage.root.innerHTML = `
        <style>
            .dockAndDropdowns {
                position:absolute;
                top:0px;
                left:0px;

                width:100%;
                height:100%;

                display:grid;
                grid-template-rows: 24px calc(100% - 16px);
            }

            .dropdownsTopbar {
                background-color: var(--background-2);
                z-index: 10;
            }

            .window {
                min-height:32px;
                min-width:96px;

                overflow: hidden;
                min-width:0px;
                min-height:0px;

                background-color:var(--background-3);
                border-color:var(--background-4);
                border-style:solid;
                border-width:2px;

                display:grid;
                grid-template-rows: ${editor.taskbarHeight}px auto;

                max-height:100vh;
                max-width:100vw;
            }

            .TaskBar {
                width:100%;
                height:${editor.taskbarHeight}px;

                margin:0px;

                background:${coffeeEngine.taskbarStyles[editor.taskbarStyle]};

                display:grid;
                grid-template-columns: auto ${editor.taskbarHeight}px ${editor.taskbarHeight}px;
                overflow: hidden;
                
                line-height: ${editor.taskbarHeight}px;
                text-align: center;
                vertical-align: middle;
                font-size: Large;

                cursor: grab;
            }

            .closeButton {
                line-height: -${editor.taskbarHeight}px;
                text-align: center;
                vertical-align: middle;
                font-size: Large;
                height:${editor.taskbarHeight}px;
                border-width:0px;
            }

            .logInfo {
                width: 100%;
            }

            .logWarn {                
                background-color: var(--warn);
                color: var(--warn-text);
                font-weight: bold;
            }

            .logError {
                background-color: var(--error);
                color: var(--error-text);
                font-weight: bold;
            }

            .italicThing {
                font-style: italic;
                color: var(--text-2);
            }

            .dockDefault {
                top:0px;
                left:0px;
                padding:0px;
                margin:0px;

                width:100%;
                max-height:calc(100% - 16px);

                overflow:hidden;

                position:relative;
            
                display: grid;

                --dockGridHorizontal: 1fr;

                grid-template-columns: var(--dockGridHorizontal);
            }

            .dockOverlay {
                top:16px;
                left:0px;
                
                position:absolute;
                
                margin:0px;
                padding:0px;

                width:100%;
                height:calc(100% - 16px);
            
                display: grid;

                --dockGridHorizontal: 1fr;
                opacity: 0%;
                transition: 250ms opacity;

                grid-template-columns: var(--dockGridHorizontal);
                overflow:hidden;
                z-index:10000;
                pointer-events:none;
            }

            .windowTab {
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                background-color: var(--background-2);
                margin: 4px;
                margin-top: 6px;
                cursor: pointer;

                transition: 125ms all, visibility 1ms;

                border-style: solid;
                border-width: 2px;
                border-color: var(--background-3);
            }

            

            .windowTab:hover {
                margin: 2px;

                color: var(--text-2);
                background-color: var(--background-3);
            }

            .genericNonSelect {
                -webkit-user-select: none; 
                -ms-user-select: none;
                user-select: none;
            }

            .fileButton {
                background-color: var(--background-2);
                transition: 125ms background-color;
                margin:4px;
                margin-right:0px;
                padding: 4px;
                padding-right: 0px;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            .fileButton[even="true"] {
                background-color: var(--background-1);
                transition: 125ms background-color;
                margin:4px;
                margin-right:0px;
                padding: 4px;
                padding-right: 0px;
                -webkit-user-select: none;
                -ms-user-select: none;
                user-select: none; 
            }

            .fileFolder {
                max-height:var(--fit-height);
                position:relative;
                transition: 125ms all, visibility 1ms;
                overflow:hidden;
            }

            .fileFolder[collasped="true"] {
                max-height:0px;
            }

            .fileButton:hover {
                background-color: var(--background-4);
            }

            @keyframes closeWindow {
                0% {
                    min-height:0px;
                    opacity: 100%;
                }

                50% {
                    opacity: 100%;
                }

                100% {
                    height:0px;
                    opacity: 0%;
                }
            }
        </style>
        <div class="dockAndDropdowns">
            <div class="dropdownsTopbar">
                <dropdown-menu id="coffeeEngineProjectDropdown">
                    ${editor.language["editor.dropdown.project"]}
                    ${
                        !project.isFolder && editor.safeties.filePermissions
                            ? //If we do have the ability to save directly to the same file
                              `<dropdown-item class="dropdown-menu-fill-down" value="save">${editor.language["editor.dropdown.project.save"]}</dropdown-item>
                        <dropdown-item class="dropdown-menu-fill-down" value="saveSeperate">${editor.language["editor.dropdown.project.saveSeperate"]}</dropdown-item>`
                            : //Or if we are in a folder/in an enviornment we can't save directly
                              `<dropdown-item class="dropdown-menu-fill-down" value="saveSeperate">${editor.language["editor.dropdown.project.saveDecaf"]}</dropdown-item>`
                    }
                    <dropdown-item class="dropdown-menu-fill-down" value="settings">${editor.language["editor.dropdown.project.projectSettings"]}</dropdown-item>
                    <dropdown-item class="dropdown-menu-fill-down"  value="settings">${editor.language["editor.dropdown.project.importFile"]}</dropdown-item>
                </dropdown-menu>
                <dropdown-menu id="coffeeEngineWindowDropdown">
                    ${editor.language["editor.dropdown.window"]}
                    <dropdown-item class="dropdown-menu-fill-down"  value="settings">${editor.language["editor.dropdown.project.importFile"]}</dropdown-item>
                </dropdown-menu>
            </div>
            <div class="dockDefault" id="coffeeEngineDock"></div>
            <div class="dockOverlay" id="coffeeEngineDockoverlay"></div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);

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
                    editor.dock.element.children[column].children[rowOveride].insertAdjacentElement(adjancency,window.windowDiv);
                }
                else {
                    editor.dock.element.children[column].appendChild(window.windowDiv);
                }
            },

            dockWindow: (window,column,row,newColumn,columnBefore,useRows) => {
                let adjancency = "beforebegin";

                if (newColumn) {
                    //Differentiate between rows and columns
                    if (useRows) {
                        //Resize the columns
                        const halfSize = editor.layout.layout[column].contents[row].size/2
                        editor.layout.layout[column].contents.splice(columnBefore ? row : row + 1,0,{size:halfSize, content:window});
                        editor.layout.layout[column].contents[row + (columnBefore ? 1 : 0)].size = halfSize;

                        //row = columnBefore ? row : row + 1;
                        adjancency = columnBefore ? "beforebegin" : "afterend";
                    }
                    else {
                        //Resize the columns
                        const halfSize = editor.layout.layout[column].size/2
                        editor.layout.layout.splice(columnBefore ? column : column + 1,0,{size:halfSize, contents:[{size:100,content:window}]});
                        editor.layout.layout[column + (columnBefore ? 1 : 0)].size = halfSize;
    
                        const subDock = document.createElement("div");
                        subDock.style.display = "grid";
                        subDock.style.gridTemplateRows = "var(--dockGridVertical)";
    
                        editor.dock.element.children[column].insertAdjacentElement(columnBefore ? "beforebegin" : "afterend", subDock);

                        //MOVE COLUMNS THAT NEED TO BE MOVED!
                        for (let columnPush = column + 1; columnPush < editor.layout.layout.length; columnPush++) {
                            const column = editor.layout.layout[columnPush];
                            column.contents.forEach(window => {
                                window.content.dockedColumn = columnPush;
                            })
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

            dockWindowUI: (targetWindow,callback) => {
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
                        editor.dock.dockWindow(targetWindow,ID,0,true,true);
                        editor.dock.closeDockWindowUI();
                        callback();
                    }

                    let rightPusher = document.createElement("div");
                    rightPusher.style.margin = "8px";
                    rightPusher.style.marginRight = "0px";
                    rightPusher.style.backgroundColor = "var(--text-1)";
                    rightPusher.style.opacity = "50%";

                    rightPusher.onclick = () => {
                        editor.dock.dockWindow(targetWindow,ID,0,true,false);
                        editor.dock.closeDockWindowUI();
                        callback();
                    }
                    
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
                            editor.dock.dockWindow(targetWindow,ID,rowID,true,true,true);
                            editor.dock.closeDockWindowUI();
                            callback();
                        }

                        const bottomPusher = document.createElement("div");
                        bottomPusher.style.marginLeft = "8px";
                        bottomPusher.style.marginRight = "8px";
                        bottomPusher.style.backgroundColor = "var(--text-1)";
                        bottomPusher.style.opacity = "50%";

                        bottomPusher.onclick = () => {
                            editor.dock.dockWindow(targetWindow,ID,rowID,true,false,true);
                            editor.dock.closeDockWindowUI();
                            callback();
                        }

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

        editor.dock.element = document.getElementById("coffeeEngineDock");
        editor.dock.overlayElement = document.getElementById("coffeeEngineDockoverlay");

        //Deserialize our windows
        editor.dock.refreshLayout(true);
        for (let X = 0; X < editor.layout.layout.length; X++) {
            for (let Y = 0; Y < editor.layout.layout[X].contents.length; Y++) {
                //Our deserialization!
                const content = editor.layout.layout[X].contents[Y].content;

                //If we don't have a valid window just name a blank window after it.
                let overrideName;

                //Window creation
                //if we serialized a string in that field create 1 window
                if (typeof content == "string") {
                    //get the window type
                    let windowType = editor.windows.__Serialization.all[content];
                    if (!windowType) {
                        overrideName = content;
                        windowType = editor.windows.base;
                    }
                    else {
                        windowType = windowType;
                    }

                    const newWindow = new (windowType)();
                    if (overrideName) {
                        newWindow.title = overrideName;
                    }

                    editor.layout.layout[X].contents[Y].content = newWindow;
                    editor.dock.dockWindowDiv(newWindow, X);
                } else if (Array.isArray(content)) {
                    let hostWindow;
                    for (let Z = 0; Z < content.length; Z++) {
                        const windowString = content[Z];
                        let windowType = editor.windows.__Serialization.all[windowString];
                        if (!windowType) {
                            overrideName = windowString;
                            windowType = editor.windows.base;
                        }

                        const newWindow = new windowType();
                        if (overrideName) {
                            newWindow.title = overrideName;
                        }

                        if (Z == 0) {
                            //Make the host window for the parasites to latch upon
                            hostWindow = newWindow;
                            editor.layout.layout[X].contents[Y].content = newWindow;
                            editor.dock.dockWindowDiv(newWindow, X);
                        }
                        //If it is a parasite latch upon the host
                        else {
                            hostWindow.__addTab(newWindow);
                        }
                    }
                }
            }
        }

        editor.dropdownBar = {
            file: document.getElementById("coffeeEngineProjectDropdown"),
            window: document.getElementById("coffeeEngineWindowDropdown"),
        };

        editor.dropdownBar.file.onchange = (value) => {
            switch (value) {
                case "save":
                    project.decaf.save();
                    break;

                case "saveSeperate":
                    project.decaf.save(true);
                    break;

                default:
                    break;
            }
        };

        //Get our available windows to spawn
        editor.dropdownBar.window.getContent = () => {
            //Our rturn and serialization
            const windows = [];
            const serializationObject = editor.windows.__Serialization;

            Object.keys(serializationObject.all).forEach(windowName => {
                if (windowName == "baseWindow") return;

                //If we only allow one window
                if (serializationObject.data[windowName].onlyOne && editor.windows.existing[windowName]) {
                    if (editor.windows.existing[windowName].length > 0) return;
                };

                //Add it to the list
                windows.push({text: editor.language[`editor.window.${windowName}`] || windowName, value: windowName});
            })

            return windows;
        }

        editor.dropdownBar.window.onchange = (value) => {
            if (!editor.windows.__Serialization.all[value]) return;

            const createdWindow = new (editor.windows.__Serialization.all[value])(400,400);
            createdWindow.__moveToTop();

            createdWindow.x = window.innerWidth / 2 - 200;
            createdWindow.y = window.innerHeight / 2 - 200;
        };

        //Load sugarcube blocks
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/motion.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/looks.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/sounds.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/events.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/controls.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/sensing.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/scene.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/operators.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/strings.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/variables.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/lists.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/objects.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/myBlocks.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/debugger.js");
        sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/files.js");
    };
})();
