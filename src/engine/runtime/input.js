(function () {
    coffeeEngine.inputs = {
        keys: {},
        mouse: {},
        //gamepad objects
        gamepads: {
            0:{},
            1:{},
            2:{},
            3:{},
        },

        //Setting it to null for now.
        mouseOutTimer:null,
    };

    //Keyboard stuff
    window.addEventListener("keydown", (event) => {
        coffeeEngine.inputs.keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        coffeeEngine.inputs.keys[event.key] = false;
    });

    //Mouse stuff
    window.addEventListener("mousedown", (event) => {
        coffeeEngine.inputs.mouse[event.button] = true;
    });

    window.addEventListener("mouseup", (event) => {
        coffeeEngine.inputs.mouse[event.button] = false;
    });

    //Mouse movement
    coffeeEngine.inputs.mouseOutTimer = null;
    window.addEventListener("mousemove", (event) => {
        coffeeEngine.inputs.mouse.movementX = event.movementX;
        coffeeEngine.inputs.mouse.movementY = event.movementY;
        coffeeEngine.inputs.mouse.screenX = event.clientX;
        coffeeEngine.inputs.mouse.screenY = event.clientY;

        //Auto Stopping
        if (coffeeEngine.inputs.mouseOutTimer) clearTimeout(coffeeEngine.inputs.mouseOutTimer);
        timer = setTimeout(() => {
            coffeeEngine.inputs.mouse.movementX = 0;
            coffeeEngine.inputs.mouse.movementY = 0;
        }, 33 || coffeeEngine.runtime.stepMS);
    });

    window.addEventListener("mouseout", () => {
        coffeeEngine.inputs.mouse.movementX = 0;
        coffeeEngine.inputs.mouse.movementY = 0;
    })

    //just a helper function
    coffeeEngine.inputs.initilizeGamepad = (gamepad) => {
        if (!gamepad) return;
        
        coffeeEngine.inputs.gamepads[gamepad.index] = {
            object:gamepad,
            id:gamepad.id,
            mapping:gamepad.mapping,
            buttons:gamepad.buttons,
            axes:gamepad.axes,
        }
    }

    //Gamepad initilization
    navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;
    navigator.getGamepads().forEach(gamepad => {
        coffeeEngine.inputs.initilizeGamepad(gamepad);
    });

    window.addEventListener("gamepadconnected", (e) => {
        coffeeEngine.inputs.initilizeGamepad(e.gamepad);
    });
})();
