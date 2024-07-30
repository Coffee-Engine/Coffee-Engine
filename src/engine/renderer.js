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
                    gl_FragColor = v_color;//texture2D(u_texture, v_texCoord) * v_color;
                }
                `
      ),
      //lit:coffeeEngine.renderer.daveshade.createShader()
    };
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
