(function() {
    coffeeEngine.prefabManager = {
        storage: {},

        loadPrefab: (path) => {
            return new Promise((resolve, reject) => {
                if (coffeeEngine.prefabManager.storage[path]) {
                    resolve(coffeeEngine.prefabManager.storage[path]);
                    return;
                }
    
                const fileReader = new FileReader();
    
                //On read we parse it.
                fileReader.onload = () => {
                    if (!fileReader.result) reject("invalid file");

                    try {
                        const parsed = JSON.parse(fileReader.result);

                        //Store for later incarnations
                        coffeeEngine.prefabManager.storage[path] = parsed;
                        resolve(parsed);
                    } catch (error) {
                        reject("invalid JSON");
                    }
                }
    
                project.getFile(path).then((file) => {
                    fileReader.readAsText(file);
                }).catch(() => {
                    reject("invalid file");
                });
            });
        },

        //Yippie!
        instantiatePrefab: (path) => {
            return new Promise((resolve) => {
                //Load our node and parent it to a temporary node
                coffeeEngine.prefabManager.loadPrefab(path).then((prefab) => {
                    const tempNode = new (coffeeEngine.getNode("Node"))();
    
                    //Get our prefab
                    currentScene.__deserializeChildren([prefab], tempNode);
                    const spawned = tempNode.children[0];
                    spawned.parent = null;

                    //Remove our temp node
                    tempNode._dispose();
    
                    //Return our new prefab
                    resolve(spawned);
                }).catch(() => {
                    resolve(new (coffeeEngine.getNode("Node"))());
                });
            })
        }
    };
})();