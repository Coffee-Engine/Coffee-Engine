(function() {
    editor.extensions = {
        storage:{},
    };

    editor.extensions.checkForExtensions = () => {
        console.log("looking for extensions");
        //Get our extension directory
        const extensionDir = project.getFile("extensions");

        //Search our extensionDir
        if (extensionDir) {
            Object.keys(extensionDir).forEach(extID => {
                if (extID == "/____DIRECTORY__HANDLE____/") return;
                if (editor.extensions.storage[extID]) return;

                console.log(editor.extensions.storage[extID]);
                editor.extensions.storage[extID] = project.getFile(`extensions/${extID}/extension.json`);
            })
        }
    }

    coffeeEngine.addEventListener("fileSystemUpdate",() => {
        editor.extensions.checkForExtensions();
    })
})();