uniform sampler2D u_texture; //?HINT: Default_WHITE

void fragment() {
    COLOR = texture(u_texture,UV);
    LIGHT_AFFECTION = 0.0;
}