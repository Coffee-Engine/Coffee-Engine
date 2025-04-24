(function () {
    coffeeEngine.behaviorManager = {
        storage: {},
        loadedFiles: {},
        lastLoaded: {},

        CUGIPropertyRegex: /@editor\s*\(\w*\)\s*\w*[\s=;]*.*;/g,
        CUGITypeRegex: /@editor\s*\(\w*(?=\))/g,
        
        register: (name, classObj) => {
            coffeeEngine.behaviorManager.storage[name] = classObj;
            coffeeEngine.behaviorManager.lastLoaded = classObj;

            for (let id in coffeeEngine.behaviorManager.listeners) {
                coffeeEngine.behaviorManager.listeners[id](name);
            }

            return classObj;
        },

        listeners: [],

        addBehaviorListener: (name, callback) => {
            const callbackMain = (retName) => {
                if (name == retName) {
                    callback();
    
                    coffeeEngine.behaviorManager.listeners.splice(coffeeEngine.behaviorManager.listeners.indexOf(callbackMain), 1);
                }
            }
            coffeeEngine.behaviorManager.listeners.push(callbackMain);
        },

        //Behavior loading
        behaviorFromFile: (filePath) => {
            //return a promise
            return new Promise((resolve, reject) => {
                //check if its loaded
                if (coffeeEngine.behaviorManager.loadedFiles[filePath]) resolve(coffeeEngine.behaviorManager.loadedFiles[filePath]);

                //if not load it
                project
                    .getFile(filePath)
                    .then((file) => {
                        const fileReader = new FileReader();

                        //when the file is parsed turn it into a script
                        fileReader.onload = () => {
                            //Make the script and check for it being loaded
                            const script = document.createElement("script");

                            //get CUGI properties
                            const properties = coffeeEngine.behaviorManager.parseProperties(fileReader.result.match(coffeeEngine.behaviorManager.CUGIPropertyRegex) || []);

                            //Save it
                            coffeeEngine.behaviorManager.addBehaviorListener(filePath, () => {
                                coffeeEngine.behaviorManager.loadedFiles[filePath] = { behavior: coffeeEngine.behaviorManager.storage[filePath], properties: properties};
                                resolve(coffeeEngine.behaviorManager.loadedFiles[filePath]);
                            });

                            //Set the inner text and add the element.
                            script.innerHTML = `(function(FILE_PATH) {\n${fileReader.result.replaceAll(coffeeEngine.behaviorManager.CUGIPropertyRegex, "")}\n})("${filePath.replaceAll('"', "\\\"")}");`;
                            document.body.appendChild(script);
                        };

                        fileReader.readAsText(file);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        //The not as impressive younger cousin of behavior from file.
        behaviorPropertiesFromFile: (filePath, force) => {
            //We might as well return the actual behavior if we do have it
            if (!coffeeEngine.isEditor) return coffeeEngine.behaviorManager.behaviorFromFile();

            return new Promise((resolve, reject) => {
                //check if its loaded
                if (coffeeEngine.behaviorManager.loadedFiles[filePath] && !force) resolve(coffeeEngine.behaviorManager.loadedFiles[filePath]);

                //if not load it
                project
                    .getFile(filePath)
                    .then((file) => {
                        const fileReader = new FileReader();

                        //when the file is parsed turn it into a script
                        fileReader.onload = () => {
                            //get CUGI properties
                            const properties = coffeeEngine.behaviorManager.parseProperties(fileReader.result.match(coffeeEngine.behaviorManager.CUGIPropertyRegex) || []);

                            //Save it
                            coffeeEngine.behaviorManager.loadedFiles[filePath] = { path: filePath, properties: properties};
                            resolve(coffeeEngine.behaviorManager.loadedFiles[filePath]);
                        };

                        fileReader.readAsText(file);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
        },

        parseProperties: (propertyArray) => {
            for (let propertyID in propertyArray) {
                const propertyString = propertyArray[propertyID];

                //Get the property type
                let propertyType = propertyString.match(coffeeEngine.behaviorManager.CUGITypeRegex)[0];
                propertyType = propertyType.split(/@editor\s*\(/g)[1].replace(/\)\s*\w*[\s=;]*.*;/g,"").trim();
                
                //now lets isolate the property name;
                let propertyName = propertyString.match(/".*(?=")/g)[0].replace('"',"").replaceAll(/\\(?=.)/g, "");

                //Then throw it in the array again
                propertyArray[propertyID] = { name: propertyName, type: propertyType.toLowerCase() };
            }

            //Churn out our new array
            return propertyArray;
        }
    };
})();
