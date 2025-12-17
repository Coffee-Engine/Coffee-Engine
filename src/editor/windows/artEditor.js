(function () {
    editor.useCSSFile("editor/css/windows/artEditor.css", "artEditor");

    //The actual window
    editor.windows.artEditor = class extends editor.windows.base {
        init(contents) {
            //Yeah
            artimus.maxHistory = editor.settings.values.Artimus.maxHistory
            this.title = editor.language["editor.window.artEditor"];
            const toolBar = document.createElement("div");
            const editorSpace = document.createElement("div");

            contents.className = "artEditor-content";
            toolBar.className = "artEditor-toolbar";
            editorSpace.className = "artEditor-editorArea";

            contents.appendChild(toolBar);
            contents.appendChild(editorSpace);

            toolBar.innerHTML = `<cugi-dropdown>
                File
                <cugi-option>{ type: "button", text: editor.language["editor.dropdown.project.importFiles"], value: "importFiles" }</cugi-option>
            </cugi-dropdown><cugi-dropdown>
                Sprite
                <cugi-option>{ type: "button", text: editor.language["editor.dropdown.project.importFiles"], value: "importFiles" }</cugi-option>
            </cugi-dropdown><cugi-dropdown>
                Atlas
                <cugi-option>{ type: "button", text: editor.language["editor.dropdown.project.importFiles"], value: "importFiles" }</cugi-option>
            </cugi-dropdown>`;

            this.workspace = artimus.inject(editorSpace);
        
            editor.addFileHook(coffeeEngine.formats.bitmapImage, (path) => {
                project.getFile(path).then(file => this.workspace.importFromPC(file));
            }, this.workspace, editor.language["editor.window.artEditor"]);
        }
    };

    editor.windows.__Serialization.register(editor.windows.artEditor, "artEditor", { onlyOne: true });
})();
