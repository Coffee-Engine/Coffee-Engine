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
                grid-template-rows: 16px calc(100% - 16px);
            }

            .dropdownsTopbar {
                background-color: var(--background-2);
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
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
                user-select: none; /* Standard syntax */
            }

            .fileButton {
                background-color: var(--background-2);
                transition: 125ms background-color;
                margin:4px;
                margin-right:0px;
                padding: 4px;
                padding-right: 0px;
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
                user-select: none; /* Standard syntax */
            }

            .fileButton[even="true"] {
                background-color: var(--background-1);
                transition: 125ms background-color;
                margin:4px;
                margin-right:0px;
                padding: 4px;
                padding-right: 0px;
                -webkit-user-select: none; /* Safari */
                -ms-user-select: none; /* IE 10 and IE 11 */
                user-select: none; /* Standard syntax */
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
            <div class="dropdownsTopbar" id="coffeeEngineDropdowns">hi</div>
            <div class="dockDefault" id="coffeeEngineDock"></div>
            <div class="dockOverlay" id="coffeeEngineDockoverlay"></div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);

        editor.dock = {
            refreshLayout:(initial, missingPercentageX, missingPercentageY) => {
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
                    editor.layout.layout[ID].contents.forEach(window => {
                        //Updatte window size to compensate for missing percentage
                        window.size += (missingPercentageY[ID] || 0) / editor.layout.layout[ID].contents.length;

                        //Then update column size
                        rowPercentage += window.size + "% ";
                        if (!window.content.resized) return;
                        window.content.resized();
                    })

                    //Set the grid property
                    subDock.style.setProperty("--dockGridVertical",rowPercentage);
                }

                editor.dock.element.style.setProperty("--dockGridHorizontal",percentages);

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
                    editor.dock.refreshLayout(true, percentageGoneX, percentageGoneY);
                }
            },

            dockWindow:(window,column) => {
                if (window.windowDiv.parentNode) {
                    window.windowDiv.parentNode.removeChild(window.windowDiv);
                }

                window.docked = true;
                window.dockedColumn = column;
                editor.dock.element.children[column].appendChild(window.windowDiv);
            },

            undockWindow:(window) => {
                if (window.windowDiv.parentNode) {
                    window.windowDiv.parentNode.removeChild(window.windowDiv);
                }

                window.docked = false;
                document.body.appendChild(window.windowDiv);

                //Update data for the layout
                if (editor.layout.layout[window.dockedColumn]) editor.layout.layout[window.dockedColumn].contents.splice(editor.layout.layout[window.dockedColumn].contents.findIndex(element => window == element.content),1);
                editor.dock.refreshLayout();

                //finally set the dockedColumn
                window.dockedColumn = 0;
            },

            closeDockWindowUI:() => {
                editor.dock.overlayElement.style.opacity = "0%";
                editor.dock.overlayElement.style.visibility = "hidden";
                editor.dock.overlayElement.style.pointerEvents = "none";
                editor.dock.overlayElement.style.backdropFilter = "";

                //Remove the children. Execute order 66
                editor.dock.overlayElement.innerHTML = "";
            },

            dockWindowUI:(targetWindow) => {
                let percentages = "";

                //Make our overlay visible
                editor.dock.overlayElement.style.opacity = "80%";
                editor.dock.overlayElement.style.visibility = "visible";
                editor.dock.overlayElement.style.pointerEvents = "auto";
                editor.dock.overlayElement.style.backdropFilter = "blur(4px)";

                for (let ID = 0; ID < editor.layout.layout.length; ID++) {
                    percentages += editor.layout.layout[ID].size + "% ";
                    //Get the "Sub Dock" which is the vertical part of the dock
                    let subDock = editor.dock.overlayElement.children[ID];
                    //If there is no "Sub Dock" add one
                    if (!subDock) {
                        subDock = document.createElement("div");
                        subDock.style.display = "grid";
                        subDock.style.gridTemplateRows = "var(--dockGridVertical)";

                        editor.dock.overlayElement.appendChild(subDock);
                    }

                    let rowPercentage = "";
                    editor.layout.layout[ID].contents.forEach(window => {
                        rowPercentage += window.size + "% ";
                        
                        const row = document.createElement("div");
                        row.style.margin = "8px";
                        row.style.backgroundColor = "var(--text-1)";
                        row.style.opacity = "50%";

                        //If we click the center box add the tab, and close the docking UI
                        row.onclick = () => {
                            window.content.__addTab(targetWindow);
                            editor.dock.closeDockWindowUI();
                        }

                        subDock.appendChild(row);
                    })

                    //Set the grid property
                    subDock.style.setProperty("--dockGridVertical",rowPercentage);
                }

                editor.dock.overlayElement.style.setProperty("--dockGridHorizontal",percentages);
            }
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

                    const newWindow = new (windowType)();
                    if (overrideName) {
                        newWindow.title = overrideName;
                    }
    
                    editor.layout.layout[X].contents[Y].content = newWindow;
                    editor.dock.dockWindow(newWindow,X);
                }
                else if (Array.isArray(content)) {
                    let hostWindow;
                    for (let Z = 0; Z < content.length; Z++) {
                        const windowString = content[Z];
                        let windowType = editor.windows.__Serialization.all[windowString];
                        if (!windowType) {
                            overrideName = windowString;
                            windowType = editor.windows.base;
                        }

                        const newWindow = new (windowType)();
                        if (overrideName) {
                            newWindow.title = overrideName;
                        }

                        if (Z == 0) {
                            //Make the host window for the parasites to latch upon
                            hostWindow = newWindow;
                            editor.layout.layout[X].contents[Y].content = newWindow;
                            editor.dock.dockWindow(newWindow,X);
                        }
                        //If it is a parasite latch upon the host
                        else {
                            hostWindow.__addTab(newWindow);
                        }
                    }
                }
            }
        }

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
