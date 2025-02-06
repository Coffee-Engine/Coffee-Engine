(function () {
    class spotLight extends coffeeEngine.getNode("Node3D") {
        color = [1, 1, 1];
        radius = 5.0;
        falloff = 5.0;

        shader = coffeeEngine.renderer.mainShaders.unlit;
        shaderArrow = coffeeEngine.renderer.mainShaders.unlitSolid;
        sprite = coffeeEngine.renderer.sprites.spotlight;

        draw() {
            const scene = coffeeEngine.runtime.currentScene;
            scene.__setLight(scene.lightCount, [this.position.x, this.position.y, this.position.z, this.radius, this.color[0], this.color[1], this.color[2], 0, this.matrix.contents[0][2], this.matrix.contents[1][2], this.matrix.contents[2][2], this.falloff, 0, 0, 0, 0]);
            scene.lightCount += 1;

            //Editor display
            if (coffeeEngine.isEditor) {
                this.shader.setBuffers(coffeeEngine.shapes.plane);

                const renderMatrix = coffeeEngine.matrix4
                    .identity()
                    .translate(this.position.x, this.position.y, this.position.z)
                    .rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x)
                    .rotationX(-coffeeEngine.renderer.cameraData.cameraRotationEul.y)
                    .scale((this.sprite.width / this.sprite.height) * 0.5, 0.5, 0.5)
                    .webGLValue();

                this.shader.uniforms.u_texture.value = this.sprite.texture;
                this.shader.uniforms.u_model.value = renderMatrix;
                this.shader.uniforms.u_colorMod.value = [this.color[0], this.color[1], this.color[2], 1];
                this.shader.drawFromBuffers(6);

                this.shaderArrow.setBuffers(coffeeEngine.shapes.arrow);

                this.shaderArrow.uniforms.u_model.value = this.matrix.rotationY(3.1415962).translate(0, 0, -1).webGLValue();
                this.shaderArrow.uniforms.u_colorMod.value = [this.color[0], this.color[1], this.color[2], 1];
                this.shaderArrow.drawFromBuffers(48);
            }
        }

        getProperties() {
            return [{ name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, "---", { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3 }, "---", { name: "radius", translationKey: "engine.nodeProperties.Light.radius", type: coffeeEngine.PropertyTypes.FLOAT }, { name: "falloff", translationKey: "engine.nodeProperties.SpotLight.falloff", type: coffeeEngine.PropertyTypes.FLOAT }, { name: "color", translationKey: "engine.nodeProperties.Light.color", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true }, "---", { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }];
        }

        //Oh yeah mr krabs
        sortValue() {
            return this.position.sub(coffeeEngine.renderer.cameraData.position).length();
        }
    }

    coffeeEngine.registerNode(spotLight, "SpotLight", "Node3D");
})();
