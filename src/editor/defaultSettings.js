(function () {
    editor.defaultSettings = {
        Editor: {
            customLanguage: "",
            changeLanguage: "",
            changeLayout: "",
            clearLocalStorage: "",
        },
        Window: {
            grabSize: 8,
            barHeight: 24,
            barStyle: "Flat",
            tabMode: "ifNeeded",
        },
        Theme: {
            themeColor: "Mocha",
            backgroundColor: "#46352a",
            textColor: "#e7cab7",
            warnColor: "#ffd078",
            warnTextColor: "#46352a",
            errorColor: "#323546",
            errorTextColor: "#323546",
            linkColor: "#ffb400",
        },
        SugarCube: {
            notchWidth: "36", //NOTCH_HEIGHT
            notchHeight: "8", //NOTCH_WIDTH
            cornerSize: "4", //CORNER_RADIUS
            padding: "2", //BETWEEN_STATEMENT_PADDING_Y
            flyOutOpacity: "50",
        },
        Monaco: {
            fontSize: 12,
            fontStyle: "Monospace",
            themeOverride: false,

            defaultText: "#e7cab7",

            colorKeyword: "#d76f2b",
            colorClassname: "#e5823f",

            colorDelimiter: "#e38d55",
            colorDelimiterBracket: "#e7b252",

            colorString: "#d6ae93",
            colorStringError: "#ff7878",
            colorStringEscape: "#e7cab7",

            colorNumber: "#bce579",
            colorNumberUnusual: "#5bb498",
            colorRegexp: "#eba2ce",
            colorRegexpInvalid: "#ff7878",
            colorRegexpEscape: "#e7cab7",

            colorComment: "#bb8d6e",
            colorCommentDoc: "#958072",
            colorCommentDocKeyword: "#bce579",
            colorCommentDocType: "#5bb498",
        },
    };

    const quickSettingCSSThemeColor = (cssName) => {
        return {
            type: "color",
            onChange: (value, fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") {
                    document.body.style.setProperty(cssName, value);
                } else if (editor.settings.values.Monaco.themeOverride) {
                    document.body.style.setProperty(cssName, value);
                } else {
                    document.body.style.setProperty(cssName, coffeeEngine.defaultThemes[editor.settings.values.Theme.themeColor][cssName]);
                }
            },
            menuInit: (previousSettings, elements) => {
                //Check if custom color is selected
                if (editor.settings.values.Theme.themeColor != "Custom" && !editor.settings.values.Monaco.themeOverride) {
                    //If not disable it and make sure the value is the one we want.
                    elements.span.style.opacity = "50%";
                    elements.input.disabled = true;
                }
            },
        };
    };

    const setSettingActiveMode = (setting, mode) => {
        editor.settings.elements[setting].span.style.opacity = mode ? "100%" : "50%";
        editor.settings.elements[setting].input.disabled = !mode;
    };

    editor.settingDefs = {
        Editor: {
            customLanguage: {
                type: "button",
                onClick: () => {
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                        if (JSON.parse(fileReader.result)) {
                            const parsed = JSON.parse(fileReader.result);
                            editor.Storage.setStorage("language", parsed);
                            editor.Storage.setStorage("languageName", "custom");
                            editor.language = Object.assign({}, editor.EnglishLang, parsed);

                            editor.settings.initilize();
                        }
                    };
                    //Yeah this google thing is getting on my nerves a wee bit
                    if (!editor.safeties.filePermissions) {
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.accept = ".json";

                        fileInput.onchange = () => {
                            fileReader.readAsText(fileInput.files[0]);
                        };

                        fileInput.click();
                    } else {
                        window
                            .showOpenFilePicker({
                                types: [
                                    {
                                        description: "Coffee Engine Project",
                                        accept: {
                                            "application/json": [".json"],
                                        },
                                    },
                                ],
                            })
                            .then((result) => {
                                result.getFile().then((file) => {
                                    fileReader.readAsText(file);
                                });
                            });
                    }
                },
            },
            changeLanguage: {
                type: "button",
                onClick: () => {
                    editor.setup.initilizeLang(true);
                },
            },
            changeLayout: {
                type: "button",
                onClick: () => {
                    editor.setup.initilizeLayout(true);
                },
            },
            clearLocalStorage: {
                type: "button",
                onClick: (element) => {
                    element.innerHTML = editor.language[`engine.settings.category.Editor.clearLocalStorage.cleared`];
                    localStorage.clear();
                },
            },
        },
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
            barStyle: {
                type: "dropdown",
                values: ["Flat", "Aero"],
                onChange: (value) => {
                    editor.taskbarStyle = value;
                },
            },
            tabMode: {
                type: "dropdown",
                values: ["arrows", "ifNeeded", "always"],
                onChange: (value) => {
                    editor.tabStyle = value;
                },
            },
        },
        Theme: {
            themeColor: {
                type: "dropdown",
                values: ["Mocha", "Cocoa", "Creme", "blueBerry", "Custom"],
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

                                editor.settings.elements["linkColor"].span.style.opacity = "50%";
                                editor.settings.elements["linkColor"].input.disabled = true;
                                if (coffeeEngine.defaultThemes[value]) {
                                    editor.settings.elements["linkColor"].input.value = coffeeEngine.defaultThemes[value]["--link-1"];
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

                        editor.settings.elements["linkColor"].span.style.opacity = "100%";
                        editor.settings.elements["linkColor"].input.disabled = false;
                        editor.settings.elements["linkColor"].input.value = editor.settings.values.Theme.linkColor;
                        editor.settingDefs.Theme.linkColor.onChange(editor.settings.values.Theme.linkColor);

                        editor.settingDefs.Monaco.defaultText.onChange(editor.settings.values.Monaco.defaultText);
                        editor.settingDefs.Monaco.colorKeyword.onChange(editor.settings.values.Monaco.colorKeyword);
                        editor.settingDefs.Monaco.colorClassname.onChange(editor.settings.values.Monaco.colorClassname);
                        editor.settingDefs.Monaco.colorDelimiter.onChange(editor.settings.values.Monaco.colorDelimiter);
                        editor.settingDefs.Monaco.colorDelimiterBracket.onChange(editor.settings.values.Monaco.colorDelimiterBracket);
                        editor.settingDefs.Monaco.colorNumber.onChange(editor.settings.values.Monaco.colorNumber);
                        editor.settingDefs.Monaco.colorNumberUnusual.onChange(editor.settings.values.Monaco.colorNumberUnusual);
                        editor.settingDefs.Monaco.colorString.onChange(editor.settings.values.Monaco.colorString);
                        editor.settingDefs.Monaco.colorStringEscape.onChange(editor.settings.values.Monaco.colorStringEscape);
                        editor.settingDefs.Monaco.colorStringError.onChange(editor.settings.values.Monaco.colorStringError);
                        editor.settingDefs.Monaco.colorRegexp.onChange(editor.settings.values.Monaco.colorRegexp);
                        editor.settingDefs.Monaco.colorRegexpInvalid.onChange(editor.settings.values.Monaco.colorRegexpInvalid);
                        editor.settingDefs.Monaco.colorRegexpEscape.onChange(editor.settings.values.Monaco.colorRegexpEscape);
                        editor.settingDefs.Monaco.colorComment.onChange(editor.settings.values.Monaco.colorComment);
                        editor.settingDefs.Monaco.colorCommentDoc.onChange(editor.settings.values.Monaco.colorCommentDoc);
                        editor.settingDefs.Monaco.colorCommentDocKeyword.onChange(editor.settings.values.Monaco.colorCommentDocKeyword);
                        editor.settingDefs.Monaco.colorCommentDocType.onChange(editor.settings.values.Monaco.colorCommentDocType);
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
            linkColor: {
                type: "color",
                onChange: (value, fromBoot) => {
                    if (editor.settings.values.Theme.themeColor == "Custom") {
                        document.body.style.setProperty("--link-1", value);

                        //Color Conversions
                        const split = coffeeEngine.ColorMath.HexToRGB(value);

                        if (coffeeEngine.ColorMath.BrightestChannel(value) > 10) {
                            document.body.style.setProperty(
                                "--link-2",
                                coffeeEngine.ColorMath.RGBtoHex({
                                    r: split.r * 0.8,
                                    g: split.g * 0.8,
                                    b: split.b * 0.8,
                                })
                            );
                            document.body.style.setProperty(
                                "--link-3",
                                coffeeEngine.ColorMath.RGBtoHex({
                                    r: split.r * 0.7,
                                    g: split.g * 0.7,
                                    b: split.b * 0.7,
                                })
                            );
                        } else {
                            document.body.style.setProperty(
                                "--link-2",
                                coffeeEngine.ColorMath.RGBtoHex({
                                    r: split.r * 1.2,
                                    g: split.g * 1.2,
                                    b: split.b * 1.2,
                                })
                            );
                            document.body.style.setProperty(
                                "--link-3",
                                coffeeEngine.ColorMath.RGBtoHex({
                                    r: split.r * 1.3,
                                    g: split.g * 1.3,
                                    b: split.b * 1.3,
                                })
                            );
                        }
                    }
                },
                menuInit: (previousSettings, elements) => {
                    //Check if custom color is selected
                    if (previousSettings.themeColor != "Custom") {
                        //If not disable it and make sure the value is the one we want.
                        elements.span.style.opacity = "50%";
                        elements.input.disabled = true;
                        if (coffeeEngine.defaultThemes[previousSettings.themeColor]) {
                            elements.input.value = coffeeEngine.defaultThemes[previousSettings.themeColor]["--link-1"];
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
        Monaco: {
            fontSize: {
                onChange: (value) => {
                    monacoManager.fontSize = Number(value);
                },
                type: "number",
                min: "8",
                max: "32",
            },
            fontStyle: {
                type: "dropdown",
                values: ["Serif", "Sans-serif", "Monospace", "Cursive", "Fantasy"],
                onChange: (value) => {
                    monacoManager.fontStyle = value;
                },
            },
            themeOverride: {
                type: "checkbox",
                onChange: (value, fromBoot) => {
                    if (!fromBoot) {
                        setSettingActiveMode("defaultText", value);
                        setSettingActiveMode("colorKeyword", value);
                        setSettingActiveMode("colorClassname", value);
                        setSettingActiveMode("colorDelimiter", value);
                        setSettingActiveMode("colorDelimiterBracket", value);
                        setSettingActiveMode("colorNumber", value);
                        setSettingActiveMode("colorNumberUnusual", value);
                        setSettingActiveMode("colorString", value);
                        setSettingActiveMode("colorStringEscape", value);
                        setSettingActiveMode("colorStringError", value);
                        setSettingActiveMode("colorRegexp", value);
                        setSettingActiveMode("colorRegexpInvalid", value);
                        setSettingActiveMode("colorRegexpEscape", value);
                        setSettingActiveMode("colorComment", value);
                        setSettingActiveMode("colorCommentDoc", value);
                        setSettingActiveMode("colorCommentDocKeyword", value);
                        setSettingActiveMode("colorCommentDocType", value);
                    }

                    editor.settingDefs.Monaco.defaultText.onChange(editor.settings.values.Monaco.defaultText);
                    editor.settingDefs.Monaco.colorKeyword.onChange(editor.settings.values.Monaco.colorKeyword);
                    editor.settingDefs.Monaco.colorClassname.onChange(editor.settings.values.Monaco.colorClassname);
                    editor.settingDefs.Monaco.colorDelimiter.onChange(editor.settings.values.Monaco.colorDelimiter);
                    editor.settingDefs.Monaco.colorDelimiterBracket.onChange(editor.settings.values.Monaco.colorDelimiterBracket);
                    editor.settingDefs.Monaco.colorNumber.onChange(editor.settings.values.Monaco.colorNumber);
                    editor.settingDefs.Monaco.colorNumberUnusual.onChange(editor.settings.values.Monaco.colorNumberUnusual);
                    editor.settingDefs.Monaco.colorString.onChange(editor.settings.values.Monaco.colorString);
                    editor.settingDefs.Monaco.colorStringEscape.onChange(editor.settings.values.Monaco.colorStringEscape);
                    editor.settingDefs.Monaco.colorStringError.onChange(editor.settings.values.Monaco.colorStringError);
                    editor.settingDefs.Monaco.colorRegexp.onChange(editor.settings.values.Monaco.colorRegexp);
                    editor.settingDefs.Monaco.colorRegexpInvalid.onChange(editor.settings.values.Monaco.colorRegexpInvalid);
                    editor.settingDefs.Monaco.colorRegexpEscape.onChange(editor.settings.values.Monaco.colorRegexpEscape);
                    editor.settingDefs.Monaco.colorComment.onChange(editor.settings.values.Monaco.colorComment);
                    editor.settingDefs.Monaco.colorCommentDoc.onChange(editor.settings.values.Monaco.colorCommentDoc);
                    editor.settingDefs.Monaco.colorCommentDocKeyword.onChange(editor.settings.values.Monaco.colorCommentDocKeyword);
                    editor.settingDefs.Monaco.colorCommentDocType.onChange(editor.settings.values.Monaco.colorCommentDocType);
                },
            },
            defaultText: quickSettingCSSThemeColor("--code-text"),
            colorKeyword: quickSettingCSSThemeColor("--keyword"),
            colorClassname: quickSettingCSSThemeColor("--class-name"),
            colorDelimiter: quickSettingCSSThemeColor("--delimiter"),
            colorDelimiterBracket: quickSettingCSSThemeColor("--delimiter-bracket"),
            colorNumber: quickSettingCSSThemeColor("--number-color"),
            colorNumberUnusual: quickSettingCSSThemeColor("--number-color-unusual"),
            colorString: quickSettingCSSThemeColor("--string"),
            colorStringEscape: quickSettingCSSThemeColor("--string-escape"),
            colorStringError: quickSettingCSSThemeColor("--string-error"),
            colorRegexp: quickSettingCSSThemeColor("--regexp"),
            colorRegexpInvalid: quickSettingCSSThemeColor("--regexp-invalid"),
            colorRegexpEscape: quickSettingCSSThemeColor("--regexp-escape"),
            colorComment: quickSettingCSSThemeColor("--comment"),
            colorCommentDoc: quickSettingCSSThemeColor("--comment-doc"),
            colorCommentDocKeyword: quickSettingCSSThemeColor("--comment-doc-keyword"),
            colorCommentDocType: quickSettingCSSThemeColor("--comment-doc-type"),
        },
    };
})();
