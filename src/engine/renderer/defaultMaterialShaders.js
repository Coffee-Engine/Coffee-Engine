(function () {
    coffeeEngine.renderer.initilizeDefaultShaders = (renderer) => {
        renderer.mainShaders.unlit = renderer.compilePBRshader(`
        uniform sampler2D u_texture; //?HINT: Default_WHITE
        void fragment() {
            COLOR = texture(u_texture,UV);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.editorCircle = renderer.compilePBRshader(`
        void fragment() {
            COLOR = mix(vec4(0.14117647058, 0.58823529411, 0.9294117647, 0.125), vec4(0),floor(length(UV - vec2(0.5,0.5)) * 2.0));
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.editorShape = renderer.compilePBRshader(`
        void fragment() {
            COLOR = vec4(0.14117647058, 0.58823529411, 0.9294117647, 0.125);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.lit = renderer.compilePBRshader(`
        uniform sampler2D u_texture; //?HINT: Default_WHITE
        void fragment() {
            COLOR = texture(u_texture,UV);
            ROUGHNESS = 1.0;
            SPECULAR = 1.0;
        }
        `);

        renderer.mainShaders.unlitSolid = renderer.compilePBRshader(`
        void fragment() {
            COLOR = vec4(1);
            LIGHT_AFFECTION = 0.0;
        }
        `);

        renderer.mainShaders.PBR = renderer.compilePBRshader(`
        #define is_PBR;
        uniform sampler2D Albedo; //?HINT: Default_WHITE
        uniform sampler2D NormalMap; //?HINT: Default_NORMAL
        uniform sampler2D SpecularMap; //?HINT: Default_BLACK
        uniform sampler2D RoughnessMap; //?HINT: Default_BLACK

        void fragment() {
            mat3 normalTransform = transpose(mat3(TANGENT,BITANGENT,NORMAL));
            COLOR = texture(Albedo, UV);
            NORMAL.xyz = (texture(NormalMap, UV).xyz + -0.5) * 2.0 * normalTransform;
            ROUGHNESS = texture(RoughnessMap, UV).x;
            SPECULAR = texture(SpecularMap, UV).x;
        }
        `);

        renderer.mainShaders.bloom = renderer.compilePBRshader(`
        #define is_post;
        #define passCount 2;

        uniform float Threshold;

        float weight[5] = float[5] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

        vec3 sampleBloom(sampler2D screen, vec2 SUV) {
            vec3 returned = texture(screen, SUV).xyz;
            returned -= Threshold;
        
            returned.x = max(0.0, returned.x);
            returned.y = max(0.0, returned.y);
            returned.z = max(0.0, returned.z);
        
            return returned;
        }

        void fragment() {
            COLOR = texture(u_screen, UV);
            vec2 screenStep = 1.0 / u_res;
        
            switch (u_renderPass) {
            case 0: {
                COLOR.w = 1.0;
                COLOR.xyz = sampleBloom(u_initial, UV) * weight[0];
                for(int i = 1; i < 5; ++i)
                {
                    vec2 SUV = UV + vec2(screenStep.x * float(i), 0);
                    SUV.x = min(1.0, SUV.x);
                    COLOR.xyz += sampleBloom(u_screen, SUV).xyz * weight[i];

                    SUV = UV - vec2(screenStep.x * float(i), 0);
                    SUV.x = max(0.0, SUV.x);
                    COLOR.xyz += sampleBloom(u_screen, SUV).xyz * weight[i];
                }
                break;
            }
            case 1: {
                COLOR.w = 1.0;
                COLOR.xyz = texture(u_screen, UV).xyz * weight[0];
                for(int i = 1; i < 5; ++i)
                {
                    vec2 SUV = UV + vec2(0, screenStep.y * float(i));
                    SUV.y = min(1.0, SUV.y);
                    COLOR.xyz += texture(u_screen, SUV).xyz * weight[i];

                    SUV = UV - vec2(0, screenStep.y * float(i));
                    SUV.y = max(0.0, SUV.y);
                    COLOR.xyz += texture(u_screen, SUV).xyz * weight[i];
                }
                
                COLOR.xyz += texture(u_initial, UV).xyz;
                break;
            }
            }
        }
        `)
    };
})();
