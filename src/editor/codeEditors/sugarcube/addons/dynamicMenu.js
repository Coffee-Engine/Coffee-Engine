(function () {
    Blockly.Extensions.register("dynamic_menu", function () {
        this.inputList.forEach((input) => {
            const dynamicMenu = input.name.split("_")[0] == "scDynamicMenu";
            if (dynamicMenu) {
                const splitName = `${input.name.split("_")[1]}_${input.name.split("_")[2]}`;
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
                            items: this.menuFunc ? this.menuFunc() : ["whoops"],
                        });
                    })
                );
            }
        });
    });
})();
