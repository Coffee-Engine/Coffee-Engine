(function () {
    class pointLight extends coffeeEngine.getNode("Node3D") {
        color = [1,1,1];
        radius = 5.0;

        draw() {
            const scene = coffeeEngine.runtime.currentScene;
            scene.__setLight(scene.lightCount,
                [
                    this.position.x,this.position.y,this.position.z,this.radius,
                    this.color[0],this.color[1],this.color[2],0,
                    1,1,1,0,
                    0,0,0,0
                ]
            );
            scene.lightCount += 1;
        }

        getProperties() {
            return [
                { name: "name", translationKey:"engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey:"engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 },
                { name: "radius", translationKey:"engine.nodeProperties.Light.radius", type: coffeeEngine.PropertyTypes.FLOAT },
                { name: "color", translationKey:"engine.nodeProperties.Light.color", type: coffeeEngine.PropertyTypes.COLOR3, smallRange: true},
                "---",
                {name: "script", translationKey:"engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js"}
            ];
        }

        //Oh yeah mr krabs
        sortValue() {
            return this.position.sub(coffeeEngine.renderer.cameraData.position).length();
        }
    }

    coffeeEngine.registerNode(pointLight, "PointLight", "Node3D");
})();
