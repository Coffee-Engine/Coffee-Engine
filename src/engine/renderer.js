(function () {
    //Just set up the renderer. Not much to do here.
    coffeeEngine.renderer.create = (canvas) => {
        coffeeEngine.renderer.canvas = canvas;
        coffeeEngine.renderer.daveshade = DaveShade.createInstance(coffeeEngine.renderer.canvas, { preserveDrawingBuffer: true, alpha: true, premultipliedAlpha: false, blendFunc: ["FUNC_ADD", "ONE_MINUS_CONSTANT_ALPHA", "ONE_MINUS_SRC_ALPHA"] });
        coffeeEngine.renderer.daveshade.useZBuffer(true);

        coffeeEngine.renderer.cameraData = {
            set transform(value) {
                Object.values(coffeeEngine.renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_camera) shader.uniforms.u_camera.value = value;
                });
                coffeeEngine.renderer.cameraData.storedTransform = value;
            },
            get transform() {
                return coffeeEngine.renderer.cameraData.storedTransform;
            },
            set projection(value) {
                Object.values(coffeeEngine.renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_projection) shader.uniforms.u_projection.value = value;
                });
                coffeeEngine.renderer.cameraData.storedProjection = value;
            },
            get projection() {
                return coffeeEngine.renderer.cameraData.storedProjection;
            },
            set res(value) {
                Object.values(coffeeEngine.renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_res) shader.uniforms.u_res.value = value;
                });
                coffeeEngine.renderer.cameraData.storedRes = value;
            },
            get res() {
                return coffeeEngine.renderer.cameraData.storedRes;
            },
            set aspectRatio(value) {
                Object.values(coffeeEngine.renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_aspectRatio) shader.uniforms.u_aspectRatio.value = value;
                });
                coffeeEngine.renderer.cameraData.storedAspect = value;
            },
            get aspectRatio() {
                return coffeeEngine.renderer.cameraData.storedAspect;
            },

            //Because orthographic projection wouldn't like me
            set wFactor(value) {
                Object.values(coffeeEngine.renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_wFactor) shader.uniforms.u_wFactor.value = value;
                });
                coffeeEngine.renderer.cameraData.storedWFactor = value;
            },
            get wFactor() {
                return coffeeEngine.renderer.cameraData.storedWFactor;
            },

            storedTransform: coffeeEngine.matrix4.identity(),
            storedProjection: coffeeEngine.matrix4.identity(),
            storedRes: [480, 360],
            storedAspect: 1,
            storedWFactor: [1, 1],
        };

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
                varying vec3 v_position;
                varying float v_warp;
    
                uniform mat4 u_model;
                uniform mat4 u_projection;
                uniform mat4 u_camera;
                uniform vec2 u_wFactor;
                uniform float u_aspectRatio;
    
                uniform sampler2D u_texture;
    
                void main()
                {
                    //Our passed in attriubtes
                    v_color = a_color;
                    v_normal = a_normal;
                    v_texCoord = a_texCoord;
    
                    //Transform my stuff!
                    gl_Position = (a_position * u_model * u_camera) * u_projection;
                    v_position = a_position.xyz;

                    //W manipulation... wait not in that way
                    gl_Position.xy *= mix(gl_Position.z, 1.0, u_wFactor.x);
                    gl_Position.xy /= u_wFactor.y;
                    gl_Position.w = gl_Position.z;
                    gl_Position -= vec4(0,0,1,0);
                    gl_Position.x /= u_aspectRatio;

                    v_warp = gl_Position.w;
                }
                `,
                //Fragment
                `
                precision highp float;
    
                varying vec4 v_color;
                varying vec3 v_normal;
                varying vec2 v_texCoord;
                varying vec3 v_position;
                varying float v_warp;
    
                uniform sampler2D u_texture;
                uniform vec2 u_wFactor;
                uniform vec4 u_colorMod;
                
                void main()
                {
                    vec2 secondaryTexCoord = mix(v_texCoord / v_warp, v_texCoord, u_wFactor.x);
                    gl_FragColor = vec4(1) * u_colorMod;
                    //gl_FragColor = texture2D(u_texture, v_texCoord) * v_color * u_colorMod;

                    if (gl_FragColor.w == 0.0 || u_colorMod.w == 0.0) {
                        discard;
                    }

                    gl_FragColor.xyz *= gl_FragColor.w;
                }
                `
            ),
            solid: coffeeEngine.renderer.daveshade.createShader(
                //Vertex
                `
                precision highp float;
    
                attribute vec4 a_position;
                attribute vec4 a_color;
    
                varying vec4 v_color;
                varying vec3 v_position;
    
                uniform mat4 u_model;
                uniform mat4 u_projection;
                uniform mat4 u_camera;
                uniform vec2 u_wFactor;
                uniform float u_aspectRatio;
    
                void main()
                {
                    //Our passed in attriubtes
                    v_color = a_color;
    
                    //Transform my stuff!
                    gl_Position = (a_position * u_model * u_camera) * u_projection;
                    v_position = a_position.xyz;

                    //W manipulation... wait not in that way
                    gl_Position.xy *= mix(gl_Position.z, 1.0, u_wFactor.x);
                    gl_Position.xy /= u_wFactor.y;
                    gl_Position.w = gl_Position.z;
                    gl_Position -= vec4(0,0,1,0);
                    gl_Position.x /= u_aspectRatio;
                }
                `,
                //Fragment
                `
                precision highp float;
    
                varying vec4 v_color;
                varying vec3 v_position;
                uniform vec4 u_colorMod;
                
                void main()
                {
                    gl_FragColor = vec4(1) * u_colorMod;

                    if (gl_FragColor.w == 0.0 || u_colorMod.w == 0.0) {
                        discard;
                    }

                    gl_FragColor.xyz *= gl_FragColor.w;
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
            ),
            //lit:coffeeEngine.renderer.daveshade.createShader()
        };

        coffeeEngine.renderer.textureStorage = {};
        coffeeEngine.renderer.materialStorage = {};

        coffeeEngine.renderer.fileToTexture = (src) => {
            return new Promise((resolve, reject) => {
                if (coffeeEngine.renderer.textureStorage[src]) {
                    resolve(coffeeEngine.renderer.textureStorage[src]);
                    return;
                }

                project
                    .getFile(src)
                    .then((file) => {
                        const trackedImage = new Image();

                        trackedImage.onload = () => {
                            coffeeEngine.renderer.textureStorage[src] = coffeeEngine.renderer.daveshade.createTexture(trackedImage);
                            resolve(coffeeEngine.renderer.daveshade.createTexture(trackedImage));
                        };

                        trackedImage.onerror = () => {
                            reject("error loading image");
                        };

                        trackedImage.src = window.URL.createObjectURL(file);
                    })
                    .catch((exception) => {
                        reject("file doesn't exist");
                    });
            });
        };

        coffeeEngine.renderer.fileToMateial = (src) => {
            return new Promise((resolve,reject) => {
                //Hardcoding this for funsies
                if (src == "coffee:/default.material") {
                    resolve(coffeeEngine.renderer.defaultMaterial);
                }
                else {
                    project.getFile(src)
                    .then((file) => {

                    })
                    .catch(() => {
                        reject("File doesn't exist");
                    })
                }
            })
        }

        
        //? what does this do exactly?
        //* It stores material data. thats it;
        coffeeEngine.renderer.material = class {
            constructor(shader, params) {
                //Internal shaders
                if (shader.startsWith("coffee://")) {
                    //Remove the coffee predesessor, and get the default shader
                    this.shader = coffeeEngine.renderer.mainShaders[shader.replace("coffee://","")];
                }
                else {
                    //Get it from the path
                    coffeeEngine.renderer.shaderFrom(shader).then(shader => {
                        this.shader = shader;
                    });
                }
                this.shaderPath = shader;
                this.params = params;
            }

            use() {
                //Loop through our params and set the keys
                if (this.shader) {
                    Object.keys(this.params).forEach(key => {
                        this.shader.uniforms[key] = this.params[key];
                    });
                }
            }
        }

        coffeeEngine.renderer.defaultMaterial = new coffeeEngine.renderer.material("coffee://solid",{u_colorMod:[0,1,1,1]});

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
