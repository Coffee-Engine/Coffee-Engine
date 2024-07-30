(function () {
  coffeeEngine.resources.resource = class {
    name = "resource";
    data = "";

    constructor() {}

    deserialize(serialized) {
      this.data = serialized;
    }

    serialize() {
      return String(this.data);
    }
  };
})();
