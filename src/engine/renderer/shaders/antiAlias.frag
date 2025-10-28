#version 300 es
precision highp float;

layout (location = 0) out vec4 o_color;

uniform sampler2D u_texture;
uniform vec2 u_res;
uniform int u_reductionAmount;

void main() {
    vec2 texCoord = gl_FragCoord.xy / u_res;
    vec2 stepSize = (1.0 / u_res) / float(u_reductionAmount);

    vec4 averageColor = vec4(0,0,0,0);

    for (int x=0; x<16; x++) {
        if (x>=u_reductionAmount) break;

        for (int y=0; y<16; y++) {
            if (y>=u_reductionAmount) break;

            //There we go
            vec2 sampleCoord = texCoord + (stepSize * vec2(x, y));
            sampleCoord.x = max(min(1.0, sampleCoord.x), 0.0);
            sampleCoord.y = max(min(1.0, sampleCoord.y), 0.0);

            averageColor += texture(u_texture, sampleCoord);
        }
    }

    //Average it out
    o_color = averageColor / float(u_reductionAmount * u_reductionAmount);
}