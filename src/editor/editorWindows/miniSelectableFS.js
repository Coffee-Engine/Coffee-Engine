(function () {
    editor.windows.modalFileExplorer = class extends editor.windows.base {
        set acceptTypes(value) {
            if (value) this.acceptedTypes = value.split(",");
            else this.acceptedTypes = [];

            //Refresh our FS
            this.displayDirectory(project.fileSystem, this.container, true);
        }

        get acceptTypes() {
            return (this.acceptedTypes || []).join(",");
        }

        set systemRoot(value) {
            this.currentSystemRoot = value;

            this.Content.innerHTML = "";

            this.displayDirectory(this.systemRoot, this.Content, true);
        }

        get systemRoot() {
            return this.currentSystemRoot;
        }

        init(container) {
            this.currentSystemRoot = project.fileSystem;
            this.acceptedTypes = [];
            this.container = container;

            this.dockable = false;
            this.resizable = false;
            this.title = editor.language["editor.window.fileExplorer.select"];

            this.displayDirectory = (directory, parentDiv, even, path) => {
                parentDiv.innerHTML = "";
                path = path || "";
                const keys = Object.keys(directory).sort();

                const hasNamepspaceID = directory[project.namespaceIdentifier] !== undefined;

                keys.forEach((key) => {
                    //The coffee engine directory handle
                    if (key == project.directoryHandleIdentifier || key == project.namespaceIdentifier) return;

                    const element = document.createElement("div");
                    element.setAttribute("even", even.toString());
                    element.className = "fileButton";

                    //Check if it is a file, or a folder
                    if (directory[key] instanceof File || directory[key] instanceof FileSystemFileHandle || typeof directory[key] === "string") {
                        //Check the file extension to make sure the key we are using is aligned with the accepted types
                        let split = key.split(".");
                        if (this.acceptedTypes.length > 0 && !this.acceptedTypes.includes(split[split.length - 1])) return;

                        element.innerHTML = `<p style="padding:0px; margin:0px;">${key}</p>`;
                        parentDiv.appendChild(element);

                        element.onclick = (event) => {
                            //Stop propogation
                            event.stopPropagation();

                            //Call our event
                            this.onFileSelected(`${path}${key}`);
                            this._dispose();
                        };
                    }
                    //For folders we do something similar but with another div inside and create a sub directory basin
                    else {
                        element.innerHTML = `<p style="padding:0px; margin:0px;">${key}</p>`;

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

            this.displayDirectory(this.systemRoot, container, false);
        }

        //Just so we can have our path and eat it too
        onFileSelected(path) {}
    };
})();
