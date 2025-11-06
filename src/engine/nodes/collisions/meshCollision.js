(function() {
    class node extends coffeeEngine.getNode("Collision3D") {
        collision = new coffeeEngine.SAT.mesh();

        meshData;
        #meshPath = "";

        set meshPath(value) {
            this.#meshPath = value;
            coffeeEngine.mesh.fromProjectFile(value).then((data) => {
                this.meshData = data;
                this.collision.mesh = data;
            }).catch(() => {
                this.meshData = null;
                this.collision.mesh = null;
            });
        }

        get meshPath() {
            return this.#meshPath;
        }

        editorDisplay(renderer, daveShade, camera, drawID) {
            renderer.pipeline.setUniforms(camera, this.shader, {
                u_model: this.mixedMatrix.webGLValue(),
                u_colorMod: [1, 1, 1, 1],
                u_objectID: drawID
            });
            daveShade.cullFace(daveShade.side.FRONT);

            //Draw mesh
            if (this.meshData && this.meshData instanceof coffeeEngine.mesh.class) {
                for (let subMeshIndex = 0; subMeshIndex < this.meshData.pointCount.length; subMeshIndex++) {
                    const data = this.meshData.data[subMeshIndex];
                    const pointCount = this.meshData.pointCount[subMeshIndex];

                    this.shader.setBuffers(data);
                    this.shader.drawFromBuffers(pointCount);
                }
            }

            coffeeEngine.renderer.daveshade.cullFace();
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---",
                { name: "collisionGroup", translationKey: "engine.nodeProperties.Collision.group", items: () => {return Object.keys(coffeeEngine.collisionGroup)}, type: coffeeEngine.PropertyTypes.DROPDOWN},
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC3 }, 
                "---",
                { name: "meshPath", translationKey: "engine.nodeProperties.MeshDisplay.meshPath", type: coffeeEngine.PropertyTypes.FILE, fileType: "obj,dae,glb" }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "MeshCollision", "Collision3D");
})();