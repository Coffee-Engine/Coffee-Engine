(function () {
    editor.windows.variable = class extends editor.windows.base {

        minWidth = 600;
        minHeight = 400;

        init(container) {
            this.title = "Create a variable";
        }
    }
})()