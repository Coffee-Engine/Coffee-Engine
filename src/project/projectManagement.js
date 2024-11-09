(function () {
    window.project = {
        formatVersion: 1,
        fileSystem: {},
        isFolder: false,
        directoryHandle: null,

        //? Why so odd?
        //* Well its simple the user can't make a file or directory with this name
        directoryHandleIdentifier: "/____DIRECTORY__HANDLE____/",

        //Our methods for handling files
        setFile: async (path, contents, type) => {
            //Using a promise now!
            return new Promise(async (resolve, reject) => {
                const split = path.split("/");
                let fold = project.fileSystem;
                let hadCreated = false;
                for (let id = 0; id < split.length; id++) {
                    //If we reach the end of the path continue!
                    if (id == split.length - 1) {
                        //If file had to be created mark it as so.
                        if (!fold[split[id]]) hadCreated = true;
                        if (!project.isFolder) {
                            //Also make sure we remove existing files when we override
                            if (fold[split[id]]) delete fold[split[id]];
                            //If we aren't in a folder context just create a file object.
                            fold[split[id]] = new File([contents], split[id], {
                                type: type,
                            });
                        } else {
                            //If we are in a folder context get the file handle and writable and add it to the main context
                            const fileHandle = await fold[project.directoryHandleIdentifier].getFileHandle(split[id], { create: true });
                            fold[split[id]] = fileHandle;

                            //Write it
                            const writable = await fileHandle.createWritable();
                            await project.writeToWritable(contents, writable, type);
                        }

                        //Update our FS
                        coffeeEngine.sendEvent("fileSystemUpdate", { type: hadCreated ? "FILE_ADDED" : "FILE_CHANGED", src: path });
                        resolve(path);
                    }

                    //make folders if need be
                    if (!fold[split[id]]) {
                        fold[split[id]] = {};
                        //If we are in a folder context and we want to make a folder. Make a directory handle
                        if (project.isFolder) {
                            fold[split[id]][project.directoryHandleIdentifier] = await fold[project.directoryHandleIdentifier].getDirectoryHandle(split[id], { create: true });
                        }
                    }
                    fold = fold[split[id]];
                }
            });
        },

        writeToWritable: async (contents, writable, type) => {
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

        addImageFromURL: async (url, destination) => {
            return new Promise((resolve, reject) => {
                fetch(url)
                    .then((response) => response.blob())
                    .then((blob) => {
                        project.setFile(destination, blob, blob.type);
                        resolve();
                    })
                    .catch(() => {
                        reject("Could not fetch image");
                    });
            });
        },

        getFile: (path) => {
            //I promise you this works
            return new Promise((resolve, reject) => {
                const split = path.split("/");
                let fold = project.fileSystem;
                for (let id = 0; id < split.length; id++) {
                    //If we reach the end of the path continue!
                    if (id == split.length - 1) {
                        //check to see if its a file system handle. I want a good multi-method file grabber, not a rubbish one.
                        if (fold[split[id]] instanceof FileSystemFileHandle) {
                            fold[split[id]]
                                .getFile()
                                .then((file) => {
                                    resolve(file);
                                })
                                .catch("can't get file");
                        } else {
                            if (!fold[split[id]]) reject(`File ${fold[split[id]]} does not exist`);
                            resolve(fold[split[id]]);
                        }
                    }

                    //make folders if need be
                    if (!fold[split[id]]) reject(`directory ${split[id]} not found`);
                    fold = fold[split[id]];
                }
            });
        },
    };
})();
