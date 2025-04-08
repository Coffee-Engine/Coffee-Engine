(function () {
    editor.windows.newScene = class extends editor.windows.base {
        minWidth = 400;
        minHeight = 150;

        init(container) {
            this.resizable = false;
            this.dockable = false;
            this.title = editor.language["editor.window.createScript"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "75px 75px";

            //This is our file path
            this.path = document.createElement("input");
            this.path.type = "text";
            this.path.value = "scenes/newScene.scene";
            this.path.style.margin = "12px";
            this.path.style.marginLeft = "50px";
            this.path.style.marginRight = "50px";

            //And this button creates the script
            this.createButton = document.createElement("button");
            this.createButton.innerHTML = editor.language["engine.generic.done"];
            this.createButton.style.margin = "12px";
            this.createButton.style.marginLeft = "100px";
            this.createButton.style.marginRight = "100px";

            this.createButton.onclick = () => {
                //This might be the one reason I actually look for a catch :Skull Emoji:
                project.getFile(this.path.value).catch((reason) => {
                    //Then we set the file
                    project.setFile(this.path.value, '{"name": "scene","nodeType": "scene","children": []}', "text/javascript").then((path) => {
                        editor.sendFileHook(path.split(".")[1], path);
                        this._dispose();
                    });
                });
            };

            container.appendChild(this.path);
            container.appendChild(this.createButton);
        }
    };
})();
