(function() {
    class node extends coffeeEngine.getNode("Collision3D") {
        collision = new coffeeEngine.SAT.Sphere();
        radius = 1.0;
        
        draw(drawID) {
            super.draw();
            const shader = coffeeEngine.renderer.mainShaders.editorCircle;
            //Editor display
            if (coffeeEngine.isEditor) {
                if (editor.lastSelectedNode != this) return;

                const halfRadius = this.radius/2.0;

                const renderMatrix = coffeeEngine.matrix4
                    .identity()
                    .translate(this.position.x, this.position.y, this.position.z)
                    .rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x)
                    .rotationX(-coffeeEngine.renderer.cameraData.cameraRotationEul.y)
                    .scale(halfRadius, halfRadius, halfRadius)
                    .webGLValue();  

                    shader.setBuffers(coffeeEngine.shapes.plane);
                    shader.uniforms.u_model.value = renderMatrix;

                    //Simple debug test
                    shader.uniforms.u_colorMod.value = [1, 1, 1, 1];
                    shader.uniforms.u_objectID.value = drawID;
                    shader.drawFromBuffers(6);
            }
        }
        
        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "radius", translationKey: "engine.nodeProperties.Light.radius", type: coffeeEngine.PropertyTypes.FLOAT },
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "SphereCollision", "Collision3D");
})();