(function () {
    editor.windows.fileExplorer = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.fileExplorer"];
        }

        resized() {}

        dispose() {}
    };

    editor.windows.__Serialization.register(editor.windows.fileExplorer,"fileExplorer");
})();
