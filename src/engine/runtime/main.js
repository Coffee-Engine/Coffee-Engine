(function () {
    coffeeEngine.runtime.paused = false;
    coffeeEngine.runtime.lastTick = Date.now();
    coffeeEngine.runtime.deltaTime = 0.016;

    coffeeEngine.runtime.update = (deltaTime) => {
        if (coffeeEngine.runtime.currentScene) {
            coffeeEngine.runtime.currentScene.update(deltaTime);
        }
    };

    coffeeEngine.runtime.draw = () => {
        if (coffeeEngine.runtime.currentScene) {
            coffeeEngine.runtime.currentScene.draw();
        }
    };

    coffeeEngine.runtime.updateDelta = () => {
        coffeeEngine.runtime.deltaTime = (Date.now() - coffeeEngine.runtime.lastTick) / 1000;
        coffeeEngine.runtime.lastTick = Date.now();
    };
})();
