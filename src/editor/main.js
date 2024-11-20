window.editor = {
    currentPage: {},
    language: {},
    selectedNode: null,

    events: {
        nodeSelected: [],
    },

    //File Hooking
    fileHooks: {},

    //File hooks these send out signals when we try to open a file
    addFileOpenHook: (fileExtension, callback, parent) => {
        fileExtension = fileExtension.toLowerCase();
        if (!editor.fileHooks[fileExtension]) editor.fileHooks[fileExtension] = [];
        callback.parent = parent;
        editor.fileHooks[fileExtension].push(callback);
        return callback;
    },
    removeOpenFileHook: (fileExtension, callback, parent) => {
        fileExtension = fileExtension.toLowerCase();
        if (!editor.fileHooks[fileExtension]) return;

        //Find the index and remove the hook
        callback.parent = parent;
        const foundIndex = editor.fileHooks[fileExtension].indexOf(callback);
        if (foundIndex == -1) return;
        editor.fileHooks[fileExtension].splice(foundIndex, 1);
    },
    sendFileHook: (fileExtension, path) => {
        fileExtension = fileExtension.toLowerCase();
        if (!editor.fileHooks[fileExtension]) return;

        editor.fileHooks[fileExtension].forEach((hook) => {
            hook.call(hook.parent || this, path, fileExtension);
        });
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

    addEventListener: (event, func) => {
        if (typeof editor.events[event] != "object") return;

        editor.events[event].push(func);
        return func;
    },

    hasEventListener: (event, func) => {
        if (typeof editor.events[event] != "object") return;

        return editor.events[event].includes(func);
    },

    removeEventListener: (event, func) => {
        if (typeof editor.events[event] != "object") return;

        if (editor.events[event].includes(func)) {
            editor.events[event].slice(editor.events[event].indexOf(func));
        }
    },

    sendEvent: (event, data) => {
        if (typeof editor.events[event] != "object") return;

        editor.events[event].forEach((event) => {
            event(data);
        });
    },

    safeties: {
        secureContext: window.isSecureContext,
        folderPerimissions: window.showDirectoryPicker != undefined,
        //It is likely that if we don't have open file picker, we don't have save file picker
        filePermissions: window.showOpenFilePicker != undefined,
    },
};
