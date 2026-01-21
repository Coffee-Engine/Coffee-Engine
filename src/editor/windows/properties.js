(function () {
    editor.windows.properties = class extends editor.windows.base {
        typeManagers = {
            file: (target, path, origData) => {
                const extension = coffeeEngine.getFileExtension(target.name);
                let { size, name } = target;

                this.Content.innerHTML = "";
                
                const fileName = document.createElement("h2");
                fileName.innerText = name;

                const fileSize = document.createElement("h3");
                fileSize.innerText = `${Math.floor(size / 100) / 10}KB`;

                this.Content.appendChild(fileName);
                this.Content.appendChild(fileSize);

                //Check for a property editor
                if (editor.filePropertyEditors[extension]) {
                    let host = editor.fetchFilePropertyEditor(this, path, origData, extension);

                    //Special properties for this aka Saving the file
                    onchange = (propertyValue, propertyDef) => {
                        console.log(propertyValue, propertyDef);
                        host.onPropertyChange(propertyValue, propertyDef);
                        project.setFile(path, JSON.stringify(this.ParsedObject)).then(() => {
                            console.log("material saved", this.ParsedObject);
                        });
                    };

                    //Check to make sure we don't already have this parsed and read
                    if (this.Current != target) {
                        let fileReader = new FileReader();
                        //Read and parse if nessasary? Necesary? needed... needed.
                        fileReader.onload = () => {
                            this.ParsedObject = JSON.parse(fileReader.result) || {};
                            host.getProperties(this.ParsedObject).then((CUGIMenu) => {
                                this.display(this.ParsedObject, CUGIMenu, onchange, host);
                            });
                        };

                        fileReader.readAsText(target); 
                    }
                    else host.getProperties(this.ParsedObject).then((CUGIMenu) => {
                        this.display(this.ParsedObject, CUGIMenu, onchange, host);
                    });

                    this.Current = target;
                }
            },

            node: (target, path, origData) => {
                //If we are a node do our basic node things
                const baseProperties = target.getProperties(this.refreshListing, false);
                let extraProperties = [];

                //If we are a scene node just display our properties
                onchange = ( value, data ) => {
                    if (data) {
                        const target = data.target;
                        const key = data.key ? data.key : "";

                        //Global on change!!!
                        if (!(target instanceof coffeeEngine.getNode("Node"))) return;
                        
                        //If we modify the script of a node do our best to parse the properties
                        if (key == "script") {
                            this.refreshListing(origData);
                        }
                    }
                }

                //Display our properties
                //If we have a script get script properties
                if (target instanceof coffeeEngine.getNode("Node")) {
                    //Reset our extra properties
                    let extraProperties = [];

                    if (!target.script) {
                        this.display(target, baseProperties, onchange);
                        return;
                    }

                    //Get our properties
                    const myself = this;
                    coffeeEngine.behaviorManager.behaviorPropertiesFromFile(target.script, true).then(({ properties }) => {
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
                    });
                }
                else this.display(target, [...baseProperties, ...extraProperties], onchange);
            }
        }

        onNodeSelected(node) {
            this.refreshListing(node);
        }

        init(container) {
            this.title = editor.language["editor.window.properties"];

            editor.addEventListener("nodeSelected", this.onNodeSelected, this);
        }

        //Gets the proper listing for object's properties
        refreshListing(target) {
            this.Content.innerHTML = "";
            if (this.typeManagers[target.type]) this.typeManagers[target.type](target.target, target.path, target);
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
                    item.text = item.text || editor.language[item.translationKey] || (item.translationKey || item.key);

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
            editor.removeEventListener("nodeSelected", this.onNodeSelected);
        }
    };

    editor.windows.__Serialization.register(editor.windows.properties, "properties");
})();
