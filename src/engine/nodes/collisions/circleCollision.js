(function() {
    class node extends coffeeEngine.getNode("Collision2D") {
        collision = new coffeeEngine.SAT.Circle();
        radius = 1.0;

        update(deltaTime) {
            super.update(deltaTime);

            this.collision.radius = this.radius;
        }
        
        draw(drawID) {
            super.draw();
            //Editor display
            if (coffeeEngine.isEditor) {
                if (editor.lastSelectedNode != this) return;

                //Get our shader and draw our circle
                const shader = coffeeEngine.renderer.mainShaders.editorCircle;

                const halfRadius = this.radius/2.0;

                shader.setBuffers(coffeeEngine.shapes.plane);
                shader.uniforms.u_model.value = this.mixedMatrix.scale(halfRadius, halfRadius, halfRadius).webGLValue();

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
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "radius", translationKey: "engine.nodeProperties.Light.radius", type: coffeeEngine.PropertyTypes.FLOAT },
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "CircleCollision", "Collision2D");
})();