(function () {
  const blockTypesBlocks = [];
  const argumentTypeBlocks = [];

  Object.keys(sugarcube.BlockType).forEach((type) => {
    blockTypesBlocks.push({
      opcode: type,
      type: sugarcube.BlockType[type],
      text: type,
    });
  });

  Object.keys(sugarcube.ArgumentType).forEach((type) => {
    argumentTypeBlocks.push({
      opcode: type + "_Arg",
      type: sugarcube.BlockType.COMMAND,
      text: type + "[argument]",
      arguments: {
        argument: {
          type: sugarcube.ArgumentType[type],
        },
      },
    });
  });

  class testCategory {
    getInfo() {
      return {
        name: "TEST",
        id: "test",
        color1: "#ff0000",
        color2: "#00ff00",
        color3: "#0000ff",
        blocks: ["Block Types"]
          .concat(blockTypesBlocks)
          .concat(["Argument Types"])
          .concat(argumentTypeBlocks)
          .concat([
            "Static Menus",
            {
              opcode: "staticMenuNoRep",
              type: sugarcube.BlockType.COMMAND,
              text: "Static Menu [Menu1] (REPORTER)",
              arguments: {
                Menu1: {
                  menu: "staticNoREP",
                },
              },
            },
            {
              opcode: "staticMenu",
              type: sugarcube.BlockType.COMMAND,
              text: "Static Menu [Menu1] (NO REPORTER)",
              arguments: {
                Menu1: {
                  menu: "static",
                },
              },
            },
            "---",
            {
              opcode: "staticMenuJSONNOREP",
              type: sugarcube.BlockType.COMMAND,
              text: "Static Menu [Menu1] (JSON NO REPORTER)",
              arguments: {
                Menu1: {
                  menu: "staticJSONNOREP",
                },
              },
            },
            {
              opcode: "staticMenuJSON",
              type: sugarcube.BlockType.COMMAND,
              text: "Static Menu [Menu1] (JSON REPORTER)",
              arguments: {
                Menu1: {
                  menu: "staticJSON",
                },
              },
            },
            "---",
            {
              opcode: "staticMenuArrayNOREP",
              type: sugarcube.BlockType.COMMAND,
              text: "Static Menu [Menu1] (ARRAY NO REPORTER)",
              arguments: {
                Menu1: {
                  menu: "staticArrayNOREP",
                },
              },
            },
            {
              opcode: "staticMenuArray",
              type: sugarcube.BlockType.COMMAND,
              text: "Static Menu [Menu1] (ARRAY REPORTER)",
              arguments: {
                Menu1: {
                  menu: "staticArray",
                },
              },
            },
            "---",
            {
              opcode: "staticMenuMixedNOREP",
              type: sugarcube.BlockType.COMMAND,
              text: "Static Menu [Menu1] (MIXED NO REPORTER)",
              arguments: {
                Menu1: {
                  menu: "mixedBlocksNOREP",
                },
              },
            },
            {
              opcode: "staticMenuMixed",
              type: sugarcube.BlockType.COMMAND,
              text: "Static Menu [Menu1] (MIXED REPORTER)",
              arguments: {
                Menu1: {
                  menu: "mixedBlocks",
                },
              },
            },
            "Dynamic Menus",
            {
              opcode: "dynamicMenuNOREP",
              type: sugarcube.BlockType.COMMAND,
              text: "Dynamic Menu [Menu1] (NO REPORTER)",
              arguments: {
                Menu1: {
                  menu: "dynamicMenuNOREP",
                },
              },
            },
            {
              opcode: "dynamicMenu",
              type: sugarcube.BlockType.COMMAND,
              text: "Dynamic Menu [Menu1] (REPORTER)",
              arguments: {
                Menu1: {
                  menu: "dynamicMenu",
                },
              },
            },
            {
              opcode: "dynamicMenuMixed",
              type: sugarcube.BlockType.COMMAND,
              text: "Dynamic Menu [Menu1] (REPORTER) [Menu2] (REPORTER)",
              arguments: {
                Menu1: {
                  menu: "dynamicMenu",
                },
                Menu2: {
                  menu: "dynamicMenuNOREP",
                },
              },
            },
            {
              opcode: "rLongOBJ",
              type: sugarcube.BlockType.OBJECT,
              text: "like a really long object block, Like a REALLY long one with an object input [obj]",
              arguments: {
                obj: {
                  type:sugarcube.BlockType.OBJECT
                },
              },
            },
            {
              opcode: "rLongARRAY",
              type: sugarcube.BlockType.ARRAY,
              text: "like a really long ARRAY block, Like a REALLY long one with an ARRAY input [obj]",
              arguments: {
                obj: {
                  type:sugarcube.BlockType.ARRAY
                },
              },
            },
          ]),
        menus: {
          staticNoREP: {
            items: ["Item1", "Item2", "Item3"],
          },
          static: {
            acceptReporters: true,
            items: ["Item1", "Item2", "Item3"],
          },
          staticJSON: {
            acceptReporters: true,
            items: [
              { text: "Text1", value: "Item1" },
              { text: "Text2", value: "Item2" },
              { text: "Text3", value: "Item3" },
              { text: "Text4", value: "Item4" },
              { text: "Text5", value: "Item5" },
            ],
          },
          staticArray: {
            acceptReporters: true,
            items: [
              ["Text1", "Item1"],
              ["Text2", "Item2"],
              ["Text3", "Item3"],
              ["Text4", "Item4"],
              ["Text5", "Item5"],
            ],
          },

          staticJSONNOREP: {
            acceptReporters: false,
            items: [
              { text: "Text1", value: "Item1" },
              { text: "Text2", value: "Item2" },
              { text: "Text3", value: "Item3" },
              { text: "Text4", value: "Item4" },
              { text: "Text5", value: "Item5" },
            ],
          },
          staticArrayNOREP: {
            acceptReporters: false,
            items: [
              ["Text1", "Item1"],
              ["Text2", "Item2"],
              ["Text3", "Item3"],
              ["Text4", "Item4"],
              ["Text5", "Item5"],
            ],
          },
          mixedBlocksNOREP: {
            acceptReporters: false,
            items: [["Array", "Item1"], { text: "JSON", value: "Item2" }, "String"],
          },
          mixedBlocks: {
            acceptReporters: true,
            items: [["Array", "Item1"], { text: "JSON", value: "Item2" }, "String"],
          },
          dynamicMenuNOREP: {
            acceptReporters: false,
            items: "dynamicMenuFunc",
          },
          dynamicMenu: {
            acceptReporters: true,
            items: "dynamicMenuFunc",
          },
        },
      };
    }

    dynamicMenuFunc() {
      return [
        ["this works", "works"],
        ["for realsies", "for"],
      ].concat([[`${Date.now()}`, "time"]]);
    }
  }

  sugarcube.extensionManager.registerExtension(new testCategory());
})();
