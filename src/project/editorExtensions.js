(function () {
    project.extensions = {
        storage: {},
        readingExtID: 0,
    };

    project.extensions.checkForExtensions = async () => {
        console.log("looking for extensions");
        //Get our extension directory
        project
            .getFile("extensions")
            .then((extensionDir) => {
                Object.keys(extensionDir).forEach((extID) => {
                    if (extID == "/____DIRECTORY__HANDLE____/") return;
                    if (project.extensions.storage[extID]) return;

                    //Our parse function

                    //Get our file
                    project.getFile(`extensions/${extID}/extension.json`).then((extensionJson) => {
                        //Make sure it exists then parse
                        if (!extensionJson) return;

                        project.extensions.storage[extID] = new project.extensions.parser(extID, extensionJson);
                    });
                });
            })
            //Just a safeguard
            .catch((error) => {
                return;
            });
    };

    coffeeEngine.addEventListener("fileSystemUpdate", (event) => {
        if (event.type == "FINISH_LOADING") {
            project.extensions.checkForExtensions();
        }
    });

    //Doing this so management and reading is slightly easier
    project.extensions.parser = class {
        scriptElements = [];

        constructor(extensionID, file) {
            this.fileReader = new FileReader();
            this.id = extensionID;
            this.path = `extensions/${extensionID}/`;

            //Read our extension.json
            this.fileReader.onload = async () => {
                project.extensions.storage[extensionID] = JSON.parse(this.fileReader.result);
                this.myStorage = project.extensions.storage[extensionID];
                this.myStorage.object = this;

                //Go through needed script directories
                await this.loadScripts(this.path, this.myStorage.scripts);
                if (coffeeEngine.isEditor) await this.loadScripts(this.path, this.myStorage.editorScripts);
            };

            this.fileReader.readAsText(file);
        }

        async loadScripts(path, scriptArray) {
            //Just make sure its an array!
            scriptArray = scriptArray || [];

            for (let index = 0; index < scriptArray.length; index++) {
                await new Promise((resolve, reject) => {
                    //Load our script
                    project.getFile(`${path}${scriptArray[index]}`).then((fileData) => {
                        //reading our files
                        this.fileReader.onload = () => {
                            //Get our script contents
                            const scriptContents = this.fileReader.result;
                            const scriptElement = document.createElement("script");

                            //Append our script element! This is a tool that may come in handy later
                            this.scriptElements.push(scriptElement);

                            //Isolate the context; Pass in EXT_ID and EXT_PATH
                            scriptElement.innerHTML = `(function(EXT_ID, EXT_PATH) {\n${scriptContents}\n})("${this.id}", "${path}");`;
                            document.body.appendChild(scriptElement);

                            resolve();
                        };

                        this.fileReader.onerror = (error) => {
                            reject(`Something happened with file "${path}${scriptArray[index]}\n: ERROR :\n${error}"`);
                        };

                        this.fileReader.readAsText(fileData);
                    });
                });
            }
        }

        async reloadExtension() {
            await this.disposeExtension(true);

            await this.loadScripts(this.path, this.myStorage.scripts);
            if (coffeeEngine.isEditor) await this.loadScripts(this.path, this.myStorage.editorScripts);

            console.log(editor.language["editor.notification.extensionReloaded"].replace("[extension]", this.id));

            //Reload the scene
            coffeeEngine.runtime.currentScene.openScene(coffeeEngine.runtime.currentScene.scenePath);
        }

        async disposeExtension(noSceneRefresh) {
            coffeeEngine.sendEvent("extensionDispose", { ID: this.id, type: "RELOAD" });

            for (let scriptID in this.scriptElements) {
                let script = this.scriptElements[scriptID];
                script.parentElement.removeChild(script);
            }

            this.scriptElements = [];

            //Reload the scene if needed
            if (!noSceneRefresh) coffeeEngine.runtime.currentScene.openScene(coffeeEngine.runtime.currentScene.scenePath);
        }
    };
})();
