(function () {
    editor.dropdown = {
        current: null,
        currentPromise: null,
        fromElements: (left, top, dropdownItems) => {
            return new Promise((resolve, reject) => {
                if (editor.dropdown.current) editor.dropdown.eventListener();
                //Create our dropdown div
                const dropdownElement = document.createElement("div");
                dropdownElement.style.position = "absolute";
                dropdownElement.style.left = `${left}px`;
                dropdownElement.style.top = `${top}px`;
                dropdownElement.style.display = "flex";
                dropdownElement.style.flexDirection = "column";
                //I'll be impressed if somebody gets a window this high;
                dropdownElement.style.zIndex = "100000000";

                //Loop through each item of the dropdown.
                Array.from(dropdownItems).forEach((child) => {
                    //Make sure we have an item
                    if (child instanceof editor.dropdown.itemClass) {
                        const button = document.createElement("button");

                        button.innerHTML = child.innerHTML;
                        dropdownElement.appendChild(button);

                        button.onclick = (event) => {
                            event.stopPropagation();
                            resolve(child.value);
                            editor.dropdown.eventListener();
                        };
                    }
                });

                //document.body.addEventListener("click",editor.dropdown.eventListener);

                //Wowzers
                editor.dropdown.current = dropdownElement;
                editor.dropdown.currentPromise = resolve;

                document.body.appendChild(dropdownElement);
            });
        },

        eventListener: () => {
            if (editor.dropdown.current) editor.dropdown.current.parentElement.removeChild(editor.dropdown.current);
            if (editor.dropdown.currentPromise) editor.dropdown.currentPromise();
            editor.dropdown.currentPromise = null;
            editor.dropdown.current = null;
        },
    };

    document.addEventListener("click", editor.dropdown.eventListener);

    editor.dropdown.itemClass = class extends HTMLElement {
        static observedAttributes = ["onclick", "value", "disabled"];

        disabled = false;

        get value() {
            return this.getAttribute("value");
        }

        constructor() {
            super();
        }

        connectedCallback() {
            if (this.getAttribute("onclick")) {
                this.onclick = new Function(this.getAttribute("color"));
            }

            this.style.display = "none";
        }
    };

    editor.dropdown.class = class extends HTMLElement {
        static observedAttributes = ["disabled"];

        disabled = false;

        constructor() {
            super();

            this.onclick = (event) => {
                event.stopPropagation();
                if (this.disabled) return;

                let boundingRect = this.getBoundingClientRect();
                editor.dropdown.fromElements(boundingRect.left, boundingRect.bottom, this.children).then((value) => {
                    this.onchange(value);
                });
            };
        }

        onchange = (value) => {};
    };

    customElements.define("dropdown-menu", editor.dropdown.class);
    customElements.define("dropdown-item", editor.dropdown.itemClass);
})();
