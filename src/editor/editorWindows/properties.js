(function () {
    editor.windows.properties = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.properties"];
            this.fileReader = new FileReader();

            const myself = this;

            editor.addEventListener("nodeSelected", (node) => {
                myself.refreshListing(node);
            });
        }

        //Gets the proper listing for object's properties
        refreshListing({ target, type, path }, repeat) {
            this.Content.innerHTML = "";

            //? Just hope to Zues this works
            //if (target["/__coffeeEngine_CurrentlyParsing__/"]) target["/__coffeeEngine_CurrentlyParsing__/"] = null;

            //The two things we ?Maybe? need;
            let editorHost = target;
            let onchange;

            //If we are a file display our name in the property panel
            //If our file has an editor get the property
            if (type == "file") {
                //Split the filename and get the file extension
                const split = target.name.split(".");
                const extension = split[split.length - 1];

                //Specifically for these file types
                const refreshListing = () => {
                    this.refreshListing({ target: target, type: type, path: path }, true);
                }

                //Declare what file we are editing inside of the div
                this.Content.innerHTML = `<h2 style="text-align:center;">${target.name}</h2><h3 style="text-align:center;">${Math.floor(target.size / 100) / 10}KB</h3>`;

                //Check for a property editor
                if (editor.filePropertyEditors[extension]) {
                    editorHost = editor.filePropertyEditors[extension]({ panel: this, refreshListing: refreshListing, path: path });

                    //Special properties for this aka Saving the file
                    onchange = (propertyValue, propertyDef) => {
                        editorHost.onPropertyChange(propertyValue, propertyDef);
                        project.setFile(path, JSON.stringify(propertyDef.target));
                    };

                    //Check to make sure we don't already have this parsed and read
                    if (this.Current != target) {
                        //Read and parse if nessasary? Necesary? needed... needed.
                        this.fileReader.onload = () => {
                            this.ParsedObject = JSON.parse(this.fileReader.result) || {};
                            this.display(this.ParsedObject, editorHost.getProperties(this.ParsedObject, !repeat), onchange, editorHost);
                        };

                        this.fileReader.readAsText(target); 
                    }
                    else this.display(this.ParsedObject, editorHost.getProperties(this.ParsedObject, !repeat), onchange, editorHost);

                    this.Current = target;
                }

                return;
            }

            //If we are a node do our basic node things
            const myself = this;
            const baseProperties = editorHost.getProperties();
            let extraProperties = [];

            const readScript = async (scriptPath) => {
                //Reset our extra properties
                extraProperties = [];

                if (!scriptPath) {
                    this.display(target, [...baseProperties, ...extraProperties], onchange);
                    return;
                }

                //Get our properties
                const { properties } = await coffeeEngine.behaviorManager.behaviorPropertiesFromFile(scriptPath, true);

                for (let propertyID in properties) {
                    const property = properties[propertyID];

                    //Configure our properties
                    property.key = property.name;
                    property.target = target.__scriptStartupProps;

                    extraProperties.push(property);
                }
                    
                //Refresh listing
                myself.Content.innerHTML = "";
                this.display(target, [...baseProperties, ...extraProperties], onchange);
            }

            //If we are a scene node just display our properties
            onchange = ( value, { key, target } ) => {
                //Global on change!!!
                if (!(target instanceof coffeeEngine.getNode("Node"))) return;
                
                //If we modify the script of a node do our best to parse the properties
                if (key == "script") {
                    readScript(value);
                }
            }

            //Display our properties
            if (target instanceof coffeeEngine.getNode("Node") && target.script) readScript(target.script);
            else this.display(target, [...baseProperties, ...extraProperties], onchange);
        }

        //Our display function, does some partial parsing then displays the output
        display(target, properties, onchange, host) {
            //Make sure we have propeties
            if (!properties) {
                const notFound = document.createElement("h3");
                notFound.innerText = editor.language["editor.window.properties.notFound"];
                notFound.style.textAlign = "center";
                myself.Content.appendChild(notFound);

                //Halt the train here
                return;
            }
            
            //Set our host if we have none
            host = host || target;
            for (let propID in properties) {
                //Make sure it is an object
                if (typeof properties[propID] != "object") continue;

                //Set our target unless one is specified
                properties[propID].target = properties[propID].target || target;

                //Accept old and new key syntax
                properties[propID].key = properties[propID].key || properties[propID].name;
            }

            //Display the CUGI properties
            this.Content.appendChild(CUGI.createList(properties, {
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

                            return parsed;
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
