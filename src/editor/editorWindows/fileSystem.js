(function () {
    editor.windows.fileExplorer = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.fileExplorer"];
            this.updateFunction = (event) => {
                if (!event) event = {type:"ALL", source:"COFFEE_ALL"};
                switch (event.type) {
                    case "ALL":{
                        container.innerHTML = "";
                        const displayDirectory = (directory,parentDiv) => {
                            const keys = Object.keys(directory);
                            console.log(keys);

                            keys.forEach(key => {
                                if (Array.isArray(directory[key])) {
                                    const element = document.createElement("div");
                                    element.innerHTML = key;
                                    element.className = "fileButton";
                                    parentDiv.appendChild(element);
                                }
                                else {
                                    const element = document.createElement("div");
                                    element.innerHTML = key;
                                    element.className = "fileButton";
                                    parentDiv.appendChild(element);
                                }
                            })
                        };

                        displayDirectory(project.fileSystem,container);
                        break;
                    }
                
                    default:
                        break;
                }
            }

            //Updating stuff
            this.updateListener = coffeeEngine.addEventListener("fileSystemUpdate",this.updateFunction);
            this.updateFunction();
        }

        resized() {}

        dispose() {}
    };

    editor.windows.__Serialization.register(editor.windows.fileExplorer,"fileExplorer");
})();
