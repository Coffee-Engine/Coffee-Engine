void fragment() {
    COLOR = mix(vec4(0.14117647058, 0.58823529411, 0.9294117647, 0.125), vec4(0),floor(length(UV - vec2(0.5,0.5)) * 2.0));
    LIGHT_AFFECTION = 0.0;
}