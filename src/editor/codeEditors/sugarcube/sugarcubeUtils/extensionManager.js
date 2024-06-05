(function () {
  class extensionManager {
    constructor() {
      this.addBlocklyBlock("__sugarcube_color_reporter", "reporter", {
        message0: " %1 ",
        args0: [
          {
            type: "field_colour_hsv_sliders",
            name: "VALUE",
            colour: "#0000ff",
          },
        ],
      });

      sugarcube.generator.forBlock["__sugarcube_color_reporter"] = (block, generator) => {
        return [block.getFieldValue("VALUE"), 0];
      };

      this.addBlocklyBlock("__sugarcube_string_reporter", "reporter", {
        message0: " %1 ",
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
        return [block.getFieldValue("VALUE"), 0];
      };

      this.addBlocklyBlock("__sugarcube_number_reporter", "reporter", {
        message0: " %1 ",
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

      sugarcube.extensionInstances = {};
    }

    //Block shape definer.
    addBlocklyBlock(blockName, type, BlockJson, inline) {
      inline = inline || true;
      switch (type) {
        case sugarcube.BlockType.HAT:
          BlockJson.nextStatement = BlockJson.nextStatement || "Action";
          break;

        case sugarcube.BlockType.REPORTER:
          BlockJson.output = "NotBoolean";
          break;

        case sugarcube.BlockType.INLINE:
          BlockJson.output = ["Inline", "Boolean"];
          break;

        case sugarcube.BlockType.BOOLEAN:
          BlockJson.output = "Boolean";
          break;

        case sugarcube.BlockType.COMMAND:
          BlockJson.nextStatement = BlockJson.nextStatement || "Action";
          BlockJson.previousStatement = BlockJson.previousStatement || "Action";
          break;

        case sugarcube.BlockType.TERMINAL:
          BlockJson.previousStatement = BlockJson.previousStatement || "Action";
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

    //This just registers the compile code for the block.
    registerBlockCode(blockJSON, extensionID) {
      const blockType = blockJSON.type;
      const blockOpcode = blockJSON.opcode;
      const blockID = extensionID + "_" + blockOpcode;

      //Certain blocks handle differently.
      switch (blockType) {
        case sugarcube.BlockType.HAT:
          sugarcube.generator.forBlock[blockID] = (block, generator) => {
            const args = {};

            if (block.inputList) {
              block.inputList.forEach((input) => {
                if (!input.connection) return;
                if (input.connection && input.connection.type == 3) {
                  args[input.name] = Function(generator.statementToCode(block, input.name));
                  return;
                }
                args[input.name] = generator.valueToCode(block, input.name, 0);
              });
            }

            if (block.fieldRow) {
              block.fieldRow.forEach((field) => {
                args[input.name] = block.getFieldValue(input.name);
              });
            }

            const baseBlockCode = `this.addEventListener("${block.eventListenerName || blockOpcode}",(event) => {
              if (sugarcube.extensionInstances["${extensionID}"]["${blockOpcode}"](${JSON.stringify(args, this.stringifyFunction)
                //Probably a better way to do this.
                .replaceAll('"____SUGAR__CUBE__FUNCTION____function anonymous(\\n', "(")
                .replaceAll(") {", ") => {")
                .replaceAll('\\n}"', "}")
                .replaceAll('\\"', '"')
                .replaceAll("\\n", "\n")},this,event)) {`;

            return `${baseBlockCode}\n${this.nextBlockToCode(block, generator)}}\n});\n`;
          };
          break;

        //This is the default. New block types or unknown ones will do this.
        default:
          sugarcube.generator.forBlock[blockID] = (block, generator) => {
            const args = {};

            if (block.inputList) {
              block.inputList.forEach((input) => {
                if (!input.connection) return;
                if (input.connection && input.connection.type == 3) {
                  args[input.name] = Function(generator.statementToCode(block, input.name));
                  return;
                }
                args[input.name] = generator.valueToCode(block, input.name, 0);
              });
            }

            if (block.fieldRow) {
              block.fieldRow.forEach((field) => {
                args[input.name] = block.getFieldValue(input.name);
              });
            }

            const baseBlockCode = `sugarcube.extensionInstances["${extensionID}"]["${blockOpcode}"](${JSON.stringify(args, this.stringifyFunction)
              //Probably a better way to do this.
              .replaceAll('"____SUGAR__CUBE__FUNCTION____function anonymous(\\n', "(")
              .replaceAll(") {", ") => {")
              .replaceAll('\\n}"', "}")
              .replaceAll('\\"', '"')
              .replaceAll("\\n", "\n")},this);`;

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
            if (extension[opcode]) {
              sugarcube.workspace.registerButtonCallback(id + opcode, extension[opcode]);
            }
            break;

          case "duplicate":
            blockData = {
              kind: "block",
              type: block.extensionID ? block.extensionID + block.of : id + block.of,
            };
            if (!Blockly.Blocks[blockData.type]) return;

            if (block.extraData) {
              blockData.extraState = block.extraData;
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
                    if (sugarcube.menus[menuID]) {
                      //Dynamic blocks are not a problem for reporter based menus.
                      if (sugarcube.menus[menuID].isBlock) {
                        argument.type = "input_value";

                        //Define the arguments
                        if (!defArgs.inputs[argumentKey]) defArgs.inputs[argumentKey] = {};
                        defArgs.inputs[argumentKey].shadow = {
                          type: "__sugarcube_menu_" + menuID,
                        };
                      }

                      //Not as easy in field menus
                      else {
                        //Check to see if the menu is dynamic.
                        if (sugarcube.menus[menuID].isDynamic) {
                          if (!blockDef.extensions.includes("dynamic_menu")) {
                            blockDef.extensions.push("dynamic_menu");
                          }
                          argument.overrideName = `${menuID}_____${argumentKey}`;
                          argument.type = "input_dummy";
                        }
                        //Check to see if it is real.
                        else {
                          argument.type = "field_dropdown";
                          argument.options = sugarcube.menus[menuID].parsed;
                        }
                      }
                    } else {
                      argument.type = "input_value";
                    }
                  } else {
                    switch (argument.type) {
                      case "custom":
                        argument.type = argument.customType || "input_value";
                        break;

                      case "boolean": {
                        argument.check = "Boolean";
                        argument.type = "input_value";
                        break;
                      }

                      case "dummy": {
                        argument.type = "input_dummy";
                        break;
                      }

                      case "statement": {
                        argument.type = "input_statement";
                        break;
                      }

                      case "image": {
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

            //If there is an output or tooltip add them to the block definition
            //Note that output only determines what the block puts out.
            if (block.mutator) {
              blockDef.mutator = block.mutator;
            }

            //Add the blockly block definition and register the block compiler
            this.registerBlockCode(block, extension.id);
            this.addBlocklyBlock(id + opcode, block.isTerminal && type == "command" ? "terminal" : type, blockDef);
            blockData = defArgs;
            break;
        }
      }

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
            return extensionClass[menuDat.items]();
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
                  return extensionClass[menuDat.items]();
                },
              },
            ],
            extensions: ["dynamic_menu"],
          });
        } else {
          //Add the data
          sugarcube.menus[menuID] = menuDat;
          sugarcube.menus[menuID].isBlock = false;
          sugarcube.menus[menuID].isDynamic = true;
          sugarcube.menus[menuID].function = function () {
            return extensionClass[menuDat.items]();
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

    registerExtension(extension) {
      try {
        const myInfo = extension.getInfo();

        sugarcube.extensionInstances[myInfo.id] = extension;

        //Snatch the extension's ID
        const id = myInfo.id + "_";

        //Add the block styles for this category. Each block can have its own override.
        sugarcube.blocklyTheme.blockStyles[id + "blocks"] = {
          colourPrimary: myInfo.color1,
          colourSecondary: myInfo.color2,
          colourTertiary: myInfo.color3,
        };

        //Define the category definition here
        let createdContentData = {
          kind: "category",
          name: myInfo.name,
          colour: myInfo.color1,
          colour_secondary: myInfo.color3,
          menuIconURI: myInfo.menuIconURI || myInfo.blockIconURI,
          showColor: myInfo.showColor,
          contents: [],
        };

        //Loop Through Menus
        if (myInfo.menus) {
          Object.keys(myInfo.menus).forEach((menu) => {
            this.addMenu(menu, myInfo.menus[menu], myInfo, extension);
          });
        }

        //Loop through each block deciding its fate!
        extension.defaultBlockInfo = [];
        myInfo.blocks.forEach((block) => {
          let blockDat = this.addBlock(block, myInfo);

          if (blockDat) {
            createdContentData.contents.push(blockDat);
          }
        });

        extension.defaultBlockInfo = createdContentData.contents;

        sugarcube.toolbox.contents.push(createdContentData);

        sugarcube.workspace.updateToolbox(sugarcube.toolbox);

        sugarcube.workspace.getToolbox().refreshSelection();

        sugarcube.refreshTheme();
      } catch (error) {
        console.error(error);
        alert("Error while importing sugarcube extension : " + error);
      }
    }

    loadExtension(url) {
      let loadedScript = document.createElement("script");
      loadedScript.src = url;
      loadedScript.async = false;

      document.body.appendChild(loadedScript);
    }
  }

  sugarcube.extensionManager = new extensionManager();
})();
