(function () {
    let shader = {uniforms:{}};

    const uniformTypes = {
        5126: {name: "", type: coffeeEngine.PropertyTypes.FLOAT},

        35664: {name: "", type: coffeeEngine.PropertyTypes.VEC2},
        35665: {name: "", type: coffeeEngine.PropertyTypes.VEC3},
        35666: {name: "", type: coffeeEngine.PropertyTypes.VEC4},

        35678: {name: "", type: coffeeEngine.PropertyTypes.FILE, fileType: "png,jpeg,jpg,webp,bmp,gif,svg" },
        35679: {name: "", type: coffeeEngine.PropertyTypes.FILE, fileType: "vox" },
    };

    //To exclude or not to exclude
    const exclude = [
        "u_model",
        "u_projection",
        "u_camera",
        "u_wFactor",
        "u_aspectRatio",
        "u_model",
        "u_colorMod",
        "u_res",
    ];

    const matEditor = ({panel, refreshListing}) => {
        return {
            getProperties:() => {
                //Get shaders
                let baseShaders = {};
                Object.keys(coffeeEngine.renderer.mainShaders).map((key) => {baseShaders[`${key}.glsl`] = key; return key});

                let uniforms = [];
                for (const uniform in shader.uniforms) {
                    if (exclude.includes(uniform)) continue;

                    //* Band aid and duct tape solution
                    uniforms.push(uniformTypes[shader.uniforms[uniform].type]);
                    uniforms[uniforms.length - 1].name = uniform
                }


                return [
                    {name:"shader", type: coffeeEngine.PropertyTypes.FILE, fileType: "glsl", systemRoot: { "/____NAMESPACE__IDENTIFIER____/":true, "coffee:": baseShaders, "project:": project.fileSystem }}
                ].concat(uniforms);
            },
            onPropertyChange:(property, value, node) => {
                if (property.name == "shader") {
                    coffeeEngine.renderer.fileToShader(value).then(value => {
                        shader = value;
                        refreshListing();
                    });
                }
                else {
                    node.params = node.params || {};
                    node.params[property.name] = value;

                    return true;
                }
            }
        }
    };

    editor.registerFilePropertyEditor("material", matEditor);
})();
