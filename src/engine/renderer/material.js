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

            constructor(shader, params, cullMode) {
                this.shader = {};
                this.cullMode = 2;
                //Internal shaders
                if (shader.startsWith("coffee:/")) {
                    //Remove the coffee predesessor, and get the default shader
                    this.shader = coffeeEngine.renderer.mainShaders[shader.replace("coffee:/", "").replace(".glsl", "")];
                } else {
                    //Get it from the path
                    coffeeEngine.renderer.fileToShader(shader).then((shader) => {
                        this.shader = shader;
                    }).catch(() => {});
                }
                this.shaderPath = shader;
                this.params = params;
                this.cullMode = Number(cullMode);
            }

            use() {
                //Loop through our params and set the keys
                if (this.shader) {
                    const filledKeys = Object.keys(this.params);
                    const nonFilledKeys = Object.keys(this.shader.uniforms).filter((key) => {return (!filledKeys.includes(key)) || (this.params[key][0] == null)});

                    coffeeEngine.renderer.daveshade.cullFace(this.cullMode);

                    for (const key in this.params) {
                        if (typeof this.params[key][0] === "string") typeConversions[this.params[key][1]](this.params[key]);
                        else if (this.shader.uniforms[key] && this.params[key][0]) this.shader.uniforms[key].value = this.params[key][0];
                    }

                    //Set non filled keys
                    for (const keyID in nonFilledKeys) {
                        const key = this.shader.uniforms[nonFilledKeys[keyID]];
                        switch (key.type) {
                            case 35678:
                                if (!key.hints) break;
                                if (coffeeEngine.renderer.sprites[key.hints[0]]) key.value = coffeeEngine.renderer.sprites[key.hints[0]].texture;
                                break;
                        
                            default:
                                break;
                        }
                    }

                    if (this.shader.uniforms.u_time) this.shader.uniforms.u_time.value = coffeeEngine.timer;
                }
            }
        };

        coffeeEngine.renderer.defaultMaterial = new coffeeEngine.renderer.material("coffee:/basis", {});
    };
})();
