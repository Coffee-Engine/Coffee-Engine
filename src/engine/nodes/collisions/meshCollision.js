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
            });
        }

        get meshPath() {
            return this.#meshPath;
        }

        draw(drawID) {
            super.draw();
            //Editor display
            if (coffeeEngine.isEditor) {
                if (editor.lastSelectedNode != this) return;
                //Get our shader
                const shader = coffeeEngine.renderer.mainShaders.editorShape;
                
                //Cull the faces
                coffeeEngine.renderer.daveshade.cullFace(DaveShade.side.FRONT);

                //Set our buffers and draw
                shader.setBuffers(coffeeEngine.shapes.cube);
                shader.uniforms.u_model.value = this.mixedMatrix.webGLValue();
                shader.uniforms.u_objectID.value = drawID;
                shader.uniforms.u_colorMod.value = [1, 1, 1, 1];

                //Draw mesh
                if (this.meshData && this.meshData instanceof coffeeEngine.mesh.class) {
                    for (let subMeshIndex = 0; subMeshIndex < this.meshData.pointCount.length; subMeshIndex++) {
                        const data = this.meshData.data[subMeshIndex];
                        const pointCount = this.meshData.pointCount[subMeshIndex];
    
                        shader.setBuffers(data);
                        shader.drawFromBuffers(pointCount);
                    }
                }

                coffeeEngine.renderer.daveshade.cullFace();
            }
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
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