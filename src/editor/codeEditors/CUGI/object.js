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
                delete data.target[data.key];
                refreshData();
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

    CUGI.types["object"] = (data) => {
        const { target, key } = data;
        target[key] = target[key] || {};

        //Create our container
        const objectContainer = document.createElement("div");
        objectContainer.className = "CUGI-objectContainer";

        const elementContainer = document.createElement("div");
        elementContainer.style.display = "grid";
        elementContainer.style.gridTemplateColumns = "50% 50%";

        const elementName = document.createElement("input");
        elementName.placeholder = editor.language["engine.CUGI.key"];
        elementName.type = "text";
        elementName.className = "CUGI-itemKey";

        const elementAdder = document.createElement("dropdown-menu");
        elementAdder.innerHTML = `
            ${editor.language["engine.CUGI.newElement"]}
            <dropdown-item value="float">${editor.language["engine.CUGI.number"]}</dropdown-item>
            <dropdown-item value="vec2">${editor.language["engine.CUGI.vec2"]}</dropdown-item>
            <dropdown-item value="vec3">${editor.language["engine.CUGI.vec3"]}</dropdown-item>
            <dropdown-item value="vec4">${editor.language["engine.CUGI.vec4"]}</dropdown-item>
            <dropdown-item value="string">${editor.language["engine.CUGI.string"]}</dropdown-item>
            <dropdown-item value="array">${editor.language["engine.CUGI.array"]}</dropdown-item>
            <dropdown-item value="object">${editor.language["engine.CUGI.object"]}</dropdown-item>
        `;

        elementContainer.appendChild(elementName);
        elementContainer.appendChild(elementAdder);

        //Refresh data
        const refreshData = () => {
            objectContainer.innerHTML = "";

            //Cycle through each element in our array
            for (let item in target[key]) {

                //Get the CUGI type and add the element
                const CUGIType = CUGI.macros.typeFromValue(target[key][item]);
                if (CUGI.types[CUGIType]) {
                    const newInputData = {...data, target: target[key], key: item};
                    const input = CUGI.types[CUGIType](newInputData);
                    objectContainer.appendChild(createArrayElementContainer(item, input, refreshData, newInputData));
                }
            }

            //Append the element adder again
            objectContainer.appendChild(elementContainer);
        }

        //Give functionality to the element adder
        elementAdder.onchange = (value) => {
            if (target[key][elementName.value] !== undefined) return;
            target[key][elementName.value] = CUGI.macros.valueFromType(value);
            if (CUGI.types[value]) {
                const ID = elementName.value;
                const newInputData = {...data, target: target[key], key: ID};
                const input = CUGI.types[value](newInputData);
                objectContainer.insertBefore(createArrayElementContainer(ID, input, refreshData, newInputData), elementContainer);

                elementName.value = "";
            }
        }

        refreshData();

        return objectContainer;
    }
})();