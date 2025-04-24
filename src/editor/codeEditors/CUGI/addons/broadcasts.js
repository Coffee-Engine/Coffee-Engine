(function() {
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

            //Add classes
            name.className += " CUGI-BroadcastNameInput";
            createButton.className += "CUGI-AddBroadcast";

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