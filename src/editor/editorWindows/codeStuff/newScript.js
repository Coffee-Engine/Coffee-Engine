(function () {
    editor.windows.newScript = class extends editor.windows.base {

        minWidth = 400;
        minHeight = 200;

        init(container) {
            this.resizable = false;
            this.title = editor.language["editor.window.createScript"];

            this.path = document.createElement("input");
            this.path.type = "text";

            container.appendChild(this.path);
        }
    }
})()
