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
                    option.innerText = editor.language[`engine.settings.category.${category}.${setting}.${value}`];

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

                input.style.width = "1em";
                input.style.margin = "0px";
                input.style.verticalAlign = "top";

                input.onchange = () => {
                    editor.settings.values[category][setting] = input.color;
                    if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(input.color);
                    editor.Storage.setStorage("settingsValues", editor.settings.values);
                };

                return input;
            }

            case "checkbox": {
                const input = document.createElement("input");
                input.type = "checkbox";
                input.checked = Boolean(editor.settings.values[category][setting]);

                input.onchange = () => {
                    editor.settings.values[category][setting] = input.checked;
                    if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(input.checked);
                    editor.Storage.setStorage("settingsValues", editor.settings.values);
                };

                return input;
            }

            case "button": {
                const input = document.createElement("button");
                input.onclick = () => {
                    if (editor.settingDefs[category][setting].onClick) editor.settingDefs[category][setting].onClick(input);
                }

                return [input,true];
            }

            default:
                break;
        }
    };
})();
