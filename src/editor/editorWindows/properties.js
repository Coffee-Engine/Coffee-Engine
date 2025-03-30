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

            myself.Content.appendChild(CUGI.createList(properties, {
                globalChange: onchange,
                preprocess: (item) => {
                    item.text = editor.language[item.translationKey] || (item.translationKey || item.key);

                    //Intercept items call
                    if (typeof item.items == "function") {
                        const oldItems = item.items;
                        item.items = (data) => {
                            const parsed = oldItems(data);

                            //translate the keys
                            for (let itemID in parsed) {
                                if (typeof parsed[itemID] == "object") continue;
                                parsed[itemID] = {text: (editor.language[`${item.translationKey || item.key}.${parsed[itemID]}`] || parsed[itemID]), value: parsed[itemID]};
                            }

                            return parsed
                        }
                    };

                    return item;
                }
            }));
        }

        resized() {}

        dispose() {
            editor.removeEventListener("nodeSelected", () => {
                myself.refreshListing();
            });
        }
    };

    editor.windows.__Serialization.register(editor.windows.properties, "properties");
})();
