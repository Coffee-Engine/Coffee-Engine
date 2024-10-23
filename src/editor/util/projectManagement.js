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
            const split = path.split("/");
            let fold = project.fileSystem;
            let hadCreated = false
            for (let id = 0; id < split.length; id++) {
                //If we reach the end of the path continue!
                if (id == (split.length - 1)) {
                    if (!fold[split[id]]) hadCreated = true;
                    if (!project.isFolder) {
                        //Also make sure we remove existing files when we override
                        if (fold[split[id]]) delete fold[split[id]];
                        //If we aren't in a folder context just create a file object we are just going to rely on these being arrays 100%
                        fold[split[id]] = [new File([contents], split[id], {
                            type: type,
                        })];
                    }
                    else {
                        //If we are in a folder context get the file handle and writable and add it to the main context
                        if (!fold[split[id]]) {
                            fold[project.directoryHandleIdentifier].getFileHandle(split[id],{ create: true }).then(fileHandle => {
                                fileHandle.createWritable().then(writable => {
                                    fold[split[id]] = [fileHandle, writable];
                                    project.writeToWritable(contents,fold[split[id]][1],type);
                                })
                            });
                        }
                        //if it exists just use it striaght up
                        else {
                            project.writeToWritable(contents,fold[split[id]][1],type);
                        }
                    }
                    
                    coffeeEngine.sendEvent("fileSystemUpdate",{type:hadCreated ? "FILE_ADDED" : "FILE_CHANGED", src:path});
                    return;
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
        },

        writeToWritable: (contents,writable,type) => {
            if (contents instanceof Blob) {
                //Pipe the blob through to the writable
                contents.stream().pipeTo(writable);
            }
            //Find some way to make a string a UInt8Array
            else {
                const newBlob = new Blob([contents.toString()], { type: type });
                newBlob.stream().pipeTo(writable);
            }
        },

        addImageFromURL: async (url,destination,callBack) => {
            fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    project.setFile(destination,blob,blob.type);
                    if (callBack) callBack();
            });
        },

        getFile: (path) => {
            const split = path.split("/");
            let fold = project.fileSystem;
            for (let id = 0; id < split.length; id++) {
                //If we reach the end of the path continue!
                if (id == (split.length - 1)) {
                    return fold[split[id]];
                }

                //make folders if need be
                if (!fold[split[id]]) return null;
                fold = fold[split[id]];
            }
        },

        //For initial creation
        addDefaultAssets: (json) => {
            //Json objects
            project.setFile("project.json",JSON.stringify(json),"text/plain");

            //Add tiramisu :)
            project.addImageFromURL("editor/images/TiramisuA.png","tiramisu.png",() => {
                editor.editorPage.initilize();
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
                    project.scanFolder(fileHandle,false,folderSystem[name]);
                }
                
                //Send our event to refresh the file system
                coffeeEngine.sendEvent("fileSystemUpdate",{type:"ALL", src:"COFFEE_ALL"});
            }

            if (openEditor) {
                if (project.fileSystem["project.json"]) {
                    editor.editorPage.initilize();
                }
                else {
                    //Remove the stuff if we don't have a valid project
                    delete project.fileSystem;
                    project.fileSystem = {};
                    project.directoryHandle = null;
                }
            }
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
            }
        }
    }
})()