(function() {
    coffeeEngine.renderer.initilizeBaseShaders = (renderer) => {
        renderer.mainShaders.unlit = renderer.compilePBRshader(`
        uniform sampler2D u_texture;
        void fragment() {
            COLOR = texture(u_texture,UV);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.unlitSolid = renderer.compilePBRshader(`
        void fragment() {
            COLOR = vec4(1);
            LIGHT_AFFECTION = 0.0;
        }
        `);
    }
})();