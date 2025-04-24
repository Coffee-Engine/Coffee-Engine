(function() {
    //Listener management for events defined in engineInit
    coffeeEngine.addEventListener = (event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        coffeeEngine.events[event].push(func);
        return func;
    },

    coffeeEngine.hasEventListener = (event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        return coffeeEngine.events[event].includes(func);
    },

    coffeeEngine.removeEventListener = (event, func) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        if (coffeeEngine.events[event].includes(func)) {
            coffeeEngine.events[event].splice(coffeeEngine.events[event].indexOf(func), 1);
        }
    },

    coffeeEngine.extensionRemovalListener = (extension, func) => {
        const eventListener = (event) => {
            if (event.ID == extension) {
                func(event);
                coffeeEngine.removeEventListener("extensionDispose", eventListener);
            }
        }

        coffeeEngine.addEventListener("extensionDispose", eventListener);

        return eventListener;
    },

    coffeeEngine.sendEvent = (event, data) => {
        if (typeof coffeeEngine.events[event] != "object") return;

        for (const eventFunc in coffeeEngine.events[event]) {
            coffeeEngine.events[event][eventFunc](data);
        }
    },

    //Differences between broadcasts and events. Broadcasts are built specifically for sending signals between nodes. Broadcasts have NO arguments
    coffeeEngine.addBroadcast = (broadcast, func) => {
        if (!coffeeEngine.broadcasts[broadcast]) coffeeEngine.broadcasts[broadcast] = [];

        coffeeEngine.broadcasts[broadcast].push(func);
        return func;
    },

    coffeeEngine.removeBroadcast = (broadcast, func) => {
        if (typeof coffeeEngine.broadcasts[broadcast] != "object") return;

        if (coffeeEngine.broadcasts[broadcast].includes(func)) {
            coffeeEngine.broadcasts[broadcast].splice(coffeeEngine.broadcasts[broadcast].indexOf(func), 1);
        }
    },

    coffeeEngine.sendBroadcast = (broadcast) => {
        if (typeof coffeeEngine.broadcasts[broadcast] != "object") return;

        for (const broadcastFunc in coffeeEngine.broadcasts[broadcast]) {
            coffeeEngine.broadcasts[broadcast][broadcastFunc]();
        }
    }
})();