uniform sampler2D u_texture; //?HINT: Default_WHITE

void fragment() {
    COLOR = texture(u_texture,UV);
    ROUGHNESS = 1.0;
    SPECULAR = 1.0;
}