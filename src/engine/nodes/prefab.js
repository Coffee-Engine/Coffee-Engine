(function() {
    //ANOTHER NODE?!?!
    class prefab extends coffeeEngine.getNode("Node") {
        __showChildren = false;

        #prefabPath = "";
        
        set prefab(value) {
            this.#prefabPath = value;
            this.name = "Loading";
            coffeeEngine.prefabManager.loadPrefab(value).then((prefab) => {
                //Remove each child from existance.
                for (let childID in this.children) {
                    this.children[childID]._dispose();
                }

                //Add our new kids :)
                if (!this.parent) return;

                const currentScene = coffeeEngine.runtime.currentScene;

                //If we are in the editor parent them to our prefab, if not add them to the scene and murder our prefab
                if (coffeeEngine.isEditor) {
                    this.name = prefab.name;
                    currentScene.__deserializeChildren([prefab], this);

                    //set our child properties
                    if (this.children.length > 0) {
                        for (let key in this.#childProps) {
                            this.children[0][key] = currentScene.__deserializeValue(this.#childProps[key]);
                        }
                    }

                    if (this.afterLoad) {
                        this.afterLoad();
                    }
                }
                else {
                    if (coffeeEngine.isEditor) currentScene.__deserializeChildren([prefab], this.parent);
                    const newChild = currentScene.children[currentScene.children.length - 1]; 

                    //set our child properties
                    if (newChild) {
                        for (let key in this.#childProps) {
                            newChild[key] = currentScene.__deserializeValue(this.#childProps[key]);
                        }
                    }

                    if (this.afterLoad) {
                        this.afterLoad();
                    }

                    this._dispose();                
                }
            })
        }

        get prefab() {
            return this.#prefabPath;
        }

        get inPrefab() {
            return this;
        }

        #childProps = {};

        //Yeah yeah
        set childProps(value) {
            this.#childProps = value || {};
        }

        get childProps() {
            //Serialize through our scene
            if (this.children.length > 0) {
                let returned = {};
                
                //yeah
                const currentScene = coffeeEngine.runtime.currentScene;
                const serialized = currentScene.__serializeChildren(this.children);

                //Yeah yeah.
                if (serialized.length > 0) {
                    returned = serialized[0].properties;
                }

                return returned;
            }

            return {};
        }

        getProperties(refreshListing, serializationCall) {
            let moreProperties = [];
            
            //Get our child's properties
            if (this.children.length > 0 && !serializationCall) {
                moreProperties = this.children[0].getProperties();
                for (let propID=0; propID<moreProperties.length; propID++) {
                    //Set our target
                    if (typeof moreProperties[propID] == "object") moreProperties[propID].target = moreProperties[propID].target || this.children[0];
                }
            }

            // prettier-ignore
            return [
                { name: "prefab", translationKey: "engine.nodeProperties.Prefab.prefab", type: coffeeEngine.PropertyTypes.FILE, fileType: "prefab", onchange: (value) => {
                    this.afterLoad = refreshListing;
                }},
                "---",
                ...moreProperties
            ];
        }

        extraSerialize() {
            return [
                "childProps"
            ];
        }
    }

    coffeeEngine.registerNode(prefab, "Prefab", "Node");
})();