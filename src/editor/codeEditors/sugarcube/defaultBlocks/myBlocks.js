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
        ],
      };
    }
  }

  sugarcube.extensionManager.registerExtension(new myblocks());
})();
