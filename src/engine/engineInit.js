window.coffeeEngine = {
    events: {
        consoleUpdate: [],
        fileSystemUpdate: [],
        extensionDispose: [],
    },
    runtime: {},
    classes: {},
    resources: {},
    renderer: {
        nodesRendered: 0,
        sprites:{}
    },
    preloadFunctions: {},
    nodeRegister: {},
    isEditor:false,
    //Just a simple node registrar thing
    registerNode: (node, name, parentNode) => {
        //Return if node already exists
        if (coffeeEngine.nodeRegister[name]) return;
        coffeeEngine.nodeRegister[name] = [node, parentNode];
    },
    getNode: (name) => {
        if (!coffeeEngine.nodeRegister[name]) return;
        return coffeeEngine.nodeRegister[name][0];
    },
    getNodeName: (node) => {
        const keys = Object.keys(coffeeEngine.nodeRegister);

        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
            const key = keys[keyIndex];
            if (coffeeEngine.nodeRegister[key]) {
                if (coffeeEngine.nodeRegister[key][0] == node.constructor) return key;
            }
        }

        return "Node";
    },

    timer: 0,
    addEventListener: (event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        coffeeEngine.events[event].push(func);
        return func;
    },

    hasEventListener: (event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        return coffeeEngine.events[event].includes(func);
    },

    removeEventListener: (event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        if (coffeeEngine.events[event].includes(func)) {
            coffeeEngine.events[event].slice(coffeeEngine.events[event].indexOf(func));
        }
    },

    sendEvent: (event, data) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        for (const eventFunc in coffeeEngine.events[event]) {
            coffeeEngine.events[event][eventFunc](data);
        }
    },
};
