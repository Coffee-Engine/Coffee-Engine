(function () {
    editor.windows.variable = class extends editor.windows.base {

        minWidth = 400;
        minHeight = 300;

        init(container) {
            this.title = "Create a Variable";

            container.style.display = "grid";
            container.style.gridTemplateRows = "52px 20% 60%";

            const variableName = document.createElement("input");
            variableName.type = "text";
            variableName.style.width = "45%";
            variableName.style.height = "30px";
            variableName.style.margin = "12px";
            variableName.style.marginLeft = "calc(50% - 22.5%)";

            variableName.placeholder = "Variable Name";

            container.appendChild(variableName);
        }

        resized() {
            this.width = 400;
            this.height = 300;
        }
    }
})()