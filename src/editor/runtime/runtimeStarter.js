//TODAY WE START THE RUNTIME!
(function () {
    //Function for compiling the runtime into a general html file
    editor.runtime.startWindowed = (scene) => {
        editor.runtime.compileWithDecaf(scene).then((htmlData) => {
            const blob = new Blob([htmlData], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            const opened = window.open(url, "coffeeEngineWindow", "popup");

            //Make an interval to do a "dirty check" on the window close.
            const interval = setInterval(() => {
                if (opened.closed) {
                    console.log("runtime terminated");
                    clearInterval(interval);

                    URL.revokeObjectURL(url);
                }
            }, 125);
        });
    };
})();
