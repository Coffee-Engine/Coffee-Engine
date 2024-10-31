(function () {
    coffeeEngine.sceneClass = class {
        constructor() {
            this.children = [];
            this.events = {
                update: [],
                draw: [],
            };

            this.name = "scene";
        }

        addEventListener(event, func) {
            if (typeof this.events[event] != "object") return;

            this.events[event].push(func);
            return func;
        }

        hasEventListener(event, func) {
            if (typeof this.events[event] != "object") return;

            return this.events[event].includes(func);
        }

        removeEventListener(event, func) {
            if (typeof this.events[event] != "object") return;

            if (this.events[event].includes(func)) {
                this.events[event].slice(this.events[event].indexOf(func));
            }
        }

        update(deltaTime) {
            this.events.update.forEach((event) => {
                event(deltaTime);
            });
        }

        draw() {
            coffeeEngine.renderer.daveshade.GL.clear(coffeeEngine.renderer.daveshade.GL.DEPTH_BUFFER_BIT)
            this.drawSky();

            this.events.draw.forEach((event) => {
                event();
            });
        }

        drawSky(renderer) {
            coffeeEngine.renderer.cameraData.res = [coffeeEngine.renderer.canvas.width,coffeeEngine.renderer.canvas.height];
            //renderer.mainShaders.skyPlane.uniforms.u_camera.value = this.matrix.webGLValue();
            coffeeEngine.renderer.mainShaders.skyplane.setBuffers(coffeeEngine.shapes.plane);

            coffeeEngine.renderer.mainShaders.skyplane.drawFromBuffers(6);
        }

        addChild(child) {
            if (child == this) return;
            this.children.push(child);
            child.parent = this;
        }
    };
})();
