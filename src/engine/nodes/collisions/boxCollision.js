(function() {
    class node extends coffeeEngine.getNode("Collision3D") {
        collision = new coffeeEngine.SAT.OBB();

        editorDisplay(renderer, daveShade, camera, drawID) {
            renderer.pipeline.setUniforms(camera, this.shader, {
                u_model: this.mixedMatrix.webGLValue(),
                u_colorMod: [1, 1, 1, 1],
                u_objectID: drawID
            })

            daveShade.cullFace(daveShade.SIDE.FRONT);
            this.shader.setBuffers(coffeeEngine.shapes.cube);
            this.shader.drawFromBuffers(36);
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
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "BoxCollision", "Collision3D");
})();