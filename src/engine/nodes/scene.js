(function () {
    coffeeEngine.sceneClass = class {
        constructor() {
            this.children = [];
            this.events = {
                update: [],
                childAdded: [],
            };
            this.drawList = [];

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

        addToDrawList(object) {
            this.drawList.push(object);
        }

        inDrawList(object) {
            return this.drawList.includes(object);
        }

        removeFromDrawList(object) {
            if (this.drawList.includes(object)) {
                this.drawList.slice(this.drawList.indexOf(object));
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

            //Clear the depth here, just so the sky doesn't ever overlap the world.
            coffeeEngine.renderer.daveshade.clear(coffeeEngine.renderer.daveshade.GL.DEPTH_BUFFER_BIT);

            //Sort em
            this.drawList.sort((node1, node2) => {
                //Don't spend the extra time recomputing the value
                const node1Sort = node1.sortValue();
                const node2Sort = node2.sortValue();
                if (node1Sort < node2Sort) {
                    return -1;
                }
                else if (node1Sort > node2Sort) {
                    return 1;
                }

                return 0;
            })

            //Now lets draw the objects
            for (let drawItem = this.drawList.length - 1; drawItem >= 0; drawItem--) {
                const node = this.drawList[drawItem];
                node.draw();
            }
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

        serialize() {
            const goDown = (children) => {
                const returnedObject = [];
                children.forEach(child => {
                    returnedObject.push({
                        name:child.name,
                        nodeType:null,
                        children:goDown(child.children)}
                    );
                });
                return returnedObject;
            }
        
            return {
                name:this.name,
                nodeType:"scene",
                children:goDown(coffeeEngine.runtime.currentScene.children)
            };
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
