(function() {
    //For initial creation
    project.addDefaultAssets = (json) => {
        //Json objects
        project.setFile("project.json",JSON.stringify(json),"text/plain");

        //Add tiramisu :)
        project.addImageFromURL("editor/images/TiramisuA.png","tiramisu.png").then(() => {
            editor.editorPage.initilize();
            
            coffeeEngine.sendEvent("fileSystemUpdate",{type:"ALL", src:"COFFEE_ALL"});
            coffeeEngine.sendEvent("fileSystemUpdate",{type:"FINISH_LOADING", src:"COFFEE_ALL"});
        });
    }

    //create stuff
    project.new = (json,type) => {
        //Refresh our filesystem
        delete project.fileSystem;
        project.fileSystem = {};

        //Check if its a folder type
        if (type == "folder") {
            project.isFolder = true;
            window
                .showDirectoryPicker()
                .then((result) => {
                    project.directoryHandle = result;
                    project.addDefaultAssets(json);
                })
                .catch((error) => {});
        }
        else {
            project.isFolder = false;
            project.addDefaultAssets(json);
        }
    }

    //Loading an existing project, determind weather its a file or a folder.
    project.load = (type,handle) => {
        delete project.fileSystem;
        project.fileSystem = {};
        if (type == "folder") {
            project.isFolder = true;
            project.directoryHandle = handle;
            project.scanFolder(project.directoryHandle,true,project.fileSystem);
        }
        else {
            project.isFolder = false;
            project.fileHandle = handle;
            editor.editorPage.initilize();
            coffeeEngine.sendEvent("fileSystemUpdate",{type:"ALL", src:"COFFEE_ALL"});
            coffeeEngine.sendEvent("fileSystemUpdate",{type:"FINISH_LOADING", src:"COFFEE_ALL"});
        }
    }

    //Lumping this in here, it works a lot better here than its own file
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