(function () {
  Blockly.Extensions.register("dynamic_menu", function () {
    this.inputList.forEach((input) => {
      const splitName = input.name.split("_____")[0];
      if (input.type == 5 && sugarcube.menus[splitName]) {
        input.appendField(
          new Blockly.FieldDropdown(() => {
            return sugarcube.extensionManager.parseMenuItems({
              items: sugarcube.menus[splitName].function(),
            });
          })
        );
      }
    });
  });


  //Was going to be used for custom blocks...... still have to figure that out.
  Blockly.Extensions.register("dynamic_menu_W_Function", function () {
    this.inputList.forEach((input) => {
      if (input.type == 5) {
        input.appendField(
          new Blockly.FieldDropdown(() => {
            console.log(this);
            return sugarcube.extensionManager.parseMenuItems({
              items: (this.menuFunc) ? this.menuFunc() : ["whoops"],
            });
          })
        );
      }
    });
  });
})();
