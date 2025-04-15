(function () {
    coffeeEngine.renderer.initilizeFileConversions = () => {
        //* We store what we need in RAM
        coffeeEngine.renderer.fileToTexture = (src) => {
            //Then we make our promise
            return new Promise((resolve, reject) => {
                if (!src) {
                    reject();
                    return;
                }
                
                if (coffeeEngine.renderer.textureStorage[src]) {
                    resolve(coffeeEngine.renderer.textureStorage[src]);
                    return;
                }

                coffeeEngine.renderer.textureStorage[src] = {};
                let fileExtension = src.split(".");
                fileExtension = fileExtension[fileExtension.length - 1];

                project
                    .getFile(src)
                    .then((file) => {
                        //VVV SVG VVV
                        if (fileExtension.toLowerCase() == "svg") {
                            const fileReader = new FileReader();

                            //Load the SVG
                            fileReader.onload = () => {
                                const trackedImage = new Image();

                                trackedImage.onload = () => {
                                    coffeeEngine.renderer.textureStorage[src] = coffeeEngine.renderer.daveshade.createTexture(trackedImage);
                                    resolve(coffeeEngine.renderer.textureStorage[src]);
                                };

                                trackedImage.onerror = () => {
                                    reject("error loading image");
                                };

                                trackedImage.src = fileReader.result.replace("data:application/octet-stream", "data:image/svg+xml;charset=utf-8");
                            };

                            fileReader.readAsDataURL(file);
                        }
                        //VVV Bitmap VVV
                        else {
                            const trackedImage = new Image();

                            trackedImage.onload = () => {
                                coffeeEngine.renderer.textureStorage[src] = coffeeEngine.renderer.daveshade.createTexture(trackedImage);
                                resolve(coffeeEngine.renderer.textureStorage[src]);
                            };

                            trackedImage.onerror = () => {
                                reject("error loading image");
                            };

                            trackedImage.src = window.URL.createObjectURL(file);
                        }
                    })
                    .catch((exception) => {
                        reject("file doesn't exist");
                    });
            });
        };

        coffeeEngine.renderer.fileToShader = (src, override) => {
            //Then we make our promise
            return new Promise((resolve, reject) => {
                if (!src) {
                    reject();
                    return;
                }

                //If we want to override the shader override.
                if (!override) {
                    //Make sure we allocate this in storage first
                    if (coffeeEngine.renderer.shaderStorage[src]) {
                        resolve(coffeeEngine.renderer.shaderStorage[src]);
                        return;
                    }
                    coffeeEngine.renderer.shaderStorage[src] = {};
                }

                if (src.startsWith("coffee:/")) {
                    coffeeEngine.renderer.shaderStorage[src] = coffeeEngine.renderer.mainShaders[src.replace("coffee:/", "").replace(".glsl", "")];
                    resolve(coffeeEngine.renderer.shaderStorage[src]);
                    return;
                }

                const fileReader = new FileReader();

                //When our file loads we get our shader to compile
                fileReader.onload = () => {
                    if (!override) {
                        coffeeEngine.renderer.shaderStorage[src] = coffeeEngine.renderer.compilePBRshader(fileReader.result);
                    }
                    else {
                        const shader = coffeeEngine.renderer.compilePBRshader(fileReader.result);
                        if (coffeeEngine.renderer.shaderStorage[src]) {
                            //Check to make sure our status is good
                            if (shader.status == 0) return;

                            //If so dispose
                            if (coffeeEngine.renderer.shaderStorage[src].dispose) coffeeEngine.renderer.shaderStorage[src].dispose();

                            //Replace the shader
                            for (let key in shader) {
                                coffeeEngine.renderer.shaderStorage[src][key] = shader[key];
                            }
                        }
                        else coffeeEngine.renderer.shaderStorage[src] = shader;
                    }

                    resolve(coffeeEngine.renderer.shaderStorage[src]);
                };

                project
                    .getFile(src)
                    .then((file) => {
                        fileReader.readAsText(file);
                    })
                    .catch(() => {
                        delete coffeeEngine.renderer.shaderStorage[src];
                        reject("File does not exist");
                    });
            });
        };

        coffeeEngine.renderer.fileToMaterial = (src) => {
            //Then we make our promise
            return new Promise((resolve, reject) => {
                if (!src) {
                    reject();
                    return;
                }
                
                //Make sure we allocate this in storage first
                if (coffeeEngine.renderer.materialStorage[src]) {
                    resolve(coffeeEngine.renderer.materialStorage[src]);
                    return;
                }
                coffeeEngine.renderer.materialStorage[src] = {};

                //Hardcoding this for funsies
                if (src == "coffee:/default.material") {
                    coffeeEngine.renderer.materialStorage[src] = coffeeEngine.renderer.defaultMaterial;
                    resolve(coffeeEngine.renderer.defaultMaterial);
                } else {
                    const fileReader = new FileReader();

                    //When our file loads we get our shader to compile
                    fileReader.onload = () => {
                        const materialData = JSON.parse(fileReader.result) || { shader: "coffee:/basis.glsl", params: {} };

                        coffeeEngine.renderer.materialStorage[src] = new coffeeEngine.renderer.material(materialData.shader || "coffee:/basis", materialData.params || {});

                        resolve(coffeeEngine.renderer.materialStorage[src]);
                    };

                    project
                        .getFile(src)
                        .then((file) => {
                            fileReader.readAsText(file);
                        })
                        .catch(() => {
                            reject("File doesn't exist");
                        });
                }
            });
        };

        //Add our preloading function
        coffeeEngine.preloadFunctions["shaders"] = { function: coffeeEngine.renderer.fileToShader, storage: coffeeEngine.renderer.shaderStorage };
        coffeeEngine.preloadFunctions["materials"] = { function: coffeeEngine.renderer.fileToMaterial, storage: coffeeEngine.renderer.materialStorage };
        coffeeEngine.preloadFunctions["textures"] = { function: coffeeEngine.renderer.fileToTexture, storage: coffeeEngine.renderer.textureStorage };
    };
})();
