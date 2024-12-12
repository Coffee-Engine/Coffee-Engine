//Loading js into monaco
(function () {
    monaco.languages.register({ id: "glsl" });

    monaco.languages.setMonarchTokensProvider("glsl", {
        keywords: ["in","out","uniform","layout","attribute","varying","precision","highp","mediump","lowp","void","bool","int","uint","float","double","vec2","vec3","vec4","ivec2","ivec3","ivec4","bvec2","bvec3","bvec4","uvec2","uvec3","uvec4","dvec2","dvec3","dvec4","mat2","mat3","mat4","mat2x2","mat2x3","mat2x4","mat3x2","mat3x3","mat3x4","mat4x2","mat4x3","mat4x4","dmat2","dmat3","dmat4","dmat2x2","dmat2x3","dmat2x4","dmat3x2","dmat3x3","dmat3x4","dmat4x2","dmat4x3","dmat4x4","sampler1D","texture1D","image1D","sampler1DShadow","sampler1DArray","texture1DArray","image1DArray","sampler1DArrayShadow","sampler2D","texture2D","image2D","sampler2DShadow","sampler2DArray","texture2DArray","image2DArray","sampler2DArrayShadow","sampler2DMS","texture2DMS","image2DMS","sampler2DMSArray","texture2DMSArray","image2DMSArray","sampler2DRect","texture2DRect","image2DRect","sampler2DRectShadow","sampler3D","texture3D","image3D","samplerCube","textureCube","imageCube","samplerCubeShadow","samplerCubeArray","textureCubeArray","imageCubeArray","samplerCubeArrayShadow","samplerBuffer","textureBuffer","imageBuffer","subpassInput","subpassInputMS","isampler1D","itexture1D","iimage1D","isampler1DArray","itexture1DArray","iimage1DArray","isampler2D","itexture2D","iimage2D","isampler2DArray","itexture2DArray","iimage2DArray","isampler2DMS","itexture2DMS","iimage2DMS","isampler2DMSArray","itexture2DMSArray","iimage2DMSArray","isampler2DRect","itexture2DRect","iimage2DRect","isampler3D","itexture3D","iimage3D","isamplerCube","itextureCube","iimageCube","isamplerCubeArray","itextureCubeArray","iimageCubeArray","isamplerBuffer","itextureBuffer","iimageBuffer","isubpassInput","isubpassInputMS","usampler1D","utexture1D","uimage1D","usampler1DArray","utexture1DArray","uimage1DArray","usampler2D","utexture2D","uimage2D","usampler2DArray","utexture2DArray","uimage2DArray","usampler2DMS","utexture2DMS","uimage2DMS","usampler2DMSArray","utexture2DMSArray","uimage2DMSArray","usampler2DRect","utexture2DRect","uimage2DRect","usampler3D","utexture3D","uimage3D","usamplerCube","utextureCube","uimageCube","usamplerCubeArray","utextureCubeArray","uimageCubeArray","usamplerBuffer","utextureBuffer","uimageBuffer","atomic_uint","usubpassInput","usubpassInputMS","sampler","samplerShadow","in","out","uniform","layout","attribute","varying","precision"],

        operators: ["*","+","-","/","~","!","%","<<",">>","<",">","<=",">=","==","!=","&","^","|","&&","^^","||","=","+=","-=","*=","/=","%=","<<=",">>=","&=","^=","|="],

        directives: [ "#","#define","#if","#ifdef","#ifndef","#else","#elif","#endif","#error","#pragma","#extension","#version","#line" ],

        // we include these common regular expressions
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        digits: /\d+(_+\d+)*/,
        octaldigits: /[0-7]+(_+[0-7]+)*/,
        binarydigits: /[0-1]+(_+[0-1]+)*/,
        hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

        // The main tokenizer for our languages
        tokenizer: {
            root: [[/[{}]/, "delimiter.bracket"], { include: "common" }],

            common: [
                //Directives
                [/#[a-z]*/, {cases: {"@directives": "string","@default": "string.invalid"}}],

                // identifiers and keywords
                [
                    /#?[a-z_$][\w$]*/,
                    {
                        cases: {
                            "@keywords": "keyword",
                            "@default": "identifier",
                        },
                    },
                ],
                [/[A-Z][\w\$]*/, "type.identifier"], // to show class names nicely
                [/[a-zA-Z][a-zA-Z0-9_]*(?=\()/, "type.identifier"], // show functions nicely
                // [/[A-Z][\w\$]*/, 'identifier'],

                // whitespace
                { include: "@whitespace" },

                // delimiters and operators
                [/[()\[\]]/, "@brackets"],
                [/[<>](?!@symbols)/, "@brackets"],
                [/!(?=([^=]|$))/, "delimiter"],
                [
                    /@symbols/,
                    {
                        cases: {
                            "@operators": "delimiter",
                            "@default": "",
                        },
                    },
                ],

                // numbers
                [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
                [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
                [/0[xX](@hexdigits)n?/, "number.hex"],
                [/(@digits)n?/, "number"],

                // delimiter: after number because of .\d floats
                [/[;,.]/, "delimiter"]
            ],

            whitespace: [
                [/[ \t\r\n]+/, ""],
                [/\/\*/, "comment", "@comment"],
                [/\/\/.*$/, "comment"],
            ],

            comment: [
                [/[^\/*]+/, "comment"],
                [/\*\//, "comment", "@pop"],
                [/[\/*]/, "comment"],
            ],

            bracketCounting: [[/\{/, "delimiter.bracket", "@bracketCounting"], [/\}/, "delimiter.bracket", "@pop"], { include: "common" }],
        },
    });
})();
