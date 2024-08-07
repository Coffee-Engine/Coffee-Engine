(function () {
    class myblocks {
        getInfo() {
            return {
                id: "myblocks",
                name: "My Blocks",
                color1: "#FF6680",
                color2: "#FF4D6A",
                color3: "#FF3355",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMDAuNDg5NjkiIGhlaWdodD0iMTAwLjQ4OTY5IiB2aWV3Qm94PSIwLDAsMTAwLjQ4OTY5LDEwMC40ODk2OSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4OS43NTUxNiwtMTI5Ljc1NTE1KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjA4Ljg1ODU1LDE3OS45MjU4MmMwLC0xLjA1NzE5IDAuODU3MDIsLTEuOTE0MjEgMS45MTQyMSwtMS45MTQyMWgzLjgyODQzYzAuOTU3MTEsMCAxLjQzNTY2LDAuNDc4NTUgMS45MTQyMSwwLjk1NzExbDEuOTE0MjEsMS45MTQyMWMwLjQ3ODU1LDAuNDc4NTUgMC45NTcxMSwwLjk1NzExIDEuOTE0MjEsMC45NTcxMWg1Ljc0MjYzYzAuOTU3MTEsMCAxLjQzNTY2LC0wLjQ3ODU1IDEuOTE0MjEsLTAuOTU3MTFsMS45MTQyMSwtMS45MTQyMWMwLjQ3ODU1LC0wLjQ3ODU1IDAuOTU3MTEsLTAuOTU3MTEgMS45MTQyMSwtMC45NTcxMWgxMi41NTk4YzEuMDU3MTksMCAxLjkxNDIxLDAuODU3MDIgMS45MTQyMSwxLjkxNDIxdjE5LjE0MjEyYzAsMS4wNTcxOSAtMC44NTcwMiwxLjkxNDIxIC0xLjkxNDIxLDEuOTE0MjFoLTEyLjU1OThjLTAuOTU3MTEsMCAtMS40MzU2NiwwLjQ3ODU1IC0xLjkxNDIxLDAuOTU3MTFsLTEuOTE0MjEsMS45MTQyMWMtMC40Nzg1NSwwLjQ3ODU1IC0wLjk1NzExLDAuOTU3MTEgLTEuOTE0MjEsMC45NTcxMWgtNS43NDI2M2MtMC45NTcxMSwwIC0xLjQzNTY2LC0wLjQ3ODU1IC0xLjkxNDIxLC0wLjk1NzExbC0xLjkxNDIxLC0xLjkxNDIxYy0wLjQ3ODU1LC0wLjQ3ODU1IC0wLjk1NzExLC0wLjk1NzExIC0xLjkxNDIxLC0wLjk1NzExaC0zLjgyODQzYy0xLjA1NzE5LDAgLTEuOTE0MjEsLTAuODU3MDIgLTEuOTE0MjEsLTEuOTE0MjF6IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNy41Ii8+PHBhdGggZD0iTTIwOS4wMTU5NSwxNTcuMTAzNjNjMCwtMS4wNTcxOSAwLjg1NzAyLC0xLjkxNDIxIDEuOTE0MjEsLTEuOTE0MjFoMy44Mjg0M2MwLjk1NzExLDAgMS40MzU2NiwwLjQ3ODU1IDEuOTE0MjEsMC45NTcxMWwxLjkxNDIxLDEuOTE0MjFjMC40Nzg1NSwwLjQ3ODU1IDAuOTU3MTEsMC45NTcxMSAxLjkxNDIxLDAuOTU3MTFoNS43NDI2M2MwLjk1NzExLDAgMS40MzU2NiwtMC40Nzg1NSAxLjkxNDIxLC0wLjk1NzExbDEuOTE0MjEsLTEuOTE0MjFjMC40Nzg1NSwtMC40Nzg1NSAwLjk1NzExLC0wLjk1NzExIDEuOTE0MjEsLTAuOTU3MTFoMzcuMjQwNzJjMS4wNTcxOSwwIDEuOTE0MjEsMC44NTcwMiAxLjkxNDIxLDEuOTE0MjF2MTkuMTQyMTJjMCwxLjA1NzE5IC0wLjg1NzAyLDEuOTE0MjEgLTEuOTE0MjEsMS45MTQyMWgtMzcuMjQwNzJjLTAuOTU3MTEsMCAtMS40MzU2NiwwLjQ3ODU1IC0xLjkxNDIxLDAuOTU3MTFsLTEuOTE0MjEsMS45MTQyMWMtMC40Nzg1NSwwLjQ3ODU1IC0wLjk1NzExLDAuOTU3MTEgLTEuOTE0MjEsMC45NTcxMWgtNS43NDI2M2MtMC45NTcxMSwwIC0xLjQzNTY2LC0wLjQ3ODU1IC0xLjkxNDIxLC0wLjk1NzExbC0xLjkxNDIxLC0xLjkxNDIxYy0wLjQ3ODU1LC0wLjQ3ODU1IC0wLjk1NzExLC0wLjk1NzExIC0xLjkxNDIxLC0wLjk1NzExaC0zLjgyODQzYy0xLjA1NzE5LDAgLTEuOTE0MjEsLTAuODU3MDIgLTEuOTE0MjEsLTEuOTE0MjF6IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNy41Ii8+PHBhdGggZD0iTTE4OS43NTUxNiwyMzAuMjQ0ODN2LTEwMC40ODk2OWgxMDAuNDg5Njl2MTAwLjQ4OTY5eiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9Ik5hTiIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjUwLjI0NDg0MzkwMzIyNTgxNDo1MC4yNDQ4NTM5MDMyMjU3OS0tPg==",
                hat: "none",
                blocks: [
                    {
                        opcode: "declaration",
                        type: sugarcube.BlockType.PROCEDURE_DEFINITION,
                        text: "Define : ",
                        mutator: "customBlockDeclarationMutator",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "input_string",
                        type: sugarcube.BlockType.REPORTER,
                        text: "",
                        output: ["customBlockArgument"],
                        mutator: "customBlockArgumentMutator",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "input_bool",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: "",
                        output: ["customBlockArgument"],
                        mutator: "customBlockArgumentMutator",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "execute_command",
                        type: sugarcube.BlockType.COMMAND,
                        text: "",
                        mutator: "commandBlock_Mutator",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "execute_reporter",
                        type: sugarcube.BlockType.REPORTER_ANY,
                        text: "",
                        mutator: "commandBlock_Mutator",
                        hideFromPalette: true,
                    },
                    {
                        type: sugarcube.BlockType.DUPLICATE,
                        of: "execute_command",
                        extraState: {
                            customBlockData: [{ type: "text", text: "testing block! boolean" }, { type: "boolean" }, { type: "text", text: "text?" }, { type: "string" }, { type: "text", text: "number!" }, { type: "number" }, { type: "text", text: "color..." }, { type: "color" }],
                        },
                    },
                    {
                        type: sugarcube.BlockType.DUPLICATE,
                        of: "execute_reporter",
                        extraState: {
                            customBlockData: [{ type: "text", text: "testing block! boolean" }, { type: "boolean" }, { type: "text", text: "text?" }, { type: "string" }, { type: "text", text: "number!" }, { type: "number" }, { type: "text", text: "color..." }, { type: "color" }],
                        },
                    },
                    {
                        type: sugarcube.BlockType.DUPLICATE,
                        of: "declaration",
                        extraState: {
                            customBlockData: [
                                { type: "text", text: "testing block! boolean" },
                                { type: "boolean", name: "testicles" },
                                { type: "text", text: "text?" },
                                { type: "string", name: "balls" },
                                { type: "text", text: "number!" },
                                { type: "number", name: "nuts" },
                                { type: "text", text: "color..." },
                                { type: "color", name: "peas" },
                                { type: "text", text: "menu!?!?!" },
                                { type: "menu", items: ["testing", "the boys"], name: "john" },
                            ],
                        },
                    },
                ],
                mutators: {
                    commandBlock_Mutator: {
                        serialize:"command_Serialize",
                        deserialize:"command_Deserialize"
                    }
                }
            };
        }

        command_Serialize(state, block) {
            return state;
        }

        command_Deserialize(state, block) {
            if (state.customBlockData) {
                let inputID = 0;
                state.customBlockData.forEach((item) => {
                    switch (item.type) {
                        case "text":
                            console.log(block.inputList);
                            //create Text
                            block.inputFromJson_({
                                type: "input_dummy",
                                name: `input_${inputID}`,
                            });
                            block.inputList[block.inputList.length - 1].appendField(
                                block.fieldFromJson_({
                                    type: "field_label",
                                    text: item.text,
                                })
                            );
                            break;

                        case "boolean":
                            block.inputFromJson_({
                                type: "input_value",
                                name: `input_${inputID}`,
                                check: ["Boolean", "ANY"],
                            });
                            break;

                        case "string":
                            //input thing
                            block.inputFromJson_({
                                type: "input_value",
                                name: `input_${inputID}`,
                            });

                            block.inputList[block.inputList.length - 1].setShadowDom(sugarcube.stringToDOM(`<shadow type="__sugarcube_string_reporter"></shadow>`));
                            break;

                        case "number":
                            //input thing
                            block.inputFromJson_({
                                type: "input_value",
                                name: `input_${inputID}`,
                            });

                            block.inputList[block.inputList.length - 1].setShadowDom(sugarcube.stringToDOM(`<shadow type="__sugarcube_number_reporter"></shadow>`));
                            break;

                        case "color":
                            //input thing
                            block.inputFromJson_({
                                type: "input_value",
                                name: `input_${inputID}`,
                            });

                            block.inputList[block.inputList.length - 1].setShadowDom(sugarcube.stringToDOM(`<shadow type="__sugarcube_color_reporter"></shadow>`));
                            break;

                        default:
                            block.inputFromJson_({
                                type: "input_value",
                                name: `input_${inputID}`,
                            });
                            break;
                    }
                    inputID += 1;
                });
            }
        }
    }

    sugarcube.extensionManager.registerExtension(new myblocks());
})();
