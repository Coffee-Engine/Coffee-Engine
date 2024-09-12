(function () {
    editor.settings.elementFromType = (type, elementDefs, category, setting) => {
        switch (type) {
            case "number": {
                const input = document.createElement("input");
                input.type = "number";
                input.value = Number(editor.settings.values[category][setting]);

                input.min = elementDefs.min;
                input.max = elementDefs.max;

                input.onchange = () => {
                    editor.settings.values[category][setting] = input.value;
                    if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(input.value);
                    editor.Storage.setStorage("settingsValues", editor.settings.values);
                };

                return input;
            }

            case "dropdown": {
                const input = document.createElement("select");

                elementDefs.values.forEach((value) => {
                    const option = document.createElement("option");

                    option.value = value;
                    option.innerText = value;

                    input.appendChild(option);
                });

                input.value = editor.settings.values[category][setting];

                input.onchange = () => {
                    editor.settings.values[category][setting] = input.value;
                    if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(input.value);
                    editor.Storage.setStorage("settingsValues", editor.settings.values);
                };

                return input;
            }

            case "color": {
                const input = document.createElement("color-picker");
                input.color = editor.settings.values[category][setting];

                input.onchange = () => {
                    editor.settings.values[category][setting] = input.color;
                    if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(input.color);
                    editor.Storage.setStorage("settingsValues", editor.settings.values);
                };

                return input;
            }

            default:
                break;
        }
    };
})();
