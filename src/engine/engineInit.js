const coffeeEngine = {
    events: {
        consoleUpdate:[]
    },
    runtime: {},
    classes: {},
    resources: {},
    renderer: {},
    timer: 0,
    addEventListener:(event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        coffeeEngine.events[event].push(func);
        return func;
    },

    hasEventListener:(event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        return coffeeEngine.events[event].includes(func);
    },

    removeEventListener:(event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        if (coffeeEngine.events[event].includes(func)) {
            coffeeEngine.events[event].slice(coffeeEngine.events[event].indexOf(func));
        }
    },

    sendEvent:(event,data) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        coffeeEngine.events[event].forEach(event => {
            event(data);
        });
    }
};
