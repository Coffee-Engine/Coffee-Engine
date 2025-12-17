(function () {
    editor.useCSSFile("editor/css/windows/fileSystem.css", "fileSystem");

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

            //Style our container
            container.style.overflow = "hidden";
            container.style.height = "100%";
            container.style.width = "100%";

            //Add the split button/container holder
            const splitHolder = document.createElement("div");
            splitHolder.style.height = "100%";
            splitHolder.style.width = "100%";
            splitHolder.style.display = "grid";
            splitHolder.style.gridTemplateRows = "24px auto";

            //The button holder, holds various controls
            const buttonHolder = document.createElement("div");
            buttonHolder.style.display = "flex";

            //Default buttons
            {
                //Creation
                const addFile = document.createElement("button");
                addFile.innerText = editor.language["editor.window.fileExplorer.createFile"];

                addFile.onclick = () => {
                    const createdWindow = new editor.windows.fileCreator(400,150);
                    createdWindow.__moveToTop();
                    createdWindow.x = (window.innerWidth / 2) - 200;
                    createdWindow.y = (window.innerHeight / 2) - 100;
                }
                
                buttonHolder.appendChild(addFile);

                //Importing (without having to go through project)
                const importFile = document.createElement("button");
                importFile.innerText = editor.language["editor.window.fileExplorer.importFiles"];

                //Just the same as the other file importer
                importFile.onclick = () => {
                    const fileInput = document.createElement("input");
                    fileInput.type = "file";
                    fileInput.multiple = true;

                    fileInput.onchange = () => {
                        Array.from(fileInput.files).forEach(file => {
                            project.setFile(file.name, file, file.type);
                        });
                    };

                    fileInput.click();
                }
                
                buttonHolder.appendChild(importFile);
            }

            //The main container for the fs
            this.fileContainer = document.createElement("div");
            this.fileContainer.style.overflowY = "scroll";

            splitHolder.appendChild(buttonHolder);
            splitHolder.appendChild(this.fileContainer);

            //Add the split holder
            container.appendChild(splitHolder);
            
            //If we are a folder add a refresh button
            if (project.isFolder) {
                
                const refreshButton = document.createElement("button");
                refreshButton.innerText = editor.language["editor.window.fileExplorer.refresh"];

                refreshButton.onclick = () => {
                    project.fileSystem = {};
                    this.fileContainer.innerHTML = editor.language["editor.window.fileExplorer.reading"];

                    //Rescan
                    project.scanFolder(project.directoryHandle, false, project.fileSystem).then(() => {
                        this.currentSystemRoot = project.fileSystem;
                        
                        this.fileContainer.innerHTML = "";
                        this.displayDirectory(this.systemRoot, this.fileContainer, false);
                    })
                }

                buttonHolder.appendChild(refreshButton);
            }

            //Add our reading text
            this.fileContainer.innerHTML = editor.language["editor.window.fileExplorer.reading"];
            
            //Drag and drop stuff
            this.makeFileDAD(this.fileContainer, "");
            
            this.displayDirectory("");

            //Our update function
            this.updateFunction = (event) => {
                if (!event) event = { type: "ALL", src: "COFFEE_ALL" };
                switch (event.type) {
                    case "ALL": {
                        //Display root when loaded;
                        this.displayDirectory("");
                        break;
                    }

                    //Yes there is
                    case "FILE_ADDED": {
                        if (!event.src.includes("/") && !this.path) return this.displayDirectory(this.path);
                        
                        //Get the folder path
                        const splitpath = event.src.split("/");
                        splitpath.splice(splitpath.length - 1, 1);

                        if (this.path == splitpath.join("/")) {
                            this.displayDirectory(this.path);
                        }
                        break;
                    }

                    default:
                        break;
                }
            };

            //Updating stuff
            this.updateListener = coffeeEngine.addEventListener("fileSystemUpdate", this.updateFunction);
        }

        selected = null;
        path = "";

        displayDirectory(path) {
            this.path = path;
            this.fileContainer.innerHTML = "";
            this.selected = null;

            //Since we can change our "root" we need to do this more manually
            let target = this.currentSystemRoot;
            if (path) {
                const searchPath = path.split("/");

                for (let i in searchPath) {
                    const next = searchPath[i];
                    if (!(target[next] instanceof File)) target = target[searchPath[i]];
                    else {
                        console.warn(`Directory path "${path}" does not exist! File explorer will show nothing.`);
                        return;
                    }
                }
            }

            for (let key in target) {
                let element = null;

                if (target[key] instanceof File) element = this.createFileElement(`${path}${(path) ? "/" : ""}${key}`, key);
                else element = this.createFolderElement(`${path}${(path) ? "/" : ""}${key}`, key);

                this.fileContainer.appendChild(element);
                
                element.onclick = () => {
                    if (this.selected) this.selected.className = "fileSystem-fileElement";
                    element.className = "fileSystem-fileElement fileSystem-fileElement-selected";
                    
                    if (this.selected == element && element.ondouble) element.ondouble();

                    this.selected = element;
                }
            }
        }

        createFolderElement(path, key) {
            const element = document.createElement("div");
            const text = document.createElement("p");

            element.className = "fileSystem-fileElement";
            text.className = "fileSystem-fileText";

            text.innerText = key;

            editor.elementFromLink("editor/windows/fileSystem/folder.svg").then(svg => {
                svg.setAttribute("class", "fileSystem-fileIcon")

                element.appendChild(svg);
                element.appendChild(text);
            });

            element.ondouble = () => {
                this.displayDirectory(path);
            }

            return element;
        }

        createFileElement(path, key) {
            const element = document.createElement("div");
            const text = document.createElement("p");

            element.className = "fileSystem-fileElement";
            text.className = "fileSystem-fileText";

            text.innerText = key;

            const preview = editor.windows.fileExplorer.previews[coffeeEngine.getFileExtension(path)];
            if (preview) {
                const returned = preview(element, path, key);

                if (returned instanceof Promise) returned.then(() => { element.appendChild(text); });
                else element.appendChild(text);
            }
            else {
                editor.elementFromLink("editor/windows/fileSystem/file.svg").then(svg => {
                    svg.setAttribute("class", "fileSystem-fileIcon")

                    element.appendChild(svg);
                    element.appendChild(text);
                });
            }

            return element;
        }

        resized() {}

        dispose() {
            coffeeEngine.removeEventListener("fileSystemUpdate", this.updateFunction);
        }
    };

    editor.windows.fileExplorer.previews = {
        img: (element, path, key) => {
            const imgElement = document.createElement("img");
            imgElement.className = "fileSystem-fileIcon";

            project.getFileContents(path, "dataURL").then((url) => {
                imgElement.src = url;
            });

            element.appendChild(imgElement);
        },
    }

    const imageTypes = coffeeEngine.formats.image;
    for (let extID in imageTypes) {
        editor.windows.fileExplorer.previews[imageTypes[extID]] = editor.windows.fileExplorer.previews.img;
    }

    editor.windows.__Serialization.register(editor.windows.fileExplorer, "fileExplorer");
})();
