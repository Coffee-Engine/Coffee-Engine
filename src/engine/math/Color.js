(function() {
    coffeeEngine.ColorMath = {
        HexToRGB: (Hex) => {
            if (typeof Hex === "string") {
                if (Hex.length > 5) {
                    const splitHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);
                    return {
                        r: parseInt(splitHex[1], 16),
                        g: parseInt(splitHex[2], 16),
                        b: parseInt(splitHex[3], 16),
                    };
                }
                else {
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

            return new coffeeEngine.vector3(split.r,split.g,split.b);
        },

        RGBtoHex: (RGB) => {
            let hexR = Math.floor(RGB.r).toString(16);
            let hexG = Math.floor(RGB.g).toString(16);
            let hexB = Math.floor(RGB.b).toString(16);
        
            if (hexR.length == 1) hexR = "0" + hexR;
            if (hexG.length == 1) hexG = "0" + hexG;
            if (hexB.length == 1) hexB = "0" + hexB;
        
            return `#${hexR}${hexG}${hexB}`;
        },
        
        BrightestChannel: (Color) => {
            if (typeof Color == "string") {
                const split = coffeeEngine.ColorMath.HexToRGB(Color);
                
                if (split.r > split.g && split.r > split.b) {
                    return split.r;
                }
                if (split.g > split.r && split.g > split.b) {
                    return split.g;
                }
                if (split.b > split.r && split.b > split.g) {
                    return split.b;
                }

                return 0;
            }

            if (Color.r > Color.g && Color.r > Color.b) {
              return Color.r;
            }
            if (Color.g > Color.r && Color.g > Color.b) {
              return Color.g;
            }
            if (Color.b > Color.r && Color.b > Color.g) {
              return Color.b;
            }
            return 0;
        }
    }
})()