(function () {
  class sensing {
    getInfo() {
      return {
        id: "sensing",
        name: "Sensing",
        color1: "#5CB1D6",
        color2: "#47A8D1",
        color3: "#2E8EB8",
        showColor: true,
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
        ],
      };
    }
  }

  sugarcube.extensionManager.registerExtension(new sensing());
})();
