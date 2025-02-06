(function () {
    coffeeEngine.mesh = {
        class: class {
            data = {};
            pointCount = [];
        },

        fromProjectFile: (src) => {
            const fileReader = new FileReader();
            return new Promise((resolve, reject) => {
                //If the mesh exists in RAM, load it
                if (coffeeEngine.mesh.storage[src]) {
                    resolve(coffeeEngine.mesh.storage[src]);
                    return;
                }

                //If the mesh does not exist load it
                project
                    .getFile(src)
                    .then((file) => {
                        let split = src.split(".");
                        const extension = split[split.length - 1].toLowerCase();
                        const settings = coffeeEngine.mesh.settings[extension] || coffeeEngine.mesh.defaultSettings;

                        fileReader.onload = () => {
                            const stored = new coffeeEngine.mesh.class();
                            coffeeEngine.mesh.storage[src] = stored;

                            if (coffeeEngine.mesh.parsers[extension]) coffeeEngine.mesh.parsers[extension](fileReader.result, stored);
                            for (const index in stored.data) {
                                stored.data[index] = coffeeEngine.renderer.daveshade.buffersFromJSON(stored.data[index]);
                            }

                            resolve(stored);
                        };

                        //Load the file.
                        if (settings.useBytes) fileReader.readAsArrayBuffer(file);
                        else fileReader.readAsText(file);
                    })
                    .catch(() => {
                        reject("File does not exist");
                    });
            });
        },

        storage: {},
        parsers: {},
        settings: {},
        defaultSettings: {
            useBytes: false,
        },
    };

    //Add our preloading function
    coffeeEngine.preloadFunctions["meshes"] = { function: coffeeEngine.mesh.fromProjectFile, storage: coffeeEngine.mesh.storage };
})();
