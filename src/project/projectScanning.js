//I know the code here ain't the prettiest but it works and its an honest job.
(function() {
    //For scanning a whole folder
    project.scanFolder = async (directoryHandle,openEditor,folderSystem) => {
        for await (const [name,fileHandle] of directoryHandle) {
            //Code to check through each thing and scan it
            folderSystem[project.directoryHandleIdentifier] = directoryHandle;
            if (fileHandle.kind == "file") {
                folderSystem[name] = fileHandle;
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
    }

    //For scanning a zip, pretty simple
    //Thankfully JSzip provides a path API that is simple
    project.scanZip = (zipHandle) => {
        //Yeah its pretty easy.
        zipHandle.forEach(fileName => {
            //Get the file and determine if its a directory
            const file = zipHandle.files[fileName];
            if (!file.dir) file.async("blob").then(fileBlob => {
                project.setFile(fileName,fileBlob);
            });
        });
    }
})()