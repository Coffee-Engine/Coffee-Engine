(function () {
    coffeeEngine.ColorMath = {
        HexToRGB: (Hex) => {
            if (typeof Hex === "string") {
                if (Hex.length > 7) {
                    const splitHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);
                    return {
                        r: parseInt(splitHex[1], 16),
                        g: parseInt(splitHex[2], 16),
                        b: parseInt(splitHex[3], 16),
                        a: parseInt(splitHex[4], 16),
                    };
                }
                else if (Hex.length > 5) {
                    const splitHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);
                    return {
                        r: parseInt(splitHex[1], 16),
                        g: parseInt(splitHex[2], 16),
                        b: parseInt(splitHex[3], 16),
                    };
                } else {
                    const splitHex = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(Hex);
                    return {
                        r: parseInt(splitHex[1], 16),
                        g: parseInt(splitHex[2], 16),
                        b: parseInt(splitHex[3], 16),
                    };
                }
            }

            return {
                r: Math.floor(Hex / 65536),
                g: Math.floor(Hex / 256) % 256,
                b: Hex % 256,
            };
        },

        HexToVec3: (Hex) => {
            const split = coffeeEngine.ColorMath.HexToRGB(Hex);

            return new coffeeEngine.vector3(split.r, split.g, split.b);
        },

        HexToVec4: (Hex) => {
            const split = coffeeEngine.ColorMath.HexToRGB(Hex);

            return new coffeeEngine.vector3(split.r, split.g, split.b, (split.a === undefined) ? 1 : split.a);
        },

        RGBtoHex: (RGB) => {
            let hexR = Math.floor(RGB.r).toString(16);
            let hexG = Math.floor(RGB.g).toString(16);
            let hexB = Math.floor(RGB.b).toString(16);

            if (hexR.length == 1) hexR = "0" + hexR;
            if (hexG.length == 1) hexG = "0" + hexG;
            if (hexB.length == 1) hexB = "0" + hexB;

            //Transparency
            if (RGB.a) {
                let hexA = Math.floor(RGB.a).toString(16);
                if (hexA.length == 1) hexA = "0" + hexA;
                
                return `#${hexR}${hexG}${hexB}${hexA}`;
            }

            return `#${hexR}${hexG}${hexB}`;
        },

        BrightestChannel: (Color) => {
            if (typeof Color == "string") {
                const split = coffeeEngine.ColorMath.HexToRGB(Color);

                let brightest = split.r;

                if (brightest < split.g) {
                    brightest = split.g;
                }
                if (brightest < split.b) {
                    brightest = split.b;
                }

                return brightest;
            }

            let brightest = Color.r;

            if (brightest < Color.g) {
                brightest = Color.g;
            }
            if (brightest < Color.b) {
                brightest = Color.b;
            }

            return brightest;
        },

        DarkestChannel: (Color) => {
            if (typeof Color == "string") {
                const split = coffeeEngine.ColorMath.HexToRGB(Color);

                let brightest = split.r;

                if (brightest > split.g) {
                    brightest = split.g;
                }
                if (brightest > split.b) {
                    brightest = split.b;
                }

                return brightest;
            }

            let brightest = Color.r;

            if (brightest > Color.g) {
                brightest = Color.g;
            }
            if (brightest > Color.b) {
                brightest = Color.b;
            }

            return brightest;
        },

        HexToHSV: (Hex) => {
            return coffeeEngine.ColorMath.RGBToHSV(coffeeEngine.ColorMath.HexToRGB(Hex));
        },

        RGBToHSV: (RGB) => {
            //Divide the RGB by 255
            RGB.r /= 255;
            RGB.g /= 255;
            RGB.b /= 255;

            //Get the brightest and darkest channels
            const CMax = coffeeEngine.ColorMath.BrightestChannel(RGB);
            const CMin = coffeeEngine.ColorMath.DarkestChannel(RGB);

            const Delta = CMax - CMin;

            let H = 0;

            //Multiply and get the Hue
            if (CMax == RGB.r) {
                H = 60 * (((RGB.g - RGB.b) / Delta) % 6);
            }
            if (CMax == RGB.g) {
                H = 60 * ((RGB.b - RGB.r) / Delta + 2);
            }
            if (CMax == RGB.b) {
                H = 60 * ((RGB.r - RGB.g) / Delta + 4);
            }

            //Set the saturation
            let S = 0;
            if (CMax != 0) {
                S = Delta / CMax;
            }

            //Make sure the hue isn't NaN
            if (isNaN(H)) {
                H = 0;
            }

            //Revert & Return
            RGB.r *= 255;
            RGB.g *= 255;
            RGB.b *= 255;

            return {
                h: H,
                s: S,
                v: CMax,
            };
        },

        HSVToRGB: (HSV) => {
            const h = HSV.h;

            //Some math to get C and X
            const C = HSV.v * HSV.s;
            const X = C * (1 - Math.abs(((h / 60) % 2) - 1));

            const m = HSV.v - C;

            //Make our returned objects
            const RGB = { r: 0, g: 0, b: 0 };

            //And the if statements
            if (0 <= h && h < 60) {
                RGB.r = C;
                RGB.g = X;
            } else if (60 <= h && h < 120) {
                RGB.r = X;
                RGB.g = C;
            } else if (120 <= h && h < 180) {
                RGB.g = C;
                RGB.b = X;
            } else if (180 <= h && h < 240) {
                RGB.g = X;
                RGB.b = C;
            } else if (240 <= h && h < 300) {
                RGB.b = C;
                RGB.r = X;
            } else if (300 <= h && h < 360) {
                RGB.b = X;
                RGB.r = C;
            }

            //Then convert
            RGB.r = (RGB.r + m) * 255;
            RGB.g = (RGB.g + m) * 255;
            RGB.b = (RGB.b + m) * 255;

            return RGB;
        },

        HSVToHex: (HSV) => {
            return coffeeEngine.ColorMath.RGBtoHex(coffeeEngine.ColorMath.HSVToRGB(HSV));
        },
    };
})();
