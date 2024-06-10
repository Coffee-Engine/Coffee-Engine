(function () {
  Blockly.Extensions.registerMutator(
    "customBlockMutator",
    {
      saveExtraState: function () {
        return {
          customBlockData: this.customBlockData,
        };
      },

      loadExtraState: function (state) {
        this.customBlockData = state["customBlockData"];
        // This is a helper function which adds or removes inputs from the block.
        this.updateShape_();
      },

      mutationToDom: function () {
        if (!this.isInFlyout) this._shouldDuplicate_ = true;
        // You *must* create a <mutation></mutation> element.
        // This element can have children.
        const container = Blockly.utils.xml.createElement("mutation");
        container.setAttribute("customBlockData", JSON.stringify(this.customBlockData));
        return container;
      },

      domToMutation: function (xmlElement) {
        this.customBlockData = JSON.parse(xmlElement.getAttribute("customBlockData"));
        this.updateShape_();
      },

      updateShape_() {
        if (this.customBlockData) {
          let inputID = 0;
          this.customBlockData.forEach((item) => {
            switch (item.type) {
              case "text":
                //create Text
                this.inputFromJson_({
                  type: "input_dummy",
                  name: `input_${inputID}`,
                });
                this.inputList[this.inputList.length - 1].appendField(
                  this.fieldFromJson_({
                    type: "field_label",
                    text: item.text,
                  })
                );
                break;

              case "boolean":
                this.inputFromJson_({
                  type: "input_value",
                  name: `input_${inputID}`,
                  check: ["Boolean", "ANY"],
                });
                break;

              case "text":
                //input thing
                this.inputFromJson_({
                  type: "input_value",
                  name: `input_${inputID}`,
                });

                this.inputList[this.inputList.length - 1].setShadowDom(sugarcube.stringToDOM(`<shadow type="__sugarcube_string_reporter"></shadow>`));
                break;

              case "number":
                //input thing
                this.inputFromJson_({
                  type: "input_value",
                  name: `input_${inputID}`,
                });

                this.inputList[this.inputList.length - 1].setShadowDom(sugarcube.stringToDOM(`<shadow type="__sugarcube_number_reporter"></shadow>`));
                break;

              default:
                this.inputFromJson_({
                  type: "input_value",
                  name: `input_${inputID}`,
                });
                break;
            }
            inputID += 1;
          });

          //Add inputs
          this.customBlockData.arguments.forEach((argument) => {
            //dummy text
            this.inputFromJson_({
              type: "input_dummy",
              name: "blocklyBlockName",
            });

            this.inputList[this.inputList.length - 1].appendField(
              this.fieldFromJson_({
                type: "field_label",
                text: argument.name + ":",
              })
            );

            //input thing
            this.inputFromJson_({
              type: "input_value",
              name: argument.name,
            });

            this.inputList[this.inputList.length - 1].setShadowDom(penPlus.stringToDOM(`<shadow type="${__getShadowForArgumentType(argument.type)}"></shadow>`));
          });
        }
      },
    },
    undefined
  );
})();
