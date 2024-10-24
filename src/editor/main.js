window.editor = {
    currentPage: {},
    language: {},

    //File Hooking
    fileHooks:{},
    addFileOpenHook:(fileExtension,callback) => {
        if (!editor.fileHooks[fileExtension]) editor.fileHooks[fileExtension] = [];
        editor.fileHooks[fileExtension].push(callback)
        return callback;
    },
    removeOpenFileHook:(fileExtension,callback) => {
        if (!editor.fileHooks[fileExtension]) return;
        
        //Find the index and remove the hook
        const foundIndex = editor.fileHooks[fileExtension].indexOf(callback);
        if (foundIndex == -1) return;
        editor.fileHooks[fileExtension].splice(foundIndex,1);
    },

    changePage: () => {
        if (editor.currentPage.root) {
            coffeeEngine.renderer.dispose();
            editor.currentPage.root.parentElement.removeChild(editor.currentPage.root);
            delete editor.currentPage.root;
        }

        if (sugarcube && sugarcube.workspace && sugarcube.workspace.dispose) {
            sugarcube.workspace.dispose();
            delete sugarcube.workspace;
        }
    },
    safeties: {
        secureContext: window.isSecureContext,
        folderPerimissions: window.showDirectoryPicker != undefined,
    },
};
