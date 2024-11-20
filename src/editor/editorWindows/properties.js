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

                const xInput = document.createElement("input");
                xInput.type = "number";
                xInput.style.borderLeftColor = "#ff0000";

                xInput.value = node[property.name || "name"].x;
                xInput.onchange = () => {
                    node[property.name].x = xInput.value;
                    xInput.value = node[property.name || "name"].x;
                }

                const yInput = document.createElement("input");
                yInput.type = "number";
                yInput.style.borderLeftColor = "#00ff00";

                yInput.value = node[property.name || "name"].x;
                yInput.onchange = () => {
                    node[property.name].x = yInput.value;
                    yInput.value = node[property.name || "name"].x;
                }

                inputHolder.appendChild(xInput);
                inputHolder.appendChild(yInput);

                return inputHolder;
            }
        }
    };

    editor.windows.__Serialization.register(editor.windows.properties, "properties");
})();