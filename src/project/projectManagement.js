(function() {
    window.project = {
        formatVersion:1,
        fileSystem:{},
        isFolder:false,
        directoryHandle:null,

        //? Why so odd?
        //* Well its simple the user can't make a file or directory with this name
        directoryHandleIdentifier:"/____DIRECTORY__HANDLE____/",

        //Our methods for handling files
        setFile: async (path,contents,type) => {
            //Using a promise now!
            return new Promise(async (resolve,reject) => {
                const split = path.split("/");
                let fold = project.fileSystem;
                let hadCreated = false
                for (let id = 0; id < split.length; id++) {
                    //If we reach the end of the path continue!
                    if (id == (split.length - 1)) {
                        //If file had to be created mark it as so.
                        if (!fold[split[id]]) hadCreated = true;
                        if (!project.isFolder) {
                            //Also make sure we remove existing files when we override
                            if (fold[split[id]]) delete fold[split[id]];
                            //If we aren't in a folder context just create a file object.
                            fold[split[id]] = new File([contents], split[id], {
                                type: type,
                            });
                        }
                        else {
                            //If we are in a folder context get the file handle and writable and add it to the main context
                            const fileHandle = await fold[project.directoryHandleIdentifier].getFileHandle(split[id],{ create: true })
                            fold[split[id]] = fileHandle;

                            //Write it
                            const writable = await fileHandle.createWritable();
                            await project.writeToWritable(contents,writable,type);
                        }

                        //Update our FS
                        coffeeEngine.sendEvent("fileSystemUpdate",{type:hadCreated ? "FILE_ADDED" : "FILE_CHANGED", src:path});
                        resolve(path);
                    }
    
                    //make folders if need be
                    if (!fold[split[id]]) {
                        fold[split[id]] = {};
                        //If we are in a folder context and we want to make a folder. Make a directory handle
                        if (project.isFolder) {
                            fold[split[id]][project.directoryHandleIdentifier] = await fold[project.directoryHandleIdentifier].getDirectoryHandle(split[id], {create:true});
                        }
                    }
                    fold = fold[split[id]];
                }
            })
        },

        writeToWritable: async(contents,writable,type) => {
            if (contents instanceof Blob) {
                //Pipe the blob through to the writable
                await contents.stream().pipeTo(writable);
            }
            //Find some way to make a string a UInt8Array
            else {
                const newBlob = new Blob([contents.toString()], { type: type });
                await newBlob.stream().pipeTo(writable);
            }

            return;
        },

        addImageFromURL: async (url,destination) => {
            return new Promise((resolve,reject) => {
                fetch(url)
                    .then((response) => response.blob())
                    .then((blob) => {
                        project.setFile(destination,blob,blob.type);
                        resolve();
                })
                .catch(() => {
                    reject("Could not fetch image");
                });
            })
        },

        getFile: (path) => {
            //I promise you this works
            return new Promise((resolve, reject) => {
                const split = path.split("/");
                let fold = project.fileSystem;
                for (let id = 0; id < split.length; id++) {
                    //If we reach the end of the path continue!
                    if (id == (split.length - 1)) {
                        //check to see if its a file system handle. I want a good multi-method file grabber, not a rubbish one.
                        if (fold[split[id]] instanceof FileSystemFileHandle) {
                            fold[split[id]].getFile().then(file => {resolve(file)}).catch("can't get file");
                        }
                        else {
                            if (!fold[split[id]]) reject(`File ${fold[split[id]]} does not exist`);
                            resolve(fold[split[id]]);
                        }
                    }
    
                    //make folders if need be
                    if (!fold[split[id]]) reject(`directory ${split[id]} not found`);
                    fold = fold[split[id]];
                }
            })
        },

        //For initial creation
        addDefaultAssets: (json) => {
            //Json objects
            project.setFile("project.json",JSON.stringify(json),"text/plain");

            //Add tiramisu :)
            project.addImageFromURL("editor/images/TiramisuA.png","tiramisu.png").then(() => {
                editor.editorPage.initilize();
                
                coffeeEngine.sendEvent("fileSystemUpdate",{type:"ALL", src:"COFFEE_ALL"});
                coffeeEngine.sendEvent("fileSystemUpdate",{type:"FINISH_LOADING", src:"COFFEE_ALL"});
            });
        },

        scanFolder: async (directoryHandle,openEditor,folderSystem) => {
            for await (const [name,fileHandle] of directoryHandle) {
                //Code to check through each thing and scan it
                folderSystem[project.directoryHandleIdentifier] = directoryHandle;
                if (fileHandle.kind == "file") {
                    folderSystem[name] = [fileHandle,null];
                }
                else {
                    folderSystem[name] = {};
                    await project.scanFolder(fileHandle,false,folderSystem[name]);
                }
            }

            if (openEditor) {
                if (project.fileSystem["project.json"]) {
                    editor.editorPage.initilize();
                
                    //Send our event to refresh the file system
                    coffeeEngine.sendEvent("fileSystemUpdate",{type:"ALL", src:"COFFEE_ALL"});
                    //Tell it that our extensions are also ready
                    coffeeEngine.sendEvent("fileSystemUpdate",{type:"FINISH_LOADING", src:"COFFEE_ALL"});
                }
                else {
                    //Remove the stuff if we don't have a valid project
                    delete project.fileSystem;
                    project.fileSystem = {};
                    project.directoryHandle = null;
                }
            }

            return;
        },

        //create stuff
        new: (json,type) => {
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
        },

        //Loading an existing project, determind weather its a file or a folder.
        load:(type,handle) => {
            delete project.fileSystem;
            project.fileSystem = {};
            if (type == "folder") {
                project.isFolder = true;
                project.directoryHandle = handle;
                project.scanFolder(project.directoryHandle,true,project.fileSystem);
            }
            else {
                project.isFolder = false;
                coffeeEngine.sendEvent("fileSystemUpdate",{type:"ALL", src:"COFFEE_ALL"});
                coffeeEngine.sendEvent("fileSystemUpdate",{type:"FINISH_LOADING", src:"COFFEE_ALL"});
            }
        }
    }
})();