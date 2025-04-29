(function() {
    window.coffeeDebugger = {
        open: false,

        createElementFromObject: (obj) => {
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
                    displayEl.innerHTML = '<p style="margin:0px;">[</p>';
                    displayEl.style.userSelect = "none";
                    displayEl.style.cursor = "auto";

                    //Loop through items
                    for (let itemInd = 0; itemInd < obj.length; itemInd++) {
                        const innerEl = this.createElementFromObject(obj[itemInd]);
                        innerEl.style.marginLeft = "8px";

                        displayEl.appendChild(innerEl);
                    }

                    //and cap it off
                    const ending = document.createElement("p");
                    ending.innerHTML += "]";
                    ending.style.margin = "0px";
                    displayEl.appendChild(ending);

                    //Remove the unpack functionality
                    displayEl.onclick = () => {};
                };

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
                        displayEl.innerHTML = '<p style="margin:0px;">{</p>';

                        if (!obj) {
                            ('<p style="margin:0px;">Nothing</p>');
                            return;
                        }

                        Object.keys(obj).forEach((key) => {
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
                        const ending = document.createElement("p");
                        ending.innerHTML = "}";
                        ending.style.margin = "0px";
                        displayEl.appendChild(ending);

                        //Remove the unpack functionality
                        displayEl.onclick = () => {};
                    };
                    break;

                case "undefined":
                    displayEl.style.innerHTML = '<span class="italicThing">undefined</span>';
                    break;

                case "function":
                    displayEl.innerText = "function()";
                    displayEl.style.cursor = "pointer";
                    displayEl.style.userSelect = "none";

                    displayEl.onclick = () => {
                        displayEl.style.userSelect = "text";
                        displayEl.style.cursor = "auto";
                        displayEl.innerText = obj.toString();
                    };
                    break;

                default:
                    displayEl.innerText = obj;
                    break;
            }

            return displayEl;
        },

        init: () => {
            const notifDiv = document.createElement("div");
            
            //Style that puppy!
            notifDiv.style.position = "absolute";
            notifDiv.style.top = "0px";
            notifDiv.style.left = "0px";
            notifDiv.style.width = "100%";
            notifDiv.style.height = "128px";
            notifDiv.style.transition = "opacity 250ms";
            notifDiv.style.backgroundColor = "#00000099";
            notifDiv.style.pointerEvents = "none";
            notifDiv.style.overflowX = "hidden";
            notifDiv.style.overflowY = "scroll";
            notifDiv.style.setProperty("--open", "0%");

            notifDiv.innerHTML = `<p style="color:rgb(61, 192, 243);">${editor.language["runtime.debugText"]}</p>`;

            document.body.appendChild(notifDiv);

            notifDiv.style.opacity = "100%";

            notifDiv.onclick = (event) => {
                event.stopImmediatePropagation();
                event.stopPropagation();
            }

            setTimeout(() => {
                notifDiv.style.opacity = "var(--open)";
            }, 2500);

            document.addEventListener("keydown", (event) => {
                if (event.shiftKey && event.key.toLowerCase() == "i") {
                    coffeeDebugger.open = !coffeeDebugger.open;
                    notifDiv.style.setProperty("--open", coffeeDebugger.open ? "100%" : "0%");
                    notifDiv.style.pointerEvents = coffeeDebugger.open ? "all" : "none";
                }
            });

            coffeeEngine.addEventListener("consoleUpdate", (event) => {
                //The element to display
                let displayColor = "#ffffff";

                //Just for different types
                switch (event.type) {
                    case "warn": {
                        displayColor = "#ffff9f";
                        break;
                    }

                    case "error": {
                        displayColor = "#ff9f9f";
                        break;
                    }

                    case "clear": {
                        notifDiv.innerHTML = "";
                        return;
                    }

                    default: {
                        displayColor = "#ffffff";
                        break;
                    }
                }

                event.info.forEach((item) => {
                    const displayEl = event.info.lineNumber && event.info.columnNumber ? coffeeDebugger.createElementFromObject(`${item}\n ${lineno}/${colno}`) : coffeeDebugger.createElementFromObject(item);
                    displayEl.style.color = displayColor;
                    displayEl.style.fontWeight = "bold";

                    notifDiv.appendChild(displayEl);
                });

                notifDiv.scrollTo(0, notifDiv.scrollHeight);
            });
        },
    }

    window.coffeeDebugger.init();
})();