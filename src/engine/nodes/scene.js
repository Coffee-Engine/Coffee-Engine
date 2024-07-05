(function() {
    coffeeEngine.sceneClass = class {
        constructor() {
            this.children = [];
            this.events = {
                update:[],
                draw:[]
            }
        }

        addEventListener(event,func) {
            if (typeof this.events[event] != "object") return;

            this.events[event].push(func);
            return func;
        }

        hasEventListener(event,func) {
            if (typeof this.events[event] != "object") return;

            return this.events[event].includes(func);
        }

        removeEventListener(event,func) {
            if (typeof this.events[event] != "object") return;

            if (this.events[event].includes(func)) {
                this.events[event].slice(this.events[event].indexOf(func));
            }
        }

        update(deltaTime) {
            this.events.update.forEach(event => {
                event(deltaTime);
            });
        }

        draw() {
            this.events.draw.forEach(event => {
                event();
            });
        }
    }
})();