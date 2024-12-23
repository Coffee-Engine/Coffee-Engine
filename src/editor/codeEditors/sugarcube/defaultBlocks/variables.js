(function () {
    class variables {
        getInfo() {
            return {
                id: "variables",
                name: editor.language["sugarcube.variables"],
                color1: "#FF8C1A",
                color2: "#ED7D0C",
                color3: "#DB6E00",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS4xNDg1MSIgaGVpZ2h0PSI2OS4xNDg1MSIgdmlld0JveD0iMCwwLDY5LjE0ODUxLDY5LjE0ODUxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA1LjQyNTc1LC0xNDUuNDI1NzQpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTI0Ny42NzA1NCwxOTMuMzQwMzNjMCwwIC02LjY0MDYzLC04LjczOTk3IC05LjI1NzYzLC0xMy4yNjQ5MWMtMi41MjMxNiwtNC4zNjI2OCAtNi4xNzMxNCwtMTMuNDE1NzUgLTYuMTczMTQsLTEzLjQxNTc1IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjI4LjQxNzI0LDE5MS4yMTNjMCwwIDQuMTQ0OTgsLTYuODc5MTggOC4zNDUxMiwtMTAuOTYxMDRjMy4yMzk1MSwtMy4xNDgyOSAxNC43MzA3MiwtMTEuNDY0OTUgMTQuNzMwNzIsLTExLjQ2NDk1IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjI1LjIyOTQ5LDIwMi4wNjU3NGMwLDAgLTEwLjU5ODI3LC0xLjUyOTc3IC03LjUxMTQyLC0yNS43Mzk3OGMyLjYzNjg2LC0yMC42ODA4IDkuODM4NTMsLTE4LjMwOTE1IDkuODM4NTMsLTE4LjMwOTE1IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjU2Ljg0NjY1LDE1OC4wMjUxOWMwLDAgNy40NTIzMiwtMS4zOTcwMyA3LjMyNzE2LDE5LjQ1MDgyYy0wLjE0NjUyLDI0LjQwNTU3IC0xMC44NTQwMywyNC41MTgzMiAtMTAuODU0MDMsMjQuNTE4MzIiIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2luZGV4JnF1b3Q7Om51bGx9IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjA1LjQyNTc1LDIxNC41NzQyNXYtNjkuMTQ4NTFoNjkuMTQ4NTF2NjkuMTQ4NTF6IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozNC41NzQyNTAwMDAwMDAwMDY6MzQuNTc0MjYwMDAwMDAwMDEtLT4=",
                updateBlocks: "dynamic_category_func",
                blocks: [
                    {
                        opcode: "openVariableMenu",
                        type: sugarcube.BlockType.BUTTON,
                        text: editor.language["sugarcube.variables.block.openVariableMenu"],
                    },
                    {
                        opcode: "getVariable",
                        type: sugarcube.BlockType.REPORTER_ANY,
                        text: "",
                        hideFromPalette: true,
                        mutator: "variable_Mutator",
                    },
                    {
                        opcode: "setVariable",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.variables.block.setVariable"],
                        hideFromPalette: true,
                        arguments: {
                            var: {
                                menu: "varMenu",
                            },
                            val: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: editor.language["sugarcube.variables.block.setVariable.defaultValue"],
                            },
                        },
                    },
                    {
                        opcode: "changeVariable",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.variables.block.changeVariable"],
                        hideFromPalette: true,
                        arguments: {
                            var: {
                                menu: "varMenu",
                            },
                            val: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "multiplyVariable",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.variables.block.multiplyVariable"],
                        hideFromPalette: true,
                        arguments: {
                            var: {
                                menu: "varMenu",
                            },
                            val: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                        },
                    },
                ],
                menus: {
                    varMenu: {
                        items: "getVars",
                    },
                },
                mutators: {
                    variable_Mutator: {
                        serialize: "variable_Serialize",
                        deserialize: "variable_Deserialize",
                    },
                },
            };
        }

        getVars() {
            const variables = sugarcube.variables.getAll();
            const returned = [];
            variables.forEach((variable) => {
                let type = variable.type;
                if (type != "variable") return;

                returned.push(variable.name);
            });

            return returned;
        }

        openVariableMenu() {
            const createdWindow = new editor.windows.variable(400, 300);
            createdWindow.__moveToTop();

            createdWindow.x = window.innerWidth / 2 - 200;
            createdWindow.y = window.innerHeight / 2 - 150;

            createdWindow.variableType = "variable";
        }

        variable_Serialize(state, block) {
            return state;
        }

        variable_Deserialize(state, block) {
            if (state.varData) {
                //create Text
                block.inputFromJson_({
                    type: "input_dummy",
                    name: `text`,
                });
                block.inputList[block.inputList.length - 1].appendField(
                    block.fieldFromJson_({
                        type: "field_label",
                        text: state.varData.name,
                    })
                );

                //Define the colours
                const convertedColors = sugarcube.blockColorFunction(
                    state.varData.color,
                    state.varData.color,
                    state.varData.color,
                    null,
                    null,
                );

                //Apply the colours
                block.style = {
                    colourPrimary: convertedColors[0],
                    colourSecondary: convertedColors[1],
                    colourTertiary: convertedColors[2],
                    colourQuaternary: convertedColors[3],
                    colourQuinary: convertedColors[4],
                    useBlackWhiteFields: convertedColors[5],
                    colourIdentifier: convertedColors[6] || convertedColors[0],
                    useEverywhere: convertedColors[7],
                    hat: "cap",
                }

                block.applyColour();
                if (!convertedColors[7]) block.setColour(state.varData.color);
            }
            return state;
        }

        dynamic_category_func() {
            const variables = sugarcube.variables.getAll();
            const returned = [];
            let varExists = false;

            variables.forEach((variable) => {
                let type = variable.type;
                if (type != "variable") return;

                varExists = true;
                returned.push({
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "getVariable",
                    extraState: {
                        varData: {
                            color: variable.color,
                            name: variable.name,
                        },
                    },
                });
            });

            if (!varExists) return returned;

            returned.push(
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "setVariable",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "changeVariable",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "multiplyVariable",
                }
            );

            return returned;
        }
    }

    sugarcube.extensionManager.registerExtension(new variables());
})();
