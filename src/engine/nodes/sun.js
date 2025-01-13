(function () {
    //Its the sun controller. Allows you to control. The sun
    class sun extends coffeeEngine.getNode("Node3D") {
        shader = coffeeEngine.renderer.mainShaders.unlit;

        constructor() {
            super()
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

        draw() {
            super.draw();

            //Rotate our sun variable in the scene
            coffeeEngine.runtime.currentScene.sunDirection = [-this.matrix.contents[0][2],-this.matrix.contents[1][2],-this.matrix.contents[2][2]];
            coffeeEngine.runtime.currentScene.sunColor = [this.#lightColorArray[0],this.#lightColorArray[1],this.#lightColorArray[2]];

            //Editor display
            if (coffeeEngine.isEditor) {
                this.shader.setBuffers(coffeeEngine.shapes.plane);

                const renderMatrix = coffeeEngine.matrix4.identity().translate(this.position.x, this.position.y, this.position.z).rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x)
                .rotationX(-coffeeEngine.renderer.cameraData.cameraRotationEul.y)
                .scale(0.25,0.25,0.25)
                .webGLValue();

                this.shader.uniforms.u_texture.value = coffeeEngine.renderer.sprites.sun.texture;
                this.shader.uniforms.u_model.value = renderMatrix;
                this.shader.uniforms.u_colorMod.value = this.#lightColorArray;
                this.shader.drawFromBuffers(6);
            }
        }

        getProperties() {
            return [
                { name: "name", translationKey:"engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey:"engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", translationKey:"engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true},
                "---",
                { name: "lightColor", translationKey:"engine.nodeProperties.Lighting.lightColor", type: coffeeEngine.PropertyTypes.COLOR3 }, 
                "---",
                {name: "script", translationKey:"engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js"}
            ];
        }

        //We don't judge, we always draw first. Hopefully
        sortValue() {
            return 0;
        }
    }

    coffeeEngine.registerNode(sun, "Sun", "Node3D");
})();
