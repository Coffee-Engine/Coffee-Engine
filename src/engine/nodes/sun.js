(function () {
    //Its the sun controller. Allows you to control. The sun
    class sun extends coffeeEngine.getNode("EditorVisible") {
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

        draw(renderer, daveShade, camera, drawID) {
            super.draw(renderer, daveShade, camera, drawID);

            //Rotate our sun variable in the scene
            coffeeEngine.runtime.currentScene.sunDirection = [-this.mixedMatrix.contents[0][2], -this.mixedMatrix.contents[1][2], -this.mixedMatrix.contents[2][2]];
            coffeeEngine.runtime.currentScene.sunColor = [this.#lightColorArray[0], this.#lightColorArray[1], this.#lightColorArray[2]];

            //Editor display
            if (coffeeEngine.isEditor) {
                this.drawBillboard(renderer, daveShade, camera, drawID, coffeeEngine.renderer.engineTextures.sun, this.color);
                this.drawDirectionalArrow(renderer, camera, drawID, this.color);
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
