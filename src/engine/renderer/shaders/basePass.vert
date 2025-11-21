#version 300 es
precision highp float;

in vec4 a_position;
in vec2 a_texCoord;

out vec2 screenUV;

void main()
{    
    //Transform my stuff!
    gl_Position = a_position;
    screenUV = a_texCoord;
    screenUV.y = -screenUV.y;
}