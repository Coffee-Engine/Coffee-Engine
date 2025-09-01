(function() {
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

        deregister: (id) => {
            if (!editor.windows.__Serialization[id]) return;

            if (editor.windows.existing[id]) {
                editor.windows.existing[id].forEach(window => {
                    window._dispose();
                })
            }
            delete editor.windows.__Serialization.all[id];
            delete editor.windows.__Serialization.data[id];
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
            } else {
                for (const key in editor.windows.__Serialization.all) {
                    const constructor = editor.windows.__Serialization.all[key];
                    if (constructor == windowOBJ.constructor) return key;
                }
            }
        },

        all: {},
        data: {},
    };
})();