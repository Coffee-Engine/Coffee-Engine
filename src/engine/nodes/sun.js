(function () {
    //Its the sun controller. Allows you to control. The sun
    class sun extends coffeeEngine.getNode("Node3D") {
        shader = coffeeEngine.renderer.mainShaders.unlit;
        shaderArrow = coffeeEngine.renderer.mainShaders.unlitSolid;

        constructor() {
            super();
        }

        #lightColorArray = [1, 1, 1, 1];
        #lightColor = "#ffffffff";

        set lightColor(value) {
            this.#lightColor = value;

            const split = coffeeEngine.ColorMath.HexToRGB(value);
            this.#lightColorArray = [split.r / 255, split.g / 255, split.b / 255, 1];
        }

        get lightColor() {
            return this.#lightColor;
        }

        draw(drawID) {
            super.draw();

            //Rotate our sun variable in the scene
            coffeeEngine.runtime.currentScene.sunDirection = [-this.mixedMatrix.contents[0][2], -this.mixedMatrix.contents[1][2], -this.mixedMatrix.contents[2][2]];
            coffeeEngine.runtime.currentScene.sunColor = [this.#lightColorArray[0], this.#lightColorArray[1], this.#lightColorArray[2]];

            //Editor display
            if (coffeeEngine.isEditor) {
                this.shader.setBuffers(coffeeEngine.shapes.plane);

                const translatedWorld = this.mixedMatrix.getTranslation();
                const renderMatrix = coffeeEngine.matrix4.identity().translate(translatedWorld.x, translatedWorld.y, translatedWorld.z).rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x).rotationX(-coffeeEngine.renderer.cameraData.cameraRotationEul.y).webGLValue();

                this.shader.uniforms.u_texture.value = coffeeEngine.renderer.sprites.sun.texture;
                this.shader.uniforms.u_model.value = renderMatrix;
                this.shader.uniforms.u_colorMod.value = this.#lightColorArray;
                this.shader.uniforms.u_objectID.value = drawID;
                this.shader.drawFromBuffers(6);

                this.shaderArrow.setBuffers(coffeeEngine.shapes.arrow);

                this.shaderArrow.uniforms.u_model.value = this.mixedMatrix.rotationY(3.1415962).translate(0, 0, -1).webGLValue();
                this.shaderArrow.uniforms.u_colorMod.value = this.#lightColorArray;
                this.shaderArrow.uniforms.u_objectID.value = drawID;
                this.shaderArrow.drawFromBuffers(48);
            }
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true }, 
                "---", 
                { name: "lightColor", translationKey: "engine.nodeProperties.Light.color", type: coffeeEngine.PropertyTypes.COLOR3 }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }

        //We don't judge, we always draw first. Hopefully
        sortValue() {
            return 0;
        }
    }

    coffeeEngine.registerNode(sun, "Sun", "Node3D");
})();
