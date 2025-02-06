sugarcube.blockColorFunctions = {
    Default: (color1, color2, color3, color4, color5) => {
        return [
            color1, //Primary Background
            color2, //Menu Inner
            color3, //Outline
            color4 || "#ffffff", //TEXT
            color5, //Field Background
            true, //Use Black White Text
            color1, //Color picker Color
            false, //Run on dynamic blocks (EG, variables, custom blocks)
        ];
    },

    Pastel: (color, a, b, color4, color5) => {
        const color1 = coffeeEngine.ColorMath.HexToHSV(color);
        const color2 = coffeeEngine.ColorMath.HexToHSV(color);
        const color3 = coffeeEngine.ColorMath.HexToHSV(color);

        color1.s *= 0.6;
        color2.s *= 0.4;
        color3.v *= 0.8;

        return [coffeeEngine.ColorMath.HSVToHex(color1).substring(0, 7), coffeeEngine.ColorMath.HSVToHex(color2).substring(0, 7), coffeeEngine.ColorMath.HSVToHex(color3).substring(0, 7), color4 || "#0f0f0f", color5 || "#ffffff", true, coffeeEngine.ColorMath.HSVToHex(color1).substring(0, 7)];
    },

    Dark: (color3, a, b, color4, color5) => {
        const color1 = coffeeEngine.ColorMath.HexToHSV(color3);
        const color2 = coffeeEngine.ColorMath.HexToHSV(color3);
        const color5FB = coffeeEngine.ColorMath.HexToHSV(color3);

        color1.v *= 0.15;
        color2.v *= 0.3;
        color5FB.v *= 0.075;

        return [coffeeEngine.ColorMath.HSVToHex(color1).substring(0, 7), coffeeEngine.ColorMath.HSVToHex(color2).substring(0, 7), color3, color4 || color3, color5 || coffeeEngine.ColorMath.HSVToHex(color5FB).substring(0, 7), false, color3, true];
    },
};

sugarcube.blockColorFunction = sugarcube.blockColorFunctions.Default;
