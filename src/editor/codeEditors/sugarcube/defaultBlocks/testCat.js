(function() {
  const blockTypesBlocks = [];
  const argumentTypeBlocks = [];

  Object.keys(sugarcube.BlockType).forEach(type => {
    blockTypesBlocks.push({
      opcode: type,
      type: sugarcube.BlockType[type],
      text: type
    });
  });

  Object.keys(sugarcube.ArgumentType).forEach(type => {
    argumentTypeBlocks.push({
      opcode: type + "_Arg",
      type: sugarcube.BlockType.COMMAND,
      text: type + "[argument]",
      arguments: {
        argument:{
          type:sugarcube.ArgumentType[type],
          defaultValue:"#ff0000"
        }
      }
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
        blocks: ["Block Types"].concat(blockTypesBlocks).concat(["Argument Types"]).concat(argumentTypeBlocks).concat([
          "Inputs",
          {
            opcode: "add",
            type: sugarcube.BlockType.REPORTER,
            text: "[a]+[b]",
            tooltip: "Add two numbers together",
            arguments: {
              "a":{
                type: sugarcube.ArgumentType.NUMBER,
              },
              "b":{
                type: sugarcube.ArgumentType.NUMBER,
              },
            },
          },
        ])
      }
    }
  }

  sugarcube.extensionManager.registerExtension(new testCategory());
})();