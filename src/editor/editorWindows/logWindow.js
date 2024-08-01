(function () {
    editor.windows.log = class extends editor.windows.base {

        init(container) {
            this.title = "Log";

            this.oldLog = console.log;
            this.oldWarn = console.warn;
            this.oldError = console.error;

            console.log = (...stuff) => {
                const displayEl = document.createElement("div");
                displayEl.innerText = stuff.join("\n");
                displayEl.className = "logInfo";

                container.appendChild(displayEl);

                this.oldLog(...stuff);
            }

            window.warn = (...stuff) => {
                const displayEl = document.createElement("div");
                displayEl.innerText = stuff.join("\n");
                displayEl.className = "logInfo logWarn";

                container.appendChild(displayEl);

                this.oldWarn(...stuff);
            }

            console.error = (...stuff) => {
                const displayEl = document.createElement("div");
                displayEl.innerText = stuff.join("\n");
                displayEl.className = "logInfo logError";

                container.appendChild(displayEl);

                this.oldError(...stuff);
            }

            window.addEventListener("error", (event) => {
                //The one thing we need from the event
                const { error, lineno, colno } = event;

                //The element to display
                const displayEl = document.createElement("div");
                displayEl.innerText = `${error}\n ${lineno}/${colno}`;
                displayEl.className = "logInfo logError";

                container.appendChild(displayEl);
            });
        }

        resized() {
        }

        dispose() {
            console.log = this.oldLog;
            console.warn = this.oldWarn;
            console.error = this.oldError;

            window.onerror = () => {};
        }
    };
})();
