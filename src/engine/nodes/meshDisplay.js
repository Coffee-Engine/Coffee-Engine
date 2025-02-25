(function () {
    class meshDisplay extends coffeeEngine.getNode("Node3D") {
        meshData;
        #meshPath = "";

        set meshPath(value) {
            this.#meshPath = value;
            coffeeEngine.mesh.fromProjectFile(value).then((data) => {
                this.meshData = data;
            });
        }
        get meshPath() {
            return this.#meshPath;
        }

        #materialPath = "";
        #material = "";

        set material(value) {
            this.#materialPath = value;
            coffeeEngine.renderer.fileToMaterial(value).then((material) => {
                this.#material = material;
            });
        }

        get material() {
            return this.#materialPath;
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

            if (this.meshData && this.#material && this.meshData instanceof coffeeEngine.mesh.class) {
                this.#material.use();
                for (let subMeshIndex = 0; subMeshIndex < this.meshData.pointCount.length; subMeshIndex++) {
                    const data = this.meshData.data[subMeshIndex];
                    const pointCount = this.meshData.pointCount[subMeshIndex];

                    this.#material.shader.setBuffers(data);
                    this.#material.shader.uniforms.u_model.value = this.mixedMatrix.webGLValue();
                    if (this.#material.shader.uniforms.u_colorMod) this.#material.shader.uniforms.u_colorMod.value = this.#modulatedColorArr;
                    if (this.#material.shader.uniforms.u_objectID) this.#material.shader.uniforms.u_objectID.value = drawID;
                    this.#material.shader.drawFromBuffers(pointCount);
                }
            }
        }

        getProperties() {
            return [{ name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, "---", { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true }, { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC3 }, "---", { name: "meshPath", translationKey: "engine.nodeProperties.MeshDisplay.meshPath", type: coffeeEngine.PropertyTypes.FILE, fileType: "obj,dae,glb" }, { name: "material", translationKey: "engine.nodeProperties.MeshDisplay.material", type: coffeeEngine.PropertyTypes.FILE, fileType: "material", systemRoot: { "/____NAMESPACE__IDENTIFIER____/": true, "coffee:": { "default.material": "defaultMaterial" }, "project:": project.fileSystem } }, { name: "modulatedColor", translationKey: "engine.nodeProperties.Node.modulatedColor", type: coffeeEngine.PropertyTypes.COLOR4 }, "---", { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }];
        }
    }

    coffeeEngine.registerNode(meshDisplay, "MeshDisplay", "Node3D");
})();
