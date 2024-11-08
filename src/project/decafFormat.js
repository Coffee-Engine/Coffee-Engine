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

        save:(forceSeperate) => {
            //Get our JSzip instance
            const zipInstance = new JSZip();

            project.decaf.loopThroughSave("",project.fileSystem,zipInstance, () => {
                zipInstance.generateAsync({type:"blob"}).then((blob) => {
                    //Just our 2 awesome saving ways, (yay)
                    if (forceSeperate || (!editor.safeties.filePermissions) || (!project.fileHandle)) {
                        //Create a blob, link it then click and revoke the blob
                        const blobURL = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = blobURL;
                        link.download = "project.decaf";
                        link.click();
                        URL.revokeObjectURL(blobURL);
                    }
                    else {
                        //Write to the file handle.
                        project.fileHandle.createWritable().then(writable => {
                            project.writeToWritable(blob,writable);
                        });
                    }
                });
            });
            //Make sure we dispose of our instance.
            delete zipInstance;
        }
    };
})();