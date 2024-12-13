(function () {
    editor.windows.properties = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.properties"];
            this.fileReader = new FileReader();

            const myself = this;

            editor.addEventListener("nodeSelected", (node) => {
                myself.refreshListing(myself, node.target, node.type);
            });
        }

        refreshListing(myself, read, type) {
            myself.Content.innerHTML = "";
            myself.Current = read;

            //? Just hope to Zues this works
            if (read["/__coffeeEngine_CurrentlyParsing__/"]) read["/__coffeeEngine_CurrentlyParsing__/"] = null;

            //The two things we ?Maybe? need;
            let properties = read;
            let onchange;
            
            //Allow for the property panel on files to refresh the parental listing
            let refreshListing = () => {
                myself.refreshListing(myself,read,type);
            }

            //If we are a file display our name in the property panel
            //If our file has an editor get the property
            if (type == "file") {
                //Split the filename and get the file extension
                const split = read.name.split(".");
                const extension = split[split.length - 1];

                //Declare what file we are editing inside of the div
                myself.Content.innerHTML = `<h2 style="text-align:center;">${read.name}</h2><h3 style="text-align:center;">${Math.floor(read.size / 100)/10}KB</h3>`;
                

                //Check for a property editor
                if (editor.filePropertyEditors[extension]) {
                    properties = editor.filePropertyEditors[extension]({panel:myself, refreshListing:refreshListing});
                    onchange = properties.onPropertyChange;
                }
            }

            //If there is no property editor for this thing
            if (!properties.getProperties) {
                const notFound = document.createElement("h3");
                notFound.innerText = editor.language["editor.window.properties.notFound"];
                notFound.style.textAlign = "center";
                myself.Content.appendChild(notFound);

                //Halt the train here
                return;
            }

            //Get properties from our node
            properties.getProperties().forEach((property) => {
                //Create our element
                const element = document.createElement("div");
                element.style.margin = "2px";
                myself.Content.appendChild(element);

                switch (typeof property) {
                    case "string":
                        if (property == "---") {
                            element.innerHTML = "<br>";
                        } else {
                            element.innerText = property;
                        }
                        break;

                    case "object":
                        //Define the property type
                        element.innerText = `${property.name || "unknown"} : `;

                        //Get the property editor of each item
                        if (myself.propertyDisplays[property.type]) element.appendChild(myself.propertyDisplays[property.type](read, property, onchange));
                        break;

                    default:
                        break;
                }
            });
        }

        resized() {}

        dispose() {
            editor.removeEventListener("nodeSelected", () => {
                myself.refreshListing();
            });
        }

        addVectorInput(node, property, nodeValue, partition, color, onchange) {
            const input = document.createElement("input");
            input.type = "number";
            input.style.minWidth = "0px";
            input.style.borderLeftColor = color;

            input.value = nodeValue[partition];
            input.onchange = () => {
                node[property.name][partition] = input.value;
                input.value = nodeValue[partition];
                if (onchange) onchange(property, node[property.name], node);
            };

            return input;
        }

        propertyDisplays = {
            string: (node, property, onchange) => {
                const input = document.createElement("input");
                input.type = "text";

                input.value = node[property.name || "name"];

                input.onchange = () => {
                    node[property.name] = input.value;
                    input.value = node[property.name || "name"];
                    if (onchange) onchange(property, node[property.name], node);
                };

                return input;
            },

            name: (node, property, onchange) => {
                const input = document.createElement("input");
                input.type = "text";

                input.value = node[property.name || "name"];

                input.onchange = () => {
                    node[property.name] = input.value;

                    //Cheap hack like myself
                    coffeeEngine.runtime.currentScene.castEvent("childAdded", node);
                    input.value = node[property.name || "name"];
                    if (onchange) onchange(property, node[property.name], node);
                };

                return input;
            },

            //The numbahs
            float: (node, property, onchange) => {
                const input = document.createElement("input");
                input.type = "number";

                input.value = node[property.name || "name"];

                input.onchange = () => {
                    node[property.name] = input.value;
                    input.value = node[property.name || "name"];
                    if (onchange) onchange(property, node[property.name], node);
                };

                return input;
            },

            int: (node, property, onchange) => {
                const input = document.createElement("input");
                input.type = "number";

                input.value = node[property.name || "name"];

                input.onchange = () => {
                    input.value = Math.round(input.value);

                    node[property.name] = input.value;
                    input.value = node[property.name || "name"];
                    if (onchange) onchange(property, node[property.name], node);
                };

                return input;
            },

            vec2: (node, property, onchange) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr";

                let nodeValue = node[property.name || "name"] || { x: 0, y: 0 };

                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "x", "#ff0000", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "y", "#00ff00", onchange));

                return inputHolder;
            },

            vec3: (node, property, onchange) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr";

                let nodeValue = node[property.name || "name"] || { x: 0, y: 0, z: 0 };

                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "x", "#ff0000", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "y", "#00ff00", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "z", "#0000ff", onchange));

                return inputHolder;
            },

            vec4: (node, property, onchange) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";

                let nodeValue = node[property.name || "name"] || { x: 0, y: 0, z: 0, w: 0 };

                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "x", "#ff0000", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "y", "#00ff00", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "z", "#0000ff", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "w", "#ffff00", onchange));

                return inputHolder;
            },

            //Stupid ridiculous never to be used vectors :)
            //I swear to god if someone finds a use for these
            vec5: (node, property, onchange) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";

                let nodeValue = node[property.name || "name"] || { x: 0, y: 0, z: 0, w: 0, u: 0 };

                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "x", "#ff0000", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "y", "#00ff00", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "z", "#0000ff", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "w", "#ffff00", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "u", "#00ffff", onchange));

                return inputHolder;
            },

            vec6: (node, property, onchange) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr";

                let nodeValue = node[property.name || "name"] || { x: 0, y: 0, z: 0, w: 0, u: 0, v: 0 };

                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "x", "#ff0000", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "y", "#00ff00", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "z", "#0000ff", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "w", "#ffff00", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "u", "#00ffff", onchange));
                inputHolder.appendChild(this.addVectorInput(node, property, nodeValue, "v", "#ff00ff", onchange));

                return inputHolder;
            },

            //Colors
            color3: (node, property, onchange) => {
                const input = document.createElement("color-picker");
                input.style.transform = "translate(0%,50%)";

                input.color = node[property.name || "name"] || "#0000ff";

                input.onchange = () => {
                    node[property.name] = input.color;
                    input.color = node[property.name || "name"];
                    if (onchange) onchange(property, node[property.name], node);
                };

                return input;
            },

            color4: (node, property, onchange) => {
                const input = document.createElement("color-picker");
                input.style.transform = "translate(0%,50%)";
                input.translucency = true;

                input.color = node[property.name || "name"] || "#0000ff";

                input.onchange = () => {
                    node[property.name] = input.color;
                    input.color = node[property.name || "name"];
                    if (onchange) onchange(property, node[property.name], node);
                };

                return input;
            },

            //Files
            file: (node, property, onchange) => {
                const button = document.createElement("button");

                button.innerText = node[property.name || "name"] || editor.language["editor.window.properties.noFile"];

                button.onclick = () => {
                    //loadl
                    const newLoadal = new editor.windows.modalFileExplorer(400, 400);

                    newLoadal.__moveToTop();

                    //Note that gifs will not be animated, they do come as non animated too. Like PNGs
                    newLoadal.acceptTypes = property.fileType;
                    if (property.systemRoot) newLoadal.systemRoot = property.systemRoot;
                    newLoadal.x = window.innerWidth / 2 - 200;
                    newLoadal.y = window.innerHeight / 2 - 200;
                    newLoadal.onFileSelected = (path) => {
                        node[property.name] = path;
                        button.innerText = path;
                        if (onchange) onchange(property, node[property.name], node);
                    };
                };

                return button;
            },
        };
    };

    editor.windows.__Serialization.register(editor.windows.properties, "properties");
})();
