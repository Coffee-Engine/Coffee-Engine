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

    
    editor.windows.getSpawnableWindows = () => {
        //Our rturn and serialization
        const windows = [];
        const serializationObject = editor.windows.__Serialization;

        Object.keys(serializationObject.all).forEach((windowName) => {
            if (windowName == "baseWindow") return;

            //If we only allow one window
            if (serializationObject.data[windowName].onlyOne && editor.windows.existing[windowName]) {
                if (editor.windows.existing[windowName].length > 0) return;
            }

            //Add it to the list
            windows.push({ type: "button", text: editor.language[`editor.window.${windowName}`] || windowName, value: windowName });
        });

        return windows;
    };

    editor.windows.CUGI_PREPROCESS = (val) => {
        const { type, value } = val;

        //Check to see if it's a button
        if (type == "button") {
            val.onclick = () => {
                if (!editor.windows.__Serialization.all[value]) return;

                const createdWindow = new editor.windows.__Serialization.all[value](400, 400);
                createdWindow.__moveToTop();

                createdWindow.x = window.innerWidth / 2 - 200;
                createdWindow.y = window.innerHeight / 2 - 200;
            }            
        }

        return val;
    }
})();