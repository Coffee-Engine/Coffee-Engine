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
            let editorHost = target;
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
                    editorHost = editor.filePropertyEditors[extension]({ panel: myself, refreshListing: refreshListing, path: path });

                    //Special properties for this aka Saving the file
                    onchange = (propertyDef, propertyValue, node) => {
                        editorHost.onPropertyChange(propertyDef, propertyValue, node);
                        project.setFile(path, JSON.stringify(node));
                    };

                    //Read and parse if nessasary? Necesary? needed... needed.
                    myself.fileReader.onload = () => {
                        myself.ParsedObject = JSON.parse(myself.fileReader.result) || {};
                        this.displayProperties(myself, { read: myself.ParsedObject, target: target, editorHost: editorHost }, onchange, !repeat);
                    };

                    //Check to make sure we don't already have this parsed and read
                    if (myself.Current != target) myself.fileReader.readAsText(target);
                    else {
                        this.displayProperties(myself, { read: myself.ParsedObject, target: target, editorHost: editorHost }, onchange, !repeat);
                    }
                    myself.Current = target;
                }

                return;
            }

            //If we are a scene node just display our properties
            this.displayProperties(myself, { read: target, editorHost: editorHost }, onchange, !repeat);
        }

        //Actually displays the properties of an object
        displayProperties(myself, { read, target, editorHost }, onchange, initial) {
            target = target || read;

            //If there is no property editor for this thing
            if (!editorHost.getProperties) {
                const notFound = document.createElement("h3");
                notFound.innerText = editor.language["editor.window.properties.notFound"];
                notFound.style.textAlign = "center";
                myself.Content.appendChild(notFound);

                //Halt the train here
                return;
            }

            //Get properties from our node
            const properties = editorHost.getProperties(read, initial);

            for (let propID in properties) {
                //Make sure it is an object
                if (typeof properties[propID] != "object") continue;

                //Set our target unless one is specified
                properties[propID].target = properties[propID].target || read;
                //Accept old and new key syntax
                properties[propID].key = properties[propID].key || properties[propID].name;
            }

            myself.Content.appendChild(CUGI.createList(properties));
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
    };

    editor.windows.__Serialization.register(editor.windows.properties, "properties");
})();
