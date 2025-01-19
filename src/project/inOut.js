(function () {
    //For initial creation
    project.addDefaultAssets = (json) => {
        //Json objects
        project.setFile("project.json", JSON.stringify(json), "text/plain");

        //Add tiramisu :)
        project.addImageFromURL(coffeeEngine.defaultSprite, coffeeEngine.defaultSpriteName).then(() => {
            if (coffeeEngine.isEditor) editor.editorPage.initilize();

            coffeeEngine.sendEvent("fileSystemUpdate", { type: "ALL", src: "COFFEE_ALL" });
            coffeeEngine.sendEvent("fileSystemUpdate", { type: "FINISH_LOADING", src: "COFFEE_ALL" });
        });
    };

    //create stuff
    project.new = (json, type) => {
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
        } else {
            project.isFolder = false;
            project.addDefaultAssets(json);
        }
    };

    project.isValidObject = (object) => {
        //Yeah this is stupid
        return object instanceof File || object instanceof FileSystemFileHandle || object instanceof FileSystemDirectoryHandle;
    };

    //Loading an existing project, determind weather its a file or a folder.
    //We use async to MAKE SURE we have consistancy when loading files
    project.load = async (type, handle) => {
        //filter out imposter objects
        if (!project.isValidObject(handle) && type != "base64") return;

        //Then remove are original FS
        delete project.fileSystem;
        project.fileSystem = {};

        //Parse
        if (type == "folder") {
            project.isFolder = true;
            project.directoryHandle = handle;
            await project.scanFolder(project.directoryHandle, true, project.fileSystem);
        }
        else if (type == "base64") {
            project.zipObject = new JSZip();
            project.zipObject = await project.zipObject.loadAsync(handle, {base64:true});

            await project.scanZip(project.zipObject);
            
            coffeeEngine.sendEvent("fileSystemUpdate", { type: "FINISH_LOADING", src: "COFFEE_ALL" });
            if (coffeeEngine.isEditor) editor.editorPage.initilize();
            coffeeEngine.sendEvent("fileSystemUpdate", { type: "ALL", src: "COFFEE_ALL" });
        } 
        else {
            project.isFolder = false;

            //Make sure we are getting the file handle and not some random garbage.
            if (handle instanceof FileSystemFileHandle) {
                project.fileHandle = handle;
                project.fileObject = await handle.getFile();
            }
            //We also have to remember that files exist on non chromium browsers like BE-browse and Firefox
            else {
                project.fileObject = handle;
            }

            project.zipObject = new JSZip();
            project.zipObject = await project.zipObject.loadAsync(project.fileObject);

            await project.scanZip(project.zipObject);

            coffeeEngine.sendEvent("fileSystemUpdate", { type: "FINISH_LOADING", src: "COFFEE_ALL" });
            if (coffeeEngine.isEditor) editor.editorPage.initilize();
            coffeeEngine.sendEvent("fileSystemUpdate", { type: "ALL", src: "COFFEE_ALL" });
        }
    };

    //Lumping this in here, it works a lot better here than its own file
    project.decaf = {
        loopThroughSave: async (path, projectDirectory, zipInstance, callback) => {
            //Loop through our folder and add our stuff.
            const keys = Object.keys(projectDirectory);
            for (let keyID = 0; keyID < keys.length; keyID++) {
                const key = keys[keyID];

                if (key == project.directoryHandleIdentifier) continue;
                //Loop through and add files
                const file = await project.getFile(`${path}${key}`);

                if (!(file instanceof File)) {
                    await project.decaf.loopThroughSave(`${path}${key}/`, file, zipInstance);
                    continue;
                }

                await zipInstance.file(`${path}${key}`, file);
            }

            if (callback) callback();
        },

        save: (forceSeperate) => {
            //Get our JSzip instance
            const zipInstance = new JSZip();

            project.decaf.loopThroughSave("", project.fileSystem, zipInstance, () => {
                zipInstance.generateAsync({ type: "blob" }).then((blob) => {
                    //Just our 2 awesome saving ways, (yay)
                    if (forceSeperate || !editor.safeties.filePermissions || !project.fileHandle) {
                        //Create a blob, link it then click and revoke the blob
                        const blobURL = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = blobURL;
                        link.download = `project.${coffeeEngine.projectFormat}`;
                        link.click();
                        URL.revokeObjectURL(blobURL);
                    } else {
                        //Write to the file handle.
                        project.fileHandle.createWritable().then((writable) => {
                            project.writeToWritable(blob, writable);
                        });
                    }
                });
            });
            //Make sure we dispose of our instance.
            delete zipInstance;
        },
    };
})();
