#version 300 es
precision highp float;

in vec2 screenUV;
in vec2 projectionMult;
in vec3 forward;
in vec3 right;
in vec3 up;

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
    //Our position on the sky sphere
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
    o_matAtr = vec4(0,0,0,1);
    o_position = vec4(SkySphere,1);
    o_normal = vec4(0);
    o_OID = vec4(0,0,0,1);
}