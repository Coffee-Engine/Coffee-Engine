(function () {
  class lists {
    getInfo() {
      return {
        id: "lists",
        name: "Lists",
        color1: "#FF661A",
        color2: "#F2590C",
        color3: "#E64D00",
        showColor: true,
        blocks: [
          {
            opcode: "getList",
            type: sugarcube.BlockType.ARRAY,
            text: "list",
            hideFromPalette: false,
          },
        ],
      };
    }
  }

  sugarcube.extensionManager.registerExtension(new lists());
})();
