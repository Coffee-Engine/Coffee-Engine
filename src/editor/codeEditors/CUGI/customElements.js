(function() {
    //General
    CUGI.types["color"] = (data) => {
        const { target, key } = data;

        //Create our input
        const input = document.createElement("color-picker");
        input.disabled = (typeof data.disabled == "function") ? data.disabled() : data.disabled;
        input.className = `CUGI-Color ${data.extraStyle}`;
        
        //Setup our colors
        if (data.smallRange) input.value = coffeeEngine.ColorMath.RGBtoHex({
            r: target[key][0] * 255 || 0, 
            g: target[key][1] * 255 || 0, 
            b:target[key][2] * 255 || 255, 
            a:(typeof target[key][3] == "number") ? target[key][3] * 255 : 255
        });
        else input.value = target[key];

        if (data.smallRange) {
            input.onchange = () => {
                //Convert properly
                const split = coffeeEngine.ColorMath.HexToRGB(input.color);
                split.r /= 255; split.g /= 255; split.b /= 255; 
                if (split.a) split.a /= 255;

                //Normal onchange stuff
                data.target[data.key] = (input.translucency) ? [split.r, split.g, split.b, split.a] : [split.r, split.g, split.b];
                if (data.onchange) data.onchange(data.target[data.key], data);
            }            
        }
        else {
            input.onchange = CUGI.macros.onchange(data, input);
        }

        return input;
    };

    CUGI.types["key"] = (data) => {
        const { target, key } = data;

        //Create our input
        const input = CUGI.displays.button({ text: target[key],
        onclick: (element) => {
            element.innerText = editor.language["engine.settings.pressAnyKey"];
            const keyDownFunction = (event) => {
                //Stop propogation and prevent the default action
                event.stopPropagation();
                event.preventDefault();

                let value = event.key.toLowerCase();
                input.innerText = value;
                //Hardcoded exception for space The button dissapears if we don't
                if (value == " ") {
                    input.innerText = editor.language["engine.settings.space"];
                    value = "space";
                }

                //Send out the signal
                target[key] = input;
                data.onchange();

                document.removeEventListener("keydown", keyDownFunction);
            };
            document.addEventListener("keydown", keyDownFunction);
        }});

        input.className = "CUGI-Button CUGI-Keybind";

        input.onchange = CUGI.macros.onchange(data, input);

        return input;
    };

    //Property menu specific
    CUGI.types["node-name"] = (data) => {
        data.onchange = (value, data) => {
            //Cheap hack like myself
            coffeeEngine.runtime.currentScene.castEvent("childAdded", data);
        }

        const input = CUGI.types.string(data);

        input.onchange = CUGI.macros.onchange(data, input);

        return input;
    }
    CUGI.types["color3"] = (data) => {
        return CUGI.types.color(data);
    }

    CUGI.types["color4"] = (data) => {
        const input = CUGI.types.color(data);
        input.className = `CUGI-Color CUGI-ColorTransparency ${data.extraStyle}`;
        input.translucency = true;
        return input;
    }

    CUGI.types["file"] = (data) => {
        const { target, key } = data;

        const button = CUGI.displays.button({...data, onclick: (button) => {
            //loadl
            const newLoadal = new editor.windows.modalFileExplorer(400, 400);

            newLoadal.__moveToTop();

            //Note that gifs will not be animated, they do come as non animated too. Like PNGs
            newLoadal.acceptTypes = data.fileType;
            if (data.systemRoot) newLoadal.systemRoot = data.systemRoot;
            newLoadal.x = window.innerWidth / 2 - 200;
            newLoadal.y = window.innerHeight / 2 - 200;
            newLoadal.onFileSelected = (path) => {
                target[key] = path;
                button.innerText = path;
                if (data.onchange) data.onchange(target[key], data);
            };
        }})

        button.innerText = target[key] || editor.language["editor.window.properties.noFile"];

        button.contextFunction = () => {
            return [
                { text: editor.language["editor.fileButton.removeFile"], value: "removeFile" },
            ];
        };

        button.contentAnswer = (value) => {
            target[key] = "";
            button.innerText = editor.language["editor.window.properties.noFile"];
            if (data.onchange) data.onchange(target[key], data);
        }

        return button;
    }

    //Project settings specific
    const createBroadcastElement = (data, broadcastName) => {
        //Create our needed elements
        const container = document.createElement("div");
        const name = document.createElement("p");
        const remove = document.createElement("button");

        //Add our classes
        container.className = "CUGI-Broadcast";
        name.className = "CUGI-BroadcastName";
        remove.className = "CUGI-BroadcastRemove";

        //Add our text
        name.innerText = broadcastName;
        remove.innerText = "X";

        //Removal
        remove.onclick = () => {
            if (container.parentElement) container.parentElement.removeChild(container);
            delete data.target[data.key][broadcastName];

            if (data.onchange) data.onchange();
        }

        //Append our child elements
        container.appendChild(remove);
        container.appendChild(name);

        return container;
    }

    CUGI.displays["broadcasts"] = (data) => {
        const { target, key } = data;
        target[key] = target[key] || {};

        //Create the broadcast container
        const container = document.createElement("div");
        container.className = "CUGI-PropertyHolder CUGI-BroadcastContainer";

        //Create our text
        const text = document.createElement("p");
        text.innerText = editor.language["engine.projectSettings.broadcasts"];

        //Create the broadcast adding div
        const creationContainer = document.createElement("div");
        creationContainer.className = "CUGI-BroadcastCreation-Container";

        //The elements within the container
        {
            //Create our needed elements
            const name = CUGI.macros.inputElement("text");
            const createButton = document.createElement("button");

            //Add our text to the inputs
            name.placeholder = editor.language["engine.projectSettings.broadcasts.placeholder"];
            createButton.innerText = editor.language["engine.projectSettings.broadcasts.add"];

            //The actual action of creating a broadcast
            createButton.onclick = () => {
                //Do not allow broadcasts with an invalid name to be created
                if (name.value.length == 0) return;

                //Do not allow broadcasts with an existing name to be created
                target[key] = target[key] || {};
                const broadcasts = Object.keys(target[key]);
                if (broadcasts.includes(name.value)) return;

                //If we pass both checks create our broadcast
                target[key][name.value] = [];
                container.insertBefore(createBroadcastElement(data, name.value), creationContainer);

                name.value = "";

                if (data.onchange) data.onchange();
            }

            //Append our inputs
            creationContainer.appendChild(name);
            creationContainer.appendChild(createButton);
        }

        //Append our new elements
        container.appendChild(text);
        container.appendChild(creationContainer);
        
        //Create our buttons
        for (let broadcast in target[key]) {
            container.insertBefore(createBroadcastElement(data, broadcast), creationContainer);
        }

        return container;
    }
})();