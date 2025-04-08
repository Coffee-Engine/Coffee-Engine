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

                background: var(--background-1);

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

                display:grid;
                grid-template-columns: auto ${editor.taskbarHeight}px;

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
                user-drag: none;
                -webkit-user-drag: none;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
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
                </dropdown-menu>
                <dropdown-menu id="coffeeEngineWindowDropdown">
                    ${editor.language["editor.dropdown.window"]}
                </dropdown-menu>
                <dropdown-menu id="coffeeEngineSceneDropdown">
                    ${editor.language["editor.dropdown.scene"]}
                    <dropdown-item class="dropdown-menu-fill-down"  value="new">${editor.language["editor.dropdown.scene.new"]}</dropdown-item>
                    <dropdown-item class="dropdown-menu-fill-down"  value="save">${editor.language["editor.dropdown.scene.save"]}</dropdown-item>
                    <dropdown-item class="dropdown-menu-fill-down"  value="load">${editor.language["editor.dropdown.scene.load"]}</dropdown-item>
                </dropdown-menu>
            </div>
            <div class="dockDefault" id="coffeeEngineDock"></div>
            <div class="dockOverlay" id="coffeeEngineDockoverlay"></div>
        </div>
        `;

        editor.pageRoot.appendChild(editor.currentPage.root);

        editor.dock.element = document.getElementById("coffeeEngineDock");
        editor.dock.overlayElement = document.getElementById("coffeeEngineDockoverlay");

        //Our indexedDB store
        const store = editor.indexedDB.getStore("recentprojects", false);

        editor.updateProjectDB = () => {
            project.getFile("project.json").then((result) => {
                const fileReader = new FileReader();

                //Load our projectJSON
                fileReader.onload = () => {
                    //Get our declaration and JSON
                    const projectJSON = JSON.parse(fileReader.result);
                    const projectDeclaration = {
                        handle: project.isFolder ? project.directoryHandle : project.fileHandle,
                        type: project.isFolder ? "folder" : "file",
                        modified: Date.now(),
                        Name: projectJSON.name,
                        projectJSON: fileReader.result,
                    };

                    //Then store it, detecting if the store exists or not
                    store.getKey("projects").then((result) => {
                        if (result) {
                            //Delete any copies of this project
                            const existing = result.find((item) => {
                                return item.projectJSON == fileReader.result;
                            });
                            if (existing) {
                                result.splice(result.indexOf(existing), 1);
                            }

                            //Add our project and update our key
                            result.unshift(projectDeclaration);
                            store.setKey("projects", result);
                        } else {
                            //Initilize our key
                            store.setKey("projects", [projectDeclaration]);
                        }
                    });
                };

                fileReader.readAsText(result);
            });
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
        //sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/testCat.js");

        //Add our scene file hook
        editor.addFileOpenHook(
            "scene",
            (path) => {
                coffeeEngine.runtime.currentScene.openScene(path);
            },
            this
        );

        //Open the user into the defaultScene (once the project config is loaded)
        coffeeEngine.addEventListener("projectSettingsLoaded", () => {
            //Deserialize our windows
            editor.dock.refreshLayout(true);
            editor.__deserializeLayout();
            editor.__setupDropdownFunctionality();

            //Then load default scene
            project.getFile(coffeeEngine.runtime.defaultScene).then((file) => {
                if (!file) return;
                coffeeEngine.runtime.currentScene.openScene(coffeeEngine.runtime.defaultScene);
            }).catch(() => {});
        });
    };
})();
