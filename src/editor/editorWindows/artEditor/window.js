(function () {
    //The tools for the window
    editor.artTools = {};

    //The actual window
    editor.windows.artEditor = class extends editor.windows.base {
    };

    editor.windows.__Serialization.register(editor.windows.artEditor, "artEditor", { onlyOne: true });
})();
