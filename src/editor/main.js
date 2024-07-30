const editor = {
    currentPage:{},
    language: {},
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
        folderPerimissions: window.showDirectoryPicker != undefined
    }
};