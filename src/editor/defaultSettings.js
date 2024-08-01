editor.defaultSettings = {
    Window: {
        grabSize: 8,
        barHeight: 24,
    },
    Theme: {
        themeColor: "Mocha",
        backgroundColor: "#46352a",
        textColor: "#e7cab7",
        warnColor: "#ffd078",
        warnTextColor: "#46352a",
        errorColor: "#323546",
        errorTextColor: "#323546",
    },
    SugarCube: {
        notchWidth: "36", //NOTCH_HEIGHT
        notchHeight: "8", //NOTCH_WIDTH
        cornerSize: "4", //CORNER_RADIUS
        padding: "2", //BETWEEN_STATEMENT_PADDING_Y
        flyOutOpacity: "50",
    },
    Monaco: {},
};

editor.settingDefs = {
    Window: {
        grabSize: {
            type: "number",
            min: "2",
            max: "16",
            onChange: (value) => {
                editor.grabDistance = value;
            },
        },
        barHeight: {
            type: "number",
            min: "16",
            max: "64",
            onChange: (value) => {
                editor.taskbarHeight = value;
            },
        },
    },
    Theme: {
        themeColor: {
            type: "dropdown",
            values: ["Mocha", "Cocoa", "Creme", "Blue Berry", "Custom"],
            onChange: (value, fromBoot) => {
                //Check if we are using a custom theme
                if (value != "Custom") {
                    //If we aren't check if our theme is valid
                    if (coffeeEngine.defaultThemes[value]) {
                        //Loop through keys and determine the right amount
                        Object.keys(coffeeEngine.defaultThemes[value]).forEach((key) => {
                            document.body.style.setProperty(key, coffeeEngine.defaultThemes[value][key]);
                        });

                        //Disable Custom Color if possible
                        if (!fromBoot) {
                            editor.settings.elements["backgroundColor"].span.style.opacity = "50%";
                            editor.settings.elements["backgroundColor"].input.disabled = true;
                            if (coffeeEngine.defaultThemes[value]) {
                                editor.settings.elements["backgroundColor"].input.value = coffeeEngine.defaultThemes[value]["--background-1"];
                            }

                            editor.settings.elements["textColor"].span.style.opacity = "50%";
                            editor.settings.elements["textColor"].input.disabled = true;
                            if (coffeeEngine.defaultThemes[value]) {
                                editor.settings.elements["textColor"].input.value = coffeeEngine.defaultThemes[value]["--text-1"];
                            }

                            editor.settings.elements["warnColor"].span.style.opacity = "50%";
                            editor.settings.elements["warnColor"].input.disabled = true;
                            if (coffeeEngine.defaultThemes[value]) {
                                editor.settings.elements["warnColor"].input.value = coffeeEngine.defaultThemes[value]["--warn"];
                            }

                            editor.settings.elements["errorColor"].span.style.opacity = "50%";
                            editor.settings.elements["errorColor"].input.disabled = true;
                            if (coffeeEngine.defaultThemes[value]) {
                                editor.settings.elements["errorColor"].input.value = coffeeEngine.defaultThemes[value]["--error"];
                            }

                            editor.settings.elements["warnTextColor"].span.style.opacity = "50%";
                            editor.settings.elements["warnTextColor"].input.disabled = true;
                            if (coffeeEngine.defaultThemes[value]) {
                                editor.settings.elements["warnTextColor"].input.value = coffeeEngine.defaultThemes[value]["--warn-text"];
                            }

                            editor.settings.elements["errorTextColor"].span.style.opacity = "50%";
                            editor.settings.elements["errorTextColor"].input.disabled = true;
                            if (coffeeEngine.defaultThemes[value]) {
                                editor.settings.elements["errorTextColor"].input.value = coffeeEngine.defaultThemes[value]["--error-text"];
                            }
                        }
                    }

                    sugarcube.blocklyTheme.componentStyles.workspaceBackgroundColour = document.body.style.getPropertyValue("--background-3");
                    sugarcube.blocklyTheme.componentStyles.unseenBackground = document.body.style.getPropertyValue("--background-3");
                    sugarcube.blocklyTheme.componentStyles.flyoutBackgroundColour = document.body.style.getPropertyValue("--background-2");
                    sugarcube.blocklyTheme.componentStyles.toolboxBackgroundColour = document.body.style.getPropertyValue("--background-1");
                    sugarcube.blocklyTheme.componentStyles.scrollbarColour = document.body.style.getPropertyValue("--background-4");

                    sugarcube.blocklyTheme.componentStyles.flyoutForegroundColour = document.body.style.getPropertyValue("--text-2");
                    sugarcube.blocklyTheme.componentStyles.toolboxForegroundColour = document.body.style.getPropertyValue("--text-1");
                }

                //Enable Custom Color if possible
                else if (!fromBoot) {
                    editor.settings.elements["backgroundColor"].span.style.opacity = "100%";
                    editor.settings.elements["backgroundColor"].input.disabled = false;
                    editor.settings.elements["backgroundColor"].input.value = editor.settings.values.Theme.backgroundColor;
                    editor.settingDefs.Theme.backgroundColor.onChange(editor.settings.values.Theme.backgroundColor);

                    editor.settings.elements["textColor"].span.style.opacity = "100%";
                    editor.settings.elements["textColor"].input.disabled = false;
                    editor.settings.elements["textColor"].input.value = editor.settings.values.Theme.textColor;
                    editor.settingDefs.Theme.textColor.onChange(editor.settings.values.Theme.textColor);

                    editor.settings.elements["warnColor"].span.style.opacity = "100%";
                    editor.settings.elements["warnColor"].input.disabled = false;
                    editor.settings.elements["warnColor"].input.value = editor.settings.values.Theme.warnColor;
                    editor.settingDefs.Theme.warnColor.onChange(editor.settings.values.Theme.warnColor);

                    editor.settings.elements["errorColor"].span.style.opacity = "100%";
                    editor.settings.elements["errorColor"].input.disabled = false;
                    editor.settings.elements["errorColor"].input.value = editor.settings.values.Theme.errorColor;
                    editor.settingDefs.Theme.errorColor.onChange(editor.settings.values.Theme.errorColor);

                    editor.settings.elements["warnTextColor"].span.style.opacity = "100%";
                    editor.settings.elements["warnTextColor"].input.disabled = false;
                    editor.settings.elements["warnTextColor"].input.value = editor.settings.values.Theme.warnTextColor;
                    editor.settingDefs.Theme.warnTextColor.onChange(editor.settings.values.Theme.warnTextColor);

                    editor.settings.elements["errorTextColor"].span.style.opacity = "100%";
                    editor.settings.elements["errorTextColor"].input.disabled = false;
                    editor.settings.elements["errorTextColor"].input.value = editor.settings.values.Theme.errorTextColor;
                    editor.settingDefs.Theme.errorTextColor.onChange(editor.settings.values.Theme.errorTextColor);
                }
            },
        },
        backgroundColor: {
            type: "color",
            onChange: (value, fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") {
                    document.body.style.setProperty("--background-1", value);

                    //Color Conversions
                    const split = coffeeEngine.ColorMath.HexToRGB(value);

                    if (coffeeEngine.ColorMath.BrightestChannel(value) > 10) {
                        document.body.style.setProperty(
                            "--background-2",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 0.8,
                                g: split.g * 0.8,
                                b: split.b * 0.8,
                            })
                        );
                        document.body.style.setProperty(
                            "--background-3",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 0.7,
                                g: split.g * 0.7,
                                b: split.b * 0.7,
                            })
                        );
                        document.body.style.setProperty(
                            "--background-4",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 0.6,
                                g: split.g * 0.6,
                                b: split.b * 0.6,
                            })
                        );
                    } else {
                        document.body.style.setProperty(
                            "--background-2",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 1.2,
                                g: split.g * 1.2,
                                b: split.b * 1.2,
                            })
                        );
                        document.body.style.setProperty(
                            "--background-3",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 1.3,
                                g: split.g * 1.3,
                                b: split.b * 1.3,
                            })
                        );
                        document.body.style.setProperty(
                            "--background-4",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 1.4,
                                g: split.g * 1.4,
                                b: split.b * 1.4,
                            })
                        );
                    }

                    sugarcube.blocklyTheme.componentStyles.workspaceBackgroundColour = document.body.style.getPropertyValue("--background-3");
                    sugarcube.blocklyTheme.componentStyles.unseenBackground = document.body.style.getPropertyValue("--background-3");
                    sugarcube.blocklyTheme.componentStyles.flyoutBackgroundColour = document.body.style.getPropertyValue("--background-2");
                    sugarcube.blocklyTheme.componentStyles.toolboxBackgroundColour = document.body.style.getPropertyValue("--background-1");
                    sugarcube.blocklyTheme.componentStyles.scrollbarColour = document.body.style.getPropertyValue("--background-4");
                }
            },
            menuInit: (previousSettings, elements) => {
                //Check if custom color is selected
                if (previousSettings.themeColor != "Custom") {
                    //If not disable it and make sure the value is the one we want.
                    elements.span.style.opacity = "50%";
                    elements.input.disabled = true;
                    if (coffeeEngine.defaultThemes[previousSettings.themeColor]) {
                        elements.input.value = coffeeEngine.defaultThemes[previousSettings.themeColor]["--background-1"];
                    }
                }
            },
        },
        textColor: {
            type: "color",
            onChange: (value, fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") {
                    document.body.style.setProperty("--text-1", value);

                    //Color Conversions
                    const split = coffeeEngine.ColorMath.HexToRGB(value);

                    if (coffeeEngine.ColorMath.BrightestChannel(value) > 10) {
                        document.body.style.setProperty(
                            "--text-2",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 0.8,
                                g: split.g * 0.8,
                                b: split.b * 0.8,
                            })
                        );
                        document.body.style.setProperty(
                            "--text-3",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 0.7,
                                g: split.g * 0.7,
                                b: split.b * 0.7,
                            })
                        );
                    } else {
                        document.body.style.setProperty(
                            "--text-2",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 1.2,
                                g: split.g * 1.2,
                                b: split.b * 1.2,
                            })
                        );
                        document.body.style.setProperty(
                            "--text-3",
                            coffeeEngine.ColorMath.RGBtoHex({
                                r: split.r * 1.3,
                                g: split.g * 1.3,
                                b: split.b * 1.3,
                            })
                        );
                    }

                    sugarcube.blocklyTheme.componentStyles.flyoutForegroundColour = document.body.style.getPropertyValue("--text-2");
                    sugarcube.blocklyTheme.componentStyles.toolboxForegroundColour = document.body.style.getPropertyValue("--text-1");
                }
            },
            menuInit: (previousSettings, elements) => {
                //Check if custom color is selected
                if (previousSettings.themeColor != "Custom") {
                    //If not disable it and make sure the value is the one we want.
                    elements.span.style.opacity = "50%";
                    elements.input.disabled = true;
                    if (coffeeEngine.defaultThemes[previousSettings.themeColor]) {
                        elements.input.value = coffeeEngine.defaultThemes[previousSettings.themeColor]["--text-1"];
                    }
                }
            },
        },
        warnColor: {
            type: "color",
            onChange: (value, fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") {
                    document.body.style.setProperty("--warn", value);
                }
            },
            menuInit: (previousSettings, elements) => {
                //Check if custom color is selected
                if (previousSettings.themeColor != "Custom") {
                    //If not disable it and make sure the value is the one we want.
                    elements.span.style.opacity = "50%";
                    elements.input.disabled = true;
                    if (coffeeEngine.defaultThemes[previousSettings.themeColor]) {
                        elements.input.value = coffeeEngine.defaultThemes[previousSettings.themeColor]["--warn"];
                    }
                }
            },
        },
        errorColor: {
            type: "color",
            onChange: (value, fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") {
                    document.body.style.setProperty("--error", value);
                }
            },
            menuInit: (previousSettings, elements) => {
                //Check if custom color is selected
                if (previousSettings.themeColor != "Custom") {
                    //If not disable it and make sure the value is the one we want.
                    elements.span.style.opacity = "50%";
                    elements.input.disabled = true;
                    if (coffeeEngine.defaultThemes[previousSettings.themeColor]) {
                        elements.input.value = coffeeEngine.defaultThemes[previousSettings.themeColor]["--error"];
                    }
                }
            },
        },
        warnTextColor: {
            type: "color",
            onChange: (value, fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") {
                    document.body.style.setProperty("--warn-text", value);
                }
            },
            menuInit: (previousSettings, elements) => {
                //Check if custom color is selected
                if (previousSettings.themeColor != "Custom") {
                    //If not disable it and make sure the value is the one we want.
                    elements.span.style.opacity = "50%";
                    elements.input.disabled = true;
                    if (coffeeEngine.defaultThemes[previousSettings.themeColor]) {
                        elements.input.value = coffeeEngine.defaultThemes[previousSettings.themeColor]["--warn-text"];
                    }
                }
            },
        },
        errorTextColor: {
            type: "color",
            onChange: (value, fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") {
                    document.body.style.setProperty("--error-text", value);
                }
            },
            menuInit: (previousSettings, elements) => {
                //Check if custom color is selected
                if (previousSettings.themeColor != "Custom") {
                    //If not disable it and make sure the value is the one we want.
                    elements.span.style.opacity = "50%";
                    elements.input.disabled = true;
                    if (coffeeEngine.defaultThemes[previousSettings.themeColor]) {
                        elements.input.value = coffeeEngine.defaultThemes[previousSettings.themeColor]["--error-text"];
                    }
                }
            },
        },
    },
    SugarCube: {
        notchWidth: {
            onChange: (value) => {
                sugarcube.constantOverrides.NOTCH_WIDTH = Number(value);
            },
            type: "number",
            min: "12",
            max: "48",
        },
        notchHeight: {
            onChange: (value) => {
                sugarcube.constantOverrides.NOTCH_HEIGHT = Number(value);
            },
            type: "number",
            min: "0",
            max: "32",
        },
        cornerSize: {
            onChange: (value) => {
                sugarcube.constantOverrides.CORNER_RADIUS = Number(value);
            },
            type: "number",
            min: "0",
            max: "8",
        },
        padding: {
            onChange: (value) => {
                sugarcube.constantOverrides.BETWEEN_STATEMENT_PADDING_Y = Number(value);
            },
            type: "number",
            min: "0",
            max: "4",
        },
        flyOutOpacity: {
            onChange: (value) => {
                sugarcube.blocklyTheme.componentStyles.flyoutOpacity = value / 100;
            },
            type: "number",
            min: "0",
            max: "100",
        },
    },
    Monaco: {},
};
