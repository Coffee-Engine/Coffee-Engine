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
    addFileHook: (fileExtension, callback, parent, parentName) => {
        //Arrays
        if (Array.isArray(fileExtension)) {
            for (let itemExtension in fileExtension) {
                editor.addFileHook(fileExtension[itemExtension], callback, parent, parentName);
            }
            return callback;
        }

        //Single items
        fileExtension = (fileExtension || "").toLowerCase();
        if (!editor.fileHooks[fileExtension]) editor.fileHooks[fileExtension] = [];
        editor.fileHooks[fileExtension].push({
            parent: parent,
            name: parentName || parent.name || parent.title, 
            function: callback
        });

        return callback;
    },
    removeFileHook: (fileExtension, callback) => {
        //Arrays
        if (Array.isArray(fileExtension)) {
            for (let itemExtension in fileExtension) {
                editor.removeFileHook[fileExtension[itemExtension], callback]
            }

            return;
        }

        //Single item
        fileExtension = (fileExtension || "").toLowerCase();
        if (!editor.fileHooks[fileExtension]) return;

        //Find the index and remove the hook
        const foundIndex = editor.fileHooks[fileExtension].indexOf(callback);
        if (foundIndex == -1) return;
        editor.fileHooks[fileExtension].splice(foundIndex, 1);
    },

    filePropertyEditor: class {
        constructor(panel, refreshListing, path) {
            this.panel = panel;
            this.refreshListing = refreshListing;
            this.path = path;
        }

        onPropertyChange(value, data) {}
    },

    registerFilePropertyEditor: (fileExtension, cls) => {
        //No overriding
        if (editor.filePropertyEditors[fileExtension]) return;
        editor.filePropertyEditors[fileExtension] = cls;
    },

    fetchFilePropertyEditor: (panel, path, origData, fileExtension) => {
        fileExtension = (typeof fileExtension == "string") ? fileExtension : coffeeEngine.getFileExtension(path);
        if (editor.filePropertyEditors[fileExtension]) return new editor.filePropertyEditors[fileExtension](panel, () => panel.refreshListing.call(panel, origData), path);
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

    addEventListener: (event, func, callee) => {
        if (!Array.isArray(editor.events[event])) return;


        if (callee) editor.events[event].push([callee, func]);
        else editor.events[event].push(func);
        return func;
    },

    hasEventListener: (event, func) => {
        if (!Array.isArray(editor.events[event])) return;

        if (editor.events[event].includes(func)) return true;

        //Otherwise check for events with callees.
        const index = editor.events[event].findIndex((val) => {
            if (Array.isArray(val)) {
                if (val[1] == func) return true;
            }
            return false;
        });

        return index != -1;
    },

    removeEventListener: (event, func) => {
        if (!Array.isArray(editor.events[event])) return;

        //First do a shallow search, if we find it. Then bingo
        if (editor.events[event].includes(func)) {
            editor.events[event].splice(editor.events[event].indexOf(func), 1);
            return;
        }

        //Otherwise check for events with callees.
        const index = editor.events[event].findIndex((val) => {
            if (Array.isArray(val)) {
                if (val[1] == func) return true;
            }
            return false;
        });

        if (index != -1) editor.events[event].splice(index, 1);
    },

    sendEvent: (event, data) => {
        if (!Array.isArray(editor.events[event])) return;

        if (event == "nodeSelected") {
            editor.lastSelectedNode = data.target;
        }

        editor.events[event].forEach((event) => {
            if (Array.isArray(event)) event[1].call(event[0], data);
            else if (typeof event == "function") event(data);
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
