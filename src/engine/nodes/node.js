(function() {
    coffeeEngine.classes.node = class {

        #parent;
        set parent(value) {
            if (value.addChild) {
                this.#parent.removeChild(this);

                value.addChild(this);

                this.#parent = value;

                //* Add our event listeners if they don't exist.
                if (!coffeeEngine.runtime.currentScene.hasEventListener("update", this.update)) {
                    coffeeEngine.runtime.currentScene.addEventListener("update", this.update)
                }
                if (!coffeeEngine.runtime.currentScene.hasEventListener("draw", this.update)) {
                    coffeeEngine.runtime.currentScene.addEventListener("draw", this.update)
                }
            }
            else if (typeof value == "undefined" || value == null) {
                //* Remove our event listeners.
                if (coffeeEngine.runtime.currentScene.hasEventListener("update", this.update)) {
                    coffeeEngine.runtime.currentScene.removeEventListener("update", this.update)
                }
                if (coffeeEngine.runtime.currentScene.hasEventListener("draw", this.update)) {
                    coffeeEngine.runtime.currentScene.removeEventListener("draw", this.update)
                }
            }
            else {
                console.error(`cannot set parent to ${String(value)}`)
            }
        }
        get parent() {return this.#parent;}

        constructor() {
            this.children = [];
        }

        onReady() {};

        update(deltaTime) {}

        onDraw() {}
    }
})();