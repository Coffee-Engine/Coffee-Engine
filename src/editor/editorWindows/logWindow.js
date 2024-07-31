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

                container.appendChild(displayEl)
            }
        }

        resized() {
        }

        dispose() {
        }
    };
})();
