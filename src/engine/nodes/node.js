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
                
                value.addChild(this,true);
            } else if (typeof value == "undefined" || value == null) {
                console.log("trying to remove child")
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
        }
        get parent() {
            return this.#parent;
        }

        #script;
        set script(value) {
            this.#script = null;

            if (!value) return;

            this.#script = new value();

            if (this.#script.ready) {
                this.#script.ready();
            }
        }

        get script() {
            return this.#script;
        }

        constructor() {
            this.children = [];
            this.name = "node";
        }

        ready() {}

        update(deltaTime) {
            // prettier-ignore
            if (this.#script && this.#script.update) {
                this.#script.update(deltaTime);
            }
        }

        draw() {
            // prettier-ignore
            coffeeEngine.renderer.nodesRendered += 1;
            if (this.#script && this.#script.draw) {
                this.#script.draw();
            }
        }

        //Nothing to really dispose here
        dispose() {}

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
                this.children.splice(this.children.indexOf(child),1);
            }
        }

        //Determines how the object will be sorted
        sortValue() { return 0; }

        //Determines what properties are serialized and added;
        getProperties() { return [{name: "name", type: coffeeEngine.PropertyTypes.NAME}] };
    }

    coffeeEngine.registerNode(node, "Node");
})();
