(function() {
    //Just set up the renderer. Not much to do here.
    coffeeEngine.renderer = {};
    coffeeEngine.renderer.canvas = document.getElementById("coffeeEngine-canvas");
    coffeeEngine.renderer.daveshade = DaveShade.createInstance(coffeeEngine.renderer.canvas);

    coffeeEngine.renderer.mainShaders = {
        unlit:coffeeEngine.renderer.daveshade.createShader(
            //Vertex
            `
            precision highp float;

            attribute highp vec4 a_position;
            attribute highp vec4 a_color;
            
            attribute highp vec3 a_normal;

            attribute highp vec2 a_texCoord;

            varying highp vec4 v_color;
            varying highp vec3 v_normal;
            varying highp vec2 v_texCoord;

            uniform highp mat4 u_model;
            uniform highp mat4 u_camera;

            uniform sampler2D u_texture;

            void main()
            {
                //Our passed in attriubtes
                v_color = a_color;
                v_normal = a_normal;
                v_texCoord = a_texCoord;

                //Transform my stuff!
                gl_Position = a_position * u_model * u_camera;
            }
            `,
            //Fragment
            `
            precision highp float;

            varying highp vec4 v_color;
            varying highp vec3 v_normal;
            varying highp vec2 v_texCoord;

            uniform sampler2D u_texture;
            
            void main()
            {
                gl_FragColor = texture2D(u_texture, v_texCoord) * v_color;
            }
            `),
        //lit:coffeeEngine.renderer.daveshade.createShader()
    }
})();