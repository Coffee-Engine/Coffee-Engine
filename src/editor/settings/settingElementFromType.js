(function () {
    editor.settings.elementFromType = (type, elementDefs, category, setting) => {
        switch (type) {
            case "number": {
                const input = (elementDefs.hasSlider) ? document.createElement("div") : document.createElement("input");

                //Slider stuff
                if (elementDefs.hasSlider) {
                    //Make the div inline
                    input.style.display = "inline-block";

                    //Create our 2 inputs
                    const numberInput = document.createElement("input");
                    const sliderInput = document.createElement("input");

                    numberInput.type = "number";
                    numberInput.value = Number(editor.settings.values[category][setting]);
                    numberInput.style.minWidth = "64px";
    
                    numberInput.min = elementDefs.min;
                    numberInput.max = elementDefs.max;
                    numberInput.step = elementDefs.step[0] || elementDefs.step;
    
                    numberInput.onchange = () => {
                        sliderInput.value = numberInput.value;
                        editor.settings.values[category][setting] = numberInput.value;
                        if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(numberInput.value);
                        editor.Storage.setStorage("settingsValues", editor.settings.values);
                    };

                    sliderInput.type = "range";
                    sliderInput.value = Number(editor.settings.values[category][setting]);
                    sliderInput.style.minWidth = "64px";
                    sliderInput.style.transform = "translate(0%,50%)";
    
                    sliderInput.min = elementDefs.min;
                    sliderInput.max = elementDefs.max;
                    sliderInput.step = elementDefs.step[1] || elementDefs.step || 0.01;
    
                    sliderInput.onchange = () => {
                        numberInput.value = sliderInput.value;
                        editor.settings.values[category][setting] = sliderInput.value;
                        if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(numberInput.value);
                        editor.Storage.setStorage("settingsValues", editor.settings.values);
                    };

                    input.appendChild(numberInput);
                    input.appendChild(sliderInput);
                }
                //Just your good ol number input
                else {
                    input.type = "number";
                    input.value = Number(editor.settings.values[category][setting]);
                    input.style.minWidth = "128px";
    
                    input.min = elementDefs.min;
                    input.max = elementDefs.max;
                    input.step = elementDefs.step;
    
                    input.onchange = () => {
                        editor.settings.values[category][setting] = input.value;
                        if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(input.value);
                        editor.Storage.setStorage("settingsValues", editor.settings.values);
                    };
                }

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
                };

                return [input, true];
            }

            case "key": {
                //Setup our input
                const input = document.createElement("button");
                input.innerText = editor.settings.values[category][setting] || "unknown";
                input.style.minWidth = "128px";

                //Hardcoded exception for space. The button dissapears if we don't
                if (editor.settings.values[category][setting] == " ") {
                    input.innerText = editor.language["engine.settings.space"];
                }

                //Then when we click it wait for a key input
                input.onclick = () => {
                    input.innerText = editor.language["engine.settings.pressAnyKey"];
                    
                    //Honestly really silly
                    const keyDownFunction = (event) => {
                        //Stop propogation and prevent the default action
                        event.stopPropagation();
                        event.preventDefault();

                        let value = event.key.toLowerCase();
                        input.innerText = value;
                        //Hardcoded exception for space The button dissapears if we don't
                        if (value == " ") {
                            input.innerText = editor.language["engine.settings.space"];
                        }

                        //Send out the signal
                        editor.settings.values[category][setting] = value;
                        if (editor.settingDefs[category][setting].onChange) editor.settingDefs[category][setting].onChange(value);
                        editor.Storage.setStorage("settingsValues", editor.settings.values);
                
                        document.removeEventListener("keydown", keyDownFunction);
                    };
                    document.addEventListener("keydown", keyDownFunction)
                };

                return input;
            }

            default:
                break;
        }
    };
})();
