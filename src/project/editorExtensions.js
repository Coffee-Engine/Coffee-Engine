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
        constructor(extensionID, file) {
            this.fileReader = new FileReader();
            this.id = extensionID;

            //Read our extension.json
            this.fileReader.onload = async () => {
                project.extensions.storage[extensionID] = JSON.parse(this.fileReader.result);

                //Go through needed script directories
                const myStorage = project.extensions.storage[extensionID];
                await this.loadScripts(`extensions/${extensionID}/`, myStorage.scripts);
                if (coffeeEngine.isEditor) await this.loadScripts(`extensions/${extensionID}/`, myStorage.editorScripts);
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
                            //Isolate the context;
                            scriptElement.innerHTML = `(function() {\n${scriptContents}\n})();`;
                            document.body.appendChild(scriptElement);

                            resolve();
                        };

                        this.fileReader.onerror = () => {
                            reject(`Something happened with file "${path}${scriptArray[index]}"`);
                        };

                        this.fileReader.readAsText(fileData);
                    });
                });
            }
        }
    };
})();
