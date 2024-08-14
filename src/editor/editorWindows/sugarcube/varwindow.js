(function () {
    const variableSVG = `
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="69.14851"
        height="69.14851" viewBox="0,0,69.14851,69.14851">
        <g transform="translate(-205.42575,-145.42574)">
            <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke-linejoin="miter"
                stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">
                <path
                    d="M247.67054,193.34033c0,0 -6.64063,-8.73997 -9.25763,-13.26491c-2.52316,-4.36268 -6.17314,-13.41575 -6.17314,-13.41575"
                    stroke="currentColor" stroke-width="6.5" stroke-linecap="round" />
                <path
                    d="M228.41724,191.213c0,0 4.14498,-6.87918 8.34512,-10.96104c3.23951,-3.14829 14.73072,-11.46495 14.73072,-11.46495"
                    stroke="currentColor" stroke-width="6.5" stroke-linecap="round" />
                <path
                    d="M225.22949,202.06574c0,0 -10.59827,-1.52977 -7.51142,-25.73978c2.63686,-20.6808 9.83853,-18.30915 9.83853,-18.30915"
                    stroke="currentColor" stroke-width="6.5" stroke-linecap="round" />
                <path
                    d="M256.84665,158.02519c0,0 7.45232,-1.39703 7.32716,19.45082c-0.14652,24.40557 -10.85403,24.51832 -10.85403,24.51832"
                    data-paper-data="{&quot;index&quot;:null}" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" />
                <path d="M205.42575,214.57425v-69.14851h69.14851v69.14851z" stroke="none" stroke-width="0"
                    stroke-linecap="butt" />
            </g>
        </g>
    </svg>
    <!--rotationCenter:34.574250000000006:34.57426000000001-->
    `;

    editor.windows.variable = class extends editor.windows.base {

        minWidth = 400;
        minHeight = 300;

        variableType = ""

        init(container) {
            this.title = editor.language["editor.window.createVar"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "52px 100px 52px";

            //Our name value
            const variableName = document.createElement("input");
            variableName.type = "text";
            variableName.style.width = "45%";
            variableName.style.height = "30px";
            variableName.style.margin = "12px";
            variableName.style.marginLeft = "calc(50% - 22.5%)";

            variableName.placeholder = editor.language["editor.window.createVar.temporaryName"];

            //Now our container that holds the variable type
            const typeDiv = document.createElement("div");
            typeDiv.style.width = "100%";
            typeDiv.style.display = "grid";
            typeDiv.style.gridTemplateColumns = "50% 50%";
            //Isolate variables in here.
            {
                const variableButton = document.createElement("button");
                const listButton = document.createElement("button");

                variableButton.style.margin = "4px";
                variableButton.innerHTML = variableSVG;
                listButton.style.margin = "4px";

                typeDiv.appendChild(variableButton);
                typeDiv.appendChild(listButton);
            }

            container.appendChild(variableName);
            container.appendChild(typeDiv);

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