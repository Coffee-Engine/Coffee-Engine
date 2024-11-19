(function () {
    editor.windows.fileExplorer = class extends editor.windows.base {
        //For later use. I have an idea of how this can be optimized
        directoryBasin = {};

        minWidth = 400;
        minHeight = 200;

        init(container) {
            this.title = editor.language["editor.window.fileExplorer"];
            container.innerHTML = editor.language["editor.window.fileExplorer.reading"];
            //Our display function
            this.displayDirectory = (directory, parentDiv, basin, even, path) => {
                path = path || "";
                const keys = Object.keys(directory).sort();
    
                keys.forEach((key) => {
                    //The coffee engine directory handle
                    if (key == project.directoryHandleIdentifier) return;
    
                    const element = document.createElement("div");
                    element.setAttribute("even", even.toString());
                    element.className = "fileButton";
    
                    //Basin declaration
                    basin.contents[key] = { element: element, isDirectory: !Array.isArray(directory[key]) };
    
                    //If we are a directory add contents
                    if (basin.contents[key].isDirectory) {
                        basin.contents[key].contents = {};
                    }
    
                    //Check if it is a file, or a folder
                    if (directory[key] instanceof File || directory[key] instanceof FileSystemFileHandle) {
                        element.innerHTML = `<p style="padding:0px; margin:0px; pointer-events:none;">${key}</p>`;

                        const refreshText = () => {
                            element.innerHTML = `<p style="padding:0px; margin:0px; pointer-events:none;">${key}</p>`;
                            document.removeEventListener("mousedown", refreshText);
                        }

                        parentDiv.appendChild(element);
    
                        element.onclick = (event) => {
                            //Stop propogation
                            event.stopPropagation();
                            const split = key.split(".");
    
                            editor.sendFileHook(split[split.length - 1], `${path}${key}`);
                        };

                        //Our file dropdown
                        element.contextFunction = () => {
                            return [
                                {text: editor.language["editor.window.fileExplorer.rename"], value: "rename"},
                                {text: editor.language["editor.window.fileExplorer.delete"], value: "delete"},
                            ];
                        }

                        element.contentAnswer = (value) => {
                            switch (value) {
                                case "rename":
                                    element.innerHTML = `<input type="text" style="padding:0px; margin:0px; width:100%;" value="${key}"></input>`;
                                    element.children[0].focus();
                                    element.children[0].onkeydown = (event) => {
                                        if (event.code == "Enter") {
                                            project.getFile(`${path}${key}`).then((file) => {
                                                //As long as this actively doesn't kill the program, I'm fine
                                                project.setFile(`${path}${element.children[0].value}`, file, file.type);
                                                project.deleteFile(`${path}${key}`);
                                            })
                                            document.removeEventListener("mousedown", refreshText);
                                        }
                                    }

                                    document.addEventListener("mousedown", refreshText);
                                    break;
                                
                                case "delete":
                                    //Delete the bastard
                                    project.deleteFile(`${path}${key}`);
                                    break;
                            
                                default:
                                    break;
                            }
                        }
                    }
                    //For folders we do something similar but with another div inside and create a sub directory basin
                    else {
                        element.innerHTML = `<p style="padding:0px; margin:0px; pointer-events:none;">${key}</p>`;

                        //Our folder dropdown
                        //Notice the sleek difference.
                        //If somebody would take the time to add folder renaming I will give you a hug.
                        element.contextFunction = () => {
                            return [
                                {text: editor.language["editor.window.fileExplorer.delete"], value: "delete"},
                            ];
                        }

                        element.contentAnswer = (value) => {
                            switch (value) {                                
                                case "delete":
                                    //Die
                                    project.deleteFile(`${path}${key}`);
                                    break;
                            
                                default:
                                    break;
                            }
                        }
    
                        const lowerDiv = document.createElement("div");
                        lowerDiv.style.margin = "0px";
                        lowerDiv.style.padding = "0px";
                        lowerDiv.style.marginLeft = "4px";
                        lowerDiv.className = "fileFolder";
                        element.appendChild(lowerDiv);
    
                        element.onclick = (event) => {
                            //Stop propogation
                            event.stopPropagation();
                            lowerDiv.style.setProperty("--fit-height", `${lowerDiv.fitHeight}px`);
    
                            if (lowerDiv.getAttribute("collasped") == "true") lowerDiv.setAttribute("collasped", "false");
                            else lowerDiv.setAttribute("collasped", "true");
                        };
    
                        //Do it in this specific order. or else KABOOM!
                        parentDiv.appendChild(element);
                        this.displayDirectory(directory[key], lowerDiv, basin.contents[key], !even, `${path}${key}/`);
                        lowerDiv.fitHeight = lowerDiv.clientHeight;
                        lowerDiv.style.setProperty("--fit-height", `${lowerDiv.fitHeight}px`);
                    }
                });
            };

            //Our update function
            this.updateFunction = (event) => {
                if (!event) event = { type: "ALL", src: "COFFEE_ALL" };
                switch (event.type) {
                    case "ALL": {
                        container.innerHTML = "";

                        this.directoryBasin = {
                            div: container,
                            contents: {},
                        };
                        this.displayDirectory(project.fileSystem, container, this.directoryBasin, false);
                        break;
                    }

                    //There is probably a way better way of doing this
                    case "FILE_ADDED": {
                        container.innerHTML = "";

                        this.directoryBasin = {
                            div: container,
                            contents: {},
                        };
                        this.displayDirectory(project.fileSystem, container, this.directoryBasin, false);
                        break;
                    }

                    default:
                        break;
                }
            };

            this.updateFunction();

            //Updating stuff
            this.updateListener = coffeeEngine.addEventListener("fileSystemUpdate", this.updateFunction);
        }

        resized() {}

        dispose() {}
    };

    editor.windows.__Serialization.register(editor.windows.fileExplorer, "fileExplorer");
})();
