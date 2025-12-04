(function () {
    //The actual window
    editor.windows.artEditor = class extends editor.windows.base {
        init(contents) {
            //Yeah
            this.title = editor.language["editor.window.artEditor"];
            artimus.inject(contents);
        }
    };

    editor.windows.__Serialization.register(editor.windows.artEditor, "artEditor", { onlyOne: true });
})();
