window.coffeeEngine = {
    events: {
        consoleUpdate: [],
        fileSystemUpdate: [],
        extensionDispose: [],
        desktopInput: [],
        projectSettingsLoaded: [],
        sceneLoaded: [],
    },
    broadcasts: {},
    runtime: {
        TVsync: false,
        TTF: 60,

        set VSync(value) {
            coffeeEngine.runtime.TVsync = value;

            if (coffeeEngine.isEditor) return;

            //Make sure our loop conforms
            if (value) coffeeEngine.runtime.startVSyncLoop();
            else coffeeEngine.runtime.startFrameLoop(coffeeEngine.runtime.targetFramerate);
        },

        get VSync() {
            return coffeeEngine.runtime.TVsync;
        },

        set targetFramerate(value) {
            coffeeEngine.runtime.TTF = value;

            if (coffeeEngine.isEditor) return;

            //Make sure our loop conforms
            if (!coffeeEngine.runtime.VSync) coffeeEngine.runtime.startFrameLoop(coffeeEngine.runtime.targetFramerate);
        },

        get targetFramerate() {
            return coffeeEngine.runtime.TTF;
        }
    },
    classes: {},
    collisionTypes: {
        SAT:false,
        POINT:true,
    },
    resources: {},
    renderer: {
        nodesRendered: 0,
        sprites: {},
        viewport: {}
    },
    preloadFunctions: {},
    nodeRegister: {},
    collisionGroup: {
        "default":{"default": true},
    },
    isEditor: false,
    //Just a simple node registrar thing
    registerNode: (node, name, parentNode) => {
        //Return if node already exists
        if (coffeeEngine.nodeRegister[name]) return;
        coffeeEngine.nodeRegister[name] = [node, parentNode];
    },
    deregisterNode: (name) => {
        if (!coffeeEngine.nodeRegister[name]) return;
        delete coffeeEngine.nodeRegister[name];
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

    //Our timer
    timer: 0,
};

window.globals = {};
