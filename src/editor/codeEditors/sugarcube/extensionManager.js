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
        ]
      });

      this.addBlocklyBlock("__sugarcube_string_reporter", "reporter", {
        message0: " %1 ",
        args0: [
          {
            type: "field_input",
            name: "VALUE",
            value: "Text Here",
            spellcheck: false,
          },
        ]
      });

      this.addBlocklyBlock("__sugarcube_number_reporter", "reporter", {
        message0: " %1 ",
        args0: [
          {
            type: "field_number",
            name: "VALUE",
            value: 0,
            spellcheck: false,
          },
        ]
      });
    }

    addBlocklyBlock(blockName, type, BlockJson, inline) {
      inline = inline || true;
      switch (type) {
        case "hat":
          BlockJson.nextStatement = BlockJson.nextStatement || "Action";
          break;
  
        case "reporter":
          BlockJson.output = "NotBoolean";
          break;

        case "inline":
          BlockJson.output = ["Inline", "Boolean"];
          break;
  
        case "boolean":
          BlockJson.output = "Boolean";
          break;
  
        case "command":
          BlockJson.nextStatement = BlockJson.nextStatement || "Action";
          BlockJson.previousStatement = BlockJson.previousStatement || "Action";
          break;
  
        case "terminal":
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
          console.log(blockName);
          console.log(BlockJson);
          console.log(this);
        },
      };
    };

    addBlock(block,extension) {
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
        const type = block.type;
        const text = block.text;

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
              sugarcube.workspace.registerButtonCallback(
                id + opcode,
                extension[opcode]
              );
            }
            break;

          case "duplicate":
            blockData = {
              kind: "block",
              type: block.extensionID
                ? block.extensionID + block.of
                : id + block.of,
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
              inputs: {}
            };

            //And the toolbox definition
            let blockDef = {
              message0: text,
              style: block.style || id + "blocks",
              args0: [],
              lastDummyAlign0: "LEFT",
            };

            //If it has arguments loop through those and add them to the args 0
            //Should probably add something for multiline things.
            //Maybe Arrays
            if (block.arguments) {
              //Get keys and loop through arguments
              const argumentKeys = Object.keys(block.arguments);
              for (
                let argumentID = 0;
                argumentID < argumentKeys.length;
                argumentID++
              ) {
                const argumentKey = argumentKeys[argumentID];

                //Check to see if the argument exists
                if (block.arguments[argumentKey]) {
                  const argument = block.arguments[argumentKey];

                  //Doing this for easier argument types
                  switch (argument.type) {
                    case "custom":
                      argument.type = "input_value";                      
                      break;

                    case "boolean": {
                      argument.check = "Boolean";
                      argument.type = "input_value";
                      break;
                    }

                    case "image": {
                      argument.type = "field_image";
                      argument.src = argument.dataURI || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAsCAYAAABloJjNAAAFJ0lEQVRIS6WXeyzkVxTHf7OYMcN4GxKPXa/GY0lQK/5sokmD1QpKitB61CNiG/QRUs9Y4hlRJEITW1EhHkGpDWEjbSrbiIqu1GOjqPd7BzPM6PdOOpMZfrPmp7/k98fce+7nd+4933POHRbF7PGGuRtee7wv8Q5cX87SkPeJiYnJV1paWvf9/Pyk+/v7/LOzs/2lpaWpw8PDx8qM24B8Lpdbb25uHlhTU2McEhKi8n0LCwvJ9vb2pxh8Jp94G9ATsJ9iY2N5DQ0NBnQ7aWlpoTIzMwfhZdBtQE89Pb2x8vJydkpKCk/dscA7ytraWnxxccGFjZTY0XnoxePxRisqKt4Kk38kKSlJ1NHRMXd8fByMsfXrQLaBgcGfQUFBNm1tbWwNA0YVFxdTcODl0dGRjwoQZ9aOMwvBmXE0hcntjI2NRThLPwXQ1NQ018rK6snMzIwpUxixT01NFcGRPDnQUltb+2/AdFxdXdXyZmdnKXd3d9p5yIoqLS39XgZERJsTExOjqqur1W41Li5ODN2xy8rKaIF1dXVUYWFhKwHaIqqvNjc3eXw+X613OJJzXV1dyfr6uh6dUX5+PtXU1PQdAealpaV9gS8YqqP19PRQ8fHxryUSiQCRpAX6+/sfj46OfsYyNDT8LTc391FWVpZa77y8vA6np6e/0dfXrzw5OaEVOnZwihx3Y2Gby5OTk3YeHh60wMHBQSomJub1wcFBiL29/QsUhBtpuLq6SiGYb/DwWQjIFqInsLOzowVCX5fQVwImN318fFqnpqYE1w37+vqo9PT03wF+l4WytDQyMmLv7U1KnerT29tLJSQkrO3t7dlg5svk5OQcukIBhYi6u7ufYssFLA6HM9Dc3BwYFRV1AygQCEQ7OzuJmHhmZGTUC1l9CPncsEMcRMhlUniXSJQ/DwsLq+js7NRXtkRUxa2trSeXl5dmZBzAlbGxMVtPT08VYH9/PwUP57a2th6SCQLUQWD+Cg0NfVBQUECRkgRPxBMTE3PQXDj5Kl4Oi8U6BfweHhVgdHS0eHh4+Fsci0zx8tTzNjMzK0dd8wb8jVgsfg6w8t4eOTo6/rywsGCkTJNKpRQKygXsH2D8H2UgbYSVBuMjIyNr2tvbVY4FdZDKyMiYwnZ95ba39RS53VPUvK9zcnJUPhwQEHA4NDSUicEWRkBE+3ltba1/RESEAogUJIEiv0nKHjMCooovIMKOylqF1CgUhPG1tbX3lN3WaMs6Ojrn0CMHelOsDQ8PF3Z1dWVgoJkp0ApbW0Auk86meBwcHITLy8vkDAaZAj1sbW3HV1ZWjJUXuri4HMzPzwdi7FemQFf03l+Q+Cr1Mjg4WIgsiQesgynQCVEmWlOIWiQSUUiASyTCfbmgGUWZzWafYstcS0tL2brs7Oxz5Pkksun96xmhUZTREf9AAXCvr68nfYMA96DDdwDbvxMQiwJRaH9EpZGiFewi4iS65H5449HIw/9Wke2RftKPV3Yx+r9AdQyVcSYeKi8kRZHWSybAD3Ah+BiFNkAoFFqgDnbgWhx5p6Ag9fKvrq6yUL7uoWRxnZ2dZToE8E46fGJjY5OH3m2EFJQ5hN5Mubm5Qd8iXcYe4rawiTZrgdu/Yi1uWVRlZeUPu7u7MUyBAShZ3Wj0KrcyJyeno8XFxY8AG2cKfIh0e7GxsaGoNFVVVWclJSXr6HJOd9GhFhZdDAwMsHx9fanGxsbzoqIiCbqcD8Zf3QVI1jxGxe7Ev6grSGUaaReNsWV1Kv8X6XkOC2AliDsAAAAASUVORK5CYII=";
                      argument.flipRTL = argument.flipRTL || false;
                      argument.width = 20;
                      argument.height = 20;
                      console.log(argument);
                      break;
                    }
                  
                    default: {
                      if (sugarcube.ArgumentShadowConversions[argument.type]) {
                        if (!defArgs.inputs[argumentKey]) defArgs.inputs[argumentKey] = {};
                        defArgs.inputs[argumentKey].shadow = {
                          type: sugarcube.ArgumentShadowConversions[argument.type]
                        };

                        if (argument.defaultValue) {
                          defArgs.inputs[argumentKey].shadow.value = argument.defaultValue;
                        }
                      }
                      argument.type = "input_value";
                      break;
                    }
                  }

                  //Replace keys with id
                  blockDef.message0 = blockDef.message0.replaceAll(
                    `[${argumentKey}]`,
                    `%${argumentID + 1}`
                  );

                  argument.name = argumentKey;

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

            //Add the blockly block definition
            this.addBlocklyBlock(id + opcode, type, blockDef);
            blockData = defArgs;
            break;
        }
      }

      if (!block.hideFromPallete) {
        return blockData;
      }
      return null;
    };

    addMenu(menuName,menuDat,extension) {
      sugarcube.menus[menuName]
    }

    registerExtension(extension) {
      try {
        const myInfo = extension.getInfo();

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
          colour_secondary: myInfo.color2,
          contents: [],
        };

        //Loop Through Menus
        if (myInfo.menus) {
          Object.keys(myInfo.menus).forEach((menu) => {this.addMenu(menu,myInfo.menus[menu],myInfo);});
        }

        //Loop through each block deciding its fate!
        extension.defaultBlockInfo = [];
        myInfo.blocks.forEach((block) => {
          let blockDat = this.addBlock(block,myInfo);

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
      let testScript = document.createElement("script");
      testScript.src = url;

      document.body.appendChild(testScript);
    }
  };

  sugarcube.extensionManager = new extensionManager();
})();
