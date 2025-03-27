(function () {
    editor.initilizeSettings = () => {
        const savedSettings = editor.Storage.getStorage("settingsValues", {});

        for (let categoryKey in editor.settingDefs) {
            //Make sure our references aren't as long.
            editor.settings.values[categoryKey] = {};
            const category = editor.settings.values[categoryKey];
            const savedCategory = savedSettings[categoryKey];
            const definedCategory = editor.settingDefs[categoryKey];

            for (let settingKey in definedCategory) {
                const key = definedCategory[settingKey].key;
                let value = savedCategory ? savedCategory[key] : definedCategory[settingKey].defaultValue;
                editor.settings.values[categoryKey][key] = value;
                if (definedCategory[settingKey].onchange) definedCategory[settingKey].onchange(value, {}, true);
            }
        }
    };
})();
