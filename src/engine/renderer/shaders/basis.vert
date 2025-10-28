#version 300 es
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