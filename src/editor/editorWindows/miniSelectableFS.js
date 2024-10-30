(function () {
    editor.windows.modalFileExplorer = class extends editor.windows.base {
        //For later use. I have an idea of how this can be optimized
        directoryBasin = {};

        init(container) {
            this.resizable = false;
            this.title = editor.language["editor.window.fileExplorer.select"];

            const displayDirectory = (directory,parentDiv,even,path) => {
                path = path || "";
                const keys = Object.keys(directory).sort();

                keys.forEach((key) => {
                    //The coffee engine directory handle
                    if (key == project.directoryHandleIdentifier) return;

                    const element = document.createElement("div");
                    element.setAttribute("even", even.toString());
                    element.className = "fileButton";

                    //Check if it is a file, or a folder
                    if (Array.isArray(directory[key])) {
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
                        displayDirectory(directory[key], lowerDiv, !even, `${path}${key}/`);
                        lowerDiv.fitHeight = lowerDiv.clientHeight;
                        lowerDiv.style.setProperty("--fit-height", `${lowerDiv.fitHeight}px`);
                    }
                });
            };

            //We will display our thing
            console.log(this);
            displayDirectory(project.fileSystem, container, false);
        }

        //Just so we can have our path and eat it too
        onFileSelected(path) {}
    };
})();
