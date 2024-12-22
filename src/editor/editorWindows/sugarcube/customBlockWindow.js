(function () {
    editor.windows.myBlock = class extends editor.windows.base {
        minWidth = 400;
        minHeight = 350;

        init(container) {
            this.resizable = false;
            this.title = editor.language["editor.window.createBlock"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "100px 100px 52px";

            //The div that contains our block display
            const params = [];
            const blockDisplay = document.createElement("div");
            blockDisplay.style.width = "100%";
            blockDisplay.style.backgroundColor = "var(--background-4)";
            blockDisplay.style.display = "flex";
            blockDisplay.style.position = "relative";
            blockDisplay.style.overflowX = "scroll";

            //Create our block display
            const blockDiv = document.createElement("div");

            //Configure our block display
            blockDiv.style.top = "50%";
            blockDiv.style.left = "50%";
            blockDiv.style.position = "absolute";
            blockDiv.style.backgroundColor = "#FF6680";
            blockDiv.style.display = "flex";
            blockDiv.style.padding = `${editor.settings.values.SugarCube.padding}px`;
            blockDiv.style.height = "1.75em";
            blockDiv.style.transform = "translate(0%,-50%)";

            //Appendix
            blockDisplay.appendChild(blockDiv);

            //Now our container that holds the variable type
            const typeDiv = document.createElement("div");
            typeDiv.style.width = "100%";
            typeDiv.style.overflowX = "scroll";
            typeDiv.style.overflowY = "Hidden";
            typeDiv.style.display = "grid";
            //Make the grid stuff
            typeDiv.style.gridTemplateColumns = "33.333% ".repeat(sugarcube.customBlocks.fieldTypes.length);
            //Isolate variable types in here.
            sugarcube.customBlocks.fieldTypes.forEach((fieldType) => {
                const button = document.createElement("button");

                button.style.margin = "4px";
                button.style.gridAutoColumns = "auto 16px";
                button.innerHTML = `<img src="${fieldType.Image}" style="height:3em;"><p style="font-size:16px; margin:0px; padding:0px;">${fieldType.Name}</p>`;

                button.onclick = () => {
                    const newParam = {
                        type: fieldType.Type,
                        name: fieldType.Name,
                    };

                    //Create the input
                    const element = document.createElement("input");
                    element.type = "text";
                    element.value = fieldType.Name;
                    element.style.fontFamily = "monospace, monospace";

                    //Stylize
                    element.style.minWidth = "2ch";
                    element.style.minHeight = "0px";
                    element.style.width = `${element.value.length}ch`;

                    //Add the margins
                    element.style.marginLeft = "2px";
                    element.style.marginRight = "2px";

                    //Elements
                    const paramID = params.length;
                    element.oninput = () => {
                        element.style.width = `${element.value.length}ch`;
                        params[paramID].name = element.value;
                    };

                    newParam.element = element;

                    if (fieldType.createFunction) fieldType.createFunction(element, blockDiv);

                    blockDiv.appendChild(element);
                    params.push(newParam);
                };

                //Click that shit
                if (fieldType.Type == "label") {
                    button.onclick();
                }

                typeDiv.appendChild(button);
            });

            container.appendChild(blockDisplay);
            container.appendChild(typeDiv);

            //This is where we colour the custom block
            const colorInput = document.createElement("color-picker");
            colorInput.setAttribute("hasExtensions", true);
            colorInput.onchange = () => {
                blockDiv.style.backgroundColor = colorInput.value;
            };
            container.appendChild(colorInput);
            colorInput.style.width = "32px";
            colorInput.style.height = "32px";
            colorInput.value = sugarcube.blocklyTheme.blockStyles["myblocks_blocks"].colourIdentifier;

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
                closeButton.style.marginRight = "12.5%";
                closeButton.innerText = "cancel";
                buttonDiv.appendChild(closeButton);

                //Close button functionality
                closeButton.onclick = () => {
                    this._dispose();
                };

                const doneButton = document.createElement("button");
                doneButton.style.margin = "10%";
                doneButton.style.marginLeft = "12.5%";
                doneButton.style.marginRight = "25%";
                doneButton.innerText = "done";
                buttonDiv.appendChild(doneButton);

                //Done button functionality
                doneButton.onclick = () => {
                    if (params.length <= 0) return;

                    sugarcube.customBlocks.blockFromDefinition({
                        parameters: params,
                        color: colorInput.value,
                        returns: "string",
                    });
                    //Refresh extension categories
                    sugarcube.extensionManager.updateExtensionBlocks("myblocks");

                    this._dispose();
                };
            }
            container.appendChild(buttonDiv);
        }
    };
})();
