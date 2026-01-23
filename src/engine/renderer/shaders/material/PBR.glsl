#define is_PBR;

uniform sampler2D Albedo; //?HINT: Default_WHITE
uniform sampler2D NormalMap; //?HINT: Default_NORMAL
uniform sampler2D SpecularMap; //?HINT: Default_BLACK
uniform sampler2D RoughnessMap; //?HINT: Default_BLACK

void fragment() {
    mat3 normalTransform = transpose(mat3(TANGENT,BITANGENT,NORMAL));
    NORMAL = (texture(NormalMap, UV).xyz - 0.5) * 2.0 * normalTransform;
    ROUGHNESS = texture(RoughnessMap, UV).x;
    SPECULAR = texture(SpecularMap, UV).x;
    COLOR = texture(Albedo, UV);
}