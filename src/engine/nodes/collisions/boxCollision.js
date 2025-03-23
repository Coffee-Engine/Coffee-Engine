(function() {
    class node extends coffeeEngine.getNode("Collision3D") {
        collision = new coffeeEngine.SAT.OBB();

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

                //Simple debug test
                shader.uniforms.u_colorMod.value = [1, 1, 1, 1];
                shader.uniforms.u_objectID.value = drawID;
                shader.drawFromBuffers(36);
                coffeeEngine.renderer.daveshade.cullFace();
            }
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC2 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.FLOAT, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC2 }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "BoxCollision", "Collision3D");
})();