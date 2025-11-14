(function() {
    //Project settings specific
    const createGlobalElement = (data, globalName) => {
        const { target, key } = data;

        //Create our needed elements
        const container = document.createElement("div");
        const name = document.createElement("p");
        const remove = document.createElement("button");
        const value = document.createElement("div");
        
        //Our stuff!
        const CUGIType = CUGI.macros.typeFromValue(target[key][globalName]);
        if (CUGI.types[CUGIType]) {
            const newInputData = {...data, target: target[key], key: globalName, notFancy: true};
            const input = CUGI.types[CUGIType](newInputData);
            value.appendChild(input);
        }

        //Add our classes
        container.className = "CUGI-Global";
        name.className = "CUGI-GlobalName";
        remove.className = "CUGI-GlobalRemove";
        value.className = "CUGI-ValueDiv";

        //Add our text
        name.innerText = globalName;
        remove.innerText = "X";

        //Removal
        remove.onclick = () => {
            if (container.parentElement) container.parentElement.removeChild(container);
            delete target[key][globalName];

            if (data.onchange) data.onchange();
        }

        //Append our child elements
        container.appendChild(remove);
        container.appendChild(name);
        container.appendChild(value);

        return container;
    }

    CUGI.displays["globalVariables"] = (data) => {
        const { target, key } = data;
        target[key] = target[key] || {};

        //Create the global container
        const container = document.createElement("div");
        container.className = "CUGI-PropertyHolder CUGI-GlobalContainer";

        //Create our text
        const text = document.createElement("p");
        text.innerText = editor.language["engine.projectSettings.globals"];

        //Create the global adding div
        const creationContainer = document.createElement("div");
        creationContainer.className = "CUGI-GlobalCreation-Container";

        //The elements within the container
        {
            //Create our needed elements
            const name = CUGI.macros.inputElement("text");
            const createButton = document.createElement("dropdown-menu");

            //Add classes
            name.className += " CUGI-GlobalNameInput";
            createButton.className += "CUGI-AddGlobal";

            //Add our text to the inputs
            name.placeholder = editor.language["engine.projectSettings.globals.placeholder"];
            createButton.innerHTML = `
                ${editor.language["engine.projectSettings.globals.add"]}
                <dropdown-item value="string">${editor.language["engine.CUGI.value"]}</dropdown-item>
                <dropdown-item value="array">${editor.language["engine.CUGI.array"]}</dropdown-item>
                <dropdown-item value="object">${editor.language["engine.CUGI.object"]}</dropdown-item>
            `;
            
            createButton.onchange = (value) => {
                //Do not allow globals with an invalid name to be created
                if (name.value.length == 0) return;

                //Do not allow globals with an existing name to be created
                target[key] = target[key] || {};
                const globalVars = Object.keys(target[key]);
                if (globalVars.includes(name.value)) return;

                //If we pass both checks create our global
                target[key][name.value] = CUGI.macros.valueFromType(value);
                container.insertBefore(createGlobalElement(data, name.value), creationContainer);
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
        for (let globalKey in target[key]) {
            container.insertBefore(createGlobalElement(data, globalKey), creationContainer);
        }

        return container;
    }
})();