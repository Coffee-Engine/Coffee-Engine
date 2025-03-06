(function() {
    editor.windows.projectManager = class extends editor.windows.base {
        init (container) {
            this.title = editor.language["editor.window.projectManager"];
        }
    }

    editor.windows.__Serialization.register(editor.windows.projectManager, "projectManager", { onlyOne: true });
})();