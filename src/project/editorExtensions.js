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
                    const extensionJson = project.getFile(`extensions/${extID}/extension.json`);

                    //Make sure it exists then parse
                    if (!extensionJson) return;

                    //Read it
                    extensionJson[0].getFile().then((file) => {
                        project.extensions.storage[extID] = new project.extensions.parser(extID, file);
                    });
                });
            })
            //Just a safeguard
            .catch((error) => {
                return;
            });
    };

    coffeeEngine.addEventListener("fileSystemUpdate", (event) => {
        if (event.type == "FINISH_LOADING") project.extensions.checkForExtensions();
    });

    //Doing this so management and reading is slightly easier
    project.extensions.parser = class {
        constructor(extensionID, file) {
            this.fileReader = new FileReader();
            this.id = extensionID;

            //Read our extension.json
            this.fileReader.onload = () => {
                project.extensions.storage[extensionID] = JSON.parse(this.fileReader.result);
                this.loadScripts(`extensions/${extensionID}/`, project.extensions.storage[extensionID].scripts);
            };

            this.fileReader.readAsText(file);
        }

        async loadScripts(path, scriptArray) {
            for (let index = 0; index < scriptArray.length; index++) {
                await new Promise((resolve, reject) => {
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

                    //Load our script
                    let fileData = project.getFile(`${path}${scriptArray[index]}`);

                    //Make sure the file exists
                    if (!fileData) return;

                    fileData[0].getFile().then((file) => {
                        this.fileReader.readAsText(file);
                    });
                });
            }
        }
    };
})();
