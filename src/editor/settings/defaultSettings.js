(function () {
    const quickSettingCSSThemeColor = (target, key, cssName, defaultValue) => {
        return {
            target: target,
            key: key,
            //Make our color type
            defaultValue: defaultValue,
            type: "color",
            onchange: (value) => {
                //Make sure the theme isn't custom
                if (editor.settings.values.Theme.themeColor == "Custom") {
                    document.body.style.setProperty(cssName, value);
                } else if (editor.settings.values.CodeMirror.themeOverride) {
                    document.body.style.setProperty(cssName, value);
                } else {
                    document.body.style.setProperty(cssName, editor.defaultThemes[editor.settings.values.Theme.themeColor][cssName]);
                }
            },
            disabled: () => {return !(editor.settings.values.Theme.themeColor == "Custom" || editor.settings.values.CodeMirror.themeOverride)}
        };
    };

    const customCSSTheme = document.createElement("style");
    document.body.appendChild(customCSSTheme);

    editor = { ...editor, get settingDefs() {
        return {
            Editor: [
                {
                    translationKey: "customLanguage",
                    type: "button",
                    onclick: () => {
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
                {
                    translationKey: "changeLanguage",
                    type: "button",
                    onclick: () => {
                        editor.setup.initilizeLang(true);
                    },
                },
                {
                    translationKey: "changeLayout",
                    type: "button",
                    onclick: () => {
                        editor.setup.initilizeLayout(true);
                    },
                },
                {
                    translationKey: "clearLocalStorage",
                    type: "button",
                    onclick: (element) => {
                        element.innerHTML = editor.language[`engine.settings.category.Editor.clearLocalStorage.cleared`];
                        localStorage.clear();
                    },
                },
                {
                    target: editor.settings.values.Editor,
                    key: "startIndex",
                    defaultValue: 0,
                    type: "dropdown",
                    items: [
                        { text: editor.language["engine.settings.category.Editor.startIndex.0"], value: 0 },
                        { text: editor.language["engine.settings.category.Editor.startIndex.1"], value: 1 }
                    ]
                }
            ],
            Window:[
                {
                    target: editor.settings.values.Window,
                    key: "grabSize",
                    defaultValue: 8,
                    type: "int",
                    min: "2",
                    max: "16",
                    onchange: (value) => {
                        editor.grabDistance = value;
                    },
                },
                {
                    target: editor.settings.values.Window,
                    key: "barHeight",
                    defaultValue: 24,
                    type: "int",
                    min: "16",
                    max: "64",
                    onchange: (value) => {
                        editor.taskbarHeight = value;
                    },
                },
            ],
            Viewport: [
                {
                    target: editor.settings.values.Viewport,
                    key: "mouseSensitivity",
                    defaultValue: 1,
                    type: "slider",
                    min: "0.2",
                    max: "3.0",
                    step: 0.05,
                    hasSlider: true,
                    onchange: (value) => {
                        editor.mouseSensitivity = Number(value) || 1;
                    },
                },
                {
                    target: editor.settings.values.Viewport,
                    key: "forward",
                    defaultValue: "w",
                    type: "key",
                    onchange: (value) => {
                        editor.controls.forward = value;
                    },
                },
                {
                    target: editor.settings.values.Viewport,
                    key: "left",
                    defaultValue: "a",
                    type: "key",
                    onchange: (value) => {
                        editor.controls.left = value;
                    },
                },
                {
                    target: editor.settings.values.Viewport,
                    key: "back",
                    defaultValue: "s",
                    type: "key",
                    onchange: (value) => {
                        editor.controls.back = value;
                    },
                },
                {
                    target: editor.settings.values.Viewport,
                    key: "right",
                    defaultValue: "d",
                    type: "key",
                    onchange: (value) => {
                        editor.controls.right = value;
                    },
                },
                {
                    target: editor.settings.values.Viewport,
                    key: "up",
                    defaultValue: "e",
                    type: "key",
                    onchange: (value) => {
                        editor.controls.up = value;
                    },
                },
                {
                    target: editor.settings.values.Viewport,
                    key: "down",
                    defaultValue: "q",
                    type: "key",
                    onchange: (value) => {
                        editor.controls.down = value;
                    },
                },
            ],
            Theme: [
                {
                    target: editor.settings.values.Theme,
                    key: "themeColor",
                    defaultValue: "Mocha",
                    type: "dropdown",
                    items: () => {
                        const settings = Object.keys(editor.defaultThemes);
                        if (settings.includes("Davey Special")) settings.splice(settings.indexOf("Davey Special"), 1);
                        settings.push("Custom");

                        return settings;
                    },
                    onchange: (value, { refreshSelection }, fromBoot) => {
                        //Check if we are using a custom theme
                        if (value != "Custom") {
                            //If we aren't check if our theme is valid
                            if (editor.defaultThemes[value]) {
                                //Loop through keys and determine the right amount
                                Object.keys(editor.defaultThemes[value]).forEach((key) => {
                                    document.body.style.setProperty(key, editor.defaultThemes[value][key]);
                                });
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
                            const settingDefs = editor.settingDefs;

                            //Make the other settings change their values
                            settingDefs.Theme[1].onchange(editor.settings.values.Theme.backgroundColor);
                            settingDefs.Theme[2].onchange(editor.settings.values.Theme.accentColor);
                            settingDefs.Theme[3].onchange(editor.settings.values.Theme.textColor);
                            settingDefs.Theme[4].onchange(editor.settings.values.Theme.warnColor);
                            settingDefs.Theme[5].onchange(editor.settings.values.Theme.errorColor);
                            settingDefs.Theme[6].onchange(editor.settings.values.Theme.warnTextColor);
                            settingDefs.Theme[7].onchange(editor.settings.values.Theme.errorTextColor);
                            settingDefs.Theme[8].onchange(editor.settings.values.Theme.linkColor);
                            settingDefs.CodeMirror[3].onchange(editor.settings.values.CodeMirror.defaultText);
                            settingDefs.CodeMirror[4].onchange(editor.settings.values.CodeMirror.colorKeyword);
                            settingDefs.CodeMirror[5].onchange(editor.settings.values.CodeMirror.colorClassname);
                            settingDefs.CodeMirror[6].onchange(editor.settings.values.CodeMirror.colorDelimiterBracket);
                            settingDefs.CodeMirror[7].onchange(editor.settings.values.CodeMirror.colorNumber);
                            settingDefs.CodeMirror[8].onchange(editor.settings.values.CodeMirror.colorString);
                            settingDefs.CodeMirror[9].onchange(editor.settings.values.CodeMirror.colorAttribute);
                            settingDefs.CodeMirror[10].onchange(editor.settings.values.CodeMirror.colorVariable);
                            settingDefs.CodeMirror[11].onchange(editor.settings.values.CodeMirror.colorComment);
                            settingDefs.CodeMirror[12].onchange(editor.settings.values.CodeMirror.colorCodeTag);
                            settingDefs.CodeMirror[13].onchange(editor.settings.values.CodeMirror.colorCodeHeader);
                            settingDefs.CodeMirror[14].onchange(editor.settings.values.CodeMirror.colorCodeLink);

                            refreshSelection();
                        }
                    },
                },
                {
                    target: editor.settings.values.Theme,
                    key: "backgroundColor",
                    defaultValue: "#46352a",
                    type: "color",
                    onchange: (value) => {
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
                    disabled: () => {return editor.settings.values.Theme.themeColor != "Custom"}
                },
                {
                    target: editor.settings.values.Theme,
                    key: "accentColor",
                    defaultValue: "#261100",
                    type: "color",
                    onchange: (value, ) => {
                        if (editor.settings.values.Theme.themeColor == "Custom") {
                            document.body.style.setProperty("--accent", value);
                        }
                    },
                    disabled: () => {return editor.settings.values.Theme.themeColor != "Custom"}
                },
                {
                    target: editor.settings.values.Theme,
                    key: "textColor",
                    defaultValue: "#e7cab7",
                    type: "color",
                    onchange: (value) => {
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
                    disabled: () => {return editor.settings.values.Theme.themeColor != "Custom"}
                },
                {
                    target: editor.settings.values.Theme,
                    key: "warnColor",
                    defaultValue: "#ffd078",
                    type: "color",
                    onchange: (value) => {
                        if (editor.settings.values.Theme.themeColor == "Custom") {
                            document.body.style.setProperty("--warn", value);
                        }
                    },
                    disabled: () => {return editor.settings.values.Theme.themeColor != "Custom"}
                },
                {
                    target: editor.settings.values.Theme,
                    key: "errorColor",
                    defaultValue: "#323546",
                    type: "color",
                    onchange: (value) => {
                        if (editor.settings.values.Theme.themeColor == "Custom") {
                            document.body.style.setProperty("--error", value);
                        }
                    },
                    disabled: () => {return editor.settings.values.Theme.themeColor != "Custom"}
                },
                {
                    target: editor.settings.values.Theme,
                    key: "warnTextColor",
                    defaultValue: "#46352a",
                    type: "color",
                    onchange: (value, ) => {
                        if (editor.settings.values.Theme.themeColor == "Custom") {
                            document.body.style.setProperty("--warn-text", value);
                        }
                    },
                    disabled: () => {return editor.settings.values.Theme.themeColor != "Custom"}
                },
                {
                    target: editor.settings.values.Theme,
                    key: "errorTextColor",
                    defaultValue: "#323546",
                    type: "color",
                    onchange: (value) => {
                        if (editor.settings.values.Theme.themeColor == "Custom") {
                            document.body.style.setProperty("--error-text", value);
                        }
                    },
                    disabled: () => {return editor.settings.values.Theme.themeColor != "Custom"}
                },
                {
                    target: editor.settings.values.Theme,
                    key: "linkColor",
                    defaultValue: "#ffb400",
                    type: "color",
                    onchange: (value) => {
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
                    disabled: () => {return editor.settings.values.Theme.themeColor != "Custom"}
                },
                {
                    target: editor.settings.values.Theme,
                    key: "customCSS",
                    defaultValue: false,
                    type: "boolean",
                    onchange: (value) => {
                        if (value) {
                            customCSSTheme.innerText = editor.settings.values.Theme.customCSSCode;
                        }
                        else {
                            customCSSTheme.innerText = "";
                        }
                    }
                },
                {
                    target: editor.settings.values.Theme,
                    key: "customCSSCode",
                    defaultValue: "",
                    type: "multiline",
                    rows: 10,
                    spellcheck: false,
                    onchange: (value) => {
                        if (editor.settings.values.Theme.customCSS) {
                            customCSSTheme.innerText = value;
                        }
                        else {
                            customCSSTheme.innerText = "";
                        }
                    }
                }
            ],
            SugarCube: [
                {
                    target: editor.settings.values.SugarCube,
                    key: "notchWidth",
                    defaultValue: "36",
                    onchange: (value) => {
                        sugarcube.constantOverrides.NOTCH_WIDTH = Number(value);
                    },
                    type: "int",
                    min: "12",
                    max: "48",
                },
                {
                    target: editor.settings.values.SugarCube,
                    key: "notchHeight",
                    defaultValue: "8",
                    onchange: (value) => {
                        sugarcube.constantOverrides.NOTCH_HEIGHT = Number(value);
                    },
                    type: "int",
                    min: "0",
                    max: "32",
                },
                {
                    target: editor.settings.values.SugarCube,
                    key: "cornerSize",
                    defaultValue: "4",
                    onchange: (value) => {
                        sugarcube.constantOverrides.CORNER_RADIUS = Number(value);
                    },
                    type: "int",
                    min: "0",
                    max: "8",
                },
                {
                    target: editor.settings.values.SugarCube,
                    key: "padding",
                    defaultValue: "2",
                    onchange: (value) => {
                        sugarcube.constantOverrides.BETWEEN_STATEMENT_PADDING_Y = Number(value);
                    },
                    type: "int",
                    min: "0",
                    max: "4",
                },
                {
                    target: editor.settings.values.SugarCube,
                    key: "flyOutOpacity",
                    defaultValue: "50",
                    onchange: (value) => {
                        sugarcube.blocklyTheme.componentStyles.flyoutOpacity = value / 100;
                    },
                    type: "int",
                    min: "0",
                    max: "100",
                },
                {
                    target: editor.settings.values.SugarCube,
                    key: "blockColoration",
                    defaultValue: "Default",
                    type: "dropdown",
                    items: () => {
                        return Object.keys(sugarcube.blockColorFunctions);
                    },
                    onchange: (value) => {
                        sugarcube.blockColorFunction = sugarcube.blockColorFunctions[value] || sugarcube.blockColorFunctions.Default;
                    },
                },
            ],
            CodeMirror: [
                {
                    target: editor.settings.values.CodeMirror,
                    key: "fontSize",
                    defaultValue: 12,
                    onchange: (value) => {
                        document.body.style.setProperty("--code-fontSize", `${value}px`);
                    },
                    type: "int",
                    min: "8",
                    max: "32",
                },
                {
                    target: editor.settings.values.CodeMirror,
                    key: "fontStyle",
                    defaultValue: "Monospace",
                    type: "dropdown",
                    items: ["Serif", "Sans-serif", "Monospace", "Cursive", "Fantasy"],
                    onchange: (value) => {
                        document.body.style.setProperty("--code-fontFamily", value);
                    },
                },
                {
                    target: editor.settings.values.CodeMirror,
                    key: "themeOverride",
                    defaultValue: false,
                    type: "boolean",
                    onchange: (value, { refreshSelection }, fromBoot) => {
                        const settingDefs = editor.settingDefs;

                        settingDefs.CodeMirror[3].onchange(editor.settings.values.CodeMirror.defaultText);
                        settingDefs.CodeMirror[4].onchange(editor.settings.values.CodeMirror.colorKeyword);
                        settingDefs.CodeMirror[5].onchange(editor.settings.values.CodeMirror.colorClassname);
                        settingDefs.CodeMirror[6].onchange(editor.settings.values.CodeMirror.colorDelimiterBracket);
                        settingDefs.CodeMirror[7].onchange(editor.settings.values.CodeMirror.colorNumber);
                        settingDefs.CodeMirror[8].onchange(editor.settings.values.CodeMirror.colorString);
                        settingDefs.CodeMirror[9].onchange(editor.settings.values.CodeMirror.colorAttribute);
                        settingDefs.CodeMirror[10].onchange(editor.settings.values.CodeMirror.colorVariable);
                        settingDefs.CodeMirror[11].onchange(editor.settings.values.CodeMirror.colorComment);
                        settingDefs.CodeMirror[12].onchange(editor.settings.values.CodeMirror.colorCodeTag);
                        settingDefs.CodeMirror[13].onchange(editor.settings.values.CodeMirror.colorCodeHeader);
                        settingDefs.CodeMirror[14].onchange(editor.settings.values.CodeMirror.colorCodeLink);

                        if (!fromBoot) refreshSelection();
                    },
                },
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "defaultText", "--code-text", "#e7cab7"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorKeyword", "--keyword", "#d76f2b"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorClassname", "--class-name", "#e5823f"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorDelimiterBracket", "--delimiter-bracket", "#e7b252"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorNumber", "--number-color", "#bce579"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorString", "--string", "#d6ae93"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorAttribute", "--attribute", "#eba2ce"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorVariable", "--variable", "#ff7878"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorComment", "--comment", "#bb8d6e"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorCodeTag", "--code-tag", "#958072"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorCodeHeader", "--code-header", "#bce579"),
                quickSettingCSSThemeColor(editor.settings.values.CodeMirror, "colorCodeLink", "--code-link", "#ff893a"),
            ],
        }
    }};

    editor.HELP_MY_CSS_BROKE = () => {
        customCSSTheme.innerText = "";
    }
})();
