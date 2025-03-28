(function() {
    window.CUGI = {
        macros:{
            inputElement: (type, extra) => {
                //Create our inputElement
                const inputEl = document.createElement("input");
                inputEl.type = type;

                //If not an object then return the input element
                if (!(typeof extra == "object")) return inputEl;

                //If we have extra use extra
                Object.keys(extra).forEach(key => {
                    if (typeof extra[key] == "undefined") return;
                    inputEl[key] = extra[key];
                });

                return inputEl;
            },
            onchange: (data, input, value, passthrough) => {
                value = value || "value";
                return () => {
                    data.target[data.key] = (typeof passthrough == "function") ? passthrough(input[value]) : input[value];
                    if (data.onchange) data.onchange(data.target[data.key], data);
                }
            }
        },

        //Custom Displays
        displays:{
            label: (data) => {
                const text = document.createElement("p");
                text.innerText = data.text || "No text";
                text.className = "CUGI-PropertyName CUGI-Label"

                return text;
            },
            header: (data) => {
                const text = document.createElement("h2");
                text.innerText = data.text || "No text";
                text.className = "CUGI-PropertyName CUGI-Header"

                return text;
            },
            subMenu: (data, parameters) => {
                //Create the container
                const container = document.createElement("div");
                container.className = "CUGI-PropertyHolder CUGI-SubMenu";

                if (!Array.isArray(data.items)) return container;
            
                //Add the sub CUGI
                container.appendChild(CUGI.createList(data.items, parameters));

                //Return
                return container;
            },
            button: (data) => {
                //Create the button
                const button = document.createElement('button');

                //Our button
                if (data.onclick) button.onclick = (event) => {data.onclick(button, event, data)};
                button.innerText = data.text || "No Text!";
                button.className = "CUGI-Button";

                return button;
            }
        },

        //Now declare our types
        types:{
            float: (data) => {
                const { target, key } = data;

                //Create our input
                const input = CUGI.macros.inputElement("number", { 
                    value: Number(target[key]), 
                    className: `CUGI-Number CUGI-Float ${data.extraStyle}`,
                    min: data.min,
                    max: data.max,
                    step: data.step,
                    size:2,
                    disabled: (typeof data.disabled == "function") ? data.disabled() : data.disabled
                });

                input.onchange = CUGI.macros.onchange(data, input);

                return input;
            },

            slider: (data) => {
                const {target, key} = data;

                data.min = data.min || 0;
                data.max = (data.max !== undefined) ? data.max : 100;

                //Create our number input
                const containerDiv = document.createElement("div");
                containerDiv.className = "CUGI-PropertyHolder CUGI-SliderHolder";

                const numberInput = CUGI.types.float(data);
                const sliderInput = CUGI.macros.inputElement("range", {
                    value: Number(target[key]),
                    className: `CUGI-Slider ${data.extraStyle}`,
                    min: data.min,
                    max: data.max,
                    step: data.step || 0.05,
                    disabled: (typeof data.disabled == "function") ? data.disabled() : data.disabled
                });

                sliderInput.onchange = CUGI.macros.onchange(data, sliderInput);
                sliderInput.disabled = (typeof data.disabled == "function") ? data.disabled() : data.disabled;

                containerDiv.appendChild(numberInput);
                containerDiv.appendChild(sliderInput);

                //Link them
                numberInput.oninput = () => {
                    sliderInput.value = numberInput.value;
                }

                sliderInput.oninput = () => {
                    numberInput.value = sliderInput.value;
                }

                return containerDiv;
            },

            int: (data) => {
                const { target, key } = data;

                //Create our input
                const input = CUGI.macros.inputElement("number", { 
                    value: Number(target[key]), 
                    className: `CUGI-Number CUGI-Int ${data.extraStyle}`,
                    min: data.min,
                    max: data.max,
                    step: 1,
                    size:2,
                    disabled: (typeof data.disabled == "function") ? data.disabled() : data.disabled
                });

                input.onchange = CUGI.macros.onchange(data, input, null, Math.floor);

                return input;
            },

            vec2: (data) => {
                const { target, key } = data;

                const containerDiv = document.createElement("div");
                containerDiv.className = "CUGI-PropertyHolder CUGI-Vec2";

                //Create our input
                const inputX = CUGI.types.float({...data, target: target[key], key: "x", extraStyle:"CUGI-Vec2 CUGI-X"});
                const inputY = CUGI.types.float({...data, target: target[key], key: "y", extraStyle:"CUGI-Vec2 CUGI-Y"});

                containerDiv.appendChild(inputX);
                containerDiv.appendChild(inputY);

                return containerDiv;
            },

            vec3: (data) => {
                const { target, key } = data;

                const containerDiv = document.createElement("div");
                containerDiv.className = "CUGI-PropertyHolder CUGI-Vec3";

                //Create our input
                const inputX = CUGI.types.float({...data, target: target[key], key: "x", extraStyle:"CUGI-Vec3 CUGI-X"});
                const inputY = CUGI.types.float({...data, target: target[key], key: "y", extraStyle:"CUGI-Vec3 CUGI-Y"});
                const inputZ = CUGI.types.float({...data, target: target[key], key: "z", extraStyle:"CUGI-Vec3 CUGI-Z"});

                containerDiv.appendChild(inputX);
                containerDiv.appendChild(inputY);
                containerDiv.appendChild(inputZ);

                return containerDiv;
            },

            vec4: (data) => {
                const { target, key } = data;

                const containerDiv = document.createElement("div");
                containerDiv.className = "CUGI-PropertyHolder CUGI-Vec4";

                //Create our input
                const inputX = CUGI.types.float({...data, target: target[key], key: "x", extraStyle:"CUGI-X"});
                const inputY = CUGI.types.float({...data, target: target[key], key: "y", extraStyle:"CUGI-Y"});
                const inputZ = CUGI.types.float({...data, target: target[key], key: "z", extraStyle:"CUGI-Z"});
                const inputW = CUGI.types.float({...data, target: target[key], key: "w", extraStyle:"CUGI-W"});

                containerDiv.appendChild(inputX);
                containerDiv.appendChild(inputY);
                containerDiv.appendChild(inputZ);
                containerDiv.appendChild(inputW);

                return containerDiv;
            },

            string: (data) => {
                const { target, key } = data;

                const input = CUGI.macros.inputElement("text", {
                    value: String(target[key]),
                    className: "CUGI-String",
                    placeholder: data.placeholder,
                    minlength: Math.floor(data.min),
                    maxlength: Math.floor(data.max),
                    spellcheck: data.spellcheck,
                    size:10,
                    disabled: (typeof data.disabled == "function") ? data.disabled() : data.disabled
                });

                input.onchange = CUGI.macros.onchange(data, input);

                return input;
            },

            multiline: (data) => {
                const {target, key} = data;

                //Create our textarea
                const input = document.createElement("textarea");
                input.className = "CUGI-String CUGI-Multiline";

                //Configure it
                input.autocapitalize = data.autocapitalize || false;
                input.autocomplete = data.autocomplete || false;
                input.autocorrect = data.autocorrect || false;
                input.spellcheck = (typeof data.spellcheck != "undefined") ? data.spellcheck : true;
                input.disabled = (typeof data.disabled == "function") ? data.disabled() : data.disabled;

                if (data.min) input.minlength = Math.floor(data.min);
                if (data.max) input.maxlength = Math.floor(data.max);

                input.placeholder = data.placeholder || "";
                input.wrap = data.wrap || "off";

                input.value = target[key];

                //Add our onchange
                input.onchange = CUGI.macros.onchange(data, input);

                //return
                return input;
            },

            boolean: (data) => {
                const { target, key } = data;

                const input = CUGI.macros.inputElement("checkbox", {
                    checked: Boolean(target[key]),
                    className: "CUGI-Boolean",
                    disabled: (typeof data.disabled == "function") ? data.disabled() : data.disabled
                });

                input.onchange = CUGI.macros.onchange(data, input, "checked");

                return input;
            },

            dropdown: (data) => {
                const { target, key } = data;

                const input = document.createElement("select");
                input.className = "CUGI-Dropdown";

                //Parse out menu items
                if (data.items) {
                    let parsedItems = data.items;
                    if (typeof parsedItems == "function") parsedItems = parsedItems(data);

                    //Make sure we have an array
                    if (Array.isArray(parsedItems)) parsedItems.forEach(item => {
                        const option = document.createElement("option");

                        switch (typeof item) {
                            //Handle strings
                            case "string":
                                option.innerText = item;
                                option.value = item;
                                break;

                            //Handle objects and arrays
                            case "object":
                                if (Array.isArray(item)) {
                                    option.innerText = item[0];
                                    option.value = item[1];
                                }
                                else {
                                    option.innerText = item.text;
                                    option.value = item.value;
                                }
                                break;
                        
                            default:
                                option.innerText = "Not set!";
                                option.value = "";
                                break;
                        }

                        input.appendChild(option);
                    });
                }
                
                input.value = target[key];

                input.onchange = CUGI.macros.onchange(data, input);

                return input;
            }
        },

        createList: (items, parameters) => {
            const container = document.createElement("div");

            const {globalChange, preprocess} = parameters || {};
            
            if (Array.isArray(items)) {
                items.forEach(item => {
                    //Make sure the item is an object
                    if (typeof item == "string") {
                        const propertyHolder = document.createElement("div");
                        propertyHolder.className = "CUGI-PropertyHolder";

                        propertyHolder.appendChild(CUGI.displays.label({ text:(item === "---") ? " " : item }));

                        container.appendChild(propertyHolder);
                        return;
                    }

                    if (typeof item != "object") return;

                    //Make sure we have a type
                    if (!item.type) return;

                    if (preprocess) {
                        item = preprocess(item);
                    }

                    //Displays are just static most of the time
                    if (CUGI.displays[item.type]) {
                        const propertyHolder = document.createElement("div");
                        propertyHolder.className = "CUGI-PropertyHolder";

                        //Add our display
                        propertyHolder.appendChild(CUGI.displays[item.type]({
                            //Our items
                            ...item, 
                            
                            //Our selection refresher
                            refreshSelection:() => {
                                //Refresh it
                                container.parentElement.insertBefore(CUGI.createList(items, parameters), container);
                                container.parentElement.removeChild(container);
                                container.innerHTML = "";
                            }
                        }, 
                        parameters));

                        container.appendChild(propertyHolder);
                        return;
                    }

                    //Make sure item target and key exist
                    if (!(item.target && item.key)) return;
                    
                    //Also make sure it's type exists
                    if (!CUGI.types[item.type]) return;

                    //If we have an globalChange add that
                    if (item.onchange && globalChange) {
                        const oldChange = item.onchange;
                        item.onchange = (value, data) => {
                            oldChange(value, data);
                            globalChange(value, data);
                        }
                    }
                    else if (globalChange) {
                        item.onchange = globalChange;
                    }

                    //Then assemble
                    const propertyHolder = document.createElement("div");
                    propertyHolder.className = "CUGI-PropertyHolder";

                    const label = document.createElement("p");
                    label.className = "CUGI-PropertyName";
                    label.innerText = item.text || item.key;

                    //Add our input
                    const input = CUGI.types[item.type]({
                        //Our items
                        ...item, 
                        
                        //Our selection refresher
                        refreshSelection:() => {
                            //Refresh it
                            container.parentElement.insertBefore(CUGI.createList(items, parameters), container);
                            container.parentElement.removeChild(container);
                            container.innerHTML = "";
                        }
                    }, 
                    parameters);

                    propertyHolder.appendChild(label);
                    propertyHolder.appendChild(input);

                    container.appendChild(propertyHolder);
                });
            }

            return container;
        }
    }
})();
