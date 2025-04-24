(function() {
    //This is like broadcasts but for collisionGroups
    const createCollisionGroupElement = (data, groupName) => {
        //Create our needed elements
        const container = document.createElement("div");
        const name = document.createElement("p");
        const remove = document.createElement("button");

        //Add our classes
        container.className = "CUGI-CollisionGroup";
        name.className = "CUGI-CollisionGroupName";
        remove.className = "CUGI-CollisionGroupRemove";

        //Add our text
        name.innerText = groupName;
        remove.innerText = "X";

        //Removal
        remove.onclick = () => {
            if (container.parentElement) container.parentElement.removeChild(container);
            delete data.target[data.key][groupName];

            if (data.onchange) data.onchange("CUGI-COLLISION-GROUP");
        }

        //Append our child elements
        container.appendChild(remove);
        container.appendChild(name);

        return container;
    }

    //VV Full of CollisionMatrix (Yummy) VV
    CUGI.displays["collisionGroups"] = (data) => {
        const { target, key } = data;
        target[key] = target[key] || {default: { default: true }};

        const container = document.createElement("div");
        container.className = "CUGI-PropertyHolder CUGI-CollisionGroupContainer";
        
        //Create our elements
        const text = document.createElement("p");
        const creationContainer = document.createElement("div");
        const matrixContainer = document.createElement("div");
        let displayedMatrix;

        //Style them
        text.innerText = editor.language["engine.projectSettings.collisionGroups"];
        creationContainer.className = "CUGI-CollisionGroupCreation-Container"
        matrixContainer.className = "CUGI-CollisionGroupMatrix-Container";

        //The elements within the creation container
        {
            //Create our needed elements
            const name = CUGI.macros.inputElement("text");
            const createButton = document.createElement("button");

            //Add classes
            name.className += " CUGI-CollisionGroupNameInput";
            createButton.className += "CUGI-CollisionGroupAdd";

            //Add our text to the inputs
            name.placeholder = editor.language["engine.projectSettings.collisionGroups.placeholder"];
            createButton.innerText = editor.language["engine.projectSettings.collisionGroups.add"];

            //The actual action of creating a broadcast
            createButton.onclick = () => {
                //Do not allow broadcasts with an invalid name to be created
                if (name.value.length == 0) return;

                //Do not allow broadcasts with an existing name to be created
                target[key] = target[key] || {};
                const broadcasts = Object.keys(target[key]);
                if (broadcasts.includes(name.value)) return;

                //If we pass both checks create our broadcast
                target[key][name.value] = {};
                target[key][name.value][name.value] = true;
                container.insertBefore(createCollisionGroupElement(data, name.value), creationContainer);

                name.value = "";

                if (data.onchange) data.onchange("CUGI-COLLISION-GROUP");
            }

            //Append our inputs
            creationContainer.appendChild(name);
            creationContainer.appendChild(createButton);
        }

        //The matrix inside the matrix container
        displayedMatrix = CUGI.displays["collisionMatrix"](data);
        matrixContainer.appendChild(displayedMatrix);

        //Append our elements
        container.appendChild(text);
        container.appendChild(creationContainer);
        container.appendChild(matrixContainer);


        //Add the default groups
        for (let collisionGroup in target[key]) {
            if (collisionGroup != "default") container.insertBefore(createCollisionGroupElement(data, collisionGroup), creationContainer);
        }

        //Override our onchange
        const oldOnchange = data.onchange;
        data.onchange = (value) => {
            oldOnchange(value, data);

            if (value !== "CUGI-COLLISION-GROUP") return;

            //Refresh our matrix
            displayedMatrix.parentElement.removeChild(displayedMatrix);
            displayedMatrix = CUGI.displays["collisionMatrix"](data);
            matrixContainer.appendChild(displayedMatrix);
        }

        return container;
    }

    CUGI.displays["collisionMatrix"] = (data) => {
        const { target, key } = data;
        target[key] = target[key] || { default: { default: true } };

        //Create the broadcast container
        const container = document.createElement("div");
        container.className = "CUGI-PropertyHolder CUGI-CollisionMatrix";

        let keys = Object.keys(target[key]);
        container.style.setProperty("--grid", (" auto").repeat(keys.length + 1));

        //Generate initial layout
        for (let i=-1; i<keys.length; i++) {
            //Now the inner part
            const keyV = keys[i];

            const starterElement = document.createElement("div");
            starterElement.className = "CUGI-CollisionMatrixGroupName CUGI-CollisionRightBorder";

            //Make the bottom border if we are the corner piece
            if (i == -1) starterElement.className += " CUGI-CollisionBottomBorder";
            else starterElement.innerText = keyV;

            container.appendChild(starterElement);

            //Now for the contents if -1 just use the key names
            for (let keyH in target[key]) {
                //If we are on the top row use the namespace
                if (i == -1) {
                    //Create the namespace element
                    const myElement = document.createElement("div");
                    myElement.className = "CUGI-CollisionMatrix-GroupName CUGI-CollisionMatrixGroupNameTop CUGI-CollisionBottomBorder";
                    myElement.innerText = keyH;
                    container.appendChild(myElement);
                }
                //If not build the checkbox
                else {
                    //Create our elements
                    const checkboxContainer = document.createElement("div");
                    const myElement = CUGI.types.boolean({...data, target:target[key][keyH], key: keyV});

                    //Style
                    checkboxContainer.className = "CUGI-CollisionGroupCheckboxContainer";
                    myElement.className += " CUGI-CollisionGroupCheckbox";
                    checkboxContainer.appendChild(myElement);
                    container.appendChild(checkboxContainer);
                }
            }
        }

        return container;
    }
})();