(function () {
    class pointLight extends coffeeEngine.getNode("Node3D") {
        color = [1, 1, 1];
        radius = 5.0;

        shader = coffeeEngine.renderer.mainShaders.unlit;
        sprite = coffeeEngine.renderer.sprites.light;

        draw(drawID) {
            super.draw();

            const scene = coffeeEngine.runtime.currentScene;
            const translatedWorld = this.mixedMatrix.getTranslation();

            scene.__setLight(scene.lightCount, [translatedWorld.x, translatedWorld.y, translatedWorld.z, this.radius, this.color[0], this.color[1], this.color[2], 0, 1, 1, 1, 1, 0, 0, 0, 0]);
            scene.lightCount += 1;

            //Editor display
            if (coffeeEngine.isEditor) {
                this.shader.setBuffers(coffeeEngine.shapes.plane);

                const renderMatrix = coffeeEngine.matrix4
                    .identity()
                    .translate(translatedWorld.x, translatedWorld.y, translatedWorld.z)
                    .rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x)
                    .rotationX(-coffeeEngine.renderer.cameraData.cameraRotationEul.y)
                    .scale((this.sprite.width / this.sprite.height) * 0.5, 0.5, 0.5)
                    .webGLValue();

                this.shader.uniforms.u_texture.value = this.sprite.texture;
                this.shader.uniforms.u_model.value = renderMatrix;
                this.shader.uniforms.u_colorMod.value = [this.color[0], this.color[1], this.color[2], 1];
                this.shader.uniforms.u_objectID.value = drawID;
                this.shader.drawFromBuffers(6);
            }
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                "---", 
                { name: "radius", translationKey: "engine.nodeProperties.Light.radius", type: coffeeEngine.PropertyTypes.FLOAT }, 
                { name: "color", translationKey: "engine.nodeProperties.Light.color", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }

        //Oh yeah mr krabs
        sortValue() {
            return this.position.sub(coffeeEngine.renderer.cameraData.position).length();
        }
    }

    coffeeEngine.registerNode(pointLight, "PointLight", "Node3D");
})();
