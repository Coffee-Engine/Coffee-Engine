(function () {
    //Just set up the renderer. Not much to do here.
    coffeeEngine.renderer.create = (canvas) => {
        const renderer = coffeeEngine.renderer;
        renderer.canvas = canvas;
        
        //Firefox's blending is wierd
        renderer.daveshade = DaveShade.createInstance(renderer.canvas, { preserveDrawingBuffer: true, alpha: true, premultipliedAlpha: true, blendFunc: ["FUNC_ADD", "ONE", "ONE_MINUS_SRC_ALPHA"] });
        const daveshadeInstance = renderer.daveshade;

        renderer.drawBuffer = daveshadeInstance.createFramebuffer(renderer.canvas.width, renderer.canvas.height, [
            //Colors
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            //Material Attributes
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            //Emission
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            //Position
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            //Normal
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            DaveShade.RENDERBUFFER_TYPES.DEPTH,
        ]);

        daveshadeInstance.useZBuffer(true);

        renderer.cameraData = {
            position: new coffeeEngine.vector3(0, 0, 0),

            set transform(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_camera) shader.uniforms.u_camera.value = value;
                });
                
                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;
                    
                    if (shader.uniforms.u_camera) shader.uniforms.u_camera.value = value;
                });
                renderer.cameraData.storedTransform = value;
            },
            get transform() {
                return renderer.cameraData.storedTransform;
            },
            set projection(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_projection) shader.uniforms.u_projection.value = value;
                });
                
                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;
                    
                    if (shader.uniforms.u_projection) shader.uniforms.u_projection.value = value;
                });
                renderer.cameraData.storedProjection = value;
            },
            get projection() {
                return renderer.cameraData.storedProjection;
            },
            set res(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_res) shader.uniforms.u_res.value = value;
                });
                
                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;
                    
                    if (shader.uniforms.u_res) shader.uniforms.u_res.value = value;
                });
                renderer.cameraData.storedRes = value;
            },
            get res() {
                return renderer.cameraData.storedRes;
            },
            set aspectRatio(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_aspectRatio) shader.uniforms.u_aspectRatio.value = value;
                });

                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;
                    
                    if (shader.uniforms.u_aspectRatio) shader.uniforms.u_aspectRatio.value = value;
                });
                renderer.cameraData.storedAspect = value;
            },
            get aspectRatio() {
                return renderer.cameraData.storedAspect;
            },

            //Because orthographic projection wouldn't like me
            set wFactor(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_wFactor) shader.uniforms.u_wFactor.value = value;
                });

                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;
                    
                    if (shader.uniforms.u_wFactor) shader.uniforms.u_wFactor.value = value;
                });
                renderer.cameraData.storedWFactor = value;
            },
            get wFactor() {
                return renderer.cameraData.storedWFactor;
            },

            storedTransform: coffeeEngine.matrix4.identity(),
            unflattenedTransform: coffeeEngine.matrix4.identity(),
            storedProjection: coffeeEngine.matrix4.identity(),
            storedRes: [480, 360],
            storedAspect: 1,
            storedWFactor: [1, 1],
            cameraRotationEul: new coffeeEngine.vector3(0, 0, 0)
        };

        renderer.mainShaders = {
            basis:daveshadeInstance.createShader(
                //Vertex
                `#version 300 es
                precision highp float;

                //SHADER DEFINED UNIFORMS
    
                in vec4 a_position;
                in vec4 a_color;
                in vec3 a_normal;
                in vec2 a_texCoord;
    
                out vec4 v_color;
                out vec3 v_position;
                out vec3 v_normal;
                out vec2 v_texCoord;
    
                uniform mat4 u_model;
                uniform mat4 u_projection;
                uniform mat4 u_camera;
                uniform vec2 u_wFactor;
                uniform float u_aspectRatio;
                uniform float u_time;

                vec3 POSITION;
                vec4 COLOR;
                vec3 NORMAL;
                vec2 UV;

                void vertex() {}
    
                void main()
                {
                    //Our passed in attriubtes
                    //These are the variables we allow the user to modify
                    POSITION = a_position.xyz;
                    COLOR = a_color;
                    NORMAL = a_normal;
                    UV = a_texCoord;

                    //Call our user input
                    //If there is none, we return the mesh input 1-1
                    vertex();

                    //Then we pass them to the fragment shader
                    v_color = COLOR;
                    v_normal = (vec4(NORMAL,0) * u_model).xyz;
                    v_texCoord = UV;
    
                    //Transform my stuff!
                    gl_Position = (vec4(POSITION,1) * u_model * u_camera) * u_projection;
                    v_position = (vec4(POSITION,1) * u_model).xyz;

                    //W manipulation... wait not in that way
                    gl_Position.xy *= mix(gl_Position.z, 1.0, u_wFactor.x);
                    gl_Position.xy /= u_wFactor.y;
                    gl_Position.w = gl_Position.z;
                    gl_Position -= vec4(0,0,1,0);
                    gl_Position.x /= u_aspectRatio;
                }
                `,
                //Fragment
                `#version 300 es
                precision highp float;

                //SHADER DEFINED UNIFORMS
    
                in vec4 v_color;
                in vec3 v_position;
                in vec3 v_normal;
                in vec2 v_texCoord;

                layout (location = 0) out vec4 o_color;
                layout (location = 1) out vec4 o_matAtr;
                layout (location = 2) out vec4 o_emission;
                layout (location = 3) out vec4 o_position;
                layout (location = 4) out vec4 o_normal;

                uniform vec4 u_colorMod;
                uniform mat4 u_model;
                uniform mat4 u_projection;
                uniform mat4 u_camera;
                uniform vec2 u_wFactor;
                uniform float u_aspectRatio;
                uniform float u_time;

                vec4 COLOR;
                vec3 EMISSION;
                vec3 NORMAL;
                vec2 UV;
                float ROUGHNESS;
                float SPECULAR;
                float LIGHT_AFFECTION;
                float ALPHA_GLOW;

                void fragment() {}
                
                void main()
                {
                    //Set our variables
                    LIGHT_AFFECTION = 1.0;
                    COLOR = v_color;
                    EMISSION = vec3(0);
                    ROUGHNESS = 0.0;
                    SPECULAR = 0.0;
                    ALPHA_GLOW = 0.0;
                    UV = v_texCoord;
                    NORMAL = v_normal;

                    //Call our user function
                    fragment();

                    NORMAL = normalize(NORMAL);

                    //Then the rest of our calculations
                    o_color = COLOR * u_colorMod;
                    if (o_color.w == 0.0 || u_colorMod.w == 0.0) {
                        discard;
                    }

                    //Let the user do additive if they are 𝓐𝓓𝓓𝓘𝓒𝓣𝓘𝓥𝓔
                    o_matAtr = vec4(ROUGHNESS,SPECULAR,LIGHT_AFFECTION,o_color.w);
                    o_emission = vec4(EMISSION,o_color.w);
                    o_position = vec4(v_position,1);
                    o_normal = vec4(NORMAL,o_color.w);

                    o_color.xyz *= mix(o_color.w,1.0,ALPHA_GLOW);
                    o_matAtr *= o_color.w;
                    o_emission *= o_color.w;
                    o_normal *= o_color.w;
                }
                `
            ),
            skyplane:daveshadeInstance.createShader(
                //Vertex
                `#version 300 es
                precision highp float;
    
                in vec4 a_position;
    
                void main()
                {    
                    //Transform my stuff!
                    gl_Position = a_position;
                }
                `,
                //Fragment
                `#version 300 es
                precision highp float;

                uniform mat4 u_camera;
                uniform mat4 u_projection;
                uniform vec2 u_res;

                uniform vec3 horizonColor;
                uniform vec3 skyColor;
                uniform vec3 groundColor;
                uniform vec3 centerColor;

                layout (location = 0) out vec4 o_color;
                layout (location = 1) out vec4 o_matAtr;
                layout (location = 2) out vec4 o_emission;
                layout (location = 3) out vec4 o_position;
                layout (location = 4) out vec4 o_normal;
                
                void main()
                {
                    vec2 screenUV = gl_FragCoord.xy / u_res;
                    mat4 mixed = u_camera; //* u_projection;
                    vec3 right = vec3(mixed[0][0],mixed[0][1],mixed[0][2]);
                    vec3 up = vec3(mixed[1][0],mixed[1][1],mixed[1][2]);
                    vec3 forward = vec3(mixed[2][0],mixed[2][1],mixed[2][2]);

                    screenUV -= vec2(0.5);

                    //Our position on the sky sphere
                    //We also need to make sure our sky sphere adjusts properly
                    vec2 projectionMult = vec2(u_projection[0][0] * (u_res.x/u_res.y) * 2.0, u_projection[1][1] * 2.0);
                    vec3 SkySphere = normalize(forward + ((right * screenUV.x) * projectionMult.x) + ((up * screenUV.y) * projectionMult.y));
                    if (SkySphere.y < 0.0) {
                        //Inverse the Y
                        SkySphere.y = -SkySphere.y;
                        o_color = vec4(mix(groundColor,centerColor,SkySphere.y),1);
                    }
                    else {
                        o_color = vec4(mix(horizonColor,skyColor,SkySphere.y),1);
                    }

                    o_color.w = 1.0;
                    o_emission = vec4(0);
                    o_matAtr = vec4(0);
                    o_position = vec4(1);
                    o_normal = vec4(0);
                }
                `
            ),
            mainPass:daveshadeInstance.createShader(
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
    
                uniform sampler2D u_color;
                uniform sampler2D u_materialAttributes;
                uniform sampler2D u_emission;
                uniform sampler2D u_position;
                uniform sampler2D u_normal;

                uniform mat4 u_lights[64];
                uniform float u_lightCount;

                uniform vec3 u_sunDir;
                uniform vec3 u_sunColor;
                uniform vec3 u_ambientColor;

                uniform vec2 u_res;
                
                void main()
                {
                    vec2 screenUV = gl_FragCoord.xy / u_res;
                    vec4 matAttributes = texture2D(u_materialAttributes, screenUV);
                    vec3 position = texture2D(u_position, screenUV).xyz;
                    vec3 normal = normalize(texture2D(u_normal,screenUV).xyz);

                    gl_FragColor = texture2D(u_color,screenUV) + texture2D(u_emission,screenUV);
                    if (gl_FragColor.w > 1.0) {
                        gl_FragColor.w = 1.0;
                    }

                    vec3 lightColor = u_ambientColor;

                    if (matAttributes.z > 0.0) {
                        lightColor += u_sunColor * dot(normal, u_sunDir);

                        for (int i=0;i<64;i++) {
                            if (i >= int(u_lightCount)) {
                                break;
                            }

                            mat4 light = u_lights[i];
                            vec3 color = vec3(light[1][0],light[1][1],light[1][2]);
                            vec3 relative = vec3(position.x - light[0][0], position.y - light[0][1], position.z - light[0][2]);
                            vec3 calculated = color * ((light[0][3] / 2.0) / sqrt(pow(relative.x,2.0) + pow(relative.y,2.0) + pow(relative.z, 2.0)));
                            lightColor.xyz += calculated * ((dot(normal,-relative) * 0.5) + 0.5);
                        }

                        gl_FragColor.xyz *= mix(vec3(1.0),lightColor,matAttributes.z);
                    }
                }
                `
            ),
        };

        renderer.compilePBRshader = (shaderCode) => {
            const vertex = DaveShade.findFunctionInGLSL(shaderCode,"vertex");
            const frag = DaveShade.findFunctionInGLSL(shaderCode,"fragment");
            const uniforms = shaderCode.replace(vertex,"").replace(frag,"");

            const compiledVert = coffeeEngine.renderer.mainShaders.basis.vertex.src.replace("//SHADER DEFINED UNIFORMS",uniforms).replace("void vertex() {}",vertex || "void vertex() {}");
            const compiledFrag = coffeeEngine.renderer.mainShaders.basis.fragment.src.replace("//SHADER DEFINED UNIFORMS",uniforms).replace("void fragment() {}",frag || "void fragment() {}");

            return daveshadeInstance.createShader(compiledVert,compiledFrag);
        }

        renderer.textureStorage = {};
        renderer.shaderStorage = {};
        renderer.materialStorage = {};

        renderer.initilizeBaseShaders(renderer);
        renderer.initilizeFileConversions();
        renderer.initilizeMaterials();
        renderer.initilizeShapes();
        renderer.initilizeDebugSprites(renderer);

        renderer.drawBuffer.resize(renderer.canvas.width,renderer.canvas.height);
        renderer.canvas.addEventListener("resize", () => {
        })

        return renderer;
    };

    coffeeEngine.renderer.dispose = () => {
        if (!coffeeEngine.renderer.canvas) return;
        coffeeEngine.renderer.canvas.parentElement.removeChild(coffeeEngine.renderer.canvas);
        coffeeEngine.renderer.daveshadeInstance.dispose();
    };
})();
