(function() {
    editor.windows.codeEditor = class extends editor.windows.base {
        init(container) {
            sugarcube.inject(container);
        }
    }

    editor.windows.__Serialization.register(editor.windows.codeEditor,"codeEditor");
})();