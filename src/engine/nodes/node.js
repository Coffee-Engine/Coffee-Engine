(function () {
    class node {
        #parent;
        set parent(value) {
            if (value.addChild) {
                // prettier-ignore
                if (this.parent) this.#parent.removeChild(this);

                this.#parent = value;

                //* Add our event listeners if they don't exist.
                // prettier-ignore
                if (!coffeeEngine.runtime.currentScene.hasEventListener("update", (deltaTime) => {this.update(deltaTime)})) {
                    coffeeEngine.runtime.currentScene.addEventListener("update", (deltaTime) => {this.update(deltaTime)});
                }
                // prettier-ignore
                if (!coffeeEngine.runtime.currentScene.inDrawList(this)) {
                    coffeeEngine.runtime.currentScene.addToDrawList(this);
                }
            } else if (typeof value == "undefined" || value == null) {
                //* Remove our event listeners.
                // prettier-ignore
                if (coffeeEngine.runtime.currentScene.hasEventListener("update", (deltaTime) => {this.update(deltaTime)})) {
                    coffeeEngine.runtime.currentScene.removeEventListener("update", (deltaTime) => {this.update(deltaTime)});
                }
                // prettier-ignore
                if (coffeeEngine.runtime.currentScene.inDrawList(this)) {
                    coffeeEngine.runtime.currentScene.removeFromDrawList(this);
                }
            } else {W
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

        addChild(child) {
            if (child == this) return;
            this.children.push(child);
            child.parent = this;

            coffeeEngine.runtime.currentScene.castEvent("childAdded", child);
        }

        sortValue() { return 0; }

        getProperties() { return [{name: "name", type: coffeeEngine.PropertyTypes.NAME}] };
    }

    coffeeEngine.registerNode(node, "Node");
})();
