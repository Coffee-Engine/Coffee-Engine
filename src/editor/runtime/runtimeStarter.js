//TODAY WE START THE RUNTIME!
(function () {
    //Function for compiling the runtime into a general html file
    editor.runtime.startWindowed = (scene) => {
        editor.runtime.compileWithDecaf(scene).then((htmlData) => {
            const blob = new Blob([htmlData], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "coffeeEngineWindow", "popup");
            URL.revokeObjectURL(url);
        });
    };
})();
