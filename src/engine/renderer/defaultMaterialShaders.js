(function () {
    coffeeEngine.renderer.initilizeBaseShaders = (renderer) => {
        renderer.mainShaders.unlit = renderer.compilePBRshader(`
        uniform sampler2D u_texture;
        void fragment() {
            COLOR = texture(u_texture,UV);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.lit = renderer.compilePBRshader(`
        uniform sampler2D u_texture;
        void fragment() {
            COLOR = texture(u_texture,UV);
        }
        `);

        renderer.mainShaders.unlitSolid = renderer.compilePBRshader(`
        void fragment() {
            COLOR = vec4(1);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.PBR = renderer.compilePBRshader(`
        uniform sampler2D Albedo;
        uniform sampler2D NormalMap;

        void fragment() {
            mat3 normalTransform = transpose(mat3(TANGENT,BITANGENT,NORMAL));
            COLOR = texture(Albedo, UV);
            NORMAL.xyz = (texture(NormalMap, UV).xyz + -0.5) * 2.0 * normalTransform;
        }
        `);
    };
})();
