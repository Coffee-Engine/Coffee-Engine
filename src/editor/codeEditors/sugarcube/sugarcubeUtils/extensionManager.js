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

                this.addBlocklyBlock("__sugarcube_file_reporter", "reporter", {
                    message0: " %1 ",
                    mutator: "stupidLittleInputMutator",
                    args0: [
                        {
                            type: "files_File",
                            name: "VALUE",
                            value: "hi",
                        },
                    ],
                });

                sugarcube.generator.forBlock["__sugarcube_file_reporter"] = (block, generator) => {
                    return [`"${block.getFieldValue("VALUE").replace('"', `\\"`)}"`, 0];
                };

                this.addBlocklyBlock("__sugarcube_angle_reporter", "reporter", {
                    message0: " %1 ",
                    mutator: "stupidLittleInputMutator",
                    args0: [
                        {
                            type: "motion_Angle",
                            name: "VALUE",
                        },
                    ],
                });

                sugarcube.generator.forBlock["__sugarcube_angle_reporter"] = (block, generator) => {
                    return [block.getFieldValue("VALUE"), 0];
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
                    return [block.getFieldValue("VALUE") || 0, 0];
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

            this.defaultAction = "Action"

            sugarcube.extensionInstances = {};
        }

        blockDefs = {};

        updateFunctions = {};

        //A quick macro for making non-extension blocks, internally used for menus.
        addBlocklyBlock(blockName, type, BlockJson, inline) {
            inline = inline || true;
            switch (type) {
                case sugarcube.BlockType.HAT:
                    BlockJson.nextStatement = BlockJson.nextStatement || this.defaultAction;
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
                    BlockJson.nextStatement = BlockJson.nextStatement || this.defaultAction;
                    BlockJson.previousStatement = BlockJson.previousStatement || this.defaultAction;
                    break;

                case sugarcube.BlockType.TERMINAL:
                    BlockJson.previousStatement = BlockJson.previousStatement || this.defaultAction;
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
                    BlockJson.nextStatement = BlockJson.nextStatement || this.defaultAction;
                    BlockJson.previousStatement = BlockJson.previousStatement || this.defaultAction;
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

        //This just registers the compile code for the block.
        registerBlockCode(blockJSON, extensionID) {
            const blockType = blockJSON.type;
            const blockOpcode = blockJSON.opcode;
            const blockCompileFunc = blockJSON.compileFunc;
            const blockID = extensionID + "_" + blockOpcode;

            //Custom compiler instructions.
            if (blockCompileFunc) {
                sugarcube.generator.forBlock[blockID] = (block, generator) => {
                    const blockData = this.blockDefs[extensionID][blockOpcode];
                    const code = sugarcube.extensionInstances[extensionID][blockCompileFunc](block, generator, this, blockData);
                    if (block.outputConnection) {
                        return [code, 0];
                    }
                    return `${code}\n`;
                };

                return;
            }

            //Check the block for async properties
            let asynchronous = false;
            const blockFunction = sugarcube.extensionInstances[extensionID][blockOpcode];
            //Check for promises
            if (blockFunction) {
                const stringified = blockFunction.toString();
                const matches = stringified.match(/new\s*Promise\s*\(/gm);
                if (matches) asynchronous = matches.length > 0;
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
                        const split = block.type.split("_");
                        const extension = split.splice(0, 1)[0];
                        const opcode = split.join("_");
                        const blockData = this.blockDefs[extension][opcode];

                        let baseBlockCode = `${asynchronous ? "await " : ""}sugarcube.extensionInstances["${extensionID}"]["${blockOpcode}"]({\n`;

                        //Loop through both sets of inputs AKA double check
                        if (block.inputList) {
                            block.inputList.forEach((input) => {
                                if (!input.connection) return;
                                //We will go through and make sure we async anything asynced
                                if (input.connection && input.connection.type == Blockly.ConnectionType.NEXT_STATEMENT) {
                                    const value = generator.statementToCode(block, input.name);
                                    args[input.name] = `${value.includes("await") ? "async " : ""}() => {\n${value}\n}`;
                                    recalls[input.name] = args[input.name];
                                    return;
                                }

                                const value = generator.valueToCode(block, input.name, 0);
                                args[input.name] = value || "0";
                                recalls[input.name] = `${String(value).includes("await") ? "async " : ""}() => {\nreturn ${value}\n}`;
                            });
                        }

                        if (blockData && blockData.fieldData) {
                            //Field stuff we need to serperate dynamic and non dynamic
                            blockData.fieldData.forEach((field) => {
                                if (Array.isArray(field)) {
                                    args[field[0]] = block.getFieldValue(field[1]);
                                    if (isNaN(Number(args[field[0]]))) args[field[0]] = `"${args[field[0]]}"`;
                                } else {
                                    args[field] = block.getFieldValue(field);
                                    if (isNaN(Number(args[field]))) args[field] = `"${args[field]}"`;
                                }
                            });
                        }

                        //Parse our inputs into code
                        for (const arg in args) {
                            baseBlockCode += `"${arg.replaceAll('"', '\\"')}": ${args[arg]},\n`;
                        }

                        //Then we do the recalls in util
                        baseBlockCode += "},{target:this.target,self:this,recalls:{\n";

                        //Add our recalls
                        for (const recall in recalls) {
                            baseBlockCode += `"${recall.replaceAll('"', '\\"')}": ${recalls[recall]},\n`;
                        }

                        baseBlockCode += "}})";

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
                const type = sugarcube.BlockTypeConstructors[block.type || block.blockType];
                const style = block.style || id + "blocks";
                let { text, opcode, isInline } = block;

                //Switch between block definition types
                switch (typeof type) {
                    case "object": {
                        let {next, previous, output} = type;

                        //Parse these properly
                        if (previous) previous = (previous === true) ? (block.previousStatement || this.defaultAction) : previous;
                        if (next) next = (next === true) ? (block.nextStatement || this.defaultAction) : next;
                        if (output) output = (output === true) ? (block.output || "ANY") : output;
                        //Make sure they are arrays
                        if (previous && !Array.isArray(previous)) previous = [previous];
                        if (next && !Array.isArray(next)) next = [next];
                        if (output && !Array.isArray(output)) output = [output];

                        //Scratch Styled Branches
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

                        //The actual block def
                        let blockDef = {
                            message0: text,
                            style: style,
                            args0: [],
                            lastDummyAlign0: "LEFT",
                            extensions: [],
                        };

                        blockData = {
                            kind: "block",
                            type: id + opcode,
                            inputs: {},
                            fieldData: [],
                        };
                        
                        //The arguments of the block
                        if (block.arguments) {
                            //Get keys and loop through arguments
                            const argumentKeys = Object.keys(block.arguments);
                            for (let argumentID = 0; argumentID < argumentKeys.length; argumentID++) {
                                const argumentKey = argumentKeys[argumentID];

                                //Make sure the argument exists if not remove it
                                if (!text.includes([`[${argumentKey}]`])) {
                                    delete block.arguments[argumentKey];
                                    argumentKeys.splice(argumentID, 1);
                                    argumentID--;
                                    continue;
                                }

                                //Check to see if the argument exists
                                if (block.arguments[argumentKey]) {
                                    let argument = block.arguments[argumentKey];

                                    //Doing this for easier argument types
                                    if (argument.menu) {
                                        //Menu id
                                        const menuID = `${id}${argument.menu}`;
                                        if (menus[menuID]) {
                                            //Dynamic blocks are not a problem for reporter based menus.
                                            if (menus[menuID].isBlock) {
                                                argument.type = "input_value";

                                                //Define the arguments
                                                if (!blockData.inputs[argumentKey]) blockData.inputs[argumentKey] = {};
                                                blockData.inputs[argumentKey].shadow = {
                                                    type: "__sugarcube_menu_" + menuID,
                                                };
                                            }

                                            //Not as easy in field menus
                                            else {
                                                //Field stuff

                                                //Check to see if the menu is dynamic.
                                                if (menus[menuID].isDynamic) {
                                                    if (!blockDef.extensions.includes("dynamic_menu")) {
                                                        blockDef.extensions.push("dynamic_menu");
                                                    }
                                                    argument.overrideName = `scDynamicMenu_${menuID}_${argumentKey}`;
                                                    argument.type = "input_dummy";
                                                    blockData.fieldData.push([argumentKey, argument.overrideName]);
                                                }
                                                //Check to see if it is real.
                                                else {
                                                    argument.type = "field_dropdown";
                                                    argument.options = menus[menuID].parsed;
                                                    blockData.fieldData.push(argumentKey);
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
                                                        if (!blockData.inputs[argumentKey]) blockData.inputs[argumentKey] = {};
                                                        blockData.inputs[argumentKey].shadow = {
                                                            type: fields[argument.type].blockName,
                                                        };

                                                        if (argument.defaultValue) {
                                                            blockData.inputs[argumentKey].shadow.fields = { VALUE: argument.defaultValue };
                                                        }

                                                        //Ughhh
                                                        argument.type = "input_value";
                                                    } else {
                                                        blockData.fieldData.push(argumentKey);
                                                    }
                                                }

                                                argument.value = argument.defaultValue || "";
                                                break;

                                            default: {
                                                const argConstructor = sugarcube.ArgumentTypeConstructors[argument.type];

                                                //Determine construction based upon inputted type
                                                switch (typeof argConstructor) {
                                                    case "string": {
                                                        //If there is one add argument keys if they don't exist
                                                        if (!blockData.inputs[argumentKey]) blockData.inputs[argumentKey] = {};

                                                        //set the shadow values and stuff
                                                        blockData.inputs[argumentKey].shadow = {
                                                            type: argConstructor,
                                                            fields: {
                                                                VALUE: argument.defaultValue || sugarcube.ArgumentDefaultValues[argument.type] || "",
                                                            },
                                                            //Make sure the style matches
                                                            style: style,
                                                        };

                                                        //If we have a default value set it
                                                        if (argument.defaultValue) {
                                                            blockData.inputs[argumentKey].shadow.value = argument.defaultValue;
                                                        }

                                                        
                                                        argument.type = "input_value";
                                                        break;
                                                    }


                                                    //The difference between these two is we have to run one
                                                    case "object": {
                                                        argument = Object.assign({}, argument, argConstructor);

                                                        if (argument.shadow) {
                                                            if (!blockData.inputs[argumentKey]) blockData.inputs[argumentKey] = {};

                                                            //set the shadow values and stuff
                                                            blockData.inputs[argumentKey].shadow = {
                                                                type: argument.shadow,
                                                                style: style,
                                                            };
                                                        }
                                                        break;
                                                    }

                                                    case "function": {
                                                        argument = Object.assign({}, argument, argConstructor(argument, this));
                                                        break;
                                                    }

                                                
                                                    default:
                                                        break;
                                                }

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

                        //Cool stuff
                        //If there is an output or tooltip add them to the block definition
                        //Note that output only determines what the block puts out.
                        if (block.alignment) blockDef["lastDummyAlign0"] = block.alignment;
                        if (previous) blockDef.previousStatement = previous;
                        if (next) blockDef.nextStatement = next;
                        if (output) blockDef.output = output;
                        if (block.filter) blockData.filter = block.filter;
                        if (block.extraState) blockData.extraState = block.extraState;

                        //The mutator
                        if (block.mutator) {
                            if (Blockly.Extensions.TEST_ONLY.allExtensions[id + block.mutator]) {
                                blockDef.mutator = id + block.mutator;
                            } else {
                                blockDef.mutator = block.mutator;
                            }
                        }

                        //Register the block code
                        this.registerBlockCode(block, extension.id);

                        //Add the block to the registry
                        Blockly.Blocks[id + opcode] = {
                            init: function () {
                                this.setInputsInline(!isInline);
                                this.jsonInit(blockDef);
                            },
                        };

                        break;
                    }

                    case "function": {
                        blockData = type(block, sugarcube.workspace, this, {id: extension.id, opcode: opcode});
                        break;
                    }

                    default: {
                        console.error(`error on\n${extension.id}_${opcode}\n`,block.type || block.blockType)
                        blockData = { kind: "label", text: `error on\n${extension.id}_${opcode}\nBlocktype is ${block.type || block.blockType}` };
                    }
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

            const extensionManager = this;
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
                                name: `scDynamicMenu_${menuID}_____VALUE`,
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
                        return [
                            `${(() => {
                                let value = block.getFieldValue(`scDynamicMenu_${menuID}_____VALUE`);
                                if (isNaN(Number(value))) {
                                    value = `"${value.replaceAll('"', '\\"')}"`;
                                }
                                return value;
                            })()}`,
                            0,
                        ];
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
                    return [
                        `${(() => {
                            let value = block.getFieldValue("VALUE");
                            if (isNaN(Number(value))) {
                                value = `"${value.replaceAll('"', '\\"')}"`;
                            }
                            return value;
                        })()}`,
                        0,
                    ];
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

            if (sugarcube.extensionInstances[myInfo.id]) { console.log("already instanced"); return;}

            sugarcube.extensionInstances[myInfo.id] = extension;

            //If we aren't in the editor stop here
            if (!coffeeEngine.isEditor) return;

            //Snatch the extension's ID
            const id = myInfo.id + "_";

            //Add the block styles for this category. Each block can have its own override.
            const convertedColors = sugarcube.blockColorFunction(myInfo.color1 || "#0fbd8c", myInfo.color2 || myInfo.color1 || "#0b8e69", myInfo.color3 || myInfo.color1 || "#0b8e69", myInfo.color4, myInfo.color5);

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
                        myInfo.fields[field].color2 = myInfo.color3 || myInfo.color2 || myInfo.color1 || "#0b8e69";
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
                        const extensionIndex = this.getExtensionToolboxIndex(myInfo.id);
                        if (extensionIndex < 0) return;
                        sugarcube.filtered.contents[extensionIndex].contents = extension.defaultBlockInfo.concat(generatedExtras);
                    }
                };
            }

            if (sugarcube.workspace) {
                sugarcube.workspace.updateToolbox(sugarcube.filtered);

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

        getExtensionToolboxIndex(extensionID) {
            //Find its index
            return sugarcube.filtered.contents.indexOf(
                //Get the extension's def
                sugarcube.filtered.contents.find((item) => {
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
                sugarcube.toolbox.contents.splice(this.getExtensionToolboxIndex(extensionID), 1);

                //Delete the instance.
                delete sugarcube.extensionInstances[extensionID];
                delete this.updateFunctions[extensionID];

                if (sugarcube.workspace) {
                    sugarcube.workspace.updateToolbox(sugarcube.filtered);

                    sugarcube.workspace.getToolbox().refreshSelection();
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

            sugarcube.workspace.updateToolbox(sugarcube.filtered);

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
