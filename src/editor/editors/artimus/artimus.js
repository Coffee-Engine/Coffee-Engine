window.artimus = {
    workspace: class {
        //Our own quickCSS function, for use outside of coffee engine.
        quickCSS(element, css) {
            if (Array.isArray(element)) {
                for (let elID in element) {
                    editor.quickCSS(element[elID], css);
                }
            }

            if (!(element instanceof HTMLElement)) return element;

            for (let key in css) {
                element.style[key] = css[key];
            }

            return element;
        }

        constructor(overrideCSS) {
            this.canvas = document.createElement("canvas");

            this.quickCSS()
        }
    },

    createWorkspace: () => {

    }
}