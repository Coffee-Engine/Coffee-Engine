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

                displayEl.style.width = "100%";

                container.appendChild(displayEl);
            }

            window.warn = (...stuff) => {
                const displayEl = document.createElement("div");
                displayEl.innerText = stuff.join("\n");

                displayEl.style.width = "100%";
                displayEl.style.backgroundColor = "var(--warn)";

                container.appendChild(displayEl);
            }

            console.error = (...stuff) => {
                const displayEl = document.createElement("div");
                displayEl.innerText = stuff.join("\n");

                displayEl.style.width = "100%";
                displayEl.style.backgroundColor = "var(--error)";

                container.appendChild(displayEl);
            }

            window.onerror = (event, source, lineno, colno, error) => {
                console.log(arguments)
                const displayEl = document.createElement("div");
                displayEl.innerText = error;

                displayEl.style.width = "100%";
                displayEl.style.backgroundColor = "var(--error)";

                container.appendChild(displayEl);
            }
        }

        resized() {
        }

        dispose() {
        }
    };
})();
