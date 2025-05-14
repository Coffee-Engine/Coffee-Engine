(function () {
    coffeeEngine.runtime.frameloopFunction = () => {
        if (!coffeeEngine.runtime.paused) {
            coffeeEngine.timer += coffeeEngine.runtime.deltaTime;
            coffeeEngine.runtime.update(coffeeEngine.runtime.deltaTime);
            coffeeEngine.runtime.draw();
        }
        coffeeEngine.runtime.frameStart();
    };

    coffeeEngine.runtime.startFrameLoop = (framerate) => {
        if (coffeeEngine.runtime.frameloop !== undefined && typeof coffeeEngine.runtime.frameLoop != "string") {
            clearInterval(coffeeEngine.runtime.frameloop);
        }

        coffeeEngine.runtime.framerate = framerate;
        coffeeEngine.runtime.stepMS = (1 / framerate) * 1000;
        coffeeEngine.runtime.frameloop = setInterval(coffeeEngine.runtime.frameloopFunction, coffeeEngine.runtime.stepMS);
    };

    coffeeEngine.runtime.startVSyncLoop = () => {
        if (typeof coffeeEngine.runtime.frameLoop == "string") return;

        if (coffeeEngine.runtime.frameloop !== undefined) {
            clearInterval(coffeeEngine.runtime.frameloop);
        }

        coffeeEngine.runtime.frameLoop = "VSync";

        const frameLoop = () => {
            if (!coffeeEngine.runtime.VSync) return;
            coffeeEngine.runtime.frameloopFunction();
            requestAnimationFrame(frameLoop);
        }

        requestAnimationFrame(frameLoop);
    }

    coffeeEngine.runtime.frameStart = (unupdatedMouse) => {
        coffeeEngine.runtime.updateDelta();
        if (!unupdatedMouse) {
            coffeeEngine.inputs.mouse.movementX = 0;
            coffeeEngine.inputs.mouse.movementY = 0;
        }
        coffeeEngine.renderer.nodesRendered = 0;
        coffeeEngine.renderer.pipeline.clearCameraQueue();
    };
})();
