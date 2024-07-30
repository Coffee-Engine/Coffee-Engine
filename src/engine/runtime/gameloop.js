(function () {
    coffeeEngine.runtime.frameloopFunction = () => {
        coffeeEngine.runtime.updateDelta();
        if (!coffeeEngine.runtime.paused) {
            coffeeEngine.runtime.update(coffeeEngine.runtime.deltaTime);
            coffeeEngine.runtime.draw();
        }
    };

    coffeeEngine.runtime.startFrameLoop = (framerate) => {
        if (coffeeEngine.runtime.frameloop) {
            clearInterval(coffeeEngine.runtime.frameloop);
        }

        coffeeEngine.runtime.frameloop = setInterval(coffeeEngine.runtime.frameloopFunction, (1 / framerate) * 1000);
    };
})();
