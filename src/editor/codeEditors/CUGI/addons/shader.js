(function() {
    CUGI.types["shader"] = (data, parameters) => {
        const { target, key } = data;
        target[key] = target[key] || { shader: "", parameters: {}};

        //Create the container
        const container = document.createElement("div");
        container.className = "CUGI-PropertyHolder CUGI-SubMenu";
        
        //Get our base shaders
        let baseShaders = {};
        Object.keys(coffeeEngine.renderer.mainShaders).map((key) => {
            baseShaders[`${key}.glsl`] = key;
            return key;
        });

        //Display our properties
        const display = async () => {
            container.innerHTML = "";

            const items = [
                {target: target[key], key: "shader", translationKey: "engine.fileProperties.Shader.shader", type: coffeeEngine.PropertyTypes.FILE, fileType: "glsl", systemRoot: { "/____NAMESPACE__IDENTIFIER____/": true, "coffee:": baseShaders, "project:": project.fileSystem }, onchange: (value) => {
                    console.log(value);
                    coffeeEngine.renderer.fileToShader(value).then((shader) => {
                        display();
                    });
                }}
            ]

            //Yeah
            coffeeEngine.renderer.fileToShader(target[key].shader).then((shader) => {
                console.log(shader);
                for (let uniform in shader.uniforms) {
                    const newParam = {...coffeeEngine.renderer.uniformTypesToCUGI[shader.uniforms[uniform].type], target: target[key].parameters, key: uniform}
                    items.push(newParam);
                }

                //Add the sub CUGI
                container.appendChild(CUGI.createList(items, parameters));
            })
            //Incase it doesn't exist anymore!
            .catch(() => {
                //Add the sub CUGI
                container.appendChild(CUGI.createList(items, parameters));
            });
        }

        display();

        //Return
        return container;
    }
})();