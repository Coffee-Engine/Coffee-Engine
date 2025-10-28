(function() {
    coffeeEngine.renderer.createBaseShaders = (daveshadeInstance) => {
        coffeeEngine.renderer.POSTPROCESS_BASE_VERTEX = `#version 300 es
        precision highp float;

        in vec4 a_position;

        void main()
        {    
            //Transform my stuff!
            gl_Position = a_position;
        }
        `;
        //Our base shaders
        coffeeEngine.renderer.mainShaders = {
            basis: daveshadeInstance.shaderFromURL("engine/renderer/shaders/basis.vert", "engine/renderer/shaders/basis.frag"),
            skyplane: daveshadeInstance.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/sky.frag"),
            mainPass: daveshadeInstance.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/mainPass.frag"),
            postBasis: daveshadeInstance.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/post.frag"),
            antiAliasPass: daveshadeInstance.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/antiAlias.frag"),
            viewportPass: daveshadeInstance.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/basePass.frag"),
        };
    }
})();