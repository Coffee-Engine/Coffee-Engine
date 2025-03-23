(function () {
    coffeeEngine.renderer.initilizeBaseShaders = (renderer) => {
        renderer.mainShaders.unlit = renderer.compilePBRshader(`
        uniform sampler2D u_texture; //?HINT: Default_WHITE
        void fragment() {
            COLOR = texture(u_texture,UV);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.editorCircle = renderer.compilePBRshader(`
        void fragment() {
            COLOR = mix(vec4(0.14117647058, 0.58823529411, 0.9294117647, 0.125), vec4(0),floor(length(UV - vec2(0.5,0.5)) * 2.0));
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.editorShape = renderer.compilePBRshader(`
        void fragment() {
            COLOR = vec4(0.14117647058, 0.58823529411, 0.9294117647, 0.125);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.lit = renderer.compilePBRshader(`
        uniform sampler2D u_texture; //?HINT: Default_WHITE
        void fragment() {
            COLOR = texture(u_texture,UV);
            ROUGHNESS = 1.0;
            SPECULAR = 1.0;
        }
        `);

        renderer.mainShaders.unlitSolid = renderer.compilePBRshader(`
        void fragment() {
            COLOR = vec4(1);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.PBR = renderer.compilePBRshader(`
        #define is_PBR;
        uniform sampler2D Albedo; //?HINT: Default_WHITE
        uniform sampler2D NormalMap; //?HINT: Default_NORMAL
        uniform sampler2D SpecularMap; //?HINT: Default_BLACK
        uniform sampler2D RoughnessMap; //?HINT: Default_BLACK

        void fragment() {
            mat3 normalTransform = transpose(mat3(TANGENT,BITANGENT,NORMAL));
            COLOR = texture(Albedo, UV);
            NORMAL.xyz = (texture(NormalMap, UV).xyz + -0.5) * 2.0 * normalTransform;
            ROUGHNESS = texture(RoughnessMap, UV).x;
            SPECULAR = texture(SpecularMap, UV).x;
        }
        `);
    };
})();
