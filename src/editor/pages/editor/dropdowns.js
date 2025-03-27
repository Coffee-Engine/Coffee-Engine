(function () {
    //Is this hacky? Maybe. check out the base editor file for the actual dropdowns
    editor.__setupDropdownFunctionality = () => {
        editor.dropdownBar = {
            file: document.getElementById("coffeeEngineProjectDropdown"),
            window: document.getElementById("coffeeEngineWindowDropdown"),
            scene: document.getElementById("coffeeEngineSceneDropdown"),
        };

        editor.dropdownBar.file.onchange = (value) => {
            switch (value) {
                case "save":
                    if (editor.safeties.filePermissions) {
                        editor.updateProjectDB();
                    }
                    project.decaf.save();
                    break;

                case "saveSeperate":
                    project.decaf.save(true);
                    break;

                //Open our project settings menu.
                case "settings":
                    if (!(editor.windows.existing.projectManager && editor.windows.existing.projectManager.length > 0)) {
                        const popupWindow = new editor.windows.projectManager(window.innerWidth / 2, window.innerHeight / 2);
                        popupWindow.x = window.innerWidth / 4;
                        popupWindow.y = window.innerHeight / 4;
                        popupWindow.__moveToTop();
                    }
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

            Object.keys(serializationObject.all).forEach((windowName) => {
                if (windowName == "baseWindow") return;

                //If we only allow one window
                if (serializationObject.data[windowName].onlyOne && editor.windows.existing[windowName]) {
                    if (editor.windows.existing[windowName].length > 0) return;
                }

                //Add it to the list
                windows.push({ text: editor.language[`editor.window.${windowName}`] || windowName, value: windowName });
            });

            return windows;
        };

        editor.dropdownBar.window.onchange = (value) => {
            if (!editor.windows.__Serialization.all[value]) return;

            const createdWindow = new editor.windows.__Serialization.all[value](400, 400);
            createdWindow.__moveToTop();

            createdWindow.x = window.innerWidth / 2 - 200;
            createdWindow.y = window.innerHeight / 2 - 200;
        };

        editor.dropdownBar.scene.onchange = (value) => {
            if (!coffeeEngine.runtime.currentScene) return;

            switch (value) {
                case "save":
                    //Its actually that easy
                    project.setFile(coffeeEngine.runtime.currentScene.scenePath, JSON.stringify(coffeeEngine.runtime.currentScene.serialize()), "application/json");
                    console.log(editor.language["editor.notification.saveScene"].replace("[path]", coffeeEngine.runtime.currentScene.scenePath));
                    break;

                default:
                    break;
            }
        };
    };
})();
