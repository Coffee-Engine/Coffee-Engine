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

        draw() {
            super.draw();

            if (this.meshData && this.meshData instanceof coffeeEngine.mesh.class) {
                for (let subMeshIndex = 0; subMeshIndex < this.meshData.pointCount.length; subMeshIndex++) {
                    const data = this.meshData.data[subMeshIndex];
                    const pointCount = this.meshData.pointCount[subMeshIndex];

                    coffeeEngine.renderer.mainShaders.unlit.setBuffers(data);
                    coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.webGLValue();
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
                {name: "modulatedColor", type: coffeeEngine.PropertyTypes.COLOR4, smallRange:true},
            ] 
        };
    }

    coffeeEngine.registerNode(meshDisplay, "MeshDisplay", "Node3D");
})();
