(function () {
    editor.windows.log = class extends editor.windows.base {

        createElementFromObject(obj) {
            const displayEl = document.createElement("div");
            displayEl.style.userSelect = "text";

            //If it is an array allow us to unpack it.
            if (Array.isArray(obj)) {
                //Create the initial text showing that it is an array and it's length
                displayEl.innerText = `[Array ${obj.length}]`;
                displayEl.style.cursor = "pointer";

                //When we click it unfold it.
                displayEl.onclick = () => {
                    //Edit the display element
                    displayEl.innerHTML = "<p style=\"margin:0px;\">[</p>";
                    displayEl.style.userSelect = "none";
                    displayEl.style.cursor = "auto";

                    //Loop through items
                    for (let itemInd = 0; itemInd < obj.length; itemInd++) {
                        const innerEl = this.createElementFromObject(obj[itemInd]);
                        innerEl.style.marginLeft = "8px";
                        
                        displayEl.appendChild(innerEl);
                    }

                    //and cap it off
                    const ending = document.createElement("p")
                    ending.innerHTML += "]";
                    ending.style.margin = "0px";
                    displayEl.appendChild(ending);

                    //Remove the unpack functionality
                    displayEl.onclick = () => {}
                }

                return displayEl;
            }

            switch (typeof obj) {
                case "object":
                    displayEl.innerText = "{Object}";
                    displayEl.style.cursor = "pointer";
                    displayEl.style.userSelect = "none";

                    displayEl.onclick = () => {
                        displayEl.style.userSelect = "text";
                        displayEl.style.cursor = "auto";
                        displayEl.innerHTML = "<p style=\"margin:0px;\">{</p>";
                        Object.keys(obj).forEach(key => {
                            const innerEl = document.createElement("div");
                            innerEl.innerText = `${key}:`;
                            innerEl.style.margin = "0px";
                            innerEl.style.marginLeft = "8px";
                            innerEl.style.display = "flex";

                            const appendedEl = this.createElementFromObject(obj[key]);
                            innerEl.appendChild(appendedEl);
                            displayEl.appendChild(innerEl);
                        });

                        //and cap it off
                        const ending = document.createElement("p")
                        ending.innerHTML = "}";
                        ending.style.margin = "0px";
                        displayEl.appendChild(ending);
    
                        //Remove the unpack functionality
                        displayEl.onclick = () => {}
                    }
                    break;

                case "undefined":
                    displayEl.style.innerHTML = "<span class=\"italicThing\">undefined</span>";
                    break

                case "function":
                    displayEl.innerText = "function()";
                    displayEl.style.cursor = "pointer";
                    displayEl.style.userSelect = "none";

                    displayEl.onclick = () => {
                        displayEl.style.userSelect = "text";
                        displayEl.style.cursor = "auto";
                        displayEl.innerText = obj.toString();
                    }
                    break;
            
                default:
                    displayEl.innerText = obj;
                    break;
            }

            return displayEl;
        }

        init(container) {
            this.title = "Log";

            this.eventListener = coffeeEngine.addEventListener("consoleUpdate", (event) => {
                //The element to display
                let displayClass = "logInfo";

                switch (event.type) {
                    case "warn": {
                        displayClass = "logInfo logWarn";
                        break;
                    }

                    case "error": {
                        displayClass = "logInfo logError";
                        break;
                    }

                    default: {
                        displayClass = "logInfo";
                        break;
                    }
                };

                event.info.forEach(item => {
                    const displayEl =  (event.info.lineNumber && event.info.columnNumber) ? this.createElementFromObject(`${item}\n ${lineno}/${colno}`) : this.createElementFromObject(item);;
                    displayEl.className = displayClass;

                    container.appendChild(displayEl);
                });
            });
        }

        resized() {
        }

        dispose() {
            console.log = this.oldLog;
            console.warn = this.oldWarn;
            console.error = this.oldError;

            window.removeEventListener("error",this.eventListener);
        }
    };
})();
