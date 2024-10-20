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
    };

    window.addEventListener("keydown", (event) => {
        coffeeEngine.inputs.keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
        coffeeEngine.inputs.keys[event.key] = false;
    });

    window.addEventListener("mousedown", (event) => {
        coffeeEngine.inputs.mouse[event.button] = true;
    });

    window.addEventListener("mouseup", (event) => {
        coffeeEngine.inputs.mouse[event.button] = false;
    });

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
