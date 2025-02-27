(function () {
    const typeConversions = { 
        35678: (param) => {
            const path = param[0];
            param[0] = null;
            coffeeEngine.renderer.fileToTexture(path).then((texture) => {
                param[0] = texture.texture;
            });
        }
    }

    coffeeEngine.renderer.initilizeMaterials = () => {
        //? what does this do exactly?
        //* It stores material data. thats it;
        coffeeEngine.renderer.material = class {

            constructor(shader, params) {
                this.shader = {};
                //Internal shaders
                if (shader.startsWith("coffee:/")) {
                    //Remove the coffee predesessor, and get the default shader
                    this.shader = coffeeEngine.renderer.mainShaders[shader.replace("coffee:/", "").replace(".glsl", "")];
                } else {
                    //Get it from the path
                    coffeeEngine.renderer.fileToShader(shader).then((shader) => {
                        this.shader = shader;
                    });
                }
                this.shaderPath = shader;
                this.params = params;

            }

            use() {
                //Loop through our params and set the keys
                if (this.shader) {
                    for (const key in this.params) {
                        if (typeof this.params[key][0] === "string") typeConversions[this.params[key][1]](this.params[key]);
                        else if (this.shader.uniforms[key] && this.params[key][0]) this.shader.uniforms[key].value = this.params[key][0];
                    }

                    if (this.shader.uniforms.u_time) this.shader.uniforms.u_time.value = coffeeEngine.timer;
                }
            }
        };

        coffeeEngine.renderer.defaultMaterial = new coffeeEngine.renderer.material("coffee:/basis", {});
    };
})();
