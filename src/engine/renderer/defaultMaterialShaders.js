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
            mat3 normalTransform = mat3(1);
            normalTransform[0] = NORMAL;
            normalTransform[1] = vec3(NORMAL.y, NORMAL.z, NORMAL.x);
            normalTransform[2] = vec3(NORMAL.x, NORMAL.z, NORMAL.y);
            COLOR = texture(Albedo, UV);
            NORMAL.xyz = texture(NormalMap, UV).xyz * normalTransform;
        }
        `);
    };
})();
