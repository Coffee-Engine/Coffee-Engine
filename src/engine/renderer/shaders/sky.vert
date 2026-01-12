#version 300 es
precision mediump float;

in vec4 a_position;
in vec2 a_texCoord;

out vec2 screenUV;
out vec2 projectionMult;
out vec3 forward;
out vec3 right;
out vec3 up;

uniform mat4 u_camera;
uniform mat4 u_projection;
uniform vec2 u_res;

void main()
{    
    //Transform my sptuff!
    gl_Position = a_position;

    screenUV = a_texCoord - 0.5;
    screenUV.y = -screenUV.y;

    //Calculate camera variables
    mat4 mixed = u_camera; //* u_projection;
    right = vec3(mixed[0][0],mixed[0][1],mixed[0][2]);
    up = vec3(mixed[1][0],mixed[1][1],mixed[1][2]);
    forward = vec3(mixed[2][0],mixed[2][1],mixed[2][2]);

    //Then get projection
    projectionMult = vec2(u_projection[0][0] * (u_res.x/u_res.y) * 2.0, u_projection[1][1] * 2.0);
}