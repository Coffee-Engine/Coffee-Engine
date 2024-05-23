(function() {
  Blockly.Extensions.register('dynamic_menu',
  function() {
    this.inputList.forEach(input => {
      const splitName = input.name.split("_____")[0];
      if (input.type == 5 && sugarcube.menus[splitName]) {
        input.appendField(new Blockly.FieldDropdown(sugarcube.menus[splitName].function));
      }
    });
  });
})()