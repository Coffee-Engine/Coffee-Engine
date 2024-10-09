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
                updateBlocks:"dynamic_category_func",
                blocks: [
                    {
                        opcode:"openCustomBlockMenu",
                        type: sugarcube.BlockType.BUTTON,
                        text: "New Block"
                    },
                    {
                        opcode: "declaration",
                        type: sugarcube.BlockType.PROCEDURE_DEFINITION,
                        text: "Define : ",
                        mutator: "hatBlock_Mutator",
                        contextMenu: "removeCustomBlock",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "input_string",
                        type: sugarcube.BlockType.REPORTER,
                        text: "",
                        output: ["noClones"],
                        mutator: "argBlock_Mutator",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "input_bool",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: "",
                        output: ["noClones"],
                        mutator: "argBlock_Mutator",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "input_array",
                        type: sugarcube.BlockType.ARRAY,
                        text: "",
                        output: ["noClones"],
                        mutator: "argBlock_Mutator",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "input_object",
                        type: sugarcube.BlockType.OBJECT,
                        text: "",
                        output: ["noClones"],
                        mutator: "argBlock_Mutator",
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
                        opcode: "input_reference",
                        type: sugarcube.BlockType.REFERENCE,
                        text: "",
                        output: ["noClones"],
                        mutator: "argBlock_Mutator",
                        hideFromPalette: true,
                    },
                    {
                        opcode: "execute_reporter",
                        type: sugarcube.BlockType.REPORTER_ANY,
                        text: "",
                        mutator: "commandBlock_Mutator",
                        hideFromPalette: true,
                    },
                    /*{
                        type: sugarcube.BlockType.DUPLICATE,
                        of: "execute_command",
                        extraState: {
                            customBlockData: [
                                { type: "text", text: "testing block! boolean" }, 
                                { type: "boolean" }, 
                                { type: "text", text: "text?" }, 
                                { type: "string" }, 
                                { type: "text", text: "number!" }, 
                                { type: "number" }, 
                                { type: "text", text: "color..." }, 
                                { type: "color" }
                            ],
                        },
                    },
                    {
                        type: sugarcube.BlockType.DUPLICATE,
                        of: "execute_reporter",
                        extraState: {
                            customBlockData: [
                                { type: "text", text: "testing block! boolean" }, 
                                { type: "boolean" }, 
                                { type: "text", text: "text?" }, 
                                { type: "string" }, 
                                { type: "text", text: "number!" }, 
                                { type: "number" }, 
                                { type: "text", text: "color..." }, 
                                { type: "color" }
                            ],
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
                            ],
                        },
                    },*/
                ],
                mutators: {
                    commandBlock_Mutator: {
                        serialize:"generic_Serialize",
                        deserialize:"command_Deserialize"
                    },
                    hatBlock_Mutator: {
                        serialize:"generic_Serialize",
                        deserialize:"hat_Deserialize"
                    },
                    argBlock_Mutator: {
                        serialize:"arg_Serialize",
                        deserialize:"arg_Deserialize"
                    }
                },
                contextMenus: {
                    editCustomBlock: {
                        text:"Edit custom block",
                        opcode:"editCustomBlock",
                        weight:2,
                    },
                    removeCustomBlock: {
                        text:"Remove custom block",
                        opcode:"removeCustomBlock",
                        weight:3,
                    },
                    makeReference: {
                        text:"Turn into reference",
                        opcode:"makeReference",
                        weight:4,
                    },
                    makeOriginal: {
                        text:"Turn into block",
                        opcode:"makeBlock",
                        weight:4,
                    }
                }
            };
        }

        dynamic_category_func() {
            const returned = [];

            //I
            //Am
            //Steve
            Object.values(sugarcube.customBlocks.storage).forEach(block => {
                returned.push({
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "execute_command",
                    extraState: block,
                })
            })

            return returned;
        }

        //Our universal serialize. it just returns the state.
        generic_Serialize(state, block) {
            return state;
        }

        command_Deserialize(state, block) {
            if (state.parameters) {
                state.parameters.forEach((item) => {
                    const index = sugarcube.customBlocks.fieldTypes.findIndex((field) => {
                        return field.Type == item.type;
                    });

                    //If we don't exist shut up.
                    //owo
                    if (index < 0) return;

                    //Parse that shit.
                    if (sugarcube.customBlocks.fieldTypes[index].parseFunction) sugarcube.customBlocks.fieldTypes[index].parseFunction(block, item);
                });

                block.setColour(state.color);
            }

            return state;
        }

        hat_Deserialize(state, block) {
            block.setDeletable(false);

            block.refreshparameters = (state) => {
                console.log("Refreshing parameters");
            }

            if (state.parameters) {
                state.parameters.forEach((item) => {
                    const index = sugarcube.customBlocks.fieldTypes.findIndex((field) => {
                        return field.Type == item.type;
                    });

                    //If we don't exist shut up.
                    //owo
                    if (index < 0) return;

                    //Parse that shit.
                    const declaration = sugarcube.customBlocks.fieldTypes[index].declaration;
                    if (declaration) {
                        switch (typeof declaration) {
                            case "string":
                                block.inputFromJson_({
                                    type: "input_value",
                                    name: item.id,
                                    check: "noClones",
                                });

                                //Block it up
                                const blockIN = sugarcube.workspace.newBlock(declaration);
                                blockIN.editedState = item;
                                blockIN.editedState.color = state.color;
                                blockIN.initSvg();
                                blockIN.render();
                                block.inputList[block.inputList.length - 1].connection.connect_(blockIN.outputConnection);
                                blockIN.loadExtraState(item);
                                break;

                            case "function":
                                sugarcube.customBlocks.fieldTypes[index].declaration(block, item);
                                break;
                        
                            default:
                                break;
                        }
                    };
                });

                block.setColour(state.color);
            }
            /* The old way BAD
            //Kept for historical preservation!
            if (state.customBlockData) {
                let inputID = 0;
                state.customBlockData.forEach((item) => {
                    block.inputFromJson_({
                        type: item.type == "text" ? "input_dummy" : "input_value",
                        name: `input_${inputID}`,
                        check: item.type != "text" ? "noClones" : "",
                    });

                    let blockIN = null;

                    switch (item.type) {
                        case "text":
                            block.inputList[block.inputList.length - 1].appendField(
                                block.fieldFromJson_({
                                    type: "field_label",
                                    text: item.text,
                                })
                            );
                            break;

                        case "boolean":
                            blockIN = sugarcube.workspace.newBlock("myblocks_input_bool");
                            break;

                        default:
                            blockIN = sugarcube.workspace.newBlock("myblocks_input_string");
                            break;
                    }

                    if (blockIN != null) {
                        blockIN.customArgData = { text: item.name };
                        block.inputList[block.inputList.length - 1].connection.connect_(blockIN.outputConnection);
                    }

                    inputID += 1;
                });
            }
            */

            return state;
        }

        //I hate these with a passion
        //There could be a better way to do this.
        arg_Serialize(state, block) {
            //Get our info out of the block.
            state = state || {};

            //Set block duplication
            if (!block._isClone_) block._shouldDuplicate_ = true;

            state._isClone_ = block._isClone_;
            state._shouldDuplicate_ = block._shouldDuplicate_;

            return state;
        }

        arg_Deserialize(state, block) {
            //put our stuff on the block
            //block._isClone_ = state._isClone_;
            //block._shouldDuplicate_ = state._shouldDuplicate_;

            if (state.name) {
                block.inputFromJson_({
                    type: "input_dummy",
                    name: `variableName`,
                });

                block.inputList[block.inputList.length - 1].appendField(
                    block.fieldFromJson_({
                        type: "field_label",
                        text: state.name,
                    })
                );
            }

            block.setColour(state.color);

            //I forgot this. It broke the state
            return state;
        }

        openCustomBlockMenu() {
            const createdWindow = new editor.windows.myBlock(400,350);
            createdWindow.__moveToTop();

            createdWindow.x = window.innerWidth / 2 - 200;
            createdWindow.y = window.innerHeight / 2 - 175;
        }
    }

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.textInput"],
        "string",
        "editor/editorWindows/sugarcube/assets/String.png",
        {
            createFunction:(input) => {
                input.style.borderRadius = "1em";
            },
            parseFunction:(block,item) => {
                block.inputFromJson_({
                    type: "input_value",
                    name: item.id,
                });
            
                block.inputList[block.inputList.length - 1].setShadowDom(sugarcube.stringToDOM(`<shadow type="__sugarcube_string_reporter"></shadow>`));
            },
            declaration:"myblocks_input_string"
        }
    );

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.booleanInput"],
        "boolean",
        "editor/editorWindows/sugarcube/assets/Boolean.png",
        {
            createFunction:(input) => {
                input.style.paddingLeft = "16px";
                input.style.paddingRight = "16px";
                input.style.clipPath = "polygon(16px 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 16px 100%, 0% 50%)";
            },
            parseFunction:(block,item) => {
                block.inputFromJson_({
                    type: "input_value",
                    name: item.id,
                    check: ["Boolean", "ANY"],
                });
            },
            declaration:"myblocks_input_bool"
        }
    );

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.colorInput"],
        "color",
        "editor/editorWindows/sugarcube/assets/Color.png",
        {
            createFunction:(input) => {
                input.style.borderRadius = "0.5em";
            },
            parseFunction:(block,item) => {
                block.inputFromJson_({
                    type: "input_value",
                    name: item.id,
                });

                block.inputList[block.inputList.length - 1].setShadowDom(sugarcube.stringToDOM(`<shadow type="__sugarcube_color_reporter"></shadow>`));
            },
            declaration:"myblocks_input_string"
        }
    );

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.numberInput"],
        "number",
        "editor/editorWindows/sugarcube/assets/Number.png",
        {
            createFunction:(input) => {
                input.style.borderRadius = "1em";
            },
            parseFunction:(block,item) => {
                block.inputFromJson_({
                    type: "input_value",
                    name: item.id,
                });

                block.inputList[block.inputList.length - 1].setShadowDom(sugarcube.stringToDOM(`<shadow type="__sugarcube_number_reporter"></shadow>`));
            },
            declaration:"myblocks_input_string"
        }
    );

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.arrayInput"],
        "array",
        "editor/editorWindows/sugarcube/assets/Array.png",
        {
            createFunction:(input) => {
                input.style.borderRadius = "0.25em";
            },
            parseFunction:(block,item) => {
                block.inputFromJson_({
                    type: "input_value",
                    name: item.id,
                    check: ["Array", "ANY"],
                });
            },
            declaration:"myblocks_input_array"
        }
    );

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.objectInput"],
        "object",
        "editor/editorWindows/sugarcube/assets/Object.png",
        {
            createFunction:(input) => {
                input.style.paddingLeft = "16px";
                input.style.paddingRight = "16px";
                input.style.clipPath = "polygon(4px 37.5%, 12px 25%, 16px 0%, calc(100% - 16px) 0%, calc(100% - 12px) 25%, calc(100% - 4px) 37.5%, 100% 50%, calc(100% - 4px) 62.5%, calc(100% - 12px) 75%, calc(100% - 16px) 100%, 16px 100%,12px 75%, 4px 62.5%, 0% 50%)";
            },
            parseFunction:(block,item) => {
                block.inputFromJson_({
                    type: "input_value",
                    name: item.id,
                    check: ["Object", "ANY"],
                });
            },
            declaration:"myblocks_input_object"
        }
    );

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.addLabel"],
        "label",
        "editor/editorWindows/sugarcube/assets/Label.png",
        {
            parseFunction:(block,item) => {
                //create Text
                block.inputFromJson_({
                    type: "input_dummy",
                    name: item.id,
                });
                block.inputList[block.inputList.length - 1].appendField(
                    block.fieldFromJson_({
                        type: "field_label",
                        text: item.name,
                    })
                );
            },
            declaration:(block,item) => {
                //create Text
                block.inputFromJson_({
                    type: "input_dummy",
                    name: item.id,
                });
                block.inputList[block.inputList.length - 1].appendField(
                    block.fieldFromJson_({
                        type: "field_label",
                        text: item.name,
                    })
                );
            },
        }
    );

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.statementInput"],
        "statement",
        "editor/editorWindows/sugarcube/assets/Statement.png",
        {
            createFunction:(input,parent) => {
                input.style.paddingLeft = "16px";
                input.style.paddingRight = "16px";
            },
            parseFunction:(block,item) => {
                block.inputFromJson_({
                    type: "input_statement",
                    name: item.id,
                });
            },
            declaration:"myblocks_input_reference"
        }
    );

    sugarcube.customBlocks.addCustomFieldToPrompt(
        editor.language["editor.window.createBlock.referenceInput"],
        "reference",
        "editor/editorWindows/sugarcube/assets/Reference.png",
        {
            createFunction:(input) => {
                input.style.paddingLeft = "16px";
                input.style.paddingRight = "16px";
                input.style.clipPath = "polygon(4px 37.5%, 12px 25%, 16px 0%, calc(100% - 16px) 0%, calc(100% - 12px) 25%, calc(100% - 4px) 37.5%, 100% 50%, calc(100% - 4px) 62.5%, calc(100% - 12px) 75%, calc(100% - 16px) 100%, 16px 100%,12px 75%, 4px 62.5%, 0% 50%)";
            },
            parseFunction:(block,item) => {
                block.inputFromJson_({
                    type: "input_value",
                    name: item.id,
                    check: ["Reference", "ANY"],
                });
            },
            declaration:"myblocks_input_reference"
        }
    );

    sugarcube.extensionManager.registerExtension(new myblocks());
})();
