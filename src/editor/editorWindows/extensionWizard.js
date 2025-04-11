(function() {
    editor.windows.extensionWizard = class extends editor.windows.base {
        init(contents) {
            this.dockable = false;
            this.title = editor.language["editor.window.extensionWizard"];
        }
    }
})