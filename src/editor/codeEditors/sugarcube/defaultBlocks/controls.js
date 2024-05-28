(function () {
  class controls {
    getInfo() {
      return {
        id: "controls",
        name: "Controls",
        color1: "#ffab19",
        color2: "#ec9c13",
        color3: "#cf8b17",
        blocks: [
          {
            opcode: "ifStatement",
            type: sugarcube.BlockType.CONDITIONAL,
            text: "if [condition] then [dummy] [statement]",
            arguments: {
              condition: {
                type: sugarcube.ArgumentType.BOOLEAN,
              },
              dummy: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              statement: {
                type: sugarcube.ArgumentType.STATEMENT,
              },
            },
          },
          {
            opcode: "ifElse_Statement",
            type: sugarcube.BlockType.CONDITIONAL,
            text: "if [condition] then [dummy] [statement] else [dummy2] [statement2]",
            arguments: {
              condition: {
                type: sugarcube.ArgumentType.BOOLEAN,
              },
              dummy: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              statement: {
                type: sugarcube.ArgumentType.STATEMENT,
              },
              dummy2: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              statement2: {
                type: sugarcube.ArgumentType.STATEMENT,
              },
            },
          },
          "---",
          {
            opcode: "inline",
            type: sugarcube.BlockType.INLINE,
            text: "inline [dummy] [condition] [dummy2] return [returned]",
            arguments: {
              dummy: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              condition: {
                type: sugarcube.ArgumentType.STATEMENT,
              },
              dummy2: {
                type: sugarcube.ArgumentType.DUMMY,
              },
              returned: {
                type: sugarcube.ArgumentType.STRING,
              },
            },
          },
        ],
        menus: {
          keys: {
            items: sugarcube.commonKeys,
          },
        },
      };
    }

    //Just for a menu
    __getMessages() {
      return sugarcube.broadcasts.concat([{ text: "New message", value: "____SUGARCUBE__CREATE__BROADCAST____" }]);
    }
  }

  sugarcube.extensionManager.registerExtension(new controls());
})();
