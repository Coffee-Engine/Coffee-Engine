#version 300 es
precision highp float;

layout (location = 0) out vec4 o_color;

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

uniform vec2 u_res;
uniform highp int u_fullBright;

vec3 viewToFrag;
vec3 F0;

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
    vec3 color = light[1].xyz;
    vec3 facingDirection = light[2].xyz;

    //General application calculations. Distance^Intensity so that the light gets funkier
    vec3 relative = position - light[0].xyz;
    vec3 halfway = viewToFrag;

    float distance = pow(length(relative),3.0);
    vec3 direction = normalize(relative);

    vec3 calculated = color * (light[0][3] / distance);
    calculated *= lightDot(normal,-direction, vec2(0.5, 0.75));

    //Now we calculate the final output
    if (facingDirection != vec3(1)) {
        float spottedDir = lightDot(direction, facingDirection, vec2(1.0, 0.5));
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

    return mix(o_color.xyz, fogData[1], mixAmount);
}

vec3 fogPBR(float distance, vec3 toPoint, mat3 fogData) {
    float mixAmount = min(1.0, //Make it clamp
        max(0.0, distance - fogData[0][2]) * //distance 
        fogData[0][1] //Falloff
    );

    float sunAmount = max(dot(toPoint, -u_sunDir), 0.0);
    vec3 sunEffection = mix(u_ambientColor, u_sunColor, pow(sunAmount, fogData[2][0]));

    return mix(o_color.xyz, fogData[1] * sunEffection, mixAmount);
}

void main()
{
    vec2 screenUV = gl_FragCoord.xy / u_res;
    vec4 matAttributes = texture(u_materialAttributes, screenUV);
    vec3 position = texture(u_position, screenUV).xyz;
    viewToFrag = normalize(u_cameraPosition - position);

    //if (matAttributes.z < 0.0) {
    //    position -= vec3(u_camera[3][0],u_camera[3][1],u_camera[3][2]);
    //}
    vec3 normal = normalize(texture(u_normal,screenUV).xyz);

    o_color = texture(u_color,screenUV);
    if (o_color.w > 1.0) {
        o_color.w = 1.0;
    }

    vec3 lightColor = u_ambientColor;

    if (matAttributes.z > 0.0 && u_fullBright == 0) {
        //Calculate F0
        F0 = mix(vec3(0.04), o_color.xyz, matAttributes.y);

        //Add the sun
        lightColor += u_sunColor * lightDot(normal, u_sunDir);

        for (int i=0;i<64;i++) {
            if (i >= u_lightCount) {
                break;
            }

            //Stuff required to calculate the end result
            mat4 light = u_lights[i];

            if (matAttributes.z > 1.0) {lightColor.xyz += calculateLightPBR(light, o_color.xyz, position, normal, matAttributes.xyz);}
            else {lightColor.xyz += calculateLight(light, position, normal);}
        }

        matAttributes.z -= ceil(matAttributes.z) - 1.0;
        o_color.xyz *= mix(vec3(1.0),lightColor,matAttributes.z);
    }

    o_color += texture(u_emission,screenUV);

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

        if (matAttributes.x < -0.1) { o_color.xyz = mix(o_color.xyz, fogColour, u_fogData[2][1]); }
        else { o_color.xyz = fogColour; }
    }
}