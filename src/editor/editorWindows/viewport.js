//Old obsolete window. Here for historical reasons. and incase I want to restore some LOST MEDIA
(function () {
    editor.windows.viewport = class extends editor.windows.base {
        init(container) {
            this.canvas = document.createElement("canvas");
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";

            container.appendChild(this.canvas);

            //Resize to initial size
            const clientSize = this.canvas.getBoundingClientRect();
            this.canvas.width = clientSize.width;
            this.canvas.height = clientSize.height;

            this.DaveShade = DaveShade.createInstance(this.canvas);
            console.log(this.DaveShade);
        }

        resize() {
            const clientSize = this.canvas.getBoundingClientRect();
            this.canvas.width = clientSize.width;
            this.canvas.height = clientSize.height;
        }
    };

    editor.windows.__Serialization.register(editor.windows.viewport,"viewport");
})();
