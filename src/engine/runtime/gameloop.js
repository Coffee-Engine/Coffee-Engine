(function () {
    coffeeEngine.runtime.frameloopFunction = () => {
        coffeeEngine.runtime.frameStart();
        if (!coffeeEngine.runtime.paused) {
            coffeeEngine.timer += coffeeEngine.runtime.deltaTime;
            coffeeEngine.runtime.update(coffeeEngine.runtime.deltaTime);
            coffeeEngine.runtime.draw();
        }
    };

    coffeeEngine.runtime.startFrameLoop = (framerate) => {
        if (coffeeEngine.runtime.frameloop) {
            clearInterval(coffeeEngine.runtime.frameloop);
        }

        coffeeEngine.runtime.framerate = framerate;
        coffeeEngine.runtime.stepMS = (1 / framerate) * 1000;
        coffeeEngine.runtime.frameloop = setInterval(coffeeEngine.runtime.frameloopFunction, (1 / framerate) * 1000);
    };

    coffeeEngine.runtime.frameStart = (unupdatedMouse) => {
        coffeeEngine.runtime.updateDelta();
        if (!unupdatedMouse) {
            coffeeEngine.inputs.mouse.movementX = 0;
            coffeeEngine.inputs.mouse.movementY = 0;
        }
        coffeeEngine.renderer.nodesRendered = 0;
    };
})();
