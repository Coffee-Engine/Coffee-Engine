(function () {
    editor.windows.fileExplorer = class extends editor.windows.base {
        minWidth = 400;
        minHeight = 200;

        set systemRoot(value) {
            this.currentSystemRoot = value;

            this.Content.innerHTML = "";

            this.displayDirectory(this.systemRoot, this.Content, false);
        }

        get systemRoot() {
            return this.currentSystemRoot;
        }

        makeFileDAD(element, path) {
            //Prevent file opening in the browser
            element.ondragover = (event) => {
                event.preventDefault();
            }

            //file drag and drop
            element.ondrop = (event) => {
                event.preventDefault();
                event.stopImmediatePropagation();

                //Get items in the list
                if (event.dataTransfer.items) {
                    const items = [...event.dataTransfer.items];

                    //Make sure each item is a file and then add it if possible
                    items.forEach(item => {
                        if (item.kind == "file") {
                            const file = item.getAsFile();
                            project.setFile(`${path}${file.name}`, file, file.type);
                        }
                    });
                };
            }
        }

        init(container) {
            this.currentSystemRoot = project.fileSystem;
            this.title = editor.language["editor.window.fileExplorer"];
            let mainContainer = container;
            
            //If we are a folder add a refresh button
            if (project.isFolder) {
                container.style.overflow = "hidden";
                container.style.height = "100%";
                container.style.width = "100%";

                const buttonHolder = document.createElement("div");
                buttonHolder.style.height = "100%";
                buttonHolder.style.width = "100%";
                buttonHolder.style.display = "grid";
                buttonHolder.style.gridTemplateRows = "24px auto";
                
                const refreshButton = document.createElement("button");
                refreshButton.innerText = editor.language["editor.window.fileExplorer.refresh"];

                refreshButton.onclick = () => {
                    project.fileSystem = {};
                    mainContainer.innerHTML = editor.language["editor.window.fileExplorer.reading"];

                    //Rescan
                    project.scanFolder(project.directoryHandle, false, project.fileSystem).then(() => {
                        this.currentSystemRoot = project.fileSystem;
                        
                        mainContainer.innerHTML = "";
                        this.displayDirectory(this.systemRoot, mainContainer, false);
                    })
                }

                mainContainer = document.createElement("div");
                mainContainer.style.overflowY = "scroll";

                buttonHolder.appendChild(refreshButton);
                buttonHolder.appendChild(mainContainer);

                container.appendChild(buttonHolder);
            }

            //Add our reading text
            mainContainer.innerHTML = editor.language["editor.window.fileExplorer.reading"];
            
            //Drag and drop stuff
            this.makeFileDAD(mainContainer, "");

            //Our display function
            this.displayDirectory = (directory, parentDiv, even, path) => {
                path = path || "";
                const keys = Object.keys(directory).sort();

                const hasNamepspaceID = keys[project.namespaceIdentifier] !== undefined;

                keys.forEach((key) => {
                    //The coffee engine directory handle
                    if (key == project.directoryHandleIdentifier || key == project.namespaceIdentifier) return;

                    const element = document.createElement("div");
                    element.setAttribute("even", even.toString());
                    element.className = "fileButton";

                    //Check if it is a file, or a folder
                    if (directory[key] instanceof File || directory[key] instanceof FileSystemFileHandle) {
                        element.innerHTML = `<p style="padding:0px; margin:0px; pointer-events:none;">${key}</p>`;
                        element.lastClick = 0;

                        const refreshText = () => {
                            element.innerHTML = `<p style="padding:0px; margin:0px; pointer-events:none;">${key}</p>`;
                            document.removeEventListener("mousedown", refreshText);
                        };

                        parentDiv.appendChild(element);

                        element.onclick = (event) => {
                            //Stop propogation
                            event.stopPropagation();
                            const split = key.split(".");

                            //Hopefully 66 milliseconds is good requires like fps<5 to break.
                            if (Date.now() - element.lastClick < 200) editor.sendFileHook(split[split.length - 1], `${path}${key}`);
                            element.lastClick = Date.now();
                            editor.selectedNode = directory[key];

                            editor.sendEvent("nodeSelected", { target: directory[key], type: "file", path: `${path}${key}` });
                        };

                        //Our file dropdown
                        element.contextFunction = () => {
                            return [
                                { text: editor.language["editor.window.fileExplorer.openInCode"], value: "codeEditor" },
                                { text: editor.language["editor.window.fileExplorer.rename"], value: "rename" },
                                { text: editor.language["editor.window.fileExplorer.delete"], value: "delete" },
                            ];
                        };

                        element.contentAnswer = (value) => {
                            switch (value) {
                                //Small QOL option here
                                case "codeEditor":
                                    if (editor.windows.existing && editor.windows.existing.codeEditor) {
                                        const split = key.split(".");
                                        if (editor.windows.existing.codeEditor[0]) editor.windows.existing.codeEditor[0].openFile(`${path}${key}`, split[split.length - 1]);
                                    }
                                    break;

                                case "rename":
                                    element.innerHTML = `<input type="text" style="padding:0px; margin:0px; width:100%;" value="${key}"></input>`;
                                    element.children[0].focus();
                                    element.children[0].onkeydown = (event) => {
                                        if (event.code == "Enter") {
                                            project.getFile(`${path}${key}`).then((file) => {
                                                //As long as this actively doesn't kill the program, I'm fine
                                                project.setFile(`${path}${element.children[0].value}`, file, file.type).then(() => {
                                                    project.deleteFile(`${path}${key}`);
                                                });
                                            });
                                            document.removeEventListener("mousedown", refreshText);
                                        }
                                    };

                                    document.addEventListener("mousedown", refreshText);
                                    break;

                                case "delete":
                                    //Delete the bastard
                                    project.deleteFile(`${path}${key}`);
                                    break;

                                default:
                                    break;
                            }
                        };
                    }
                    //For folders we do something similar but with another div inside and create a sub directory basin
                    else {
                        element.innerHTML = `<p style="padding:0px; margin:0px; pointer-events:none;">${key}</p>`;

                        this.makeFileDAD(element, `${path}${key}/`);

                        //Our folder dropdown
                        //Notice the sleek difference.
                        //If somebody would take the time to add folder renaming I will give you a hug.
                        element.contextFunction = () => {
                            return [
                                { text: editor.language["editor.window.fileExplorer.delete"], value: "delete" },
                                { text: editor.language["editor.window.fileExplorer.package"], value: "package" },
                            ];
                        };

                        element.contentAnswer = (value) => {
                            switch (value) {
                                case "delete":
                                    //Die
                                    project.deleteFile(`${path}${key}`);
                                    break;

                                case "package":
                                    project.latte.saveLatteFrom(path);
                                    break;

                                default:
                                    break;
                            }
                        };

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

                        //Special functionality for namepsaces
                        if (hasNamepspaceID && key == "project:") {
                            this.displayDirectory(directory[key], lowerDiv, !even, ``);
                        } else {
                            this.displayDirectory(directory[key], lowerDiv, !even, `${path}${key}/`);
                        }

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
                        mainContainer.innerHTML = "";
                        this.displayDirectory(this.systemRoot, mainContainer, false);
                        break;
                    }

                    //There is probably a way better way of doing this
                    case "FILE_ADDED": {
                        mainContainer.innerHTML = "";

                        this.displayDirectory(this.systemRoot, mainContainer, false);
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

        dispose() {
            coffeeEngine.removeEventListener("fileSystemUpdate", this.updateFunction);
        }
    };

    editor.windows.__Serialization.register(editor.windows.fileExplorer, "fileExplorer");
})();
