editor.defaultSettings = {
    Theme: {
        themeColor: "Mocha",
        backgroundColor: "#46352a"
    },
    SugarCube: {
        notchWidth:"36", //NOTCH_HEIGHT
        notchHeight:"8", //NOTCH_WIDTH
        cornerSize:"4", //CORNER_RADIUS
        padding:"2" //BETWEEN_STATEMENT_PADDING_Y
    },
    Monaco: {

    }
}

editor.settingDefs = {
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
                if (value != "Custom") {
                    if (coffeeEngine.defaultThemes[value]) {
                        Object.keys(coffeeEngine.defaultThemes[value]).forEach(key => {
                            document.body.style.setProperty(key,coffeeEngine.defaultThemes[value][key]);
                        })
                    }
                }
                else if (!fromBoot) {

                }
            }
        },
        backgroundColor: {
            type:"color",
            onChange:() => {

            },
            menuInit: (previousSettings, elements) => {
                if (previousSettings.themeColor != "Custom") {
                    elements.span.style.opacity = "50%";
                }
            }
        }
    },
    SugarCube: {
        notchWidth:{
            onChange:(value) => {
                sugarcube.constantOverrides.NOTCH_WIDTH = value;
            },
            type:"number",
            min:"12",
            max:"48"
        },
        notchHeight:{
            onChange:(value) => {
                sugarcube.constantOverrides.NOTCH_HEIGHT = value;
            },
            type:"number",
            min:"0",
            max:"32"
        },
        cornerSize:{
            onChange:(value) => {
                sugarcube.constantOverrides.CORNER_RADIUS = value;
            },
            type:"number",
            min:"0",
            max:"8"
        },
        padding:{
            onChange:(value) => {
                sugarcube.constantOverrides.BETWEEN_STATEMENT_PADDING_Y = value;
            },
            type:"number",
            min:"0",
            max:"4"
        },
    },
    Monaco: {

    }
}