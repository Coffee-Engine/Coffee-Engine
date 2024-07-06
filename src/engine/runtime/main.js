(function() {
    coffeeEngine.runtime.currentScene = new coffeeEngine.sceneClass();

    coffeeEngine.runtime.update = (deltaTime) => {
        if (coffeeEngine.runtime.currentScene) {
            coffeeEngine.runtime.currentScene.update(deltaTime)
        }
    }

    coffeeEngine.runtime.draw = () => {
        if (coffeeEngine.runtime.currentScene) {
            coffeeEngine.runtime.currentScene.draw();
        }
    }
})();