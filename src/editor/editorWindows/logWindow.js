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

                this.oldLog(...stuff);
            }

            window.warn = (...stuff) => {
                const displayEl = document.createElement("div");
                displayEl.innerText = stuff.join("\n");

                displayEl.style.width = "100%";
                displayEl.style.backgroundColor = "var(--warn)";
                displayEl.style.color = "var(--warn-text)";

                container.appendChild(displayEl);

                this.oldWarn(...stuff);
            }

            console.error = (...stuff) => {
                const displayEl = document.createElement("div");
                displayEl.innerText = stuff.join("\n");

                displayEl.style.width = "100%";
                displayEl.style.backgroundColor = "var(--error)";
                displayEl.style.color = "var(--error-text)";

                container.appendChild(displayEl);

                this.oldError(...stuff);
            }

            window.onerror = (event, source, lineno, colno, error) => {
                const displayEl = document.createElement("div");
                displayEl.innerText = error;

                displayEl.style.width = "100%";
                displayEl.style.backgroundColor = "var(--error)";
                displayEl.style.color = "var(--error-text)";

                container.appendChild(displayEl);
            }
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
