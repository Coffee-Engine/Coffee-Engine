(function () {
    let shader = { uniforms: {} };

    coffeeEngine.renderer.uniformTypesToCUGI = {
        35670: { name: "", type: coffeeEngine.PropertyTypes.BOOLEAN },

        5124: { name: "", type: coffeeEngine.PropertyTypes.INT },
        5125: { name: "", type: coffeeEngine.PropertyTypes.INT },
        5126: { name: "", type: coffeeEngine.PropertyTypes.FLOAT },

        35664: { name: "", type: coffeeEngine.PropertyTypes.VEC2 },
        35665: { name: "", type: coffeeEngine.PropertyTypes.VEC3 },
        35666: { name: "", type: coffeeEngine.PropertyTypes.VEC4 },

        35674: { name: "", type: "mat2" },
        35675: { name: "", type: "mat3" },
        35676: { name: "", type: "mat4" },

        35678: { name: "", type: coffeeEngine.PropertyTypes.FILE, fileType: "png,jpeg,jpg,webp,bmp,gif,svg" },
        35679: { name: "", type: coffeeEngine.PropertyTypes.FILE, fileType: "vox" },
    };

    //To exclude or not to exclude
    const exclude = ["u_model", "u_projection", "u_camera", "u_wFactor", "u_aspectRatio", "u_model", "u_colorMod", "u_res", "u_objectID", "u_time"];

    const matEditor = ({ panel, refreshListing, path }) => {
        return {
            getProperties: (material, initial) => {
                //Get shaders
                let baseShaders = {};
                Object.keys(coffeeEngine.renderer.mainShaders).map((key) => {
                    baseShaders[`${key}.glsl`] = key;
                    return key;
                });

                let uniforms = [];
                for (const uniform in shader.uniforms) {
                    if (exclude.includes(uniform)) continue;

                    //* Band aid and duct tape solution
                    uniforms.push(Object.assign({}, coffeeEngine.renderer.uniformTypesToCUGI[shader.uniforms[uniform].type]));
                    uniforms[uniforms.length - 1].name = uniform;
                }

                //Get our shader variables if this isn't our first rodeo
                if (initial) {
                    coffeeEngine.renderer.fileToShader(material.shader).then((shaderOBJ) => {
                        shader = shaderOBJ;
                        refreshListing();
                    }).catch(() => {
                        shader = { uniforms: {} };
                        refreshListing();
                    });
                }

                return [
                    { name: "shader", translationKey: "engine.fileProperties.Shader.shader", type: coffeeEngine.PropertyTypes.FILE, fileType: "glsl", systemRoot: { "/____NAMESPACE__IDENTIFIER____/": true, "coffee:": baseShaders, "project:": project.fileSystem } },
                    { name: "cullMode", translationKey: "engine.fileProperties.Shader.cullMode", type: coffeeEngine.PropertyTypes.DROPDOWN, items: [
                        { text: editor.language["engine.fileProperties.Shader.cullMode.neither"], value: 2 },
                        { text: editor.language["engine.fileProperties.Shader.cullMode.front"], value: 1 },
                        { text: editor.language["engine.fileProperties.Shader.cullMode.back"], value: 0 },
                    ]},
                    { name: "filtering", translationKey: "engine.nodeProperties.Sprite.filtering", type: coffeeEngine.PropertyTypes.DROPDOWN, items: [
                        { text: editor.language["engine.nodeProperties.Sprite.filtering.nearest"], value: "NEAREST"},
                        { text: editor.language["engine.nodeProperties.Sprite.filtering.linear"], value: "LINEAR"},
                    ]},
                ].concat(uniforms);
            },
            onPropertyChange: (value, data) => {
                const { target, key } = data;
                const liveMaterial = coffeeEngine.renderer.materialStorage[path];
                switch (key) {
                    case "shader":
                        //If its the shader that changes change the shader
                        coffeeEngine.renderer.fileToShader(value).then((shaderOBJ) => {
                            shader = shaderOBJ;
                            if (liveMaterial) liveMaterial.shader = shaderOBJ;
                            refreshListing();
                        })
                        //Make empty if no shader
                        .catch(() => {
                            shader = { uniforms: {} };
                            refreshListing();
                        });
                        break;

                    case "cullMode":
                        if (liveMaterial) liveMaterial.cullMode = Number(value);
                        break;

                    case "filtering":
                        if (liveMaterial) liveMaterial.filtering = value || "NEAREST";
                        break;
                
                    default:
                        //Just set the parameters for everything else
                        target.params = target.params || {};
                        target.params[key] = [value, shader.uniforms[key].type];
                        
                        if (liveMaterial) {
                            if (!liveMaterial.params[key]) liveMaterial.params[key] = [value, shader.uniforms[key].type];
                            else liveMaterial.params[key][0] = value;
                        }
                        break;
                }
            },
        };
    };

    editor.registerFilePropertyEditor("material", matEditor);
})();
