(function() {
    coffeeEngine.renderer.initilizeBaseShaders = (renderer) => {
        renderer.mainShaders.unlit = renderer.compilePBRshader(`
        uniform sampler2D u_texture;
        void fragment() {
            COLOR = texture(u_texture,UV);
            LIGHT_AFFECTION = 0.0;
        }
        `);
    }
})();