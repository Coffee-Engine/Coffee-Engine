//? Technically its a node, a very strange node yes. but like... a very distant cousin.
(function () {
    coffeeEngine.sceneClass = class {
        scenePath = coffeeEngine.defaultScenePath || "scenes/default.scene";
        fileReader = new FileReader();

        horizonColor = [0.77254902, 0.792156863, 0.909803922];
        skyColor = [0.403921569, 0.639215686, 0.941176471];
        groundColor = [0.290196078, 0.22745098, 0.192156863];
        centerColor = [0.2, 0.105882353, 0.0549019608];
        sunDirection = [0, 0, 0];
        sunColor = [0, 0, 0];
        ambientColor = [0, 0, 0];
        lightCount = 0;

        prefabEditMode = false;
        
        //The layout
        //* TYPE          , FALLOFF   , START
        //* RED           , GREEN     , BLUE
        //* Sun Multiplier, Sky Effect, NU 
        fogData = [
            0, 0.125, 5,
            [1, 1, 1],
            8, 0, 0
        ];
        
        //? And here is our matrix.
        //? The humble matrix
        mixedMatrix = coffeeEngine.matrix4.identity();

        constructor() {
            this.children = [];
            this.events = {
                update: [],
                childAdded: [],
                childMoved: [],
            };
            this.drawList = [];

            this.name = "scene";

            this.fileReader.onload = () => {
                //Make sure our scene is JSON
                const parsed = JSON.parse(this.fileReader.result);
                if (!parsed) {
                    console.log(`"${this.scenePath}" is INVALID! Opening an empty scene with that path.`);
                    return;
                }

                //if it is deserialize it.
                if (!this.prefabEditMode) this.deserialize(parsed);
                else this.__setupPrefabScene(parsed);
            };
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
                this.events[event].splice(this.events[event].indexOf(func), 1);
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
                this.drawList.splice(this.drawList.indexOf(object), 1);
            }
        }

        //Lets us cast an event
        castEvent(event, data) {
            for (const eventFunc in this.events[event]) {
                this.events[event][eventFunc](data);
            }
        }

        update(deltaTime) {
            this.children.forEach(child => {
                child.update(deltaTime);
            })
            
            //this.castEvent("update", deltaTime);
        }

        //Collision stuff
        isColliding(collidee, collisionList) {
            //Make sure we are not the parent, or collider;
            if (collidee == this) return [];

            if (!collisionList) collisionList = new Array();

            //Iterate collisions
            for (const child in this.children) {
                const collision = this.children[child].isColliding(collidee,collisionList);
                if (typeof collision == "object") {
                    //Use a sprawl to determine splicing
                    if (Array.isArray(collision)) {
                        collisionList.splice(0,0,...collision);
                    }
                    else {
                        collisionList.push(collision);
                    }
                }
            }
            //Return our collision list
            return collisionList;
        }

        //This big drawing stuff
        draw() {
            const renderer = coffeeEngine.renderer;
            const GL = renderer.daveshade.GL;

            const {width, height} = coffeeEngine.renderer.drawBuffer;

            //Clear the main renderers depth, and reset the sun
            renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT);
            this.sunDirection = [0, 0, 0];
            this.lightCount = 0;

            //Use our draw buffer
            renderer.drawBuffer.use();

            //Clear the depth each time and draw the sky/scene
            renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);
            this.__drawSky(renderer, width, height);
            renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT);
            this.__drawScene(renderer);

            //Render it back to the main draw pass.
            renderer.daveshade.cullFace();
            renderer.swapPost();

            this.__drawFinal(renderer, renderer.mainShaders.mainPass);
            this.__postProcess(renderer);

            //The final blit!
            renderer.daveshade.renderToCanvas();
            renderer.mainShaders.viewportPass.setBuffers(coffeeEngine.shapes.plane);
            renderer.mainShaders.viewportPass.setUniforms({ u_texture: renderer.getPost().attachments[0].texture });
            renderer.mainShaders.viewportPass.drawFromBuffers(6);
        }

        __drawSky(renderer, width, height) {
            renderer.cameraData.res = [width, height];

            //Set our uniforms
            const skyShader = renderer.mainShaders.skyplane;
            skyShader.setBuffers(coffeeEngine.shapes.plane);
            skyShader.setUniforms({
                horizonColor: this.horizonColor,
                skyColor: this.skyColor,
                groundColor: this.groundColor,
                centerColor: this.centerColor,
            })

            skyShader.drawFromBuffers(6);
        }

        __drawScene() {
            //Sort em
            this.drawList.sort((node1, node2) => {
                //Don't spend the extra time recomputing the value
                let node1Sort = node1.sortValue(false);
                let node2Sort = node2.sortValue(false);
                if (node1Sort < node2Sort) {
                    return -1;
                } else if (node1Sort > node2Sort) {
                    return 1;
                }
                //Dual pass sorting, just in case two are the same value
                else {
                    node1Sort = node1.sortValue(true);
                    node2Sort = node2.sortValue(true);

                    if (node1Sort < node2Sort) {
                        return -1;
                    } else if (node1Sort > node2Sort) {
                        return 1;
                    }
                }

                return 0;
            });

            //Now lets draw the objects
            for (let drawItem = this.drawList.length - 1; drawItem >= 0; drawItem--) {
                const node = this.drawList[drawItem];
                node.draw(drawItem + 1);
            }
        }

        __setLight(id, value) {
            const mainPass = coffeeEngine.renderer.mainShaders.mainPass;
            if (mainPass.uniforms.u_lights && mainPass.uniforms.u_lights[id]) {
                mainPass.uniforms.u_lights[id].value = value;
            }
        }

        __drawFinal(renderer, mainPass) {
            if (renderer.viewport.antiAlias) {
                renderer.getPost().resize(renderer.canvas.width * renderer.drawBufferSizeMul, renderer.canvas.height * renderer.drawBufferSizeMul);
                renderer.getPost().use();
            }

            if (renderer.viewport.antiAlias) renderer.cameraData.res = [renderer.canvas.width * renderer.drawBufferSizeMul, renderer.canvas.height * renderer.drawBufferSizeMul];
            else renderer.cameraData.res = [renderer.canvas.width, renderer.canvas.height];
            
            const drawBuffer =  renderer.drawBuffer.attachments;
            mainPass.setBuffers(coffeeEngine.shapes.plane);
            
            //Neato!
            mainPass.setUniforms({
                //Textures
                u_color: drawBuffer[0].texture, 
                u_materialAttributes: drawBuffer[1].texture, 
                u_emission: drawBuffer[2].texture, 
                u_position: drawBuffer[3].texture, 
                u_normal: drawBuffer[4].texture,

                //The sun
                u_sunDir: this.sunDirection,
                u_sunColor: this.sunColor,
                u_ambientColor: this.ambientColor,

                //Lights
                u_lightCount: this.lightCount,

                //fog data
                u_fogData: this.fogData.flat(),
                u_cameraPosition: coffeeEngine.renderer.cameraData.position.webGLValue(),
            });

            //Draw main pass!
            mainPass.drawFromBuffers(6);

            if (renderer.viewport.antiAlias) renderer.cameraData.res = [renderer.canvas.width, renderer.canvas.height];
        }

        __postProcess(renderer) {
            //Do our AA pass first
            if (renderer.viewport.antiAlias) {
                renderer.swapPost();
                renderer.mainShaders.antiAliasPass.setBuffers(coffeeEngine.shapes.plane);
                renderer.mainShaders.antiAliasPass.setUniforms({ u_texture: renderer.getPrevPost().attachments[0].texture, u_reductionAmount: renderer.drawBufferSizeMul });
                renderer.mainShaders.antiAliasPass.drawFromBuffers(6);

                renderer.getPrevPost().resize(renderer.canvas.width, renderer.canvas.height);
            }
        }

        //Child management
        addChild(child) {
            if (child == this) return;
            if (this.children.includes(child)) return;
            this.children.push(child);
            if (!arguments[1]) child.parent = this;

            this.castEvent("childAdded", child);
        }

        removeChild(child) {
            if (child == this) return;

            if (!arguments[1]) child.parent = null;
            //Splice the child
            if (this.children.includes(child)) {
                this.children.splice(this.children.indexOf(child), 1);
            }
        }

        __clearChildren(node) {
            //Remove all children
            const childCount = node.children.length;
            for (let index = 0; index < childCount; index++) {
                this.__clearChildren(node.children[0]);
            }

            //Check if the node we are clearing is the scene
            if (node == this) return;
            //Remove them from events
            node.parent.removeChild(node);
            node._dispose();
            //Remove the child from memory, we have to rely on the garbage collector because this is 'strict' mode?
            node = null;
        }

        __serializeValue(value) {
            //Determine original coolage
            let returned = {};
            if (Array.isArray(value)) returned = [];
            
            let rValue = value;
            if (value.serialize && typeof value.serialize == "function") returned = rValue.serialize();
            
            if (typeof rValue == "object") {
                for (let key in rValue) {
                    returned[key] = this.__serializeValue(rValue[key]);
                }
            }
            else {
                returned = rValue;
            }

            return returned;
        }

        //We want to recursively go downwards and get the properties and types of each child
        __serializeChildren(node) {
            const returnedObject = [];
            node.forEach((child) => {
                const properties = {};

                //Do script startup props first so ensure they load first

                //Less precious but still needed to be stored
                let extraSerialize = (child.extraSerialize) ? child.extraSerialize() : [];
                let extraAfter = false;
                if (typeof extraSerialize != "object") extraSerialize = [];

                //Now we check for after
                if (!Array.isArray(extraSerialize)) {
                    extraAfter = extraSerialize.after || false;
                    extraSerialize = extraSerialize.data || [];
                }

                //If we are before
                if (extraSerialize && !extraAfter) extraSerialize.forEach((property) => {
                    //Safeties
                    if (!child[property]) return;
                    properties[property] = this.__serializeValue(child[property]);
                });

                //Loop through child properties and validate/add each one
                child.getProperties(() => {}, true).forEach((property) => {
                    //Make sure its a property and not a label
                    if (typeof property != "object") return;

                    //Safeties
                    if (!child[property.name]) return;
                    properties[property.name] = this.__serializeValue(child[property.name]);
                });

                //If we are after
                if (extraSerialize && extraAfter) extraSerialize.forEach((property) => {
                    //Safeties
                    if (!child[property]) return;
                    properties[property] = this.__serializeValue(child[property]);
                });

                //Push the child to the returned object array
                returnedObject.push({
                    name: child.name,
                    nodeType: coffeeEngine.getNodeName(child),
                    children: this.__serializeChildren(child.children),
                    properties: properties,
                });
            });
            return returnedObject;
        }

        //Scene serialization and stuff
        serialize() {
            //Get our preloaded asset paths
            const keys = {};
            Object.keys(coffeeEngine.preloadFunctions).forEach((key) => {
                //Make sure we have a preload function
                const preloadFunction = coffeeEngine.preloadFunctions[key];
                if (preloadFunction) {
                    //Then we get the keys
                    keys[key] = Object.keys(preloadFunction.storage);
                }
            });

            //Once we got all that juicy data we return our array
            return {
                name: this.name,
                nodeType: "scene",
                children: this.__serializeChildren(coffeeEngine.runtime.currentScene.children),
                preload: keys,

                //Serialize the sky
                skyColor: this.skyColor,
                horizonColor: this.horizonColor,
                groundColor: this.groundColor,
                centerColor: this.centerColor,
                ambientColor: this.ambientColor,
                fogData: this.fogData,
            };
        }

        //Scene deserialization and stuff
        __deserializeValue(value) {
            //Prototype property
            if (typeof value == "object" && value["/-_-PROTOTYPE-_-/"]) {
                if (coffeeEngine[value["/-_-PROTOTYPE-_-/"]] && coffeeEngine[value["/-_-PROTOTYPE-_-/"]].deserialize) {
                    let returned;
                    returned = coffeeEngine[value["/-_-PROTOTYPE-_-/"]].deserialize(returned, value.value);
                    return returned;
                }
            }

            //if not do our typical
            let returned = value;
            if (typeof returned == "object") {
                for (let key in value) {
                    returned[key] = this.__deserializeValue(returned[key]);
                }
            }

            return returned;
        }

        //recursive child looping
        __deserializeChildren(data, physicalParent) {
            data.forEach((child) => {
                //Get our node class
                const nodeClass = coffeeEngine.getNode(child.nodeType) || coffeeEngine.getNode("Node");
                const node = new nodeClass();
                node.name = child.name;
                node.parent = physicalParent;

                //Loop through the node's properties
                if (child.properties) {
                    for (let key in child.properties) {
                        node[key] = this.__deserializeValue(child.properties[key]);
                    }
                }

                this.__deserializeChildren(child.children, node);
            });
        }

        deserialize(data) {
            //Set our colors from the file
            this.skyColor = data.skyColor || [0, 0, 0];
            this.horizonColor = data.horizonColor || [1, 1, 1];
            this.groundColor = data.groundColor || [1, 1, 1];
            this.centerColor = data.centerColor || [0, 0, 0];
            this.ambientColor = data.ambientColor || [0.05, 0.05, 0.05];
            this.fogData = data.fogData || [
                0, 0.125, 5,
                [1, 1, 1],
                8, 0, 0
            ];

            //Our function for actually loading the scene
            const loadNodes = () => {
                //Clear out children from memory and registry
                this.__clearChildren(this);

                //If we have no data assume this is a new scene
                if (!data) data = { name: "scene", nodeType: "scene", children: [] };

                //Identify us as a scene
                this.name = "Scene";

                //Now we cycle through every child
                this.__deserializeChildren(data.children, this);
            };

            //Check if preload exists
            if (!data.preload) {
                loadNodes();
                return;
            }

            //Get our count of preloaded data
            const preloadCount = Object.values(data.preload).flat(2).length;
            let preloadFinished = 0;

            //Then load them
            Object.keys(data.preload).forEach((preloadCategory) => {
                //Make sure the category has a preload function
                const preloadFunction = coffeeEngine.preloadFunctions[preloadCategory];
                //If it does preload the data
                if (preloadFunction) {
                    data.preload[preloadCategory].forEach((path) => {
                        preloadFunction
                            .function(path)
                            .then(() => {
                                //Increment our preload finished, and check if we are done
                                preloadFinished++;
                                if (preloadFinished == preloadCount) {
                                    loadNodes();
                                }
                            })
                            .catch(() => {
                                //!THIS "ERROR" SOMETIMES WORKS SOMETIMES DOESN'T
                                //!FOR SOME REASON IT ERRORS AT 'default.material' AND ONLY 'default.material'
                                //!EVEN THOUGH WE RESOLVE THE PROMISE BEFORE IT CAN EVEN CHECK FOR 'default.material' IN THE MAIN FILESYSTEM!
                                //Increment our preload finished, and check if we are done
                                preloadFinished++;
                                if (preloadFinished == preloadCount) {
                                    loadNodes();
                                }
                            });
                    });
                }
            });
        }

        //For prefabs we make it the prettiest thing ever.
        __setupPrefabScene(data) {
            this.skyColor = [0,0,0];
            this.horizonColor = [0.07450980392156863, 0.09019607843137255, 0.3254901960784314];
            this.groundColor = [0.07450980392156863, 0.09019607843137255, 0.3254901960784314];
            this.centerColor = [0, 0, 0];

            this.ambientColor = [1,1,1];

            this.fogData = [
                0, 0.125, 5,
                [1, 1, 1],
                8, 0, 0
            ];
            
            //Identify us as a prefab
            this.name = "Prefab";

            this.__clearChildren(this);
            this.__deserializeChildren([data], this);
        }

        openIsolatedPrefab(path) {
            project.getFile(path).then((file) => {
                if (file) {
                    this.prefabEditMode = true;
                    this.scenePath = path;
                    this.fileReader.readAsText(file);
                }
            })
        }

        openScene(path) {
            project.getFile(path).then((file) => {
                if (file) {
                    this.prefabEditMode = false;
                    this.scenePath = path;
                    this.fileReader.readAsText(file);
                }
            });
        }

        getProperties() {
            // if we are a prefab we don't have properties.
            if (this.prefabEditMode) return [];

            // prettier-ignore
            return [
                { name: "skyColor", translationKey: "engine.nodeProperties.scene.skyColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true }, 
                { name: "horizonColor", translationKey: "engine.nodeProperties.scene.horizonColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true }, 
                { name: "groundColor", translationKey: "engine.nodeProperties.scene.groundColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true }, 
                { name: "centerColor", translationKey: "engine.nodeProperties.scene.centerColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true }, 
                "---", 
                { name: "ambientColor", translationKey: "engine.nodeProperties.scene.ambientColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true },
                "---",
                { name: "0", target: this.fogData, translationKey: "engine.nodeProperties.scene.fogType", type: coffeeEngine.PropertyTypes.DROPDOWN, items: [
                    {text: editor.language["engine.nodeProperties.scene.fogType.none"], value: 0},
                    {text: editor.language["engine.nodeProperties.scene.fogType.retro"], value: 3},
                    {text: editor.language["engine.nodeProperties.scene.fogType.simple"], value: 1},
                    {text: editor.language["engine.nodeProperties.scene.fogType.sunAffected"], value: 2},
                ]},
                { name: "2", target: this.fogData, translationKey: "engine.nodeProperties.scene.fogStart", type: coffeeEngine.PropertyTypes.FLOAT },
                { name: "1", target: this.fogData, translationKey: "engine.nodeProperties.scene.fogFalloff", type: coffeeEngine.PropertyTypes.SLIDER, min:0, max: 10 },
                "---",
                { name: "3", target: this.fogData, translationKey: "engine.nodeProperties.scene.fogColor", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true },
                "---",
                { name: "5", target: this.fogData, translationKey: "engine.nodeProperties.scene.skyEffect", type: coffeeEngine.PropertyTypes.SLIDER, min:0, max: 1 },
                { name: "4", target: this.fogData, translationKey: "engine.nodeProperties.scene.sunMultiplier", type: coffeeEngine.PropertyTypes.SLIDER, min:1, max: 10 },
            ];
        }
    };

    //Make current scene our scene class
    coffeeEngine.runtime.currentScene = new coffeeEngine.sceneClass();
})();
