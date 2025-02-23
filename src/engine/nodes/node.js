(function () {
    class node {
        #parent;
        //We store our update event in here
        __storedUpdate = null;

        set parent(value) {
            if (value != null && value.addChild) {
                // prettier-ignore
                //We add true to remove recursion
                if (this.parent) this.#parent.removeChild(this,true);

                this.#parent = value;

                //* Add our event listeners if they don't exist.
                // prettier-ignore
                if (!coffeeEngine.runtime.currentScene.hasEventListener("update", this.__storedUpdate)) {
                    this.__storedUpdate = (deltaTime) => {this.update(deltaTime)};
                    coffeeEngine.runtime.currentScene.addEventListener("update", this.__storedUpdate);
                }
                // prettier-ignore
                if (!coffeeEngine.runtime.currentScene.inDrawList(this)) {
                    coffeeEngine.runtime.currentScene.addToDrawList(this);
                }

                value.addChild(this, true);
            } else if (typeof value == "undefined" || value == null) {
                //* Remove our event listeners.

                // prettier-ignore
                if (this.parent) this.#parent.removeChild(this,true);

                // prettier-ignore
                if (coffeeEngine.runtime.currentScene.hasEventListener("update", this.__storedUpdate)) {
                    coffeeEngine.runtime.currentScene.removeEventListener("update", this.__storedUpdate);
                    //Clear the update
                    this.__storedUpdate = null;
                }

                // prettier-ignore
                if (coffeeEngine.runtime.currentScene.inDrawList(this)) {
                    coffeeEngine.runtime.currentScene.removeFromDrawList(this);
                }

                this.#parent = null;
            } else {
                console.error(`cannot set parent to ${String(value)}`);
            }

            //Refresh stuff
            if (this.#scriptObject) {
                this.#scriptObject.target = value;
            }

            coffeeEngine.runtime.currentScene.castEvent("childMoved", this);
        }
        get parent() {
            return this.#parent;
        }

        #scriptPath;
        #scriptObject;
        set script(value) {
            this.#scriptPath = null;
            this.#scriptObject = null;

            if (!value) return;

            this.#scriptPath = value;
            if (!coffeeEngine.isEditor) {
                coffeeEngine.behaviorManager.behaviorFromFile(value).then((classObj) => {
                    this.#scriptObject = new classObj();
                    this.#scriptObject.target = this;

                    if (this.#scriptObject.ready) {
                        this.#scriptObject.ready();
                    }
                });
            }
        }

        get script() {
            return this.#scriptPath;
        }

        get scriptObject() {
            return this.#scriptObject;
        }

        constructor() {
            this.children = [];
            this.name = "node";
        }

        ready() {}

        update(deltaTime) {
            // prettier-ignore
            if (this.#scriptObject && this.#scriptObject.update) {
                this.#scriptObject.update(deltaTime);
            }
        }

        clicked(mousePosition) {
            // prettier-ignore
            if (this.#scriptObject && this.#scriptObject.clicked) {
                this.#scriptObject.clicked(mousePosition);
            }
        }

        draw(drawID) {
            // prettier-ignore
            coffeeEngine.renderer.nodesRendered += 1;
            if (this.#scriptObject && this.#scriptObject.draw) {
                this.#scriptObject.draw();
            }
        }

        //Nothing to really dispose here
        dispose() {}

        //The main disposal unit
        _dispose() {
            //Dispose key components
            if (this.#scriptObject && this.#scriptObject.dispose) this.#scriptObject.dispose();
            if (this.parent) this.parent.removeChild(this);

            this.dispose();
            delete this;
        }

        //Determines how the object will be sorted
        sortValue() {
            return 0;
        }

        isColliding() {
            let colliding = false;
            for (child in this.children) {
                return colliding || this.children[child].isColliding();
            }
            return colliding;
        }

        //Children addition
        addChild(child) {
            if (child == this) return;
            if (this.children.includes(child)) return;
            this.children.push(child);
            if (!arguments[1]) child.parent = this;

            coffeeEngine.runtime.currentScene.castEvent("childAdded", child);
        }

        removeChild(child) {
            if (child == this) return;

            if (!arguments[1]) child.parent = null;
            //Splice the child
            if (this.children.includes(child)) {
                this.children.splice(this.children.indexOf(child), 1);
            }
        }

        //Determines what properties are serialized and added;
        getProperties() {
            return [{ name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, "---", { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }];
        }
    }

    coffeeEngine.registerNode(node, "Node");
})();
