#version 300 es
precision highp float;

uniform sampler2D u_initial;
uniform sampler2D u_screen;
uniform int u_renderPass;

vec4 COLOR;
vec2 UV;

layout (location = 0) out vec4 o_color;

uniform vec2 u_res;
uniform float u_time;
uniform mat4 u_projection;
uniform mat4 u_camera;
uniform vec3 u_wFactor;
uniform float u_aspectRatio;

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
uniform vec3 u_cameraPosition;

//SHADER DEFINED UNIFORMS

void fragment() {}

void main() {
    UV = gl_FragCoord.xy / u_res;
    fragment();

    o_color = COLOR;
}