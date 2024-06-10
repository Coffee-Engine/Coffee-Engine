(function () {
  class myblocks {
    getInfo() {
      return {
        id: "myblocks",
        name: "My Blocks",
        color1: "#FF6680",
        color2: "#FF4D6A",
        color3: "#FF3355",
        showColor: true,
        blocks: [
          {
            opcode: "execute_command",
            type: sugarcube.BlockType.COMMAND,
            text: "",
            mutator: "customBlockMutator",
            hideFromPalette: true,
          },
          {
            opcode: "execute_reporter",
            type: sugarcube.BlockType.REPORTER_ANY,
            text: "",
            mutator: "customBlockMutator",
            hideFromPalette: true,
          },
          {
            type: sugarcube.BlockType.DUPLICATE,
            of: "execute_command",
            extraState: {
              customBlockData: [
                {type:"text",text:"testing block! boolean"},
                {type:"boolean"},
                {type:"text",text:"text?"},
                {type:"string"},
                {type:"text",text:"number!"},
                {type:"number"},
                {type:"text",text:"color..."},
                {type:"color"}
              ]
            }
          },
          {
            type: sugarcube.BlockType.DUPLICATE,
            of: "execute_reporter",
            extraState: {
              customBlockData: [
                {type:"text",text:"testing block! boolean"},
                {type:"boolean"},
                {type:"text",text:"text?"},
                {type:"string"},
                {type:"text",text:"number!"},
                {type:"number"},
                {type:"text",text:"color..."},
                {type:"color"},
                {type:"text",text:"menu!?!?!"},
                {type:"menu", items: ["testing","the boys"]}
              ]
            }
          },
        ],
      };
    }
  }

  sugarcube.extensionManager.registerExtension(new myblocks());
})();
