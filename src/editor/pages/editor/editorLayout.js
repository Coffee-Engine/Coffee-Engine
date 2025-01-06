(function() {
    editor.__deserializeLayout = () => {
        //Our grid layout

        let layout = editor.layout.layout;
        let floating = editor.layout.floating;

        for (let X = 0; X < layout.length; X++) {
            const column = layout[X];
            for (let Y = 0; Y < column.contents.length; Y++) {
                //Our deserialization!
                const row = layout[X].contents[Y];
                const content = row.content;

                //If we don't have a valid window just name a blank window after it.
                let overrideName;

                //Window creation
                //if we serialized a string in that field create 1 window
                if (typeof content == "string") {
                    //get the window type
                    let windowType = editor.windows.__Serialization.all[content];
                    if (!windowType) {
                        overrideName = content;
                        windowType = editor.windows.base;
                    } else {
                        windowType = windowType;
                    }

                    const newWindow = new windowType();
                    if (overrideName) {
                        newWindow.title = overrideName;
                    }

                    row.content = newWindow;
                    editor.dock.dockWindowDiv(newWindow, X);
                    newWindow.resized();
                } else if (Array.isArray(content)) {
                    let hostWindow;
                    for (let Z = 0; Z < content.length; Z++) {
                        const windowString = content[Z];
                        let windowType = editor.windows.__Serialization.all[windowString];
                        if (!windowType) {
                            overrideName = windowString;
                            windowType = editor.windows.base;
                        }

                        const newWindow = new windowType();
                        if (overrideName) {
                            newWindow.title = overrideName;
                        }

                        if (Z == 0) {
                            //Make the host window for the parasites to latch upon
                            hostWindow = newWindow;
                            row.content = newWindow;
                            editor.dock.dockWindowDiv(newWindow, X);
                            hostWindow.resized();
                        }
                        //If it is a parasite latch upon the host
                        else {
                            hostWindow.__addTab(newWindow);
                        }
                    }
                }
            }
        }

        for (let I = 0; I < floating.length; I++) {
            const floatData = floating[I];
            const content = floatData.content;

            //If we don't have a valid window just name a blank window after it.
            let overrideName;

            //Window creation
            //if we serialized a string in that field create 1 window
            if (typeof content == "string") {
                //get the window type
                let windowType = editor.windows.__Serialization.all[content];
                if (!windowType) {
                    overrideName = content;
                    windowType = editor.windows.base;
                } else {
                    windowType = windowType;
                }

                const newWindow = new windowType();
                if (overrideName) {
                    newWindow.title = overrideName;
                }

                newWindow.x = (floatData.x/100) * window.innerWidth;
                newWindow.y = (floatData.y/100) * window.innerHeight;

                newWindow.width = (floatData.width/100) * window.innerWidth;
                newWindow.height = (floatData.height/100) * window.innerHeight;
                newWindow.resized();

                floatData.content = newWindow;
            } else if (Array.isArray(content)) {
                let hostWindow;
                for (let Z = 0; Z < content.length; Z++) {
                    const windowString = content[Z];
                    let windowType = editor.windows.__Serialization.all[windowString];
                    if (!windowType) {
                        overrideName = windowString;
                        windowType = editor.windows.base;
                    }

                    const newWindow = new windowType();
                    if (overrideName) {
                        newWindow.title = overrideName;
                    }

                    if (Z == 0) {
                        //Make the host window for the parasites to latch upon
                        hostWindow = newWindow;
                    }
                    //If it is a parasite latch upon the host
                    else {
                        hostWindow.__addTab(newWindow);
                    }
                }

                hostWindow.x = (floatData.x/100) * window.innerWidth;
                hostWindow.y = (floatData.y/100) * window.innerHeight;

                hostWindow.width = (floatData.width/100) * window.innerWidth;
                hostWindow.height = (floatData.height/100) * window.innerHeight;
                hostWindow.resized();

                floatData.content = hostWindow;
            }
        }
    }

    editor.__serializeLayout = () => {
        let layout = editor.layout.layout;
        let floating = editor.layout.floating;
        const serialized = {};

        
        for (let X = 0; X < layout.length; X++) {
            const column = layout[X];
            for (let Y = 0; Y < column.contents.length; Y++) {
                const row = column[Y];

                console.log(editor.windows.__Serialization.find(row));
            }
        }

        serialized.floating = [];
        for (let I = 0; I < floating.length; I++) {
            const floatData = floating[I];
            serialized.floating.push({
                content: editor.windows.__Serialization.find(floatData.content),
                x:(floatData.content.x/window.innerWidth) * 100,
                y:(floatData.content.y/window.innerHeight) * 100,
                width:(floatData.content.width/window.innerWidth) * 100,
                height:(floatData.content.height/window.innerHeight) * 100
            })
        }

        return serialized;
    }
})();