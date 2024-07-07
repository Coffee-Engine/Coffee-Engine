(function() {
    coffeeEngine.classes.node = class {

        #parent;
        set parent(value) {
            if (value.addChild) {
                if (this.parent) this.#parent.removeChild(this);

                this.#parent = value;

                //* Add our event listeners if they don't exist.
                if (!coffeeEngine.runtime.currentScene.hasEventListener("update", this.update)) {
                    coffeeEngine.runtime.currentScene.addEventListener("update", this.update)
                }
                if (!coffeeEngine.runtime.currentScene.hasEventListener("draw", this.draw)) {
                    coffeeEngine.runtime.currentScene.addEventListener("draw", this.draw)
                }
            }
            else if (typeof value == "undefined" || value == null) {
                //* Remove our event listeners.
                if (coffeeEngine.runtime.currentScene.hasEventListener("update", this.update)) {
                    coffeeEngine.runtime.currentScene.removeEventListener("update", this.update)
                }
                if (coffeeEngine.runtime.currentScene.hasEventListener("draw", this.draw)) {
                    coffeeEngine.runtime.currentScene.removeEventListener("draw", this.draw)
                }
            }
            else {
                console.error(`cannot set parent to ${String(value)}`)
            }
        }
        get parent() {return this.#parent;}

        #script;
        set script(value) {
            if (!value) return;

            if (this.#script) {
                delete this.#script;
            }

            this.#script = value;

            if (this.#script.ready) {
                this.#script.ready();
            }
        }

        get script() {return this.#script;}

        constructor() {
            this.children = [];
            this.name = "node";
        }

        ready() {};

        update(deltaTime) {
            if (this.script && this.script.update) {
                this.script.update(deltaTime);
            }
        }

        draw() {
            if (this.script && this.script.draw) {
                this.script.draw();
            }
        }
        
        addChild(child) {
            if (child == this) return;
            this.children.push(child);
            child.parent = this;
        }
    }
})();