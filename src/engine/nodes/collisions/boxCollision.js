(function() {
    class node extends coffeeEngine.getNode("Collision3D") {
        collision = new coffeeEngine.SAT.OBB();

        draw(drawID) {
            super.draw();
            const shader = coffeeEngine.renderer.mainShaders.editorCircle;
            //Editor display
            if (coffeeEngine.isEditor) {
                if (editor.lastSelectedNode != this) return;
                shader.setBuffers(coffeeEngine.shapes.cube);
                shader.uniforms.u_model.value = this.mixedMatrix.webGLValue();

                //Simple debug test
                shader.uniforms.u_colorMod.value = [1, 1, 1, 1];
                shader.uniforms.u_objectID.value = drawID;
                shader.drawFromBuffers(36);
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
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "BoxCollision", "Collision3D");
})();