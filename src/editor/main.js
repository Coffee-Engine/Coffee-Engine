window.editor = {
    currentPage: {},
    language: {},

    runtime: {},
    selectedNode: null,

    events: {
        nodeSelected: [],
    },

    //File Hooking
    fileHooks: {},
    filePropertyEditors: {},

    //File hooks these send out signals when we try to open a file
    addFileOpenHook: (fileExtension, callback, parent) => {
        //Arrays
        if (Array.isArray(fileExtension)) {
            for (let itemExtension in fileExtension) {
                itemExtension = fileExtension[itemExtension].toLowerCase();
                if (!editor.fileHooks[itemExtension]) editor.fileHooks[itemExtension] = [];
                callback.parent = parent;
                editor.fileHooks[itemExtension].push(callback);
            }
            return callback;
        }

        //Single items
        fileExtension = fileExtension.toLowerCase();
        if (!editor.fileHooks[fileExtension]) editor.fileHooks[fileExtension] = [];
        callback.parent = parent;
        editor.fileHooks[fileExtension].push(callback);
        return callback;
    },
    removeOpenFileHook: (fileExtension, callback, parent) => {
        //Arrays
        if (Array.isArray(fileExtension)) {
            for (let itemExtension in fileExtension) {
                itemExtension = fileExtension[itemExtension].toLowerCase();
                if (!editor.fileHooks[itemExtension]) continue;

                //Find the index and remove the hook
                callback.parent = parent;
                const foundIndex = editor.fileHooks[itemExtension].indexOf(callback);
                if (foundIndex == -1) continue;
                editor.fileHooks[itemExtension].splice(foundIndex, 1);
            }

            return;
        }

        //Single item
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

    registerFilePropertyEditor: (fileExtension, callback) => {
        //No overriding
        if (editor.filePropertyEditors[fileExtension]) return;
        editor.filePropertyEditors[fileExtension] = callback;
    },

    changePage: () => {
        if (editor.currentPage.root) {
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

        if (event == "nodeSelected") {
            editor.lastSelectedNode = data.target;
        }

        editor.events[event].forEach((event) => {
            event(data);
        });
    },

    controls: {
        forward: "w",
        left: "a",
        back: "s",
        right: "d",
        up: "e",
        down: "q",
    },

    safeties: {
        secureContext: window.isSecureContext,
        folderPerimissions: window.showDirectoryPicker != undefined,
        //It is likely that if we don't have open file picker, we don't have save file picker
        filePermissions: window.showOpenFilePicker != undefined,
    },
};


//Page root for making page management easier
editor.pageRoot = document.createElement("div");
editor.pageRoot.style.position = "absolute";
editor.pageRoot.style.left = "0px";
editor.pageRoot.style.top = "0px";
editor.pageRoot.style.margin = "0px";
editor.pageRoot.style.padding = "0px";
editor.pageRoot.style.width = "100%";
editor.pageRoot.style.height = "100%";
editor.pageRoot.style.overflow = "hidden";

document.body.appendChild(editor.pageRoot);


//Tell coffee we are the editor
coffeeEngine.isEditor = true;
