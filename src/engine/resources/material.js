(function() {
    //? what does this do exactly?
    //* It stores material data. thats it;
    coffeeEngine.material = class {
        constructor(shader, params) {
            //Internal shaders
            if (shader.startsWith("coffee://")) {
                //Remove the coffee predesessor, and get the default shader
                this.shader = coffeeEngine.renderer.mainShaders[shader.replace("coffee://"),""];

            }
            else {
                //Get it from the path
                coffeeEngine.renderer.shaderFrom(shader).then(shader => {
                    this.shader = shader;
                });
            }
            this.shaderPath = shader;
            this.params = params;
        }

        use() {
            //Loop through our params and set the keys
            if (this.shader) {
                Object.keys(this.params).forEach(key => {
                    this.shader.uniforms[key] = this.params[key];
                });
            }
        }
    }
})();