(function () {
    editor.windows.fileExplorer = class extends editor.windows.base {
        //For later use. I have an idea of how this can be optimized
        directoryBasin = {}

        displayDirectory = (directory,parentDiv,basin,even,path) => {
            path = path || "";
            const keys = Object.keys(directory).sort();

            keys.forEach(key => {
                //The coffee engine directory handle
                if (key == project.directoryHandleIdentifier) return;
                
                const element = document.createElement("div");
                element.setAttribute("even",even.toString());
                element.className = "fileButton";

                //Basin declaration
                basin.contents[key] = {element:element, isDirectory:!Array.isArray(directory[key])};

                //If we are a directory add contents
                if (basin.contents[key].isDirectory) {
                    basin.contents[key].contents = {};
                }

                //Check if it is a file, or a folder
                if (Array.isArray(directory[key])) {
                    element.innerHTML = `<p style="padding:0px; margin:0px;">${key}</p>`;
                    parentDiv.appendChild(element);

                    element.onclick = (event) => {
                        //Stop propogation
                        event.stopPropagation();
                        const split = key.split(".");

                        editor.sendFileHook(split[split.length - 1],`${path}${key}`);
                    }
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
                        
                        if (lowerDiv.getAttribute("collasped") == "true") lowerDiv.setAttribute("collasped","false");
                        else lowerDiv.setAttribute("collasped","true");
                    }

                    //Do it in this specific order. or else KABOOM!
                    parentDiv.appendChild(element);
                    this.displayDirectory(directory[key],lowerDiv,basin.contents[key],!even,`${path}${key}/`);
                    lowerDiv.fitHeight = lowerDiv.clientHeight;
                    lowerDiv.style.setProperty("--fit-height", `${lowerDiv.fitHeight}px`);
                }
            });
        };

        init(container) {
            this.title = editor.language["editor.window.fileExplorer"];
            container.innerHTML = editor.language["editor.window.fileExplorer.reading"];
            this.updateFunction = (event) => {
                if (!event) event = {type:"ALL", src:"COFFEE_ALL"};
                switch (event.type) {
                    case "ALL":{
                        container.innerHTML = "";

                        this.directoryBasin = {
                            div: container,
                            contents: {}
                        }
                        this.displayDirectory(project.fileSystem,container,this.directoryBasin,false);
                        break;
                    }

                    //There is probably a way better way of doing this
                    case "FILE_ADDED": {
                        container.innerHTML = "";

                        this.directoryBasin = {
                            div: container,
                            contents: {}
                        }
                        this.displayDirectory(project.fileSystem,container,this.directoryBasin,false);
                        break;
                    }
                
                    default:
                        break;
                }
            }

            //Updating stuff
            this.updateListener = coffeeEngine.addEventListener("fileSystemUpdate",this.updateFunction);
        }

        resized() {}

        dispose() {}
    };

    editor.windows.__Serialization.register(editor.windows.fileExplorer,"fileExplorer");
})();
