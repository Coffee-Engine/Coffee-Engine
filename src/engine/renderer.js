(function () {
    //Just set up the renderer. Not much to do here.
    coffeeEngine.renderer.create = (canvas) => {
        coffeeEngine.renderer.canvas = canvas;
        coffeeEngine.renderer.daveshade = DaveShade.createInstance(coffeeEngine.renderer.canvas);

        coffeeEngine.renderer.mainShaders = {
            unlit: coffeeEngine.renderer.daveshade.createShader(
                //Vertex
                `
                precision highp float;
    
                attribute vec4 a_position;
                attribute vec4 a_color;
                
                attribute vec3 a_normal;
    
                attribute vec2 a_texCoord;
    
                varying vec4 v_color;
                varying vec3 v_normal;
                varying vec2 v_texCoord;
    
                uniform mat4 u_model;
                uniform mat4 u_camera;
    
                uniform sampler2D u_texture;
    
                void main()
                {
                    //Our passed in attriubtes
                    v_color = a_color;
                    v_normal = a_normal;
                    v_texCoord = a_texCoord;
    
                    //Transform my stuff!
                    gl_Position = a_position * u_model * u_camera;
                    gl_Position.w = gl_Position.z;
                }
                `,
                //Fragment
                `
                precision highp float;
    
                varying vec4 v_color;
                varying vec3 v_normal;
                varying vec2 v_texCoord;
    
                uniform sampler2D u_texture;
                
                void main()
                {
                    gl_FragColor = texture2D(u_texture, v_texCoord) * v_color;
                }
                `
            ),
            skyplane: coffeeEngine.renderer.daveshade.createShader(
                //Vertex
                `
                precision highp float;
    
                attribute vec4 a_position;
    
                void main()
                {    
                    //Transform my stuff!
                    gl_Position = a_position;
                }
                `,
                //Fragment
                `
                precision highp float;
    
                uniform sampler2D u_texture;
                uniform mat4 u_camera;
                uniform vec2 u_res;
                
                void main()
                {
                    vec2 screenUV = gl_FragCoord.xy / u_res;
                    vec3 right = vec3(u_camera[0][0],u_camera[0][1],u_camera[0][2]);
                    vec3 up = vec3(u_camera[1][0],u_camera[1][1],u_camera[1][2]);
                    vec3 forward = vec3(u_camera[2][0],u_camera[2][1],u_camera[2][2]);

                    screenUV -= vec2(0.5);

                    //Our position on the sky sphere
                    vec3 SkySphere = normalize(forward + (right * screenUV.x) + (up * screenUV.y));
                    gl_FragColor = vec4(SkySphere,1);
                }
                `
            )
            //lit:coffeeEngine.renderer.daveshade.createShader()
        };

        return coffeeEngine.renderer;
    };

    coffeeEngine.renderer.dispose = () => {
        if (!coffeeEngine.renderer.canvas) return;
        coffeeEngine.renderer.canvas.parentElement.removeChild(coffeeEngine.renderer.canvas);
        coffeeEngine.renderer.daveshade.dispose();
        delete coffeeEngine.renderer.mainShaders;
        delete coffeeEngine.renderer.daveshade;
        delete coffeeEngine.renderer.canvas;
    };
})();
