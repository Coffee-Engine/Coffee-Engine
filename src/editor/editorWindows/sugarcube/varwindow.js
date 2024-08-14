(function () {
    editor.windows.variable = class extends editor.windows.base {

        minWidth = 400;
        minHeight = 300;

        variableType = ""

        init(container) {
            this.title = editor.language["editor.window.createVar"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "52px 20% 60%";

            const variableName = document.createElement("input");
            variableName.type = "text";
            variableName.style.width = "45%";
            variableName.style.height = "30px";
            variableName.style.margin = "12px";
            variableName.style.marginLeft = "calc(50% - 22.5%)";

            variableName.placeholder = editor.language["editor.window.createVar.temporaryName"];

            container.appendChild(variableName);

            sugarcube.workspace.createVariable(
                variableName.value,
                this.variableType,
                //This is going to be random anyways
                variableName.value
            );
        }

        variableExists(name) {
            return sugarcube.workspace.getAllVariableNames().includes(name);
        }

        resized() {
            this.width = 400;
            this.height = 300;
        }
    }
})()