(function () {
    editor.windows.myBlock = class extends editor.windows.base {

        minWidth = 400;
        minHeight = 300;

        init(container) {

            this.resizable = false;
            this.title = editor.language["editor.window.createBlock"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "100px 52px 52px";

            //The div that contains our block display
            const params = [];
            const blockDisplay = document.createElement("div");
            blockDisplay.style.width = "100%";
            blockDisplay.style.backgroundColor = "var(--background-4)";
            blockDisplay.style.display = "flex";
            blockDisplay.style.position = "relative";

            //Create our block display
            const blockDiv = document.createElement("div");

            //Configure our block display
            blockDiv.style.top = "50%";
            blockDiv.style.left = "50%";
            blockDiv.style.position = "absolute";
            blockDiv.style.backgroundColor = "#FF6680";
            blockDiv.style.padding = `${editor.settings.values.SugarCube.padding}px`;
            blockDiv.style.height = "1.75em";
            blockDiv.style.transform = "translate(-50%,-50%)";

            blockDiv.appendChild((() => {const cool = document.createElement("input"); cool.type = "text"; cool.value = "Wow"; cool.style.minWidth = "2ch"; cool.style.minHeight = "0px"; cool.style.width = "2ch"; return cool;})());

            blockDisplay.appendChild(blockDiv);

            //Now our container that holds the variable type
            const typeDiv = document.createElement("div");
            typeDiv.style.width = "100%";
            typeDiv.style.overflowX = "scroll";
            typeDiv.style.display = "grid";
            typeDiv.style.gridTemplateColumns = "33.333% 33.333% 33.333% 33.333% 33.333% 33.333%";
            //Isolate variable types in here.
            {
                //Creeate the buttons and assign click actions
                const textButton = document.createElement("button");
                const numberButton = document.createElement("button");
                const colorButton = document.createElement("button");
                const labelButton = document.createElement("button");
                const arrayButton = document.createElement("button");
                const objectButton = document.createElement("button");

                //Here are the images. We are also assigning the correct color and translation keys
                textButton.style.margin = "4px";
                textButton.style.gridAutoColumns = "auto 16px";
                textButton.innerHTML = `<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createBlock.textInput"]}</p>`;

                //Here are the images. We are also assigning the correct color and translation keys
                numberButton.style.margin = "4px";
                numberButton.style.gridAutoColumns = "auto 16px";
                numberButton.innerHTML = `<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createBlock.numberInput"]}</p>`;

                //Here are the images. We are also assigning the correct color and translation keys
                colorButton.style.margin = "4px";
                colorButton.style.gridAutoColumns = "auto 16px";
                colorButton.innerHTML = `<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createBlock.colorInput"]}</p>`;

                //Here are the images. We are also assigning the correct color and translation keys
                labelButton.style.margin = "4px";
                labelButton.style.gridAutoColumns = "auto 16px";
                labelButton.innerHTML = `<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createBlock.addLabel"]}</p>`;

                //Here are the images. We are also assigning the correct color and translation keys
                arrayButton.style.margin = "4px";
                arrayButton.style.gridAutoColumns = "auto 16px";
                arrayButton.innerHTML = `<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createBlock.arrayInput"]}</p>`;

                //Here are the images. We are also assigning the correct color and translation keys
                objectButton.style.margin = "4px";
                objectButton.style.gridAutoColumns = "auto 16px";
                objectButton.innerHTML = `<p style="font-size:16px; margin:0px; padding:0px;">${editor.language["editor.window.createBlock.objectInput"]}</p>`;

                //Append em
                typeDiv.appendChild(textButton);
                typeDiv.appendChild(numberButton);
                typeDiv.appendChild(colorButton);
                typeDiv.appendChild(arrayButton);
                typeDiv.appendChild(objectButton);
                typeDiv.appendChild(labelButton);
            }

            container.appendChild(blockDisplay);
            container.appendChild(typeDiv);

            //This is where we colour the custom block
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
