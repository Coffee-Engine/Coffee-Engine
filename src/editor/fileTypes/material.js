(function () {
    editor.registerFilePropertyEditor("material", class extends editor.filePropertyEditor {
        shader = {};

        materialMustHaves = [
            { name: "shader", translationKey: "engine.fileProperties.Shader.shader", type: coffeeEngine.PropertyTypes.FILE, fileType: "glsl", systemRoot: {} },
            { name: "cullMode", translationKey: "engine.fileProperties.Shader.cullMode", type: coffeeEngine.PropertyTypes.DROPDOWN, items: [
                { text: editor.language["engine.fileProperties.Shader.cullMode.neither"], value: 2 },
                { text: editor.language["engine.fileProperties.Shader.cullMode.front"], value: 1 },
                { text: editor.language["engine.fileProperties.Shader.cullMode.back"], value: 0 },
            ]},
            { name: "filtering", translationKey: "engine.nodeProperties.Sprite.filtering", type: coffeeEngine.PropertyTypes.DROPDOWN, items: [
                { text: editor.language["engine.nodeProperties.Sprite.filtering.nearest"], value: "NEAREST"},
                { text: editor.language["engine.nodeProperties.Sprite.filtering.linear"], value: "LINEAR"},
            ]},
        ];

        uniformTypesToCUGI = {
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
        
        getProperties(material) {
            return new Promise((resolve, reject) => {
                material.params = material.params || {};
                
                //Get shaders
                let baseShaders = {};
                Object.keys(coffeeEngine.renderer.mainShaders).map((key) => {
                    baseShaders[`${key}.glsl`] = key;
                    return key;
                });

                //Update system root
                this.materialMustHaves[0].systemRoot = { "/____NAMESPACE__IDENTIFIER____/": true, "coffee:": baseShaders, "project:": project.fileSystem };

                coffeeEngine.renderer.fileToShader(material.shader).then((shaderOBJ) => {
                    let uniforms = [];

                    for (const uniform in shaderOBJ.uniforms) {
                        if (coffeeEngine.renderer.engineUniforms.includes(uniform)) continue;

                        //* Non band-aid and duct-tape solution.
                        const uniformType = this.uniformTypesToCUGI[shaderOBJ.uniforms[uniform].type];
                        if (uniformType) uniforms.push({...uniformType, name: uniform, target: material.params, uniformType: shaderOBJ.uniforms[uniform].type });
                    }
                    resolve([...this.materialMustHaves, ...uniforms]);
                }).catch(() => {
                    resolve(this.materialMustHaves);
                }); 
            })
        }

        onPropertyChange(value, data) {
            if (!data) return;

            const { target, key } = data;
            const liveMaterial = coffeeEngine.renderer.materialStorage[this.path];
            switch (key) {
                case "shader":
                    //If its the shader that changes change the shader
                    coffeeEngine.renderer.fileToShader(value).then((shaderOBJ) => {
                        if (liveMaterial) liveMaterial.shader = shaderOBJ;
                        this.refreshListing();
                    })
                    //Make empty if no shader
                    .catch(() => {
                        this.shader = { uniforms: {} };
                        this.refreshListing();
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
                    target[key] = [value, data.uniformType];
                    
                    if (liveMaterial) {
                        if (!liveMaterial.params[key]) liveMaterial.params[key] = [value, data.uniformType];
                        else liveMaterial.params[key][0] = value;

                        liveMaterial.refresh();
                    }
                    break;
            }
        }
    });
})();
