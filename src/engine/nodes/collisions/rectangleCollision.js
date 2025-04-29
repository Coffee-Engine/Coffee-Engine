(function() {
    class node extends coffeeEngine.getNode("Collision2D") {
        collision = new coffeeEngine.SAT.retangle();

        draw(drawID) {
            super.draw();
            //Editor display
            if (coffeeEngine.isEditor) {
                if (editor.lastSelectedNode != this) return;
                //Get our shader
                const shader = coffeeEngine.renderer.mainShaders.editorShape;

                //Set our buffers and draw
                shader.setBuffers(coffeeEngine.shapes.plane);
                shader.uniforms.u_model.value = this.mixedMatrix.webGLValue();

                //Simple debug test
                shader.uniforms.u_colorMod.value = [1, 1, 1, 1];
                shader.uniforms.u_objectID.value = drawID;
                coffeeEngine.renderer.daveshade.cullFace();
                shader.drawFromBuffers(6);
            }
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---",
                { name: "collisionGroup", translationKey: "engine.nodeProperties.Collision.group", items: () => {return Object.keys(coffeeEngine.collisionGroup)}, type: coffeeEngine.PropertyTypes.DROPDOWN},
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC2 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.FLOAT, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC2 }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "RectangleCollision", "Collision2D");
})();