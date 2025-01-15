window.editor = {
    currentPage: {},
    language: {},
    selectedNode: null,

    events: {
        nodeSelected: [],
    },

    //File Hooking
    fileHooks: {},
    filePropertyEditors: {},

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

    registerFilePropertyEditor: (fileExtension, callback) => {
        //No overriding
        if (editor.filePropertyEditors[fileExtension]) return;
        editor.filePropertyEditors[fileExtension] = callback;
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

    controls: {
        forward:"w",
        left:"a",
        back:"s",
        right:"d",
        up:"e",
        down:"q",
    },

    safeties: {
        secureContext: window.isSecureContext,
        folderPerimissions: window.showDirectoryPicker != undefined,
        //It is likely that if we don't have open file picker, we don't have save file picker
        filePermissions: window.showOpenFilePicker != undefined,
    },
};

//This will contain the editor's windows
editor.windowLayer = 0;
editor.windows = {};

editor.windows.existing = {};

//this is the base window class
editor.windows.__Serialization = {
    register: (classOBJ, id, jsonData) => {
        //Extra json can be used to add special data to windows like only allowing 1 to be open at a time.
        editor.windows.__Serialization.all[id] = classOBJ; //{object: classOBJ, extraJson:jsonData};
        editor.windows.__Serialization.data[id] = jsonData || {};
    },

    find: (windowOBJ) => {
        //Check to make sure the window has tabs. if it does serialize those too.
        if (windowOBJ.tabs && windowOBJ.tabs.length > 1) {
            const serializedArray = [];
            for (windowTabIndex in windowOBJ.tabs) {
                const windowTab = windowOBJ.tabs[windowTabIndex].owner;

                //Serialize the tab
                for (const key in editor.windows.__Serialization.all) {
                    const constructor = editor.windows.__Serialization.all[key];
                    if (constructor == windowTab.constructor) {
                        serializedArray.push(key);
                        break;
                    }
                }
            }

            return serializedArray;
        }
        else {
            for (const key in editor.windows.__Serialization.all) {
                const constructor = editor.windows.__Serialization.all[key];
                if (constructor == windowOBJ.constructor) return key;
            }
        }
    },

    all: {},
    data: {},
};

coffeeEngine.isEditor = true;