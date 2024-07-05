(function() {
    coffeeEngine.runtime = {};
    coffeeEngine.runtime.currentScene = [];

    coffeeEngine.runtime.update = (deltaTime) => {
        if (coffeeEngine.runtime.currentScene) {
            coffeeEngine.runtime.currentScene.forEach(child => {
                if (child.update) {
                    child.update(deltaTime);
                }
            });
        }
    }

    coffeeEngine.runtime.draw = () => {
        if (coffeeEngine.runtime.currentScene) {
            coffeeEngine.runtime.currentScene.forEach(child => {
                if (child.draw) {
                    child.draw();
                }
            });
        }
    }
})();