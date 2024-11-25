(function () {
    coffeeEngine.sceneClass = class {
        constructor() {
            this.children = [];
            this.events = {
                update: [],
                draw: [],
                childAdded: [],
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

        castEvent(event, data) {
            this.events[event].forEach((eventFunc) => {
                eventFunc(data);
            })
        }

        update(deltaTime) {
            this.castEvent("update", deltaTime);
        }

        draw() {
            coffeeEngine.renderer.daveshade.clear(coffeeEngine.renderer.daveshade.GL.DEPTH_BUFFER_BIT);
            this.drawSky();

            this.castEvent("draw", {});
        }

        drawSky(renderer) {
            coffeeEngine.renderer.cameraData.res = [coffeeEngine.renderer.canvas.width, coffeeEngine.renderer.canvas.height];
            //renderer.mainShaders.skyPlane.uniforms.u_camera.value = this.matrix.webGLValue();
            coffeeEngine.renderer.mainShaders.skyplane.setBuffers(coffeeEngine.shapes.plane);

            coffeeEngine.renderer.mainShaders.skyplane.drawFromBuffers(6);
        }

        addChild(child,disruptUpdateEvent) {
            if (child == this) return;
            this.children.push(child);
            child.parent = this;

            if (!disruptUpdateEvent) this.castEvent("childAdded", child);
        }

        getProperties() { 
            //return ["Nothing Here"]
            
            //Input Testing stuff
            return [
                {name: "INT", type: coffeeEngine.PropertyTypes.INT},
                {name: "FLOAT", type: coffeeEngine.PropertyTypes.FLOAT},
                {name: "VEC2", type: coffeeEngine.PropertyTypes.VEC2},
                {name: "VEC3", type: coffeeEngine.PropertyTypes.VEC3},
                {name: "VEC4", type: coffeeEngine.PropertyTypes.VEC4},
                {name: "VEC5", type: "vec5"},
                {name: "VEC6", type: "vec6"},
                {name: "COLOR3", type: coffeeEngine.PropertyTypes.COLOR3},
                {name: "COLOR4", type: coffeeEngine.PropertyTypes.COLOR4},
                {name: "NODE", type: coffeeEngine.PropertyTypes.NODE},
                {name: "FILE", type: coffeeEngine.PropertyTypes.FILE},
                {name: "STRING", type: coffeeEngine.PropertyTypes.STRING},
                {name: "NAME", type: coffeeEngine.PropertyTypes.NAME},
                {name: "ARRAY", type: coffeeEngine.PropertyTypes.ARRAY},
                {name: "OBJECT", type: coffeeEngine.PropertyTypes.OBJECT},
            ]
        };
    };
})();
