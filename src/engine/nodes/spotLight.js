(function () {
    class spotLight extends coffeeEngine.getNode("EditorVisible") {
        color = [1, 1, 1];
        radius = 5.0;
        falloff = 5.0;

        draw(renderer, daveShade, camera, drawID) {
            super.draw(renderer, daveShade, camera, drawID);
            
            const scene = coffeeEngine.runtime.currentScene;
            const translatedWorld = this.mixedMatrix.getTranslation();

            scene.__setLight(scene.lightCount, [translatedWorld.x, translatedWorld.y, translatedWorld.z, this.radius, this.color[0], this.color[1], this.color[2], 0, this.mixedMatrix.contents[0][2], this.mixedMatrix.contents[1][2], this.mixedMatrix.contents[2][2], this.falloff, 0, 0, 0, 0]);
            scene.lightCount += 1;

            //Editor display
            if (coffeeEngine.isEditor) {
                this.drawBillboard(renderer, daveShade, camera, drawID, coffeeEngine.renderer.engineTextures.spotlight);
                this.drawDirectionalArrow(renderer, camera, drawID);
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
                { name: "radius", translationKey: "engine.nodeProperties.Light.radius", type: coffeeEngine.PropertyTypes.FLOAT }, 
                { name: "falloff", translationKey: "engine.nodeProperties.SpotLight.falloff", type: coffeeEngine.PropertyTypes.FLOAT }, 
                { name: "color", translationKey: "engine.nodeProperties.Light.color", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(spotLight, "SpotLight", "Node3D");
})();
