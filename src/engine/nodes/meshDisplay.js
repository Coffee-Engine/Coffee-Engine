(function () {
    class meshDisplay extends coffeeEngine.getNode("Node3D") {
        meshData;
        #meshPath = "";

        set meshPath(value) {
            this.#meshPath = value;
            coffeeEngine.mesh.fromProjectFile(value).then((data) => {
                this.meshData = data;
                this.parseMeshProperties();
                if (this.afterLoad) this.afterLoad();
            }).catch(() => {
                this.meshData = null;
            });
        }

        get meshPath() {
            return this.#meshPath;
        }

        setMeshPath(value) {
            return new Promise((resolve, reject) => {
                this.#meshPath = value;
                coffeeEngine.mesh.fromProjectFile(value).then((data) => {
                    this.meshData = data;
                    this.parseMeshProperties();
                    resolve(data);
                }).catch((error) => {
                    this.meshData = null;
                    reject(error);
                });
            });
        }

        //Define our materials
        set materials(value) {
            if (typeof value != "object") return;
            for (let key in value) {
                //Set materials
                coffeeEngine.renderer.fileToMaterial(value[key]).then((material) => {
                    this.__materials[key] = [value[key], material];
                }).catch(() => {
                    this.__materials[key] = ["", null];
                });
            }
        }
        get materials() {
            return this.#materials;
        };
        #materials = {};

        //Storage
        __materials = {};

        //Just to add our material setters right now
        parseMeshProperties() {
            //Doing "this" in the getters and setters is invalid
            const meshDisplayObj = this;

            //Define material setters
            for (let subMeshIndex in this.meshData.pointCount) {
                //Define our property if needed
                if (!this.materials.hasOwnProperty(subMeshIndex)) Object.defineProperty(this.materials, subMeshIndex, {
                    set(value) {
                        //Set our material once we call our setter
                        coffeeEngine.renderer.fileToMaterial(value).then((material) => {
                            meshDisplayObj.__materials[subMeshIndex] = [value, material];
                        }).catch(() => {
                            meshDisplayObj.__materials[subMeshIndex] = ["", null];
                        });
                    },

                    get() {
                        if (meshDisplayObj.__materials[subMeshIndex]) return meshDisplayObj.__materials[subMeshIndex][0];
                        return "";
                    },

                    enumerable: true,
                    configurable: true,
                });

                if (!meshDisplayObj.__materials[subMeshIndex]) meshDisplayObj.__materials[subMeshIndex] = ["", null];
            }
        }

        #modulatedColorArr = [1, 1, 1, 1];
        #modulatedColor = "#ffffffff";

        set modulatedColor(value) {
            this.#modulatedColor = value;

            const split = coffeeEngine.ColorMath.HexToRGB(value);
            this.#modulatedColorArr = [split.r / 255, split.g / 255, split.b / 255, split.a / 255];
        }

        get modulatedColor() {
            return this.#modulatedColor;
        }

        draw(drawID) {
            super.draw();

            if (this.meshData && this.meshData instanceof coffeeEngine.mesh.class) {
                for (let subMeshIndex in this.meshData.pointCount) {
                    //Make sure our material is active
                    if (this.materials[subMeshIndex] == undefined || this.materials[subMeshIndex] == "") continue;
                    if (!this.__materials[subMeshIndex][1]) continue;

                    //Use our material
                    const myMaterial = this.__materials[subMeshIndex][1];
                    myMaterial.use();

                    const data = this.meshData.data[subMeshIndex];
                    const pointCount = this.meshData.pointCount[subMeshIndex];

                    myMaterial.shader.setBuffers(data);
                    myMaterial.shader.uniforms.u_model.value = this.mixedMatrix.webGLValue();
                    if (myMaterial.shader.uniforms.u_colorMod) myMaterial.shader.uniforms.u_colorMod.value = this.#modulatedColorArr;
                    if (myMaterial.shader.uniforms.u_objectID) myMaterial.shader.uniforms.u_objectID.value = drawID;
                    myMaterial.shader.drawFromBuffers(pointCount);
                }
            }
        }

        getProperties(refreshListing, serializationCall) {
            //If we have a mesh, and this is not a serialization call
            //Add our material properties
            const extraProperties = [];
            if (this.meshData && !serializationCall) {
                for (let subMeshIndex in this.meshData.pointCount) {
                    //Create our material slot
                    //Start with the offset
                    const offset = (coffeeEngine.isEditor) ? Number(editor.settings.values.Editor.startIndex) : 0;

                    //Push it
                    extraProperties.push({ 
                        text: editor.language["engine.nodeProperties.MeshDisplay.material"].replace("[number]", Number(subMeshIndex) + offset), 
                        key: subMeshIndex, 
                        target: this.materials, 
                        type: coffeeEngine.PropertyTypes.FILE, 
                        fileType: "material", 
                        systemRoot: { "/____NAMESPACE__IDENTIFIER____/": true, "coffee:": { "default.material": "defaultMaterial" }, "project:": project.fileSystem } 
                    });
                }
            }

            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC3 }, 
                "---",
                { name: "meshPath", translationKey: "engine.nodeProperties.MeshDisplay.meshPath", type: coffeeEngine.PropertyTypes.FILE, fileType: "obj,dae,glb", onchange: (value) => {
                    this.afterLoad = refreshListing;
                }}, 
                ...extraProperties,
                { name: "modulatedColor", translationKey: "engine.nodeProperties.Node.modulatedColor", type: coffeeEngine.PropertyTypes.COLOR4 }, "---", { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }

        extraSerialize() {
            return {
                after: false,
                data: [
                    "__scriptStartupProps",
                    "materials"
                ]
            };
        }

        //We sort on two different principals
        // 1. Where are we relative to the camera?
        // 2. where is the furthest point infront of the camera?
        sortValue(drawID) {
            if (this.meshData) {
                const low = this.mixedMatrix.multiplyVector(this.meshData.lowestBound);
                const high = this.mixedMatrix.multiplyVector(this.meshData.highestBound);
                const camForward = coffeeEngine.renderer.cameraData.unflattenedTransform.contents[2];

                //Just like a really far vector.
                const cameraPosition = coffeeEngine.renderer.cameraData.position;
                const farVec = cameraPosition.add({ x: camForward[0] * 9999, y: camForward[1] * 9999, z: camForward[2] * 9999 });

                farVec.x = Math.min(Math.max(farVec.x, low.x), high.x);
                farVec.y = Math.min(Math.max(farVec.y, low.y), high.y);
                farVec.z = Math.min(Math.max(farVec.z, low.z), high.z);
                
                return farVec.sub(cameraPosition).length();
            }
            return this.position.sub(coffeeEngine.renderer.cameraData.position).length();
        }
    }

    coffeeEngine.registerNode(meshDisplay, "MeshDisplay", "Node3D");
})();
