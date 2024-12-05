//? Technically its a node, a very strange node yes. but like... a very distant cousin.
(function () {
    coffeeEngine.sceneClass = class {
        scenePath = coffeeEngine.defaultScenePath || "scenes/default.scene";

        constructor() {
            this.children = [];
            this.events = {
                update: [],
                childAdded: [],
            };
            this.drawList = [];

            this.name = "scene";
        }

        //Event listener stuff
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

        //This is so we know what to draw like event listeners, but with nodes instead of functions
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

        //Lets us cast an event
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
            this.drawSky(coffeeEngine.renderer);

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
            renderer.cameraData.res = [renderer.canvas.width, renderer.canvas.height];
            //renderer.mainShaders.skyPlane.uniforms.u_camera.value = this.matrix.webGLValue();
            renderer.mainShaders.skyplane.setBuffers(coffeeEngine.shapes.plane);

            renderer.mainShaders.skyplane.drawFromBuffers(6);
        }

        addChild(child,disruptUpdateEvent) {
            if (child == this) return;
            this.children.push(child);
            child.parent = this;

            if (!disruptUpdateEvent) this.castEvent("childAdded", child);
        }

        //Scene serialization and stuff
        serialize() {
            //We want to recursively go downwards and get the properties and types of each child
            const goDown = (children) => {
                const returnedObject = [];
                children.forEach(child => {
                    const properties = {};

                    //Loop through child properties and validate/add each one
                    child.getProperties().forEach(property => {
                        //Make sure its a property and not a label
                        if (typeof property != "object") return;

                        //Safeties
                        if (!child[property.name]) return;
                        if (child[property.name].serialize) properties[property.name] = child[property.name].serialize();
                        else properties[property.name] = child[property.name];
                    })

                    //Push the child to the returned object array
                    returnedObject.push({
                        name:child.name,
                        nodeType:coffeeEngine.getNodeName(child),
                        children:goDown(child.children),
                        properties:properties
                    });
                });
                return returnedObject;
            }
        
            //Once we got all that juicy data we return our array
            return {
                name:this.name,
                nodeType:"scene",
                children:goDown(coffeeEngine.runtime.currentScene.children)
            };
        }

        deserialize(data) {

        }

        getProperties() { 
            return ["Nothing Here"];
            
            //Input Testing stuff
            /*
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
            */
        };
    };
})();
