#version 300 es
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