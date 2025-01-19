(function() {
    coffeeEngine.behaviorManager = {
        storage: {},
        loadedFiles: {},
        lastLoaded: {},
        register: (name, classObj) => {
            coffeeEngine.behaviorManager.storage[name] = classObj;
            coffeeEngine.behaviorManager.lastLoaded = classObj;
            return classObj;
        },

        //Behavior loading
        behaviorFromFile: (filePath) => {
            //return a promise
            return new Promise((resolve, reject) => {
                //check if its loaded
                if (coffeeEngine.behaviorManager.loadedFiles[filePath]) resolve(coffeeEngine.behaviorManager.loadedFiles[filePath]);
                
                //if not load it
                project.getFile(filePath).then((file) => {
                    const fileReader = new FileReader();

                    //when the file is parsed turn it into a script
                    fileReader.onload = () => {

                        //Make the script and check for it being loaded
                        const script = document.createElement("script");
                        script.onload = () => {
                            coffeeEngine.behaviorManager.loadedFiles[filePath] = coffeeEngine.behaviorManager.lastLoaded;
                            resolve(coffeeEngine.behaviorManager.loadedFiles[filePath]);
                        }

                        //Set the inner text and add the element.
                        script.innerText = fileReader.result;
                        document.body.appendChild(script);
                    }

                    fileReader.readAsText(file);
                })
                .catch(error => {
                    reject(error);
                })
            });
        }
    }
})