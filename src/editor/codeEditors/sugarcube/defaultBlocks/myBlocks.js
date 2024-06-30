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
        hat: "none",
        blocks: [
          {
            opcode: "declaration",
            type: sugarcube.BlockType.PROCEDURE_DEFINITION,
            text: "Define : ",
            mutator: "customBlockDeclarationMutator",
            hideFromPalette: true,
          },
          {
            opcode: "input_string",
            type: sugarcube.BlockType.REPORTER,
            text: "",
            output: ["customBlockArgument"],
            mutator: "customBlockArgumentMutator",
            hideFromPalette: true,
          },
          {
            opcode: "input_bool",
            type: sugarcube.BlockType.BOOLEAN,
            text: "",
            output: ["customBlockArgument"],
            mutator: "customBlockArgumentMutator",
            hideFromPalette: true,
          },
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
          {
            type: sugarcube.BlockType.DUPLICATE,
            of: "declaration",
            extraState: {
              customBlockData: [
                {type:"text",text:"testing block! boolean"},
                {type:"boolean", name:"testicles"},
                {type:"text",text:"text?"},
                {type:"string", name:"balls"},
                {type:"text",text:"number!"},
                {type:"number", name:"nuts"},
                {type:"text",text:"color..."},
                {type:"color", name:"peas"},
                {type:"text",text:"menu!?!?!"},
                {type:"menu", items: ["testing","the boys"], name:"john"}
              ]
            }
          },
        ],
      };
    }
  }

  sugarcube.extensionManager.registerExtension(new myblocks());
})();
