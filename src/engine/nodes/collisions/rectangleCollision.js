(function() {
    class node extends coffeeEngine.getNode("Collision2D") {
        collision = new coffeeEngine.SAT.retangle();

        editorDisplay(renderer, daveShade, camera, drawID) {
            //Set our buffers and draw
            this.shader.setBuffers(coffeeEngine.shapes.plane);

            renderer.pipeline.setUniforms(camera, this.shader, {
                u_model: this.mixedMatrix.webGLValue(),
                u_colorMod: [1, 1, 1, 1],
                u_objectID: drawID
            });

            daveShade.cullFace();
            this.shader.drawFromBuffers(6);
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