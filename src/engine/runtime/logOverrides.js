{
    const oCLOG = console.log;
    const oCWARN = console.warn;
    const oCERROR = console.error;
    const oCINFO = console.info;
    const oCCLEAR = console.clear;

    console.log = (...stuff) => {
        coffeeEngine.sendEvent("consoleUpdate", {
            type: "log",
            info: stuff,
        });

        oCLOG(...stuff);
    };

    console.warn = (...stuff) => {
        coffeeEngine.sendEvent("consoleUpdate", {
            type: "warn",
            info: stuff,
        });

        oCWARN(...stuff);
    };

    console.error = (...stuff) => {
        coffeeEngine.sendEvent("consoleUpdate", {
            type: "error",
            info: stuff,
        });

        oCERROR(...stuff);
    };

    console.info = (...stuff) => {
        coffeeEngine.sendEvent("consoleUpdate", {
            type: "info",
            info: stuff,
        });

        oCINFO(...stuff);
    };

    console.clear = (...stuff) => {
        coffeeEngine.sendEvent("consoleUpdate", {
            type: "clear",
            info: stuff,
        });

        oCCLEAR(...stuff);
    };

    window.addEventListener("error", (event) => {
        //The one thing we need from the event
        const { message, lineno, colno } = event;

        //Somewhere there is a ResizeObserver that is making a loop. And it is supposed to be returning something?
        //I dunno cheap hack fix
        if (message == "ResizeObserver loop completed with undelivered notifications.") return;

        coffeeEngine.sendEvent("consoleUpdate", {
            type: "error",
            info: [message],
            lineNumber: lineno,
            columnNumber: colno,
        });
    });
}
