(function() {
    class node extends coffeeEngine.getNode("Collision2D") {
        collision = new coffeeEngine.SAT.Circle();
        radius = 1.0;

        update(deltaTime) {
            super.update(deltaTime);

            this.collision.radius = this.radius;
        }

        shader = coffeeEngine.renderer.mainShaders.editorCircle;

        editorDisplay(renderer, daveShade, camera, drawID) {
            //Set our buffers and draw
            this.shader.setBuffers(coffeeEngine.shapes.plane);
            const halfRadius = this.radius / 2.0;

            renderer.pipeline.setUniforms(camera, this.shader, {
                u_model: this.mixedMatrix.scale(halfRadius, halfRadius, halfRadius).webGLValue(),
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
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "radius", translationKey: "engine.nodeProperties.Light.radius", type: coffeeEngine.PropertyTypes.FLOAT },
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "CircleCollision", "Collision2D");
})();