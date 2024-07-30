editor.defaultSettings = {
    Window: {
        grabSize: 8
    },
    Theme: {
        themeColor: "Mocha",
        backgroundColor: "#46352a",
        textColor: "#e7cab7"
    },
    SugarCube: {
        notchWidth:"36", //NOTCH_HEIGHT
        notchHeight:"8", //NOTCH_WIDTH
        cornerSize:"4", //CORNER_RADIUS
        padding:"2", //BETWEEN_STATEMENT_PADDING_Y
        flyOutOpacity:"50"
    },
    Monaco: {

    }
}

editor.settingDefs = {
    Window: {
        grabSize: {
            type:"number",
            min:"2",
            max:"16",
            onChange:(value,fromBoot) => {
                editor.grabDistance = value;
            }
        },
    },
    Theme: {
        themeColor: {
            type:"dropdown",
            values: [
                "Mocha",
                "Cocoa",
                "Creme",
                "Blue Berry",
                "Custom"
            ],
            onChange:(value,fromBoot) => {
                //Check if we are using a custom theme
                if (value != "Custom") {

                    //If we aren't check if our theme is valid
                    if (coffeeEngine.defaultThemes[value]) {

                        //Loop through keys and determine the right amount
                        Object.keys(coffeeEngine.defaultThemes[value]).forEach(key => {
                            document.body.style.setProperty(key,coffeeEngine.defaultThemes[value][key]);
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
                }
            }
        },
        backgroundColor: {
            type:"color",
            onChange:(value,fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") { 
                    document.body.style.setProperty("--background-1",value);

                    //Color Conversions
                    const split = coffeeEngine.ColorMath.HexToRGB(value);

                    if (coffeeEngine.ColorMath.BrightestChannel(value) > 10) {
                        document.body.style.setProperty("--background-2",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 0.80,
                            g:split.g * 0.80,
                            b:split.b * 0.80
                        }));
                        document.body.style.setProperty("--background-3",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 0.70,
                            g:split.g * 0.70,
                            b:split.b * 0.70
                        }));
                        document.body.style.setProperty("--background-4",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 0.60,
                            g:split.g * 0.60,
                            b:split.b * 0.60
                        }));
                    }
                    else {
                        document.body.style.setProperty("--background-2",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 1.2,
                            g:split.g * 1.2,
                            b:split.b * 1.2
                        }));
                        document.body.style.setProperty("--background-3",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 1.3,
                            g:split.g * 1.3,
                            b:split.b * 1.3
                        }));
                        document.body.style.setProperty("--background-4",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 1.4,
                            g:split.g * 1.4,
                            b:split.b * 1.4
                        }));
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
            }
        },
        textColor: {
            type:"color",
            onChange:(value,fromBoot) => {
                if (editor.settings.values.Theme.themeColor == "Custom") { 
                    document.body.style.setProperty("--text-1",value);

                    //Color Conversions
                    const split = coffeeEngine.ColorMath.HexToRGB(value);

                    if (coffeeEngine.ColorMath.BrightestChannel(value) > 10) {
                        document.body.style.setProperty("--text-2",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 0.80,
                            g:split.g * 0.80,
                            b:split.b * 0.80
                        }));
                        document.body.style.setProperty("--text-3",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 0.70,
                            g:split.g * 0.70,
                            b:split.b * 0.70
                        }));
                    }
                    else {
                        document.body.style.setProperty("--text-2",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 1.2,
                            g:split.g * 1.2,
                            b:split.b * 1.2
                        }));
                        document.body.style.setProperty("--text-3",coffeeEngine.ColorMath.RGBtoHex({
                            r:split.r * 1.3,
                            g:split.g * 1.3,
                            b:split.b * 1.3
                        }));
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
            }
        }
    },
    SugarCube: {
        notchWidth:{
            onChange:(value) => {
                sugarcube.constantOverrides.NOTCH_WIDTH = Number(value);
            },
            type:"number",
            min:"12",
            max:"48"
        },
        notchHeight:{
            onChange:(value) => {
                sugarcube.constantOverrides.NOTCH_HEIGHT = Number(value);
            },
            type:"number",
            min:"0",
            max:"32"
        },
        cornerSize:{
            onChange:(value) => {
                sugarcube.constantOverrides.CORNER_RADIUS = Number(value);
            },
            type:"number",
            min:"0",
            max:"8"
        },
        padding:{
            onChange:(value) => {
                sugarcube.constantOverrides.BETWEEN_STATEMENT_PADDING_Y = Number(value);
            },
            type:"number",
            min:"0",
            max:"4"
        },
        flyOutOpacity:{
            onChange:(value) => {
                sugarcube.blocklyTheme.componentStyles.flyoutOpacity = value / 100;
            },
            type:"number",
            min:"0",
            max:"100"
        },
    },
    Monaco: {

    }
}