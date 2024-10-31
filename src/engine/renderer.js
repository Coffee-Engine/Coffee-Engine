(function () {
    //Just set up the renderer. Not much to do here.
    coffeeEngine.renderer.create = (canvas) => {
        coffeeEngine.renderer.canvas = canvas;
        coffeeEngine.renderer.daveshade = DaveShade.createInstance(coffeeEngine.renderer.canvas, {preserveDrawingBuffer: true});
        coffeeEngine.renderer.daveshade.useZBuffer(true);

        coffeeEngine.renderer.cameraData = {

            set transform(value) {
                Object.values(coffeeEngine.renderer.mainShaders).forEach(shader => {
                    if (shader.uniforms.u_camera) shader.uniforms.u_camera.value = value;
                });
                coffeeEngine.renderer.cameraData.storedTransform = value;
            },
            get transform() { return coffeeEngine.renderer.cameraData.storedTransform; },
            set projection(value) {
                Object.values(coffeeEngine.renderer.mainShaders).forEach(shader => {
                    if (shader.uniforms.u_projection) shader.uniforms.u_projection.value = value;
                });
                coffeeEngine.renderer.cameraData.storedProjection = value;
            },
            get projection() { return coffeeEngine.renderer.cameraData.storedProjection; },
            set res(value) {
                Object.values(coffeeEngine.renderer.mainShaders).forEach(shader => {
                    if (shader.uniforms.u_res) shader.uniforms.u_res.value = value;
                });
                coffeeEngine.renderer.cameraData.storedRes = value;
            },
            get res() { return coffeeEngine.renderer.cameraData.storedRes; },

            storedTransform:coffeeEngine.matrix4.identity(),
            storedProjection:coffeeEngine.matrix4.identity(),
            storedRes: [480,360]
        }

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
                uniform mat4 u_projection;
                uniform mat4 u_camera;
    
                uniform sampler2D u_texture;
    
                void main()
                {
                    //Our passed in attriubtes
                    v_color = a_color;
                    v_normal = a_normal;
                    v_texCoord = a_texCoord;
    
                    //Transform my stuff!
                    gl_Position = a_position * u_model * u_camera * u_projection;
                    gl_Position.w = gl_Position.z;
                    gl_Position -= vec4(0,0,1,0);
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

                    if (gl_FragColor.w == 0.0) {
                        discard;
                    }
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
                uniform mat4 u_projection;
                uniform vec2 u_res;
                
                void main()
                {
                    vec2 screenUV = gl_FragCoord.xy / u_res;
                    mat4 mixed = u_camera * u_projection;
                    vec3 right = vec3(mixed[0][0],mixed[0][1],mixed[0][2]);
                    vec3 up = vec3(mixed[1][0],mixed[1][1],mixed[1][2]);
                    vec3 forward = vec3(mixed[2][0],mixed[2][1],mixed[2][2]);

                    screenUV -= vec2(0.5);

                    //Our position on the sky sphere
                    vec3 SkySphere = normalize(forward + (right * screenUV.x) + (up * screenUV.y));
                    if (SkySphere.y < 0.0) {
                        //Inverse the Y
                        SkySphere.y = -SkySphere.y;
                        gl_FragColor = vec4(mix(vec3(0.290196078, 0.22745098, 0.192156863),vec3(0.2, 0.105882353, 0.0549019608),SkySphere.y),1);
                    }
                    else {
                        gl_FragColor = vec4(mix(vec3(0.77254902, 0.792156863, 0.909803922),vec3(0.403921569, 0.639215686, 0.941176471),SkySphere.y),1);
                    }
                }
                `
            )
            //lit:coffeeEngine.renderer.daveshade.createShader()
        };

        coffeeEngine.renderer.fileToTexture = (src) => {
            return new Promise((resolve,reject) => {
                const desiredFile = project.getFile(src);
                
                if (!desiredFile) reject("file doesn't exist");
                
                desiredFile[0].getFile().then((file) => {
                    const trackedImage = new Image();
                    
                    trackedImage.onload = () => {
                        resolve(coffeeEngine.renderer.daveshade.createTexture(trackedImage));
                    }

                    trackedImage.onerror = () => {
                        reject("error loading image");
                    }

                    trackedImage.src = window.URL.createObjectURL(file);
                });
            })
        }

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
