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

        #modulatedColorArr = [1,1,1,1];
        #modulatedColor = "#ffffffff";

        set modulatedColor(value) {
            this.#modulatedColor = value;

            const split = coffeeEngine.ColorMath.HexToRGB(value);
            this.#modulatedColorArr = [split.r / 255, split.g / 255, split.b / 255, split.a / 255];
        }

        get modulatedColor() {
            return this.#modulatedColor;
        }

        draw() {
            super.draw();

            if (this.meshData && this.meshData instanceof coffeeEngine.mesh.class) {
                for (let subMeshIndex = 0; subMeshIndex < this.meshData.pointCount.length; subMeshIndex++) {
                    const data = this.meshData.data[subMeshIndex];
                    const pointCount = this.meshData.pointCount[subMeshIndex];

                    coffeeEngine.renderer.mainShaders.unlit.setBuffers(data);
                    coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.webGLValue();
                    if (coffeeEngine.renderer.mainShaders.unlit.uniforms.u_colorMod) coffeeEngine.renderer.mainShaders.unlit.uniforms.u_colorMod.value = this.#modulatedColorArr;
                    coffeeEngine.renderer.mainShaders.unlit.drawFromBuffers(pointCount);
                }
            }
        }

        getProperties() { 
            return [
                {name: "name", type: coffeeEngine.PropertyTypes.NAME},
                "---",
                {name: "position", type: coffeeEngine.PropertyTypes.VEC3},
                {name: "rotation", type: coffeeEngine.PropertyTypes.VEC3},
                {name: "scale", type: coffeeEngine.PropertyTypes.VEC3},
                "---",
                {name: "meshPath", type: coffeeEngine.PropertyTypes.FILE, fileType: "obj,dae,gltf"},
                {name: "material", type: coffeeEngine.PropertyTypes.FILE, fileType: "material", systemRoot:{"coffee:":{"default.material":"defaultMaterial"},project:project.fileSystem}},
                {name: "modulatedColor", type: coffeeEngine.PropertyTypes.COLOR4, smallRange:true},
            ] 
        };
    }

    coffeeEngine.registerNode(meshDisplay, "MeshDisplay", "Node3D");
})();
