(function () {
    editor.editorPage = {};

    editor.editorPage.initilize = () => {
        console.log("Initilizing Home Page");

        editor.changePage();

        editor.currentPage.root = document.createElement("div");

        editor.currentPage.root.style.position = "absolute";
        editor.currentPage.root.style.top = "0px";
        editor.currentPage.root.style.left = "0px";
        editor.currentPage.root.style.width = "100%";
        editor.currentPage.root.style.height = "100%";

        editor.currentPage.root.innerHTML = `
        <style>
            .window {
                min-height:32px;
                min-width:96px;

                overflow: hidden;
                min-width:0px;
                min-height:0px;

                background-color:var(--background-3);

                display:grid;
                grid-template-rows: ${editor.taskbarHeight}px auto;

                max-height:100vh;
                max-width:100vw;
            }

            .TaskBar {
                width:100%;
                height:${editor.taskbarHeight}px;

                margin:0px;

                background-color:var(--background-1);

                display:grid;
                grid-template-columns: auto ${editor.taskbarHeight}px;
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
                position:absolute;
                top:0px;
                left:0px;
                padding:0px;
                margin:0px;

                width:100%;
                height:100%;

                overflow:hidden;
            
                display: grid;

                --dockGridHorizontal: 1fr;

                grid-template-columns: var(--dockGridHorizontal);
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
        <div class="dockDefault" id="coffeeEngineDock"></div>
        `;

        document.body.appendChild(editor.currentPage.root);

        editor.dock = {
            refreshLayout:(initial) => {
                //Set the horizontal grid layout then loop through each item
                editor.dock.element.style.setProperty("--dockGridHorizontal",(`${100 / editor.layout.layout.length}% `).repeat(editor.layout.layout.length));
                for (let ID = 0; ID < editor.layout.layout.length; ID++) {
                    //Get the "Sub Dock" which is the vertical part of the dock
                    let subDock = editor.dock.element.children[ID];
                    //If there is no "Sub Dock" add one
                    if (!subDock) {
                        subDock = document.createElement("div");
                        subDock.style.display = "grid";
                        subDock.style.gridTemplateRows = "var(--dockGridVertical)"

                        editor.dock.element.appendChild(subDock);
                    }

                    editor.layout.layout[ID].forEach(window => {
                        if (!window.resized) return;
                        window.resized();
                    })

                    //Set the grid property
                    subDock.style.setProperty("--dockGridVertical",(`${100 / editor.layout.layout[ID].length} `).repeat(editor.layout.layout[ID].length));
                }

                if (initial) return;

                //Check for holes in the layout
                let backIndent = 0;
                let hadToRemove = false;
                for (let X = 0; X < editor.dock.element.children.length; X++) {
                    //Make sure it has a window or 2 in it
                    if (editor.dock.element.children[X].children.length > 0) {
                        //Loop over each window and subtract the indent
                        editor.layout.layout[X].forEach(window => {
                            window.dockedColumn -= backIndent;
                        });
                    }
                    //If there are no windows remove them and account for that
                    else {
                        editor.dock.element.children[X].parentNode.removeChild(editor.dock.element.children[X]);
                        editor.layout.layout.splice(X,1);
                        
                        //move our X back and add an indent
                        backIndent += 1;
                        X -= 1;

                        //tick this for later
                        hadToRemove = true;
                    }
                }

                //If we had to remove something refresh the layout without removal code
                if (hadToRemove) {
                    editor.dock.refreshLayout(true);
                }
            },

            dockWindow:(window,column) => {
                if (window.windowDiv.parentNode) {
                    window.windowDiv.parentNode.removeChild(window.windowDiv);
                }

                window.docked = true;
                window.dockedColumn = column;
                editor.dock.element.children[column].appendChild(window.windowDiv);
            }
        };

        editor.dock.element = document.getElementById("coffeeEngineDock");

        //Deserialize our windows
        editor.dock.refreshLayout(true);
        for (let X = 0; X < editor.layout.layout.length; X++) {
            for (let Y = 0; Y < editor.layout.layout[X].length; Y++) {
                //Our deserialization!
                let windowType = editor.windows.__Serialization.all[editor.layout.layout[X][Y]];

                //If we don't have a valid window just name a blank window after it.
                let overrideName;
                if (!windowType) {
                    overrideName = editor.layout.layout[X][Y];
                    windowType = editor.windows.base;
                }

                //Window creation
                const newWindow = new (windowType)();
                if (overrideName) {
                    newWindow.title = overrideName;
                }

                editor.layout.layout[X][Y] = newWindow;
                editor.dock.dockWindow(newWindow,X);
            }
        }
    };

    editor.editorPage.initilizePanels = () => {
        console.log("initilizing panels");
    };
})();
