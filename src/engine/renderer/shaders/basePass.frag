#version 300 es
precision highp float;
layout (location = 0) out vec4 o_color;

uniform sampler2D u_texture;
uniform vec2 u_res;

void main() {
    o_color = texture(u_texture, gl_FragCoord.xy / u_res);
}