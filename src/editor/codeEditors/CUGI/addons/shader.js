(function() {
    CUGI.displays["shader"] = (data, parameters) => {
        const { target, key } = data;
        target[key] = target[key] || { shader: "", parameters: {}};

        //Create the container
        const container = document.createElement("div");
        container.className = "CUGI-PropertyHolder CUGI-SubMenu";
        
        //Get our base shaders
        let baseShaders = {};
        Object.keys(coffeeEngine.renderer.mainShaders).map((key) => {
            baseShaders[`${key}.glsl`] = key;
            return key;
        });

        //Display our properties
        const display = async (preloadedShader) => {
            container.innerHTML = "";

            const items = [
                {target: target[key], key: "shader", translationKey: "engine.fileProperties.Shader.shader", type: coffeeEngine.PropertyTypes.FILE, fileType: "glsl", systemRoot: { "/____NAMESPACE__IDENTIFIER____/": true, "coffee:": baseShaders, "project:": project.fileSystem }, onchange: (value) => {
                    coffeeEngine.renderer.fileToShader(value).then((shader) => {
                        target[key].$processedShader = null;
                        display(shader);
                    });
                }}
            ];

            if (preloadedShader) {
                for (let uniform in preloadedShader.uniforms) {
                    //Make sure our uniform is valid.
                    if (coffeeEngine.renderer.engineUniforms.includes(uniform)) continue;

                    const newParam = {...coffeeEngine.renderer.uniformTypesToCUGI[preloadedShader.uniforms[uniform].type], target: target[key].parameters, key: uniform}
                    items.push(newParam);
                }

                //Add the sub CUGI
                container.appendChild(CUGI.createList(items, parameters));

                return;
            }

            //Yeah
            coffeeEngine.renderer.fileToShader(target[key].shader).then((shader) => {
                for (let uniform in shader.uniforms) {
                    //Make sure our uniform is valid.
                    if (coffeeEngine.renderer.engineUniforms.includes(uniform)) continue;

                    const newParam = {...coffeeEngine.renderer.uniformTypesToCUGI[shader.uniforms[uniform].type], target: target[key].parameters, key: uniform}
                    items.push(newParam);
                }

                //Add the sub CUGI
                container.appendChild(CUGI.createList(items, parameters));
            })
            //Incase it doesn't exist anymore!
            .catch(() => {
                //Add the sub CUGI
                container.appendChild(CUGI.createList(items, parameters));
            });
        }

        display();

        //Return
        return container;
    }


    //Yippie?
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

    CUGI.types["shaderArray"] = (data) => {
        const { target, key } = data;
        target[key] = target[key] || [];

        //Create our container
        const arrayContainer = document.createElement("div");
        arrayContainer.className = "CUGI-arrayContainer";

        const elementAdder = document.createElement("button");
        //Fancy vs not fancy
        data.types = ["shader"];
        data.createText = data.createText || editor.language["engine.projectSettings.broadcasts.newElement"];

        //Element adder
        elementAdder.innerHTML = editor.language["engine.projectSettings.broadcasts.add"];

        //Refresh data
        const refreshData = () => {
            arrayContainer.innerHTML = "";

            //Cycle through each element in our array
            for (let item in target[key]) {
                //Get the CUGI type and add the element
                const newInputData = {...data, target: target[key], key: item};
                const input = CUGI.displays["shader"](newInputData);
                const itemText = item + Number(editor.settings.values.Editor.startIndex);
                arrayContainer.appendChild(createArrayElementContainer(itemText, input, refreshData, newInputData));
            }

            //Append the element adder again
            arrayContainer.appendChild(elementAdder);
        }

        //Give functionality to the element adder
        elementAdder.onclick = () => {
            target[key].push({shader: null, parameters: {}});
            const ID = target[key].length - 1;
            const newInputData = {...data, target: target[key], key: ID};
            const input = CUGI.displays["shader"](newInputData);
            const itemText = ID + Number(editor.settings.values.Editor.startIndex);
            arrayContainer.insertBefore(createArrayElementContainer(itemText, input, refreshData, newInputData), elementAdder);

            if (data.onchange) data.onchange(null, {target, key});
        }

        refreshData();

        return arrayContainer;
    }
})();