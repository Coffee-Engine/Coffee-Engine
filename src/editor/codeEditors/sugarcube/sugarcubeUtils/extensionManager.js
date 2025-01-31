(function () {
    class extensionManager {
        constructor() {
            //Don't load blockly stuff if we aren't available for blockly
            if (coffeeEngine.isEditor) {
                this.addBlocklyBlock("__sugarcube_color_reporter", "reporter", {
                    message0: " %1 ",
                    mutator: "stupidLittleInputMutator",
                    args0: [
                        {
                            type: "looks_Color",
                            name: "VALUE",
                            colour: "#0000ff",
                        },
                    ],
                });
    
                sugarcube.generator.forBlock["__sugarcube_color_reporter"] = (block, generator) => {
                    return [`"${block.getFieldValue("VALUE").replace('"', `\\"`)}"`, 0];
                };
    
                this.addBlocklyBlock("__sugarcube_string_reporter", "reporter", {
                    message0: " %1 ",
                    mutator: "stupidLittleInputMutator",
                    args0: [
                        {
                            type: "field_input",
                            name: "VALUE",
                            value: "Text Here",
                            spellcheck: false,
                        },
                    ],
                });
    
                sugarcube.generator.forBlock["__sugarcube_string_reporter"] = (block, generator) => {
                    return [`"${block.getFieldValue("VALUE").replace('"', `\\"`)}"`, 0];
                };
    
                this.addBlocklyBlock("__sugarcube_number_reporter", "reporter", {
                    message0: " %1 ",
                    mutator: "stupidLittleInputMutator",
                    args0: [
                        {
                            type: "field_number",
                            name: "VALUE",
                            value: 0,
                            spellcheck: false,
                        },
                    ],
                });
    
                sugarcube.generator.forBlock["__sugarcube_number_reporter"] = (block, generator) => {
                    return [block.getFieldValue("VALUE"), 0];
                };
    
                this.addBlocklyBlock("__sugarcube_multiline_string_reporter", "reporter", {
                    message0: " %1 ",
                    mutator: "stupidLittleInputMutator",
                    args0: [
                        {
                            type: "field_multilinetext",
                            name: "VALUE",
                            text: "Hello\nWorld!",
                            spellcheck: false,
                        },
                    ],
                });
    
                sugarcube.generator.forBlock["__sugarcube_multiline_string_reporter"] = (block, generator) => {
                    return [`"${block.getFieldValue("VALUE").replace('"', `\\"`)}"`, 0];
                };
            }

            sugarcube.extensionInstances = {};
        }

        blockDefs = {};

        updateFunctions = {};

        //Block shape definer.
        addBlocklyBlock(blockName, type, BlockJson, inline) {
            inline = inline || true;
            switch (type) {
                case sugarcube.BlockType.HAT:
                    BlockJson.nextStatement = BlockJson.nextStatement || "Action";
                    break;

                case sugarcube.BlockType.PROCEDURE_DEFINITION:
                    BlockJson.nextStatement = BlockJson.nextStatement || "Action";
                    break;

                case sugarcube.BlockType.REPORTER:
                    if (BlockJson.output) {
                        BlockJson.output = ["NotBoolean"].concat(BlockJson.output);
                    } else {
                        BlockJson.output = "NotBoolean";
                    }
                    break;

                case sugarcube.BlockType.INLINE:
                    if (BlockJson.output) {
                        BlockJson.output = ["Inline", "ANY"].concat(BlockJson.output);
                    } else {
                        BlockJson.output = ["Inline", "ANY"];
                    }
                    break;

                case sugarcube.BlockType.REPORTER_ANY:
                    if (BlockJson.output) {
                        BlockJson.output = ["ANY"].concat(BlockJson.output);
                    } else {
                        BlockJson.output = "ANY";
                    }
                    break;

                case sugarcube.BlockType.FIELD_REPORTERACCEPTANCE:
                    if (BlockJson.output) {
                        BlockJson.output = ["Field_ReporterAcceptance"].concat(BlockJson.output);
                    } else {
                        BlockJson.output = "Field_ReporterAcceptance";
                    }
                    break;

                case sugarcube.BlockType.BOOLEAN:
                    if (BlockJson.output) {
                        BlockJson.output = ["Boolean"].concat(BlockJson.output);
                    } else {
                        BlockJson.output = "Boolean";
                    }
                    break;

                case sugarcube.BlockType.COMMAND:
                    BlockJson.nextStatement = BlockJson.nextStatement || "Action";
                    BlockJson.previousStatement = BlockJson.previousStatement || "Action";
                    break;

                case sugarcube.BlockType.TERMINAL:
                    BlockJson.previousStatement = BlockJson.previousStatement || "Action";
                    break;

                case sugarcube.BlockType.OBJECT:
                    if (BlockJson.output) {
                        BlockJson.output = ["Object"].concat(BlockJson.output);
                    } else {
                        BlockJson.output = "Object";
                    }
                    break;

                case sugarcube.BlockType.ARRAY:
                    if (BlockJson.output) {
                        BlockJson.output = ["Array"].concat(BlockJson.output);
                    } else {
                        BlockJson.output = "Array";
                    }
                    break;

                case sugarcube.BlockType.REFERENCE:
                    if (BlockJson.output) {
                        BlockJson.output = ["Reference"].concat(BlockJson.output);
                    } else {
                        BlockJson.output = "Reference";
                    }
                    break;

                default:
                    BlockJson.nextStatement = BlockJson.nextStatement || "Action";
                    BlockJson.previousStatement = BlockJson.previousStatement || "Action";
                    break;
            }

            Blockly.Blocks[blockName] = {
                init: function () {
                    this.setInputsInline(inline);
                    this.jsonInit(BlockJson);
                },
            };
        }

        //Custom stringify argument. Just a function helper.
        stringifyFunction(key, val) {
            if (typeof val === "function") {
                return "____SUGAR__CUBE__FUNCTION____" + val.toString(); // implicitly `toString` it
            }
            return val;
        }

        //Gets the code for the next block.
        nextBlockToCode(block, generator) {
            const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
            if (nextBlock) {
                return sugarcube.generator.blockToCode(nextBlock);
            }
            return "";
        }

        fixifyTheArgs(args) {
            return args.replaceAll('"____SUGAR__CUBE__FUNCTION____function anonymous(\\n', "(").replaceAll(") {", ") => {").replaceAll('\\n}"', "}").replaceAll('\\"', '"').replaceAll("\\n", "\n");
        }

        //This just registers the compile code for the block.
        registerBlockCode(blockJSON, extensionID) {
            const blockType = blockJSON.type;
            const blockOpcode = blockJSON.opcode;
            const blockCompileFunc = blockJSON.compileFunc;
            const blockID = extensionID + "_" + blockOpcode;

            //Custom compiler instructions.
            if (blockCompileFunc) {
                sugarcube.generator.forBlock[blockID] = (block, generator) => {
                    const code = sugarcube.extensionInstances[extensionID][blockCompileFunc](block, generator, this);
                    if (block.outputConnection) {
                        return [code, 0];
                    }
                    return `${code}\n`;
                };

                return;
            }

            //Certain blocks handle differently.
            switch (blockType) {
                //Hat blocks will be event listeners. No exceptions lol.
                case sugarcube.BlockType.HAT:
                    sugarcube.generator.forBlock[blockID] = (block, generator) => {
                        return `(function(){})() // Hat ${blockID} needs custom compile code. please add this or the block will do NOTHING.\n`;
                    };
                    break;

                // For every other block
                default:
                    sugarcube.generator.forBlock[blockID] = (block, generator) => {
                        const args = {};
                        const recalls = {};

                        //Break down our block type real quick
                        const split =  block.type.split("_")
                        const extension = split.splice(0,1)[0];
                        const opcode = split.join("_");
                        const blockData = this.blockDefs[extension][opcode];
                        let baseBlockCode = `sugarcube.extensionInstances["${extensionID}"]["${blockOpcode}"]({\n`;

                        if (block.inputList) {
                            block.inputList.forEach((input) => {
                                if (!input.connection) return;
                                if (input.connection && input.connection.type == Blockly.ConnectionType.NEXT_STATEMENT) {
                                    args[input.name] = `() => {\n${generator.statementToCode(block, input.name)}\n}`;
                                    recalls[input.name] = args[input.name];
                                    return;
                                }

                                const value = generator.valueToCode(block, input.name, 0);
                                args[input.name] = value || "0";
                                recalls[input.name] = `() => {\nreturn ${value}\n}`;
                            });
                        }

                        if (blockData && blockData.fieldData) {
                            blockData.fieldData.forEach((field) => {
                                args[field] = block.getFieldValue(field);

                                if (isNaN(Number(args[field]))) args[field] = `"${args[field]}"`;
                            });
                        }

                        for (const arg in args) {
                            baseBlockCode += `"${arg.replaceAll('"', '\\"')}": ${args[arg]},\n`;
                        }

                        //Then we do the recalls in util
                        baseBlockCode += "},{target:this.target,self:this,recalls:{\n";

                        for (const recall in recalls) {
                            baseBlockCode += `"${recall.replaceAll('"', '\\"')}": ${recalls[recall]},\n`;
                        }
                        
                        baseBlockCode += "}})"

                        //let baseBlockCode = `sugarcube.extensionInstances["${extensionID}"]["${blockOpcode}"](${this.fixifyTheArgs(JSON.stringify(args, this.stringifyFunction))},{target:this.target,self:this,recalls:${this.fixifyTheArgs(JSON.stringify(recalls, this.stringifyFunction))}});`.replaceAll(');"', ")").replaceAll('"sugarcube.extensionInstances', "sugarcube.extensionInstances");
                        

                        if (block.outputConnection) {
                            return [baseBlockCode, 0];
                        }
                        return `${baseBlockCode}\n${this.nextBlockToCode(block, generator)}`;
                    };
                    break;
            }
        }

        addBlock(block, extension) {
            const id = extension.id + "_";
            const menus = sugarcube.menus;
            const fields = sugarcube.fields.storage;

            let blockData = {};
            //Seperator Shorthand
            if (block == "---") {
                blockData = { kind: "label", text: "" };
            }
            //Label Shorthand
            else if (typeof block == "string") {
                blockData = { kind: "label", text: block };
            }
            //if it is an object (Or anything else really)
            else {
                //Get the type and text
                const type = block.type || block.blockType;
                const style = block.style || id + "blocks";
                let text = block.text;

                const opcode = block.opcode;
                switch (type) {
                    case "label":
                        blockData = {
                            kind: "label",
                            text: text,
                        };
                        break;

                    case "button":
                        //Create button
                        blockData = {
                            kind: "button",
                            text: text,
                            callbackKey: id + opcode,
                        };

                        //Register callback code for the button
                        sugarcube.buttons[id + opcode] = () => {
                            sugarcube.extensionInstances[extension.id][opcode]();
                        };

                        //If we have a workspace register the callback
                        if (sugarcube.workspace) {
                            sugarcube.workspace.registerButtonCallback(id + opcode, sugarcube.buttons[id + opcode]);
                        }
                        break;

                    //For duplicating blocks in the toolbox
                    case "duplicate":
                        blockData = {
                            kind: "block",
                            type: block.extensionID ? block.extensionID + block.of : id + block.of,
                        };
                        if (!Blockly.Blocks[blockData.type]) return;

                        if (block.extraState) {
                            blockData.extraState = block.extraState;
                        }

                        //Wierd block hack
                        //I wish blockly preserved block inputs inside the actual block itself instead of having
                        //half in the actual block, half in an outside definition
                        if (this.blockDefs[block.extensionID ? block.extensionID : extension.id][block.of].inputs) {
                            blockData.inputs = this.blockDefs[block.extensionID ? block.extensionID : extension.id][block.of].inputs;
                        }
                        break;

                    default:
                        //Declare the conversion for the function
                        //The this will be our object/scene
                        //sugarcube.JS_GEN.forBlock[id + opcode] = `sugarcube.extensions.${extension.id}[${opcode}]({},this);`;

                        //Define the arguments used in block creation
                        let defArgs = {
                            kind: "block",
                            type: id + opcode,
                            inputs: {},
                            fieldData: [],
                        };

                        //For the funny scratch styled branches
                        if (typeof text == "object") {
                            //Joined variable
                            let joined = "";

                            //Add the branch count variable if not there.
                            if (!block.branchCount) block.branchCount = 0;

                            //Loop through the different text sections
                            for (let textSection = 0; textSection < text.length; textSection++) {
                                //Get the text object
                                const textObject = text[textSection];

                                //Join the text
                                joined +=
                                    textObject +
                                    //Check for valid conditions
                                    (block.branchCount > textSection ? ` [__SUGARCUBE__DUMMY__${textSection}] [__SUGARCUBE__CONDITION__${textSection}] ` : "");

                                //Add arguments if not there
                                if (!block.arguments) block.arguments = {};

                                //Add the conditions if valid
                                if (block.branchCount > textSection) {
                                    block.arguments[`__SUGARCUBE__DUMMY__${textSection}`] = {
                                        type: sugarcube.ArgumentType.DUMMY,
                                    };
                                    block.arguments[`__SUGARCUBE__CONDITION__${textSection}`] = {
                                        type: sugarcube.ArgumentType.STATEMENT,
                                    };
                                }
                            }

                            //Make the text be the joined result.
                            text = joined;
                        }

                        //And the toolbox definition
                        let blockDef = {
                            message0: text,
                            style: style,
                            args0: [],
                            lastDummyAlign0: "LEFT",
                            extensions: [],
                        };

                        //If it has arguments loop through those and add them to the args 0
                        //Should probably add something for multiline things.
                        //Maybe Arrays
                        if (block.arguments) {
                            //Get keys and loop through arguments
                            const argumentKeys = Object.keys(block.arguments);
                            for (let argumentID = 0; argumentID < argumentKeys.length; argumentID++) {
                                const argumentKey = argumentKeys[argumentID];

                                //Check to see if the argument exists
                                if (block.arguments[argumentKey]) {
                                    const argument = block.arguments[argumentKey];

                                    //Doing this for easier argument types
                                    if (argument.menu) {
                                        //Menu id
                                        const menuID = `${id}${argument.menu}`;
                                        if (menus[menuID]) {
                                            //Dynamic blocks are not a problem for reporter based menus.
                                            if (menus[menuID].isBlock) {
                                                argument.type = "input_value";

                                                //Define the arguments
                                                if (!defArgs.inputs[argumentKey]) defArgs.inputs[argumentKey] = {};
                                                defArgs.inputs[argumentKey].shadow = {
                                                    type: "__sugarcube_menu_" + menuID,
                                                };
                                            }

                                            //Not as easy in field menus
                                            else {
                                                //Field stuff
                                                defArgs.fieldData.push(argumentKey);

                                                //Check to see if the menu is dynamic.
                                                if (menus[menuID].isDynamic) {
                                                    if (!blockDef.extensions.includes("dynamic_menu")) {
                                                        blockDef.extensions.push("dynamic_menu");
                                                    }
                                                    argument.overrideName = `${menuID}_____${argumentKey}`;
                                                    argument.type = "input_dummy";
                                                }
                                                //Check to see if it is real.
                                                else {
                                                    argument.type = "field_dropdown";
                                                    argument.options = menus[menuID].parsed;
                                                }
                                            }
                                        } else {
                                            argument.type = "input_value";
                                        }
                                    } else {
                                        switch (argument.type) {
                                            case sugarcube.ArgumentType.CUSTOM:
                                                argument.type = "input_value";
                                                if (argument.customType) {
                                                    //let it be global or local
                                                    if (fields[id + argument.customType]) {
                                                        argument.type = id + argument.customType;
                                                    } else if (fields[argument.customType]) {
                                                        argument.type = argument.customType;
                                                    }

                                                    //Accept reporters
                                                    if (fields[argument.type].acceptReporters) {
                                                        //Eww
                                                        if (!defArgs.inputs[argumentKey]) defArgs.inputs[argumentKey] = {};
                                                        defArgs.inputs[argumentKey].shadow = {
                                                            type: fields[argument.type].blockName,
                                                        };

                                                        if (argument.defaultValue) {
                                                            defArgs.inputs[argumentKey].shadow.fields = { VALUE: argument.defaultValue };
                                                        }

                                                        //Ughhh
                                                        argument.type = "input_value";
                                                    }
                                                    else {                                                
                                                        defArgs.fieldData.push(argumentKey);
                                                    }
                                                }

                                                argument.value = argument.defaultValue || "";
                                                break;

                                            case sugarcube.ArgumentType.BOOLEAN: {
                                                argument.check = ["Boolean", "ANY"];
                                                argument.type = "input_value";
                                                break;
                                            }

                                            case sugarcube.ArgumentType.OBJECT: {
                                                argument.check = ["Object", "ANY"];
                                                argument.type = "input_value";
                                                break;
                                            }

                                            case sugarcube.ArgumentType.ARRAY: {
                                                argument.check = ["Array", "ANY"];
                                                argument.type = "input_value";
                                                break;
                                            }

                                            case sugarcube.ArgumentType.REFERENCE: {
                                                argument.check = ["Reference", "ANY"];
                                                argument.type = "input_value";
                                                break;
                                            }

                                            case sugarcube.ArgumentType.DUMMY: {
                                                argument.type = "input_dummy";
                                                break;
                                            }

                                            case sugarcube.ArgumentType.STATEMENT: {
                                                argument.type = "input_statement";
                                                break;
                                            }

                                            case sugarcube.ArgumentType.IMAGE: {
                                                argument.type = "field_image";
                                                argument.src = argument.dataURI || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAsCAYAAABloJjNAAAFJ0lEQVRIS6WXeyzkVxTHf7OYMcN4GxKPXa/GY0lQK/5sokmD1QpKitB61CNiG/QRUs9Y4hlRJEITW1EhHkGpDWEjbSrbiIqu1GOjqPd7BzPM6PdOOpMZfrPmp7/k98fce+7nd+4933POHRbF7PGGuRtee7wv8Q5cX87SkPeJiYnJV1paWvf9/Pyk+/v7/LOzs/2lpaWpw8PDx8qM24B8Lpdbb25uHlhTU2McEhKi8n0LCwvJ9vb2pxh8Jp94G9ATsJ9iY2N5DQ0NBnQ7aWlpoTIzMwfhZdBtQE89Pb2x8vJydkpKCk/dscA7ytraWnxxccGFjZTY0XnoxePxRisqKt4Kk38kKSlJ1NHRMXd8fByMsfXrQLaBgcGfQUFBNm1tbWwNA0YVFxdTcODl0dGRjwoQZ9aOMwvBmXE0hcntjI2NRThLPwXQ1NQ018rK6snMzIwpUxixT01NFcGRPDnQUltb+2/AdFxdXdXyZmdnKXd3d9p5yIoqLS39XgZERJsTExOjqqur1W41Li5ODN2xy8rKaIF1dXVUYWFhKwHaIqqvNjc3eXw+X613OJJzXV1dyfr6uh6dUX5+PtXU1PQdAealpaV9gS8YqqP19PRQ8fHxryUSiQCRpAX6+/sfj46OfsYyNDT8LTc391FWVpZa77y8vA6np6e/0dfXrzw5OaEVOnZwihx3Y2Gby5OTk3YeHh60wMHBQSomJub1wcFBiL29/QsUhBtpuLq6SiGYb/DwWQjIFqInsLOzowVCX5fQVwImN318fFqnpqYE1w37+vqo9PT03wF+l4WytDQyMmLv7U1KnerT29tLJSQkrO3t7dlg5svk5OQcukIBhYi6u7ufYssFLA6HM9Dc3BwYFRV1AygQCEQ7OzuJmHhmZGTUC1l9CPncsEMcRMhlUniXSJQ/DwsLq+js7NRXtkRUxa2trSeXl5dmZBzAlbGxMVtPT08VYH9/PwUP57a2th6SCQLUQWD+Cg0NfVBQUECRkgRPxBMTE3PQXDj5Kl4Oi8U6BfweHhVgdHS0eHh4+Fsci0zx8tTzNjMzK0dd8wb8jVgsfg6w8t4eOTo6/rywsGCkTJNKpRQKygXsH2D8H2UgbYSVBuMjIyNr2tvbVY4FdZDKyMiYwnZ95ba39RS53VPUvK9zcnJUPhwQEHA4NDSUicEWRkBE+3ltba1/RESEAogUJIEiv0nKHjMCooovIMKOylqF1CgUhPG1tbX3lN3WaMs6Ojrn0CMHelOsDQ8PF3Z1dWVgoJkp0ApbW0Auk86meBwcHITLy8vkDAaZAj1sbW3HV1ZWjJUXuri4HMzPzwdi7FemQFf03l+Q+Cr1Mjg4WIgsiQesgynQCVEmWlOIWiQSUUiASyTCfbmgGUWZzWafYstcS0tL2brs7Oxz5Pkksun96xmhUZTREf9AAXCvr68nfYMA96DDdwDbvxMQiwJRaH9EpZGiFewi4iS65H5449HIw/9Wke2RftKPV3Yx+r9AdQyVcSYeKi8kRZHWSybAD3Ah+BiFNkAoFFqgDnbgWhx5p6Ag9fKvrq6yUL7uoWRxnZ2dZToE8E46fGJjY5OH3m2EFJQ5hN5Mubm5Qd8iXcYe4rawiTZrgdu/Yi1uWVRlZeUPu7u7MUyBAShZ3Wj0KrcyJyeno8XFxY8AG2cKfIh0e7GxsaGoNFVVVWclJSXr6HJOd9GhFhZdDAwMsHx9fanGxsbzoqIiCbqcD8Zf3QVI1jxGxe7Ev6grSGUaaReNsWV1Kv8X6XkOC2AliDsAAAAASUVORK5CYII=";
                                                argument.flipRTL = argument.flipRTL || false;
                                                argument.width = 20;
                                                argument.height = 20;
                                                break;
                                            }

                                            default: {
                                                //Check for a shadow conversion
                                                if (sugarcube.ArgumentShadowConversions[argument.type]) {
                                                    //If there is one add argument keys if they don't exist
                                                    if (!defArgs.inputs[argumentKey]) defArgs.inputs[argumentKey] = {};

                                                    //set the shadow values and stuff
                                                    defArgs.inputs[argumentKey].shadow = {
                                                        type: sugarcube.ArgumentShadowConversions[argument.type],
                                                        fields: {
                                                            VALUE: argument.defaultValue || sugarcube.ArgumentDefaultValues[argument.type] || "",
                                                        },
                                                        //Make sure the style matches
                                                        style: style,
                                                    };

                                                    //If we have a default value set it
                                                    if (argument.defaultValue) {
                                                        defArgs.inputs[argumentKey].shadow.value = argument.defaultValue;
                                                    }
                                                }

                                                //set the type to input
                                                argument.type = "input_value";
                                                break;
                                            }
                                        }
                                    }

                                    //Replace keys with id
                                    blockDef.message0 = blockDef.message0.replaceAll(`[${argumentKey}]`, `%${argumentID + 1}`);

                                    argument.name = argument.overrideName || argumentKey;

                                    blockDef.args0.push(argument);
                                }
                            }
                        }

                        if (block.alignments) {
                            blockDef["lastDummyAlign0"] = block.alignment;
                        }

                        //For the funni!
                        if (block.filter) {
                            defArgs.filter = block.filter;
                        }

                        //If there is an output or tooltip add them to the block definition
                        //Note that output only determines what the block puts out.
                        if (block.mutator) {
                            //first we check to see if the mutator + extension ID exists.
                            if (Blockly.Extensions.TEST_ONLY.allExtensions[id + block.mutator]) {
                                blockDef.mutator = id + block.mutator;
                            } else {
                                blockDef.mutator = block.mutator;
                            }
                        }

                        if (block.extraState) {
                            blockData.extraState = block.extraState;
                        }

                        if (block.output) {
                            blockDef.output = block.output;
                        }

                        //Add the blockly block definition and register the block compiler
                        this.registerBlockCode(block, extension.id);
                        this.addBlocklyBlock(id + opcode, block.isTerminal && type == "command" ? "terminal" : type, blockDef);
                        blockData = defArgs;
                        break;
                }
            }

            this.blockDefs[extension.id][block.opcode] = blockData;

            if (!block.hideFromPalette) {
                return blockData;
            }

            return null;
        }

        parseMenuItems(menuDat) {
            let parsed = [];
            menuDat.items.forEach((menuItem) => {
                switch (typeof menuItem) {
                    case "string": {
                        parsed.push([menuItem, menuItem]);
                        break;
                    }

                    case "object": {
                        if (Array.isArray(menuItem)) {
                            parsed.push([menuItem[0] || "", menuItem[1] || ""]);
                        } else {
                            parsed.push([menuItem.text || "", menuItem.value || ""]);
                        }
                        break;
                    }

                    default:
                        break;
                }
            });

            return parsed;
        }

        addMenu(menuName, menuDat, extension, extensionClass) {
            if (!menuDat.items) return;

            const menuID = `${extension.id}_${menuName}`;

            if (typeof menuDat.items == "string") {
                if (menuDat.acceptReporters) {
                    //Add the data
                    sugarcube.menus[menuID] = menuDat;
                    sugarcube.menus[menuID].isBlock = true;
                    sugarcube.menus[menuID].isDynamic = true;
                    sugarcube.menus[menuID].function = function () {
                        const items = extensionClass[menuDat.items]();
                        if (items.length == 0) {
                            items.push(["", ""]);
                        }
                        return items;
                    };

                    this.addBlocklyBlock("__sugarcube_menu_" + menuID, "reporter", {
                        message0: " %1 ",
                        style: extension.id + "_blocks",
                        args0: [
                            {
                                type: "input_dummy",
                                //Add this seperator to properly get the menu.
                                name: `${menuID}_____VALUE`,
                                //We want to make this a function that derives from the extension's object.
                                //Or else we will explode.
                                function: function () {
                                    const items = extensionClass[menuDat.items]();
                                    if (items.length == 0) {
                                        items.push(["", ""]);
                                    }
                                    return items;
                                },
                            },
                        ],
                        extensions: ["dynamic_menu"],
                    });

                    sugarcube.generator.forBlock["__sugarcube_menu_" + menuID] = (block, generator) => {
                        return [`${(() => {
                            let value = block.getFieldValue("VALUE");
                            if (isNaN(Number(value))) {
                                value = `"${value.replaceAll('"','\\"')}"`;
                            }
                            return value;
                    })()}`, 0];
                    };
                } else {
                    //Add the data
                    sugarcube.menus[menuID] = menuDat;
                    sugarcube.menus[menuID].isBlock = false;
                    sugarcube.menus[menuID].isDynamic = true;
                    sugarcube.menus[menuID].function = function () {
                        const items = extensionClass[menuDat.items]();
                        if (items.length == 0) {
                            items.push(["", ""]);
                        }
                        return items;
                    };
                }

                //Make sure we do not go on with the rest o this debotchery.
                return;
            }

            if (menuDat.acceptReporters) {
                //Add to the global menu repository.
                sugarcube.menus[menuID] = menuDat;

                //Parse items
                const parsed = this.parseMenuItems(menuDat);

                //Add more data
                sugarcube.menus[menuID].parsed = parsed;
                sugarcube.menus[menuID].isBlock = true;
                sugarcube.menus[menuID].isDynamic = false;

                //Add the block (Not Dynamic)
                this.addBlocklyBlock("__sugarcube_menu_" + menuID, "reporter", {
                    message0: " %1 ",
                    style: extension.id + "_blocks",
                    args0: [
                        {
                            type: "field_dropdown",
                            name: "VALUE",
                            options: sugarcube.menus[menuID].parsed,
                        },
                    ],
                });

                sugarcube.generator.forBlock["__sugarcube_menu_" + menuID] = (block, generator) => {
                    return [`${(() => {
                        let value = block.getFieldValue("VALUE");
                        if (isNaN(Number(value))) {
                            value = `"${value.replaceAll('"','\\"')}"`;
                        }
                        return value;
                    })()}`, 0];
                };
            }
            //Static menus with no reporters
            else {
                //Just typical menu stuff.
                sugarcube.menus[menuID] = menuDat;

                const parsed = this.parseMenuItems(menuDat);

                sugarcube.menus[menuID].parsed = parsed;
                sugarcube.menus[menuID].isBlock = false;
                sugarcube.menus[menuID].isDynamic = false;
            }
        }

        addContextMenu(menuName, menuDat, extension, extensionClass) {
            const contextMenu = {};
            contextMenu.id = `${extension.id}_${menuName}`;
            contextMenu.weight = typeof menuDat.weight == "undefined" ? 10 : menuDat.weight;
            sugarcube.contextMenuBlockCorrolations[contextMenu.id] = [];

            //Elegibility check.
            if (menuDat.eligibility) {
                //If its the workspace limit the scope slightly
                if (menuDat.isWorkspace) {
                    contextMenu.preconditionFn = (scope) => {
                        if (extensionClass[menuDat.eligibility]) return extensionClass[menuDat.eligibility](scope);
                        return "enabled";
                    };
                } else {
                    contextMenu.preconditionFn = (scope) => {
                        //This part sucks I have to write a whole storage thingy. UGhhhhhh
                        if (!menuDat.global && !sugarcube.contextMenuBlockCorrolations[contextMenu.id].includes(scope.block.type)) return "hidden";
                        if (extensionClass[menuDat.eligibility]) return extensionClass[menuDat.eligibility](scope.block, scope);
                        return "enabled";
                    };
                }
            } else {
                contextMenu.preconditionFn = (scope) => {
                    if (!menuDat.global && !sugarcube.contextMenuBlockCorrolations[contextMenu.id].includes(scope.block.type)) return "hidden";
                    return "enabled";
                };
            }

            //Elegibility check.
            if (menuDat.textIsOpcode) {
                //If its the workspace limit the scope slightly
                if (menuDat.isWorkspace) {
                    contextMenu.displayText = (scope) => {
                        if (extensionClass[menuDat.text]) return extensionClass[menuDat.text](scope);
                        return `opcode [${menuDat.text}] not found!`;
                    };
                } else {
                    contextMenu.displayText = (scope) => {
                        if (extensionClass[menuDat.text]) return extensionClass[menuDat.text](scope.block, scope);
                        return `opcode [${menuDat.text}] not found!`;
                    };
                }
            } else {
                contextMenu.displayText = menuDat.text;
            }

            //Opcode stuff
            if (menuDat.opcode) {
                //If its the workspace limit the scope slightly
                //Make sure to warn folks who don't have it
                if (menuDat.isWorkspace) {
                    contextMenu.callback = (scope) => {
                        if (extensionClass[menuDat.opcode]) return extensionClass[menuDat.opcode](scope);
                        console.warn(`opcode ${menuDat.opcode} does not exist in ${extension.id}!`);
                    };
                } else {
                    contextMenu.callback = (scope) => {
                        if (extensionClass[menuDat.opcode]) return extensionClass[menuDat.opcode](scope.block, scope);
                        console.warn(`opcode ${menuDat.opcode} does not exist in ${extension.id}!`);
                    };
                }
            }
            //warn people if they forget it.
            else {
                console.warn(`context menu ${menuName} has no opcode!\nAdd one for it to function properly!`);
            }

            if (menuDat.isWorkspace) {
                contextMenu.scopeType = Blockly.ContextMenuRegistry.ScopeType.WORKSPACE;
            } else {
                contextMenu.scopeType = Blockly.ContextMenuRegistry.ScopeType.BLOCK;
            }

            Blockly.ContextMenuRegistry.registry.register(contextMenu);
        }

        registerExtension(extension) {
            const myInfo = extension.getInfo();
            extension.__precompile = myInfo.precompile;

            if (sugarcube.extensionInstances[myInfo.id]) return;

            sugarcube.extensionInstances[myInfo.id] = extension;

            //If we aren't in the editor stop here
            if (!coffeeEngine.isEditor) return;

            //Snatch the extension's ID
            const id = myInfo.id + "_";

            //Add the block styles for this category. Each block can have its own override.
            const convertedColors = sugarcube.blockColorFunction(
                myInfo.color1 || "#0fbd8c", 
                myInfo.color2 || myInfo.color1 || "#0b8e69", 
                myInfo.color3 || myInfo.color1 || "#0b8e69",
                myInfo.color4,
                myInfo.color5
            );

            sugarcube.blocklyTheme.blockStyles[id + "blocks"] = {
                colourPrimary: convertedColors[0],
                colourSecondary: convertedColors[1],
                colourTertiary: convertedColors[2],
                colourQuaternary: convertedColors[3],
                colourQuinary: convertedColors[4],
                useBlackWhiteFields: convertedColors[5],
                colourIdentifier: convertedColors[6] || convertedColors[0],
                useEverywhere: convertedColors[7],
                hat: myInfo.hat || "cap",
            };

            //Define the category definition here
            let createdContentData = {
                kind: "category",
                name: myInfo.name,
                id: myInfo.id,
                colour: myInfo.color1 || "#0fbd8c",
                colour_secondary: myInfo.color3 || myInfo.color1 || "#0b8e69",
                menuIconURI: myInfo.menuIconURI || myInfo.blockIconURI,
                showColor: myInfo.showColor,
                contents: [],
            };

            //Do the context menus
            if (myInfo.contextMenus) {
                Object.keys(myInfo.contextMenus).forEach((contextMenu) => {
                    this.addContextMenu(contextMenu, myInfo.contextMenus[contextMenu], myInfo, extension);
                });
            }

            //Create the fields
            if (myInfo.fields) {
                Object.keys(myInfo.fields).forEach((field) => {
                    //colours
                    if (!myInfo.fields[field].color1) {
                        myInfo.fields[field].color1 = myInfo.color1 || "#0fbd8c";
                    }
                    if (!myInfo.fields[field].color2) {
                        (myInfo.fields[field].color2 = myInfo.color3), myInfo.color2 || myInfo.color1 || "#0b8e69";
                    }

                    sugarcube.fields.makeFromFunction(myInfo.id, myInfo.fields[field], id + field);
                });
            }

            //Create the mutators
            if (myInfo.mutators) {
                Object.keys(myInfo.mutators).forEach((mutator) => {
                    sugarcube.mutators.makeFromFunction(myInfo.id, myInfo.mutators[mutator].serialize, myInfo.mutators[mutator].deserialize, id + mutator);
                });
            }

            //Loop Through Menus
            if (myInfo.menus) {
                Object.keys(myInfo.menus).forEach((menu) => {
                    this.addMenu(menu, myInfo.menus[menu], myInfo, extension);
                });
            }

            //Loop through each block deciding its fate!
            extension.defaultBlockInfo = [];
            this.blockDefs[myInfo.id] = {};
            myInfo.blocks.forEach((block) => {
                let blockDat = this.addBlock(block, myInfo);

                //Context menu stuff
                if (block.contextMenu) {
                    //Switch the types
                    switch (typeof block.contextMenu) {
                        case "string":
                            if (sugarcube.contextMenuBlockCorrolations[`${myInfo.id}_${block.contextMenu}`]) sugarcube.contextMenuBlockCorrolations[`${myInfo.id}_${block.contextMenu}`].push(`${myInfo.id}_${block.opcode}`);
                            break;

                        case "object":
                            if (Array.isArray(block.contextMenu)) {
                                block.contextMenu.forEach((menu) => {
                                    if (sugarcube.contextMenuBlockCorrolations[`${myInfo.id}_${menu}`]) sugarcube.contextMenuBlockCorrolations[`${myInfo.id}_${menu}`].push(`${myInfo.id}_${block.opcode}`);
                                });
                            }
                            break;

                        default:
                            break;
                    }
                }

                if (blockDat) {
                    createdContentData.contents.push(blockDat);
                }
            });

            extension.defaultBlockInfo = createdContentData.contents;

            sugarcube.toolboxDefault = JSON.parse(JSON.stringify(sugarcube.toolbox.contents));
            sugarcube.toolbox.contents.push(createdContentData);

            if (myInfo.updateBlocks) {
                this.updateFunctions[myInfo.id] = () => {
                    const generatedExtras = sugarcube.extensionInstances[myInfo.id][myInfo.updateBlocks]() || [];

                    //Make sure we are getting an array
                    if (Array.isArray(generatedExtras)) {
                        //If so parse each block.
                        for (let genIndex = 0; genIndex < generatedExtras.length; genIndex++) {
                            generatedExtras[genIndex] = this.addBlock(generatedExtras[genIndex], myInfo);
                        }

                        //Then concat our two things into a freakish monstrosity, and update the toolbox.
                        sugarcube.toolbox.contents[this.getExtensionIndex(myInfo.id)].contents = extension.defaultBlockInfo.concat(generatedExtras);
                    }
                };
            }

            if (sugarcube.workspace) {
                sugarcube.workspace.updateToolbox(sugarcube.toolbox);

                sugarcube.workspace.getToolbox().refreshSelection();

                sugarcube.refreshTheme();
            }
        }

        getExtensionIndex(extensionID) {
            //Find its index
            return sugarcube.toolbox.contents.indexOf(
                //Get the extension's def
                sugarcube.toolbox.contents.find((item) => {
                    return item.id == extensionID;
                })
            );
        }

        removeExtension(extensionID) {
            if (sugarcube.extensionInstances[extensionID]) {
                //run the disposal function if it exists
                if (sugarcube.extensionInstances[extensionID].__extDispose) {
                    sugarcube.extensionInstances[extensionID].__extDispose();
                }

                //Remove the extension's toolbox contents
                sugarcube.toolbox.contents.splice(getExtensionIndex(extensionID), 1);

                //Delete the instance.
                delete sugarcube.extensionInstances[extensionID];
                delete this.updateFunctions[extensionID];

                if (sugarcube.workspace) {
                    sugarcube.workspace.updateToolbox(sugarcube.toolbox);

                    sugarcube.workspace.getToolbox().refreshSelection();
                }

                if (coffeeEngine.isEditor) {
                    sugarcube.toolboxDefault = JSON.parse(JSON.stringify(sugarcube.toolbox.contents));
                }
            }
        }

        hasExtension(extensionID) {
            return typeof sugarcube.extensionInstances[extensionID] != "undefined";
        }

        updateExtensionBlocks(extensionID) {
            if (!extensionID) {
                Object.keys(this.updateFunctions).forEach((func) => {
                    this.updateFunctions[func]();
                });
            } else {
                if (!this.updateFunctions[extensionID]) return;

                this.updateFunctions[extensionID]();
            }

            sugarcube.workspace.updateToolbox(sugarcube.toolbox);

            sugarcube.workspace.getToolbox().refreshSelection();
        }

        loadExtension(url) {
            if (window.isSingleFile) {
                let loadedScript = document.createElement("engine-script");
                loadedScript.setAttribute("src", url);
                loadedScript.setAttribute("async", false);

                document.body.appendChild(loadedScript);
            } else {
                let loadedScript = document.createElement("script");
                loadedScript.src = url;
                loadedScript.async = false;

                document.body.appendChild(loadedScript);
            }
        }
    }

    sugarcube.extensionManager = new extensionManager();
})();
