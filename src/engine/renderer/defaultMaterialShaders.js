(function() {
    coffeeEngine.renderer.initilizeBaseShaders = (renderer) => {
        renderer.mainShaders.unlit = renderer.compilePBRshader(`
        void fragment() {
            COLOR = vec4(1);
        }
        `);
    }
})();