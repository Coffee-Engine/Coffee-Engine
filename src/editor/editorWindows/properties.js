(function() {
    editor.windows.properties = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.properties"];

            const myself = this;

            editor.addEventListener("nodeSelected", (node) => {myself.refreshListing(myself,node);});
        }

        refreshListing(myself, node) {
            myself.Content.innerHTML = "";

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
                        element.innerHTML = `${property.name || "unknown"} : `;
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

                let NodeValue = node[property.name || "name"] || {x:0,y:0};

                const xInput = document.createElement("input");
                xInput.type = "number";
                xInput.style.minWidth = "0px";
                xInput.style.borderLeftColor = "#ff0000";

                xInput.value = NodeValue.x;
                xInput.onchange = () => {
                    node[property.name].x = xInput.value;
                    xInput.value = NodeValue.x;
                }

                const yInput = document.createElement("input");
                yInput.type = "number";
                yInput.style.minWidth = "0px";
                yInput.style.borderLeftColor = "#00ff00";

                yInput.value = NodeValue.y;
                yInput.onchange = () => {
                    node[property.name].y = yInput.value;
                    yInput.value = NodeValue.y;
                }

                inputHolder.appendChild(xInput);
                inputHolder.appendChild(yInput);

                return inputHolder;
            },

            vec3: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr";

                let NodeValue = node[property.name || "name"] || {x:0,y:0,z:0};

                const xInput = document.createElement("input");
                xInput.type = "number";
                xInput.style.minWidth = "0px";
                xInput.style.borderLeftColor = "#ff0000";

                xInput.value = NodeValue.x;
                xInput.onchange = () => {
                    node[property.name].x = xInput.value;
                    xInput.value = NodeValue.x;
                }

                const yInput = document.createElement("input");
                yInput.type = "number";
                yInput.style.minWidth = "0px";
                yInput.style.borderLeftColor = "#00ff00";

                yInput.value = NodeValue.y;
                yInput.onchange = () => {
                    node[property.name].y = yInput.value;
                    yInput.value = NodeValue.y;
                }

                const zInput = document.createElement("input");
                zInput.type = "number";
                zInput.style.minWidth = "0px";
                zInput.style.borderLeftColor = "#0000ff";

                zInput.value = NodeValue.z;
                zInput.onchange = () => {
                    node[property.name].z = zInput.value;
                    zInput.value = NodeValue.z;
                }

                inputHolder.appendChild(xInput);
                inputHolder.appendChild(yInput);
                inputHolder.appendChild(zInput);

                return inputHolder;
            },

            vec4: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";

                let NodeValue = node[property.name || "name"] || {x:0,y:0,z:0,w:0};

                const xInput = document.createElement("input");
                xInput.type = "number";
                xInput.style.minWidth = "0px";
                xInput.style.borderLeftColor = "#ff0000";

                xInput.value = NodeValue.x;
                xInput.onchange = () => {
                    node[property.name].x = xInput.value;
                    xInput.value = NodeValue.x;
                }

                const yInput = document.createElement("input");
                yInput.type = "number";
                yInput.style.minWidth = "0px";
                yInput.style.borderLeftColor = "#00ff00";

                yInput.value = NodeValue.y;
                yInput.onchange = () => {
                    node[property.name].y = yInput.value;
                    yInput.value = NodeValue.y;
                }

                const zInput = document.createElement("input");
                zInput.type = "number";
                zInput.style.minWidth = "0px";
                zInput.style.borderLeftColor = "#0000ff";

                zInput.value = NodeValue.z;
                zInput.onchange = () => {
                    node[property.name].z = zInput.value;
                    zInput.value = NodeValue.z;
                }

                const wInput = document.createElement("input");
                wInput.type = "number";
                wInput.style.minWidth = "0px";
                wInput.style.borderLeftColor = "#ffff00";

                wInput.value = NodeValue.w;
                wInput.onchange = () => {
                    node[property.name].w = wInput.value;
                    wInput.value = NodeValue.w;
                }

                inputHolder.appendChild(xInput);
                inputHolder.appendChild(yInput);
                inputHolder.appendChild(zInput);
                inputHolder.appendChild(wInput);

                return inputHolder;
            },

            //Stupid ridiculous never to be used vectors :)
            vec5: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";

                let NodeValue = node[property.name || "name"] || {x:0,y:0,z:0,w:0,u:0};

                const xInput = document.createElement("input");
                xInput.type = "number";
                xInput.style.minWidth = "0px";
                xInput.style.borderLeftColor = "#ff0000";

                xInput.value = NodeValue.x;
                xInput.onchange = () => {
                    node[property.name].x = xInput.value;
                    xInput.value = NodeValue.x;
                }

                const yInput = document.createElement("input");
                yInput.type = "number";
                yInput.style.minWidth = "0px";
                yInput.style.borderLeftColor = "#00ff00";

                yInput.value = NodeValue.y;
                yInput.onchange = () => {
                    node[property.name].y = yInput.value;
                    yInput.value = NodeValue.y;
                }

                const zInput = document.createElement("input");
                zInput.type = "number";
                zInput.style.minWidth = "0px";
                zInput.style.borderLeftColor = "#0000ff";

                zInput.value = NodeValue.z;
                zInput.onchange = () => {
                    node[property.name].z = zInput.value;
                    zInput.value = NodeValue.z;
                }

                const wInput = document.createElement("input");
                wInput.type = "number";
                wInput.style.minWidth = "0px";
                wInput.style.borderLeftColor = "#ffff00";

                wInput.value = NodeValue.w;
                wInput.onchange = () => {
                    node[property.name].w = wInput.value;
                    wInput.value = NodeValue.w;
                }

                const uInput = document.createElement("input");
                uInput.type = "number";
                uInput.style.minWidth = "0px";
                uInput.style.borderLeftColor = "#00ffff";

                uInput.value = NodeValue.u;
                uInput.onchange = () => {
                    node[property.name].u = uInput.value;
                    uInput.value = NodeValue.u;
                }

                inputHolder.appendChild(xInput);
                inputHolder.appendChild(yInput);
                inputHolder.appendChild(zInput);
                inputHolder.appendChild(wInput);
                inputHolder.appendChild(uInput);

                return inputHolder;
            },

            vec6: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr 1fr";

                let NodeValue = node[property.name || "name"] || {x:0,y:0,z:0,w:0,u:0,v:0};

                const xInput = document.createElement("input");
                xInput.type = "number";
                xInput.style.minWidth = "0px";
                xInput.style.borderLeftColor = "#ff0000";

                xInput.value = NodeValue.x;
                xInput.onchange = () => {
                    node[property.name].x = xInput.value;
                    xInput.value = NodeValue.x;
                }

                const yInput = document.createElement("input");
                yInput.type = "number";
                yInput.style.minWidth = "0px";
                yInput.style.borderLeftColor = "#00ff00";

                yInput.value = NodeValue.y;
                yInput.onchange = () => {
                    node[property.name].y = yInput.value;
                    yInput.value = NodeValue.y;
                }

                const zInput = document.createElement("input");
                zInput.type = "number";
                zInput.style.minWidth = "0px";
                zInput.style.borderLeftColor = "#0000ff";

                zInput.value = NodeValue.z;
                zInput.onchange = () => {
                    node[property.name].z = zInput.value;
                    zInput.value = NodeValue.z;
                }

                const wInput = document.createElement("input");
                wInput.type = "number";
                wInput.style.minWidth = "0px";
                wInput.style.borderLeftColor = "#ffff00";

                wInput.value = NodeValue.w;
                wInput.onchange = () => {
                    node[property.name].w = wInput.value;
                    wInput.value = NodeValue.w;
                }

                const uInput = document.createElement("input");
                uInput.type = "number";
                uInput.style.minWidth = "0px";
                uInput.style.borderLeftColor = "#00ffff";

                uInput.value = NodeValue.u;
                uInput.onchange = () => {
                    node[property.name].u = uInput.value;
                    uInput.value = NodeValue.u;
                }

                const vInput = document.createElement("input");
                vInput.type = "number";
                vInput.style.minWidth = "0px";
                vInput.style.borderLeftColor = "#ff00ff";

                vInput.value = NodeValue.v;
                vInput.onchange = () => {
                    node[property.name].v = vInput.value;
                    vInput.value = NodeValue.v;
                }

                inputHolder.appendChild(xInput);
                inputHolder.appendChild(yInput);
                inputHolder.appendChild(zInput);
                inputHolder.appendChild(wInput);
                inputHolder.appendChild(uInput);
                inputHolder.appendChild(vInput);

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

            file: (node, property) => {
                const inputHolder = document.createElement("div");
                inputHolder.style.display = "inline-grid";
                inputHolder.style.gridTemplateColumns = "1fr 1fr";
                
                const pathText = document.createElement("p");
                const button = document.createElement("button");

                pathText.innerText = node[property.name || "name"] || "";
                
                button.onclick = () => {
                    //loadl
                    const newLoadal = new editor.windows.modalFileExplorer(400, 400);

                    newLoadal.__moveToTop();

                    //Note that gifs will not be animated, they do come as non animated too. Like PNGs
                    newLoadal.acceptTypes = property.fileType;
                    newLoadal.x = window.innerWidth.width / 2 - 200;
                    newLoadal.y = window.innerHeight.height / 2 - 200;
                    newLoadal.onFileSelected = (path) => {
                        node[property.name] = path;
                        pathText.innerText = path;
                    };
                }

                inputHolder.appendChild(pathText);
                inputHolder.appendChild(button);

                return inputHolder;
            }
        }
    };

    editor.windows.__Serialization.register(editor.windows.properties, "properties");
})();