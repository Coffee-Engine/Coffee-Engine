#version 300 es
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
    o_OID = vec4(0,0,0,1);
}