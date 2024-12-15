(function () {
    let shader = {uniforms:{}};
    const matEditor = ({panel, refreshListing}) => {
        return {
            getProperties:() => {
                //Get shaders
                let baseShaders = {};
                Object.keys(coffeeEngine.renderer.mainShaders).map((key) => {baseShaders[`${key}.glsl`] = key; return key});

                let uniforms = [];
                for (const uniform in shader.uniforms) {
                    console.log(shader.uniforms[uniform]);
                }


                return [
                    {name:"shader", type: coffeeEngine.PropertyTypes.FILE, fileType: "glsl", systemRoot: { "/____NAMESPACE__IDENTIFIER____/":true, "coffee:": baseShaders, "project:": project.fileSystem }}
                ];
            },
            onPropertyChange:(property, value, node) => {
                if (property.name == "shader") {
                    coffeeEngine.renderer.fileToShader(value).then(value => {
                        shader = value;
                        console.log(shader);
                        refreshListing();
                    });
                }
                else {
                    node.params[property] = value;
                }
            }
        }
    };

    editor.registerFilePropertyEditor("material", matEditor);
})();
