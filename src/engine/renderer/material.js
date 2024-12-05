(function () {
    coffeeEngine.renderer.initilizeMaterials = () => {
        //? what does this do exactly?
        //* It stores material data. thats it;
        coffeeEngine.renderer.material = class {
            constructor(shader, params) {
                //Internal shaders
                console.log(shader);
                if (shader.startsWith("coffee:/")) {
                    //Remove the coffee predesessor, and get the default shader
                    this.shader = coffeeEngine.renderer.mainShaders[shader.replace("coffee:/", "")];
                    console.log(shader.replace("coffee:/", ""));
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
                    Object.keys(this.params).forEach((key) => {
                        this.shader.uniforms[key] = this.params[key];
                    });
                }
            }
        };

        coffeeEngine.renderer.defaultMaterial = new coffeeEngine.renderer.material("coffee:/basis", { COLOR: [0, 1, 1, 1] });
    };
})();
