sugarcube.blockColorFunctions = {
    Default: (color1, color2, color3) => {
        return [color1, color2, color3];
    },
    Pastel: (color) => {
        const color1 = coffeeEngine.ColorMath.HexToHSV(color);
        const color2 = coffeeEngine.ColorMath.HexToHSV(color);
        const color3 = coffeeEngine.ColorMath.HexToHSV(color);

        color1.s *= 0.6;
        color2.s *= 0.4;
        color3.v *= 0.8;

        return [
            coffeeEngine.ColorMath.HSVToHex(color1).substring(0,7),
            coffeeEngine.ColorMath.HSVToHex(color2).substring(0,7),
            coffeeEngine.ColorMath.HSVToHex(color3).substring(0,7)
        ];
    }
}

sugarcube.blockColorFunction = (color1, color2, color3) => {
    return [color1, color2, color3];
}