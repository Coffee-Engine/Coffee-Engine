(function () {
    class operators {
      getInfo() {
        return {
          id: "operators",
          name: "Operators",
          color1: "#59C059",
          color2: "#48AB48",
          color3: "#389438",
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
  
    sugarcube.extensionManager.registerExtension(new operators());
  })();
  