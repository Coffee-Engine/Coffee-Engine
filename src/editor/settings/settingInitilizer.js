(function() {
    editor.initilizeSettings = () => {
        const savedSettings = editor.Storage.getStorage("settingsValues", {});
    
        for (let categoryKey in editor.settingDefs) {
            //Make sure our references aren't as long.
            editor.settings.values[categoryKey] = {};
            const category = editor.settings.values[categoryKey];
            const savedCategory = savedSettings[categoryKey];
            const definedCategory = editor.settingDefs[categoryKey]
    
            for (let settingKey in editor.settingDefs[categoryKey]) {
                let value = (savedCategory) ? savedCategory[settingKey] : definedCategory[settingKey].defaultValue;
                category[settingKey] = value;
                if (definedCategory[settingKey].onChange) definedCategory[settingKey].onChange(category[settingKey], true);
            }
        }
    }
})();