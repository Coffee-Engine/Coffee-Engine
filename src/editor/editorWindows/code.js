(function() {
    editor.windows.codeEditor = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.codeEditor"];
            monacoManager.refreshTheme();
            monacoManager.inject(container);
            //sugarcube.inject(container);
        }
    }

    editor.windows.__Serialization.register(editor.windows.codeEditor,"codeEditor");
})();