(function() {
    CUGI.macros.typeFromValue = (value) => {
        switch (true) {
            case (typeof value == "number"):
                return "float";

            case (typeof value == "string"):
                return "string";

            case (value instanceof coffeeEngine.vector2):
                return "vec2";

            case (value instanceof coffeeEngine.vector3):
                return "vec3";

            case (value instanceof coffeeEngine.vector4):
                return "vec4";

            case (Array.isArray(value)):
                return "array";

            case (typeof value == "object"):
                return "object";
        
            default:
                return "string";
        }
    }

    CUGI.macros.valueFromType = (type) => {
        switch (type) {
            case "float":
                return 0;

            case "string":
                return "";

            case "vec2":
                return new coffeeEngine.vector2(0,0);
            
            case "vec3":
                return new coffeeEngine.vector3(0,0,0);
            
            case "vec4":
                return new coffeeEngine.vector4(0,0,0,0);

            case "array":
                return [];

            case "object":
                return {};
        
            default:
                return "";
        }
    }

    const createArrayElementContainer = (text, element, refreshData, data) => {
        const container = document.createElement("div");
        container.className = "CUGI-ItemContainer";

        //Contains text and controls
        const controlEl = document.createElement("div");
        controlEl.style.height = "100%";
        controlEl.style.display = "grid";
        controlEl.style.alignContent = "center";
        controlEl.style.alignItems = "center";
        controlEl.style.verticalAlign = "center";
        controlEl.style.gridTemplateColumns = "auto auto";
        {
            const removeEl = document.createElement("button");
            removeEl.innerText = "X";
            removeEl.style.height = "2em";
            removeEl.style.aspectRatio = "1";
            controlEl.appendChild(removeEl);

            //The data removal process
            removeEl.onclick = () => {
                data.target.splice(data.key, 1);
                refreshData();

                if (data.onchange) data.onchange(null, {});
            }

            const textEl = document.createElement("p");
            textEl.className = "CUGI-PropertyName CUGI-ItemName";
            textEl.innerText = text;
            controlEl.appendChild(textEl);
        }

        const elementContainer = document.createElement("div");
        elementContainer.className = "CUGI-ItemValueDiv";
        elementContainer.appendChild(element);

        container.appendChild(controlEl);
        container.appendChild(elementContainer);

        return container;
    }

    CUGI.types["array"] = (data) => {
        const { target, key } = data;
        target[key] = target[key] || [];

        //Create our container
        const arrayContainer = document.createElement("div");
        arrayContainer.className = "CUGI-arrayContainer";

        const elementAdder = document.createElement("dropdown-menu");
        //Fancy vs not fancy
        data.types = data.types || ["number", "vec2", "vec3", "vec4", "string", "array", "object"];
        data.createText = data.createText || editor.language["engine.projectSettings.broadcasts.newElement"];
        if (data.notFancy) {
            data.types = data.types || ["string", "array", "object"];
            data.createText = data.createText || editor.language["engine.projectSettings.broadcasts.add"];
        }

        //Element adder
        elementAdder.innerHTML = editor.language["engine.projectSettings.broadcasts.add"];

        data.types.forEach(element => {
            elementAdder.innerHTML += `<dropdown-item value="${element}">${editor.language[`engine.CUGI.${element}`] || element}</dropdown-item>`;            
        });

        //Refresh data
        const refreshData = () => {
            arrayContainer.innerHTML = "";

            //Cycle through each element in our array
            for (let item in target[key]) {

                //Get the CUGI type and add the element
                const CUGIType = CUGI.macros.typeFromValue(target[key][item]);
                if (CUGI.types[CUGIType]) {
                    const newInputData = {...data, target: target[key], key: item};
                    const input = CUGI.types[CUGIType](newInputData);
                    const itemText = item + Number(editor.settings.values.Editor.startIndex);
                    arrayContainer.appendChild(createArrayElementContainer(itemText, input, refreshData, newInputData));
                }
            }

            //Append the element adder again
            arrayContainer.appendChild(elementAdder);
        }

        //Give functionality to the element adder
        elementAdder.onchange = (value) => {
            target[key].push(CUGI.macros.valueFromType(value));
            if (CUGI.types[value]) {
                const ID = target[key].length - 1;
                const newInputData = {...data, target: target[key], key: ID};
                const input = CUGI.types[value](newInputData);
                const itemText = ID + Number(editor.settings.values.Editor.startIndex);
                arrayContainer.insertBefore(createArrayElementContainer(itemText, input, refreshData, newInputData), elementAdder);

                if (data.onchange) data.onchange(null, {target, key});
            }
        }

        refreshData();

        return arrayContainer;
    }
})();