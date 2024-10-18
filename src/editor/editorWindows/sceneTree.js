(function () {
    editor.windows.log = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.sceneTree"];
        }

        resized() {}

        dispose() {}
    };

    editor.windows.__Serialization.register(editor.windows.log,"sceneTree");
})();
