(function() {
    coffeeEngine.renderer.createBaseShaders = (daveshadeInstance) => {
        //Our base shaders
        coffeeEngine.renderer.mainShaders = {
            basis: daveshadeInstance.createShader(
                //Vertex
                `#version 300 es
                precision highp float;

                //SHADER DEFINED UNIFORMS
    
                in vec4 a_position;
                in vec4 a_color;
                in vec3 a_normal;
                in vec3 a_tangent;
                in vec3 a_bitangent;
                in vec2 a_texCoord;
    
                out vec4 v_color;
                out vec3 v_position;
                out vec3 v_normal;
                out vec3 v_tangent;
                out vec3 v_bitangent;
                out vec2 v_texCoord;
                out vec3 v_OID;
    
                uniform mat4 u_model;
                uniform mat4 u_projection;
                uniform mat4 u_camera;
                uniform vec3 u_wFactor;
                uniform float u_aspectRatio;
                uniform float u_time;
                uniform highp int u_objectID;

                vec3 POSITION;
                vec4 COLOR;
                vec3 NORMAL;
                vec3 TANGENT;
                vec3 BITANGENT;
                vec2 UV;

                void vertex() {}
    
                void main()
                {
                    //Our passed in attriubtes
                    //These are the variables we allow the user to modify
                    POSITION = a_position.xyz;
                    COLOR = a_color;
                    NORMAL = a_normal;
                    TANGENT = a_tangent;
                    BITANGENT = a_bitangent;
                    UV = a_texCoord;

                    //Call our user input
                    //If there is none, we return the mesh input 1-1
                    vertex();

                    //Then we pass them to the fragment shader
                    v_color = COLOR;
                    v_normal = normalize(vec4(NORMAL,0) * u_model).xyz;
                    v_tangent = normalize(vec4(TANGENT,0) * u_model).xyz;
                    v_bitangent = normalize(vec4(BITANGENT,0) * u_model).xyz;
                    v_texCoord = UV;
    
                    //Transform my stuff!
                    gl_Position = (vec4(POSITION,1) * u_model * u_camera) * u_projection;
                    v_position = (vec4(POSITION,1) * u_model).xyz;

                    //W manipulation... wait not in that way
                    gl_Position.w = mix(1.0, gl_Position.z, u_wFactor.x);
                    if (u_wFactor.x < 1.0) {
                        gl_Position.z /= 1000.0;
                        gl_Position.xy /= mix(u_wFactor.y, 1.0, u_wFactor.x);
                    }

                    gl_Position -= vec4(0,0,1,0);
                    gl_Position.x /= u_aspectRatio;

                    //Near plane manipulation
                    gl_Position.xy /= u_wFactor.z;
                    gl_Position.w /= u_wFactor.z;

                    v_OID.r = float(u_objectID)/255.0;
                    v_OID.g = float(u_objectID/256)/255.0;
                    v_OID.b = float(u_objectID/65536)/255.0;
                }
                `,
                //Fragment
                `#version 300 es
                precision highp float;

                //SHADER DEFINED UNIFORMS
    
                in vec4 v_color;
                in vec3 v_position;
                in vec3 v_normal;
                in vec3 v_tangent;
                in vec3 v_bitangent;
                in vec2 v_texCoord;
                in vec3 v_OID;

                layout (location = 0) out vec4 o_color;
                layout (location = 1) out vec4 o_matAtr;
                layout (location = 2) out vec4 o_emission;
                layout (location = 3) out vec4 o_position;
                layout (location = 4) out vec4 o_normal;
                layout (location = 5) out vec4 o_OID;

                uniform vec4 u_colorMod;
                uniform mat4 u_model;
                uniform mat4 u_projection;
                uniform mat4 u_camera;
                uniform vec3 u_wFactor;
                uniform float u_aspectRatio;
                uniform float u_time;

                vec4 COLOR;
                vec3 EMISSION;
                vec3 NORMAL;
                vec3 TANGENT;
                vec3 BITANGENT;
                vec2 UV;
                float ROUGHNESS;
                float SPECULAR;
                float LIGHT_AFFECTION;

                void fragment() {}
                
                void main()
                {

                    //Set our variables
                    LIGHT_AFFECTION = 1.0;
                    COLOR = v_color;
                    EMISSION = vec3(0);
                    ROUGHNESS = 0.0;
                    SPECULAR = 0.0;
                    UV = v_texCoord;
                    NORMAL = v_normal;
                    TANGENT = v_tangent;
                    BITANGENT = v_bitangent;

                    //Call our user function
                    fragment();

                    NORMAL = normalize(NORMAL);

                    //Then the rest of our calculations
                    o_color = COLOR * u_colorMod;
                    if (o_color.w <= 0.0125) {
                        discard;
                    }

                    #ifdef is_PBR
                    if (LIGHT_AFFECTION > 0.0) {
                        LIGHT_AFFECTION += 1.0;
                    }
                    #endif

                    //Let the user do additive if they are 𝓐𝓓𝓓𝓘𝓒𝓣𝓘𝓥𝓔
                    o_matAtr = vec4(ROUGHNESS,SPECULAR,LIGHT_AFFECTION,o_color.w);
                    o_emission = vec4(EMISSION, o_color.w);
                    o_position = vec4(v_position, o_color.w);
                    o_normal = vec4(NORMAL, o_color.w);

                    o_matAtr *= o_color.w;
                    o_emission *= o_color.w;
                    //o_normal *= o_color.w;

                    o_OID = vec4(v_OID,1.0);
                }
                `
            ),
            skyplane: daveshadeInstance.createShader(
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
                layout (location = 5) out vec4 o_OID;
                
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

                        //Inverse it back
                        SkySphere.y = -SkySphere.y;
                    }
                    else {
                        o_color = vec4(mix(horizonColor,skyColor,SkySphere.y),1);
                    }

                    o_color.w = 1.0;
                    o_emission = vec4(0);
                    o_matAtr = vec4(-1,0,0,1);
                    o_position = vec4(SkySphere,1);
                    o_normal = vec4(0);
                    o_OID.x = 0.0;
                    o_OID.y = 0.0;
                    o_OID.z = 0.0;
                    o_OID.w = 1.0;
                }
                `
            ),
            mainPass: daveshadeInstance.createShader(
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
                uniform int u_lightCount;

                uniform vec3 u_sunDir;
                uniform vec3 u_sunColor;
                uniform mat3 u_fogData;
                uniform vec3 u_ambientColor;
                uniform mat4 u_camera;
                uniform vec3 u_cameraPosition;

                uniform float u_antiAliasingRate;

                uniform vec2 u_res;
                uniform highp int u_fullBright;

                vec3 viewToFrag;
                vec3 F0;
                vec4 finalFrag;

                float lightDot(vec3 a,vec3 b) {
                    return min(1.0,max(0.0,dot(a,b)));
                }

                float lightDot(vec3 a,vec3 b, vec2 thinness) {
                    return min(1.0,max(0.0,dot(a,b) + thinness.x) * thinness.y);
                }

                vec3 fresnelSchlick(float cosTheta, vec3 F0)
                {
                    return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
                } 

                float DistributionGGX(vec3 N, vec3 H, float roughness)
                {
                    float a      = roughness*roughness;
                    float a2     = a*a;
                    float NdotH  = max(dot(N, H), 0.0);
                    float NdotH2 = NdotH*NdotH;
                    
                    float num   = a2;
                    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
                    denom = 3.1415962 * denom * denom;
                    
                    return num / denom;
                }

                float GeometrySchlickGGX(float NdotV, float roughness)
                {
                    float r = (roughness + 1.0);
                    float k = (r*r) / 8.0;

                    float num   = NdotV;
                    float denom = NdotV * (1.0 - k) + k;
                    
                    return num / denom;
                }
                float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
                {
                    float NdotV = max(dot(N, V), 0.0);
                    float NdotL = max(dot(N, L), 0.0);
                    float ggx2  = GeometrySchlickGGX(NdotV, roughness);
                    float ggx1  = GeometrySchlickGGX(NdotL, roughness);
                    
                    return ggx1 * ggx2;
                }

                vec3 calculateLightPBR(mat4 light, vec3 albedo, vec3 position, vec3 normal, vec3 matAttributes) {
                    vec3 lightPosition = vec3(light[0][0],light[0][1],light[0][2]);
                    vec3 lightColour = vec3(light[1][0],light[1][1],light[1][2]);
                    vec3 facingDirection = vec3(light[2][0],light[2][1],light[2][2]);

                    vec3 lightToFrag = normalize(lightPosition - position);
                    vec3 halfway = normalize(viewToFrag + lightToFrag);
                    float distance    = length(lightPosition - position);
                    float attenuation = light[0][3] / (distance * distance);
                    vec3 radiance     = lightColour * attenuation;        
                    
                    // cook-torrance brdf
                    float NDF = DistributionGGX(normal, halfway, matAttributes.x);        
                    float G   = GeometrySmith(normal, viewToFrag, lightToFrag, matAttributes.x);      
                    vec3 F    = fresnelSchlick(max(dot(matAttributes, viewToFrag), 0.0), F0);       
                    
                    vec3 kS = F;
                    vec3 kD = vec3(1.0) - kS;
                    kD *= 1.0 - matAttributes.y;	  
                    
                    vec3 numerator    = NDF * G * F;
                    float denominator = 4.0 * max(dot(normal, viewToFrag), 0.0) * max(dot(normal, lightToFrag), 0.0) + 0.0001;
                    vec3 specular     = numerator / denominator;  
                        
                    // add to outgoing radiance Lo
                    float NdotL = max(dot(normal, lightToFrag), 0.0);     
                    if (facingDirection != vec3(1)) {
                        float spottedDir = lightDot(normalize(-lightToFrag),facingDirection, vec2(1.0, 0.5));
                        if (spottedDir < 0.0) {
                            spottedDir = 0.0;
                        }
                    
                        spottedDir = pow(spottedDir, 2.0 * light[2][3]);

                        NdotL *= spottedDir;
                    }

                    return (kD * albedo / 3.1415962 + specular) * radiance * NdotL; 
                }

                vec3 calculateLight(mat4 light, vec3 position, vec3 normal) {
                    vec3 color = vec3(light[1][0],light[1][1],light[1][2]);
                    vec3 facingDirection = vec3(light[2][0],light[2][1],light[2][2]);

                    //General application calculations. Distance^Intensity so that the light gets funkier
                    vec3 relative = vec3(position.x - light[0][0], position.y - light[0][1], position.z - light[0][2]);
                    vec3 halfway = viewToFrag;

                    float distance = pow(length(relative),3.0);
                    vec3 calculated = color * (light[0][3] / distance);
                    calculated *= lightDot(normal,-normalize(relative), vec2(0.5, 0.75));

                    //Now we calculate the final output
                    if (facingDirection != vec3(1)) {
                        float spottedDir = lightDot(normalize(relative),facingDirection, vec2(1.0, 0.5));
                        if (spottedDir < 0.0) {
                            spottedDir = 0.0;
                        }
                    
                        spottedDir = pow(spottedDir, 2.0 * light[2][3]);

                        calculated *= spottedDir;
                    }

                    return calculated;
                }

                //Default fog
                vec3 fogDefault(float distance, vec3 toPoint, mat3 fogData) {
                    float mixAmount = min(1.0, //Make it clamp
                        max(0.0, distance - fogData[0][2]) * //distance 
                        fogData[0][1] //Falloff
                    );

                    return mix(finalFrag.xyz, fogData[1], mixAmount);
                }

                vec3 fogPBR(float distance, vec3 toPoint, mat3 fogData) {
                    float mixAmount = min(1.0, //Make it clamp
                        max(0.0, distance - fogData[0][2]) * //distance 
                        fogData[0][1] //Falloff
                    );

                    float sunAmount = max(dot(toPoint, -u_sunDir), 0.0);
                    vec3 sunEffection = mix(u_ambientColor, u_sunColor, pow(sunAmount, fogData[2][0]));

                    return mix(finalFrag.xyz, fogData[1] * sunEffection, mixAmount);
                }

                //CAA
                //Coffee Anti-Aliasing
                vec4 renderPixel(vec2 fragCoord) {
                    finalFrag = vec4(0,0,0,0);

                    vec2 screenUV = fragCoord / u_res;
                    vec4 matAttributes = texture2D(u_materialAttributes, screenUV);
                    vec3 position = texture2D(u_position, screenUV).xyz;
                    viewToFrag = normalize(u_cameraPosition - position);

                    //if (matAttributes.z < 0.0) {
                    //    position -= vec3(u_camera[3][0],u_camera[3][1],u_camera[3][2]);
                    //}
                    vec3 normal = normalize(texture2D(u_normal,screenUV).xyz);

                    finalFrag = texture2D(u_color,screenUV);
                    if (finalFrag.w > 1.0) {
                        finalFrag.w = 1.0;
                    }

                    vec3 lightColor = u_ambientColor;

                    if (matAttributes.z > 0.0 && u_fullBright == 0) {
                        //Calculate F0
                        F0 = mix(vec3(0.04), finalFrag.xyz, matAttributes.y);

                        //Add the sun
                        lightColor += u_sunColor * lightDot(normal, u_sunDir);

                        for (int i=0;i<64;i++) {
                            if (i >= u_lightCount) {
                                break;
                            }

                            //Stuff required to calculate the end result
                            mat4 light = u_lights[i];

                            if (matAttributes.z > 1.0) {lightColor.xyz += calculateLightPBR(light, finalFrag.xyz, position, normal, matAttributes.xyz);}
                            else {lightColor.xyz += calculateLight(light, position, normal);}
                        }

                        matAttributes.z -= ceil(matAttributes.z) - 1.0;
                        finalFrag.xyz *= mix(vec3(1.0),lightColor,matAttributes.z);
                    }

                    finalFrag += texture2D(u_emission,screenUV);

                    int fogType = int(u_fogData[0][0]);
                    //Handle sky plane
                    if (matAttributes.x < -0.1) {
                        position = (position * 1000.0) + u_cameraPosition;
                        viewToFrag = normalize(u_cameraPosition - position);
                    }

                    if (fogType > 0) {
                        float distance = length(position - u_cameraPosition);
                        vec3 fogColour = vec3(0);
                        if (fogType == 1) { fogColour = fogDefault(distance, viewToFrag, u_fogData); }
                        else if (fogType == 2) { fogColour = fogPBR(distance, viewToFrag, u_fogData); }
                        else if (fogType == 3) { fogColour = fogDefault((vec4(position,1) * u_camera).z, viewToFrag, u_fogData); }

                        if (matAttributes.x < -0.1) { finalFrag.xyz = mix(finalFrag.xyz, fogColour, u_fogData[2][1]); }
                        else { finalFrag.xyz = fogColour; }
                    }

                    return finalFrag;
                }
                
                void main()
                {
                    vec4 averageFrag = vec4(0,0,0,0);
                    vec2 antiAliasingStep = vec2((1.0/u_res.x)/u_antiAliasingRate, (1.0/u_res.y)/u_antiAliasingRate);
                    for (int x=0; x<=16; x++) {
                        if (x>=int(u_antiAliasingRate)) break;
                        for (int y=0; y<=16; y++) {
                            if (y>=int(u_antiAliasingRate)) break;
                            averageFrag += renderPixel(gl_FragCoord.xy + vec2(x,y));
                        }
                    }

                    gl_FragColor = averageFrag / (u_antiAliasingRate*u_antiAliasingRate);
                    gl_FragColor.w = min(1.0, gl_FragColor.w);
                }
                `
            ),
        };
    }
})();