(function () {
    coffeeEngine.renderer.initilizeFileConversions = () => {
        //* We store what we need in RAM
        coffeeEngine.renderer.fileToTexture = (src) => {
            //Then we make our promise
            return new Promise((resolve, reject) => {
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

                            fileReader.onload = () => {
                                console.log(fileReader.result.replace("data:application/octet-stream","data:image/svg+xml;charset=utf-8"));

                                const trackedImage = new Image();
    
                                trackedImage.onload = () => {
                                    coffeeEngine.renderer.textureStorage[src] = coffeeEngine.renderer.daveshade.createTexture(trackedImage);
                                    resolve(coffeeEngine.renderer.textureStorage[src]);
                                };
    
                                trackedImage.onerror = () => {
                                    reject("error loading image");
                                };
    
                                trackedImage.src = fileReader.result.replace("data:application/octet-stream","data:image/svg+xml;charset=utf-8");
                            }

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
                    coffeeEngine.renderer.shaderStorage[src] = coffeeEngine.renderer.mainShaders[src.replace("coffee:/","").replace(".glsl","")];
                    resolve(coffeeEngine.renderer.shaderStorage[src]);
                    return;
                }

                const fileReader = new FileReader();

                //When our file loads we get our shader to compile
                fileReader.onload = () => {
                    const vertex = DaveShade.findFunctionInGLSL(fileReader.result,"vertex");
                    const frag = DaveShade.findFunctionInGLSL(fileReader.result,"fragment");

                    const compiledVert = coffeeEngine.renderer.mainShaders.basis.vertex.src.replace("void vertex() {}",vertex || "void vertex() {}");
                    const compiledFrag = coffeeEngine.renderer.mainShaders.basis.fragment.src.replace("void fragment() {}",frag || "void fragment() {}");

                    coffeeEngine.renderer.shaderStorage[src] = coffeeEngine.renderer.daveshade.createShader(compiledVert,compiledFrag);
                    
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
                        const materialData = JSON.parse(fileReader.result) || {shader:"coffee:/basis.glsl", params:{}};

                        coffeeEngine.renderer.materialStorage[src] = new coffeeEngine.renderer.material(materialData.shader || "coffee:/basis", materialData.params || {});
                        
                        resolve(coffeeEngine.renderer.materialStorage[src]);
                    };

                    project
                        .getFile(src)
                        .then((file) => {
                            fileReader.readAsText(file)
                        })
                        .catch(() => {
                            reject("File doesn't exist");
                        });
                }
            });
        };

        //Add our preloading function
        coffeeEngine.preloadFunctions["shaders"] = {function:coffeeEngine.renderer.fileToShader, storage:coffeeEngine.renderer.shaderStorage};
        coffeeEngine.preloadFunctions["materials"] = {function:coffeeEngine.renderer.fileToMaterial, storage:coffeeEngine.renderer.materialStorage};
        coffeeEngine.preloadFunctions["textures"] = {function:coffeeEngine.renderer.fileToTexture, storage:coffeeEngine.renderer.textureStorage};
    };
})();
