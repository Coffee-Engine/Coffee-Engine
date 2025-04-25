(function () {
    const typeConversions = { 
        35678: (param) => {
            const path = param[0];
            param[0] = null;
            coffeeEngine.renderer.fileToTexture(path).then((texture) => {
                param[0] = texture;
            });
        }
    }

    const specialHandling = {
        35678: (param, key, shader, material) => {
            //Set the texture filtering.
            if (param[0].setFiltering) param[0].setFiltering(DaveShade.filtering[material.filtering || "NEAREST"]);
            shader.uniforms[key].value = param[0].texture;
        }
    }

    coffeeEngine.renderer.initilizeMaterials = () => {
        //? what does this do exactly?
        //* It stores material data. thats it;
        coffeeEngine.renderer.material = class {

            constructor({shader, params, cullMode, filtering}) {
                shader = shader || "coffee:/basis"
                params = params || {};
                cullMode = (cullMode !== undefined) ? cullMode : 2;

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
                this.filtering = filtering || "NEAREST";
            }

            use() {
                //Loop through our params and set the keys
                if (this.shader) {
                    const filledKeys = Object.keys(this.params);
                    const nonFilledKeys = Object.keys(this.shader.uniforms).filter((key) => {return (!filledKeys.includes(key)) || (this.params[key][0] == null)});

                    coffeeEngine.renderer.daveshade.cullFace(this.cullMode);

                    for (const key in this.params) {
                        const param = this.params[key];
                        if (typeof param[0] === "string") typeConversions[param[1]](param);

                        //The actual setter
                        else if (this.shader.uniforms[key] && param[0]) {
                            if (specialHandling[param[1]]) specialHandling[param[1]](param, key, this.shader, this);
                            else this.shader.uniforms[key].value = param[0];
                        }
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

        coffeeEngine.renderer.defaultMaterial = new coffeeEngine.renderer.material("coffee:/basis", {}, 0);
    };
})();
