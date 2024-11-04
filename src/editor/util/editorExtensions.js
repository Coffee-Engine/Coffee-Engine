(function() {
    project.extensions = {
        storage:{},
        readingExtID:0
    };

    project.extensions.checkForExtensions = async () => {
        console.log("looking for extensions");
        //Get our extension directory
        const extensionDir = project.getFile("extensions");

        //Search our extensionDir
        if (extensionDir) {
            Object.keys(extensionDir).forEach(extID => {
                if (extID == "/____DIRECTORY__HANDLE____/") return;
                if (project.extensions.storage[extID]) return;

                //Our parse function
                    
                //Get our file
                const extensionJson = project.getFile(`extensions/${extID}/extension.json`)
                
                //Make sure it exists then parse
                if (!extensionJson) return;

                //Read it
                extensionJson[0].getFile().then(file => {
                    project.extensions.storage[extID] = new project.extensions.parser(extID,file);
                })
            })
        }
    }

    coffeeEngine.addEventListener("fileSystemUpdate",(event) => {
        if (event.type == "FINISH_LOADING") project.extensions.checkForExtensions();
    });

    

    //Doing this so management and reading is slightly easier
    project.extensions.parser = class {
        constructor(extensionID,file) {
            this.fileReader = new FileReader()
            this.id = extensionID;

            //Read our extension.json
            this.fileReader.onload = () => {
                project.extensions.storage[extensionID] = JSON.parse(this.fileReader.result);
                console.log(project.extensions.storage[extensionID]);
            }

            this.fileReader.readAsText(file);
        }
    }
})();