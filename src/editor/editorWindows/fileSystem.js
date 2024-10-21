(function () {
    editor.windows.fileExplorer = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.fileExplorer"];
            this.updateFunction = () => {
                console.log("File System Updated")
            }

            //Updating stuff
            this.updateListener = coffeeEngine.addEventListener("fileSystemUpdate",this.updateFunction);
            this.updateFunction();
        }

        resized() {}

        dispose() {}
    };

    editor.windows.__Serialization.register(editor.windows.fileExplorer,"fileExplorer");
})();
