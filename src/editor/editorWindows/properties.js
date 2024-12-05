(function() {
    editor.windows.properties = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.properties"];

            const myself = this;

            editor.addEventListener("nodeSelected", (node) => {myself.refreshListing(myself,node.target,node.type);});
        }

        refreshListing(myself, node, type) {
            myself.Content.innerHTML = "";

            //If we are a file display our name in the property panel
            if (type == "file") myself.Content.innerHTML = `<h2 style="text-align:center;">${node.name}</h2>`;

            //If there is no property editor for this thing
            if (!node.getProperties) {
                const notFound = document.createElement("h3");
                notFound.innerText = editor.language["editor.window.properties.notFound"];
                notFound.style.textAlign = "center";
                myself.Content.appendChild(notFound);

                //Halt the train here
                return;
            }

            node.getProperties().forEach(property => {
                const element = document.createElement("div");
                element.style.margin = "2px";
                myself.Content.appendChild(element);

                switch (typeof property) {
                    case "string":
                        if (property == "---") {
                            element.innerHTML = "<br>";
                        }
                        else {
                            element.innerText = property;
                        }
                        break;

                    case "object":
                        //Create a grid
                        element.innerText = `${property.name || "unknown"} : `;
                        if (myself.propertyDisplays[property.type]) element.appendChild(myself.propertyDisplays[property.type](node, property));
                        break
                
                    default:
                        break;
                }
            })
        }

        resized() {}

        dispose() {
            editor.removeEventListener("nodeSelected", () => {myself.refreshListing();});
        }

        addVectorInput(node,property,nodeValue,partition,color) {
            const input = document.createElement("input");
            input.type = "number";
            input.style.minWidth = "0px";
            input.style.borderLeftColor = color;

            input.value = nodeValue[partition];
            input.onchange = () => {
                node[property.name][partition] = input.value;
                input.value = nodeValue[partition];
            }

            return input;
        }

        propertyDisplays = {
            string: (node, property) => {
                const input = document.createElement("input");
                input.type = "text";

                input.value = node[property.name || "name"];

                input.onchange = () => {
                    node[property.name] = input.value;
                    input.value = node[property.name || "name"];
                }

                return input;
            },

            name: (node, property) => {
                const input = document.createElement("input");
                input.type = "text";

                input.value = node[property.name || "name"];

                input.onchange = () => {
                    node[property.name] = input.value;

                    //Cheap hack like myself
                    coffeeEngine.runtime.currentScene.castEvent("childAdded", node);
                    input.value = node[property.name || "name"];
                }

                return input;
            },

            //The numbahs
            float: (node, property) => {
                const input = document.createElement("input");
                input.type = "number";

                input.value = node[property.name || "name"];

                input.onchange = () => {
                    node[property.name] = input.value;
                    input.value = node[property.name || "name"];
                }

                return input;
            },

            int: (node, property) => {
                const input = document.createElement("input");
                input.type = "number";

                input.value = node[property.name || "name"];

                input.onchange = () => {
                    input.value = Math.round(input.value);

                    node[property.name] = input.value;
                    input.value = node[property.name || "name"];
                }

                return input;
            },

            vec2: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr";

                let nodeValue = node[property.name || "name"] || {x:0,y:0};

                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"x","#ff0000"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"y","#00ff00"));

                return inputHolder;
            },

            vec3: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr";

                let nodeValue = node[property.name || "name"] || {x:0,y:0,z:0};

                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"x","#ff0000"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"y","#00ff00"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"z","#0000ff"));

                return inputHolder;
            },

            vec4: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";

                let nodeValue = node[property.name || "name"] || {x:0,y:0,z:0,w:0};

                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"x","#ff0000"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"y","#00ff00"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"z","#0000ff"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"w","#ffff00"));

                return inputHolder;
            },

            //Stupid ridiculous never to be used vectors :)
            vec5: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";

                let nodeValue = node[property.name || "name"] || {x:0,y:0,z:0,w:0,u:0};

                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"x","#ff0000"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"y","#00ff00"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"z","#0000ff"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"w","#ffff00"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"u","#00ffff"));

                return inputHolder;
            },

            vec6: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr";

                let nodeValue = node[property.name || "name"] || {x:0,y:0,z:0,w:0,u:0,v:0};

                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"x","#ff0000"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"y","#00ff00"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"z","#0000ff"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"w","#ffff00"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"u","#00ffff"));
                inputHolder.appendChild(this.addVectorInput(node,property,nodeValue,"v","#ff00ff"));

                return inputHolder;
            },

            //Colors
            color3: (node, property) => {
                const input = document.createElement("color-picker");
                input.style.transform = "translate(0%,50%)";

                input.color = node[property.name || "name"] || "#0000ff";

                input.onchange = () => {
                    node[property.name] = input.color;
                    input.color = node[property.name || "name"];
                }

                return input;
            },
            
            color4: (node, property) => {
                const input = document.createElement("color-picker");
                input.style.transform = "translate(0%,50%)";
                input.translucency = true;

                input.color = node[property.name || "name"] || "#0000ff";

                input.onchange = () => {
                    node[property.name] = input.color;
                    input.color = node[property.name || "name"];
                }

                return input;
            },

            //Files
            file: (node, property) => {
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
                    };
                }

                return button;
            }
        }
    };

    editor.windows.__Serialization.register(editor.windows.properties, "properties");
})();