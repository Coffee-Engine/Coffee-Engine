(function() {
    coffeeEngine.classes.node = class {

        #parent;

        set parent(value) {
            if (value.addChild) {
                this.#parent.removeChild(this);

                value.addChild(this);

                this.#parent = value;
            }
            else {
                console.error(`cannot set parent to ${String(value)}`)
            }
        }

        get parent() {
            return this.#parent;
        }

        constructor() {
            this.children = [];
        }

        onReady() {};

        update(deltaTime) {}

        onDraw() {}
    }
})