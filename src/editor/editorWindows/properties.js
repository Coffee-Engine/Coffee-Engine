(function () {
    editor.windows.properties = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.properties"];
            this.fileReader = new FileReader();

            const myself = this;

            editor.addEventListener("nodeSelected", (node) => {
                myself.refreshListing(myself, node);
            });
        }

        //Gets the proper listing for object's properties
        refreshListing(myself, { target, type, path, unique }, repeat) {
            myself.Content.innerHTML = "";

            //? Just hope to Zues this works
            //if (target["/__coffeeEngine_CurrentlyParsing__/"]) target["/__coffeeEngine_CurrentlyParsing__/"] = null;

            //The two things we ?Maybe? need;
            let properties = target;
            let onchange;

            //Allow for the property panel on files to refresh the parental listing
            let refreshListing = () => {
                myself.refreshListing(myself, { target: target, type: type, path: path }, true);
            };

            //If we are a file display our name in the property panel
            //If our file has an editor get the property
            if (type == "file") {
                //Split the filename and get the file extension
                const split = target.name.split(".");
                const extension = split[split.length - 1];

                //Declare what file we are editing inside of the div
                myself.Content.innerHTML = `<h2 style="text-align:center;">${target.name}</h2><h3 style="text-align:center;">${Math.floor(target.size / 100) / 10}KB</h3>`;

                //Check for a property editor
                if (editor.filePropertyEditors[extension]) {
                    properties = editor.filePropertyEditors[extension]({ panel: myself, refreshListing: refreshListing });

                    //Special properties for this aka Saving the file
                    onchange = (propertyDef, propertyValue, node) => {
                        properties.onPropertyChange(propertyDef, propertyValue, node);
                        project.setFile(path, JSON.stringify(node));
                    };

                    //Read and parse if nessasary? Necesary? needed... needed.
                    myself.fileReader.onload = () => {
                        myself.ParsedObject = JSON.parse(myself.fileReader.result) || {};
                        this.displayProperties(myself, { read: myself.ParsedObject, target: target, properties: properties }, onchange, !repeat);
                    };

                    //Check to make sure we don't already have this parsed and read
                    if (myself.Current != target) myself.fileReader.readAsText(target);
                    else {
                        this.displayProperties(myself, { read: myself.ParsedObject, target: target, properties: properties }, onchange, !repeat);
                    }
                    myself.Current = target;
                }

                return;
            }

            //If we are a scene node just display our properties
            this.displayProperties(myself, { read: target, properties: properties }, onchange, !repeat);
        }

        //Actually displays the properties of an object
        displayProperties(myself, { read, target, properties }, onchange, initial) {
            target = target || read;

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
            properties.getProperties(read, initial).forEach((property) => {
                //Create our element
                const element = document.createElement("div");
                element.style.margin = "2px";
                myself.Content.appendChild(element);

                switch (typeof property) {
                    case "string":
                        if (property == "---") {
                            element.innerHTML = "<br>";
                        } else {
                            element.innerText = editor.language[`engine.nodePropertyLabels.${property}`] || property;
                        }
                        break;

                    case "object":
                        //Define the property type
                        element.innerText = `${editor.language[property.translationKey] || property.name || "unknown"} : `;

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

            //Convert it
            input.value = Number(nodeValue[partition]);
            if (isNaN(input.value)) input.value = 0;
            //Turn it to degrees if it is in radians
            if (property.isRadians) input.value = coffeeEngine.rad2Deg(input.value);
            if (property.isRadians) {
                input.onchange = () => {
                    node[property.name][partition] = coffeeEngine.deg2Rad(input.value);
                    input.value = coffeeEngine.rad2Deg(nodeValue[partition]);
                    if (onchange) onchange(property, node[property.name], node);
                };
            }
            else {
                input.onchange = () => {
                    node[property.name][partition] = input.value;
                    input.value = nodeValue[partition];
                    if (onchange) onchange(property, node[property.name], node);
                };
            }

            return input;
        }

        propertyDisplays = {
            boolean: (node, property, onchange) => {
                const input = document.createElement("input");
                (input.type = "checkbox"), (input.checked = node[property.name || "name"] || false);

                input.onchange = () => {
                    node[property.name] = input.checked;
                    input.checked = node[property.name || "name"];
                    if (onchange) onchange(property, node[property.name], node);
                };

                return input;
            },

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

                //Check for small range and properly convert
                if (property.smallRange) input.color = coffeeEngine.ColorMath.RGBtoHex({ r: node[property.name || "name"][0] * 255, g: node[property.name || "name"][1] * 255, b: node[property.name || "name"][2] * 255 } || { r: 0, g: 0, b: 255 });
                else input.color = node[property.name || "name"] || "#0000ff";

                input.onchange = () => {
                    //Same for the small range check down here
                    if (property.smallRange) {
                        const split = coffeeEngine.ColorMath.HexToRGB(input.color);
                        node[property.name] = [split.r / 255, split.g / 255, split.b / 255];
                    } else {
                        node[property.name] = input.color;
                    }

                    //Send the color up
                    input.color = node[property.name || "name"];
                    if (onchange) onchange(property, node[property.name], node);
                };

                return input;
            },

            color4: (node, property, onchange) => {
                const input = document.createElement("color-picker");
                input.style.transform = "translate(0%,50%)";
                input.translucency = true;

                //Check for small range and properly convert
                if (property.smallRange) input.color = coffeeEngine.ColorMath.RGBtoHex({ r: node[property.name || "name"][0] * 255, g: node[property.name || "name"][1] * 255, b: node[property.name || "name"][2] * 255, b: node[property.name || "name"][3] * 255 } || { r: 0, g: 0, b: 255, a: 255 });
                else input.color = node[property.name || "name"] || "#0000ff";

                input.onchange = () => {
                    //Same for the small range check down here
                    if (property.smallRange) {
                        const split = coffeeEngine.ColorMath.HexToRGB(input.color);
                        node[property.name] = [split.r / 255, split.g / 255, split.b / 255, split.a / 255];
                    } else {
                        node[property.name] = input.color;
                    }

                    //Send the color up
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
