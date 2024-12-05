(function () {
    coffeeEngine.inputs = {
        keys: {},
        mouse: {},
        //gamepad objects
        gamepads: {
            0: {},
            1: {},
            2: {},
            3: {},
        },

        //Setting it to null for now.
        axisNameToID: {
            "left-stick-x": 0,
            "left-stick-y": 1,
            "right-stick-x": 2,
            "right-stick-y": 3,
        },
        buttonNameToID: {
            "Bottom-Face": 0,
            "Right-Face": 1,
            "Left-Face": 2,
            "Top-Face": 3,

            "Left-Bumper": 4,
            "Right-Bumper": 5,

            "Left-Trigger": 6,
            "Right-Trigger": 7,

            Select: 8,
            Start: 9,

            "Left-Stick": 10,
            "Left-Stick": 11,

            "DPad-Up": 12,
            "DPad-Down": 13,
            "DPad-Left": 14,
            "DPad-Right": 15,
        },
    };

    //Keyboard stuff
    window.addEventListener("keydown", (event) => {
        coffeeEngine.inputs.keys[event.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (event) => {
        coffeeEngine.inputs.keys[event.key.toLowerCase()] = false;
    });

    //Mouse stuff
    window.addEventListener("mousedown", (event) => {
        coffeeEngine.inputs.mouse[event.button] = true;
    });

    window.addEventListener("mouseup", (event) => {
        coffeeEngine.inputs.mouse[event.button] = false;
    });

    window.addEventListener("contextmenu", (event) => {
        if (event.target.nodeName != "INPUT") event.preventDefault();
        if (event.target.contextFunction) {
            if (!event.defaultPrevented) event.preventDefault();
            if (editor && editor.dropdown && editor.dropdown.fromArray)
                editor.dropdown.fromArray(event.clientX, event.clientY, event.target.contextFunction()).then((value) => {
                    if (event.target.contentAnswer) event.target.contentAnswer(value);
                });
        }
    });

    //Mouse movement
    window.addEventListener("mousemove", (event) => {
        coffeeEngine.inputs.mouse.movementX = event.movementX;
        coffeeEngine.inputs.mouse.movementY = event.movementY;
        coffeeEngine.inputs.mouse.screenX = event.clientX;
        coffeeEngine.inputs.mouse.screenY = event.clientY;
    });

    window.addEventListener("mouseout", () => {
        coffeeEngine.inputs.mouse.movementX = 0;
        coffeeEngine.inputs.mouse.movementY = 0;
    });

    //just a helper function
    coffeeEngine.inputs.initilizeGamepad = (gamepad) => {
        if (!gamepad) return;

        coffeeEngine.inputs.gamepads[gamepad.index] = {
            object: gamepad,
            id: gamepad.id,
            mapping: gamepad.mapping,
            buttons: gamepad.buttons,
            axes: gamepad.axes,
        };
    };

    //Gamepad initilization
    navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;
    navigator.getGamepads().forEach((gamepad) => {
        coffeeEngine.inputs.initilizeGamepad(gamepad);
    });

    window.addEventListener("gamepadconnected", (event) => {
        coffeeEngine.inputs.initilizeGamepad(event.gamepad);
    });

    window.addEventListener("gamepaddisconnected", (event) => {
        delete coffeeEngine.inputs.gamepads[event.gamepad.index];
        coffeeEngine.inputs.gamepads[event.gamepad.index] = {};
    });
})();
