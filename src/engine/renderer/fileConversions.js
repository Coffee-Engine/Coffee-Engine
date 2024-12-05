(function() {
    coffeeEngine.renderer.initilizeFileConversions = () => {
        //* We store what we need in RAM
        coffeeEngine.renderer.fileToTexture = (src) => {
            //Make sure we allocate this in storage first
            if (coffeeEngine.renderer.textureStorage[src]) return;

            //Then we make our promise
            return new Promise((resolve, reject) => {
                if (coffeeEngine.renderer.textureStorage[src]) {
                    resolve(coffeeEngine.renderer.textureStorage[src]);
                    return;
                }
                
                coffeeEngine.renderer.textureStorage[src] = {};

                project
                    .getFile(src)
                    .then((file) => {
                        const trackedImage = new Image();

                        trackedImage.onload = () => {
                            coffeeEngine.renderer.textureStorage[src] = coffeeEngine.renderer.daveshade.createTexture(trackedImage);
                            resolve(coffeeEngine.renderer.textureStorage[src]);
                        };

                        trackedImage.onerror = () => {
                            reject("error loading image");
                        };

                        trackedImage.src = window.URL.createObjectURL(file);
                    })
                    .catch((exception) => {
                        reject("file doesn't exist");
                    });
            });
        };

        coffeeEngine.renderer.fileToShader = (src) => {
            //Make sure we allocate this in storage first
            if (coffeeEngine.renderer.shaderStorage[src]) return;
            coffeeEngine.renderer.shaderStorage[src] = {};

            //Then we make our promise
            return new Promise((resolve,reject) => {
                const fileReader = new FileReader();

                //When our file loads we get our shader to compile
                fileReader.onload = () => {
                    resolve(fileReader.result);
                }

                project.getFile(src).then((file) => {
                    fileReader.readAsText(file);
                }).catch(() => {
                    delete coffeeEngine.renderer.shaderStorage[src];
                    reject("File does not exist");
                })
            })
        }

        coffeeEngine.renderer.fileToMaterial = (src) => {
            //Make sure we allocate this in storage first
            if (coffeeEngine.renderer.materialStorage[src]) return;
            coffeeEngine.renderer.materialStorage[src] = {};

            //Then we make our promise
            return new Promise((resolve,reject) => {
                //Hardcoding this for funsies
                if (src == "coffee:/default.material") {
                    coffeeEngine.renderer.materialStorage[src] = coffeeEngine.renderer.defaultMaterial;
                    resolve(coffeeEngine.renderer.defaultMaterial);
                }
                else {
                    project.getFile(src)
                    .then((file) => {
                        
                    })
                    .catch(() => {
                        reject("File doesn't exist");
                    })
                }
            })
        }
    }
})();