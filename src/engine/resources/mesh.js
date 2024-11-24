(function() {
    const fileReader = new FileReader();
    coffeeEngine.mesh = {
        class: class {
            data = {};
            pointCount = [];
        },

        fromProjectFile: (src) => {
            return new Promise((resolve,reject) => {
                //If the mesh exists in RAM, load it
                if (coffeeEngine.mesh.storage[src]) resolve(coffeeEngine.mesh.storage[src]);

                //If the mesh does not exist load it
                project.getFile(src).then((file) => {
                    let split = src.split(".");
                    const extension = split[split.length - 1].toLowerCase();
        
                    fileReader.onload = () => {
                        const stored = new coffeeEngine.mesh.class();
                        coffeeEngine.mesh.storage[src] = stored;
        
                        if (coffeeEngine.mesh.parsers[extension]) coffeeEngine.mesh.parsers[extension](fileReader.result, stored);

                        resolve(stored);
                    }
        
                    fileReader.readAsText(file);
                }).catch(() => {
                    reject("File does not exist");
                })
            })
        },

        storage: {}
    };
})();