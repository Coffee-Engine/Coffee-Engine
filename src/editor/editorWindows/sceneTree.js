(function () {
    editor.windows.sceneTree = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.sceneTree"];

            //create our shiz
            container.style.display = "grid";
            container.style.gridTemplateRows = "24px 1fr";
            container.style.margin = "0px";
            container.style.overflow = "hidden";

            //Where log controls are stored
            this.logControls = document.createElement("div");
            this.logControls.style.width = "100%";
            this.logControls.style.backgroundColor = "var(--background-2)";

            this.addObject = document.createElement("button");
            this.addObject.innerText = editor.language["editor.window.sceneTree.addObject"];

            //when we click this add our window that adds a node to the scene
            this.addObject.onclick = () => {
                const createdWindow = new editor.windows.nodeMaker(400, 350);
                createdWindow.__moveToTop();

                createdWindow.x = window.innerWidth / 2 - 200;
                createdWindow.y = window.innerHeight / 2 - 175;
            }

            this.logControls.appendChild(this.addObject);
            container.appendChild(this.logControls);
        }

        resized() {}

        dispose() {}
    };

    editor.windows.__Serialization.register(editor.windows.sceneTree, "sceneTree");
})();
