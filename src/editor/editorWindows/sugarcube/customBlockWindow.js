(function () {
    const variableSVG = `
    <svg style="margin:0px; padding:0px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="69.14851"
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

    const listSVG = `
    <svg style="margin:0px; padding:0px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="72.67051"
    height="72.67051" viewBox="0,0,72.67051,72.67051">
        <g transform="translate(-203.66475,-143.66475)">
            <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke-linejoin="miter"
                stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">
                <path
                    d="M210.17759,161.46139c0,-2.76142 2.23858,-5 5,-5c2.76142,0 5,2.23858 5,5c0,2.76142 -2.23858,5 -5,5c-2.76142,0 -5,-2.23858 -5,-5z"
                    fill="currentColor" stroke="none" stroke-width="0.5" stroke-linecap="butt" />
                <path d="M227.95171,161.46139h37.32879" fill="none" stroke="currentColor" stroke-width="10"
                    stroke-linecap="round" />
                <path
                    d="M210.17759,180.05411c0,-2.76143 2.23857,-5 5,-5c2.76143,0 5,2.23857 5,5c0,2.76143 -2.23857,5 -5,5c-2.76143,0 -5,-2.23857 -5,-5z"
                    fill="currentColor" stroke="none" stroke-width="0.5" stroke-linecap="butt" />
                <path d="M227.9517,180.05411h37.32879" fill="none" stroke="currentColor" stroke-width="10"
                    stroke-linecap="round" />
                <path
                    d="M210.17759,198.53861c0,-2.76143 2.23857,-5 5,-5c2.76143,0 5,2.23857 5,5c0,2.76143 -2.23857,5 -5,5c-2.76143,0 -5,-2.23857 -5,-5z"
                    fill="currentColor" stroke="none" stroke-width="0.5" stroke-linecap="butt" />
                <path d="M227.95171,198.53861h37.3288" fill="none" stroke="currentColor" stroke-width="10"
                    stroke-linecap="round" />
                <path d="M203.66475,216.33525v-72.67051h72.67051v72.67051z" fill="none" stroke="none" stroke-width="none"
                    stroke-linecap="butt" />
            </g>
        </g>
    </svg>
    <!--rotationCenter:36.33525264516135:36.33525264516123-->
    `;

    editor.windows.myBlock = class extends editor.windows.base {

        minWidth = 400;
        minHeight = 300;

        init(container) {

            this.resizable = false;
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
            //Isolate variable types in here.
            {
                //Creeate the buttons and assign click actions
                this.variableButton = document.createElement("button");
                this.listButton = document.createElement("button");

                this.variableButton.onclick = () => {
                    this.variableType = "variable";
                }

                this.listButton.onclick = () => {
                    this.variableType = "list";
                }

                //Here are the images. We are also assigning the correct color and translation keys
                this.variableButton.style.margin = "4px";
                this.variableButton.style.gridAutoColumns = "auto 16px";
                this.variableButton.innerHTML = `${variableSVG}<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createVar.variable"]}</p>`;

                this.listButton.style.margin = "4px";
                this.listButton.style.gridAutoColumns = "auto 16px";
                this.listButton.innerHTML = `${listSVG}<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createVar.list"]}</p>`;

                //Append em
                typeDiv.appendChild(this.variableButton);
                typeDiv.appendChild(this.listButton);
            }

            container.appendChild(variableName);
            container.appendChild(typeDiv);

            this.colorInput = document.createElement("color-picker");
            this.colorInput.setAttribute("hasExtensions",true)
            container.appendChild(this.colorInput);
            this.colorInput.style.width = "32px";
            this.colorInput.style.height = "32px";

            this.colorInput.style.position = "relative";
            this.colorInput.style.margin = "8px";
            this.colorInput.style.marginLeft = "50%";

            this.colorInput.style.transform = "translate(-50%,0%)";

            const buttonDiv = document.createElement("div");
            buttonDiv.style.display = "grid";
            buttonDiv.style.gridTemplateColumns = "50% 50%";
            //Isolate buttons
            {
                const closeButton = document.createElement("button");
                closeButton.style.margin = "10%";
                closeButton.style.marginLeft = "25%";
                closeButton.style.marginRight = "12.5%"
                closeButton.innerText = "cancel";
                buttonDiv.appendChild(closeButton);
                
                //Close button functionality
                closeButton.onclick = () => {
                    this._dispose();
                }

                const doneButton = document.createElement("button");
                doneButton.style.margin = "10%";
                doneButton.style.marginLeft = "12.5%"
                doneButton.style.marginRight = "25%";
                doneButton.innerText = "done";
                buttonDiv.appendChild(doneButton);
                
                //Done button functionality
                doneButton.onclick = () => {
                    if (variableName.value.length < 1) return;

                    //Create our variable
                    sugarcube.variables.createVariable(
                        variableName.value,
                        this.variableType,
                        this.colorInput.value
                    );

                    //Refresh extension categories
                    sugarcube.extensionManager.updateExtensionBlocks("variables");
                    sugarcube.extensionManager.updateExtensionBlocks("lists");

                    this._dispose();
                }
                
            }
            container.appendChild(buttonDiv)
        }
    }
})()
