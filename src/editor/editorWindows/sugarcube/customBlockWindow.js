(function () {
    editor.windows.myBlock = class extends editor.windows.base {

        minWidth = 400;
        minHeight = 300;

        init(container) {

            this.resizable = false;
            this.title = editor.language["editor.window.createBlock"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "100px 52px 52px";

            //Our name value
            const params = [];
            const blockDisplay = document.createElement("div");
            blockDisplay.style.width = "100%";
            blockDisplay.style.backgroundColor = "var(--background-4)";

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
                this.variableButton.innerHTML = `<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createVar.variable"]}</p>`;

                this.listButton.style.margin = "4px";
                this.listButton.style.gridAutoColumns = "auto 16px";
                this.listButton.innerHTML = `<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createVar.list"]}</p>`;

                //Append em
                typeDiv.appendChild(this.variableButton);
                typeDiv.appendChild(this.listButton);
            }

            container.appendChild(blockDisplay);
            container.appendChild(typeDiv);

            const colorInput = document.createElement("color-picker");
            colorInput.setAttribute("hasExtensions",true)
            container.appendChild(colorInput);
            colorInput.style.width = "32px";
            colorInput.style.height = "32px";
            colorInput.value = "#FF6680";

            colorInput.style.position = "relative";
            colorInput.style.margin = "8px";
            colorInput.style.marginLeft = "50%";

            colorInput.style.transform = "translate(-50%,0%)";

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
                        colorInput.value
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
