(function() {
    project.decaf = {
        loopThroughSave: async (path,projectDirectory,zipInstance,callback) => {
            //Loop through our folder and add our stuff.
            const keys = Object.keys(projectDirectory);
            for (let keyID = 0; keyID < keys.length; keyID++) {
                const key = keys[keyID];
                
                if (key == project.directoryHandleIdentifier) continue;
                //Loop through and add files
                const file = await project.getFile(`${path}${key}`)

                if (!(file instanceof File)) {
                    await project.decaf.loopThroughSave(`${path}${key}/`,file,zipInstance);                 
                    continue;
                }

                await zipInstance.file(`${path}${key}`,file);
            }

            if (callback) callback();
        },

        save:() => {
            //Get our JSzip instance
            const zipInstance = new JSZip();

            project.decaf.loopThroughSave("",project.fileSystem,zipInstance, () => {
                zipInstance.generateAsync({type:"blob"}).then((blob) => { 
                        const blobURL = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.style.display = 'none';
                        link.href = blobURL;
                        link.download = "project.decaf";
                        link.click();
                        URL.revokeObjectURL(blobURL);
                    });
            });
            //Make sure we dispose of our instance.
            delete zipInstance;
        }
    };
})();