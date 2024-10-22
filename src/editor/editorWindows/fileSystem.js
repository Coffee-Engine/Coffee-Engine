(function () {
    editor.windows.fileExplorer = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.fileExplorer"];
            this.updateFunction = (event) => {
                if (!event) event = {type:"ALL", source:"COFFEE_ALL"};
                switch (event.type) {
                    case "ALL":{
                        container.innerHTML = "";
                        const displayDirectory = (directory,parentDiv,even) => {
                            const keys = Object.keys(directory).sort();

                            keys.forEach(key => {
                                //The coffee engine directory handle
                                if (key == project.directoryHandleIdentifier) return;
                                
                                const element = document.createElement("div");
                                element.setAttribute("even",even.toString());
                                element.className = "fileButton";

                                //Check if it is a file, or a folder
                                if (Array.isArray(directory[key])) {
                                    element.innerHTML = `<p style="padding:0px; margin:0px;">${key}</p>`;
                                    parentDiv.appendChild(element);
                                }
                                else {
                                    element.innerHTML = `<p style="padding:0px; margin:0px;">${key}</p>`;

                                    const lowerDiv = document.createElement("div");
                                    lowerDiv.style.margin = "0px";
                                    lowerDiv.style.padding = "0px";
                                    lowerDiv.style.marginLeft = "4px";
                                    element.appendChild(lowerDiv);

                                    displayDirectory(directory[key],lowerDiv,!even);
                                    parentDiv.appendChild(element);
                                }
                            })
                        };

                        displayDirectory(project.fileSystem,container,false);
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
