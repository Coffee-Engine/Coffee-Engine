(function () {
  class strings {
    getInfo() {
      return {
        id: "strings",
        name: "Strings",
        color1: "#419f86",
        color2: "#3d967e",
        color3: "#347f6b",
        showColor: true,
        blocks: [
        ],
      };
    }
  }

  sugarcube.extensionManager.registerExtension(new strings());
})();
