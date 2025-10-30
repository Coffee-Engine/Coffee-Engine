#define is_post;
#define passCount 2;

uniform float Threshold;

float weight[5] = float[5] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);

vec3 sampleBloom(sampler2D screen, vec2 SUV) {
    vec3 returned = texture(screen, SUV).xyz;
    returned -= Threshold;

    returned.x = max(0.0, returned.x);
    returned.y = max(0.0, returned.y);
    returned.z = max(0.0, returned.z);

    return returned;
}

void fragment() {
    COLOR = texture(u_screen, UV);
    vec2 screenStep = 1.0 / u_res;

    switch (u_renderPass) {
    case 0: {
        COLOR.w = 1.0;
        COLOR.xyz = sampleBloom(u_initial, UV) * weight[0];
        for(int i = 1; i < 5; ++i)
        {
            vec2 SUV = UV + vec2(screenStep.x * float(i), 0);
            SUV.x = min(1.0, SUV.x);
            COLOR.xyz += sampleBloom(u_screen, SUV).xyz * weight[i];

            SUV = UV - vec2(screenStep.x * float(i), 0);
            SUV.x = max(0.0, SUV.x);
            COLOR.xyz += sampleBloom(u_screen, SUV).xyz * weight[i];
        }
        break;
    }
    case 1: {
        COLOR.w = 1.0;
        COLOR.xyz = texture(u_screen, UV).xyz * weight[0];
        for(int i = 1; i < 5; ++i)
        {
            vec2 SUV = UV + vec2(0, screenStep.y * float(i));
            SUV.y = min(1.0, SUV.y);
            COLOR.xyz += texture(u_screen, SUV).xyz * weight[i];

            SUV = UV - vec2(0, screenStep.y * float(i));
            SUV.y = max(0.0, SUV.y);
            COLOR.xyz += texture(u_screen, SUV).xyz * weight[i];
        }
        
        COLOR.xyz += texture(u_initial, UV).xyz;
        break;
    }
    }
}