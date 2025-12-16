(function() {
    editor.windows.fileCreator = class extends editor.windows.base {
        minWidth = 400;
        minHeight = 150;

        init(container) {
            this.resizable = false;
            this.dockable = false;
            this.title = editor.language["editor.window.createFile"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "50px 50px 50px";

            //This dropdown is where we select our programming language
            this.type = document.createElement("select");
            this.type.style.margin = "12px";
            this.type.style.marginLeft = "50px";
            this.type.style.marginRight = "50px";

            //Populate the type dropdown
            editor.fileTypeDefs.forEach((languageDef) => {
                const optionElement = document.createElement("option");

                optionElement.innerHTML = `${languageDef.hasTranslation ? editor.language[`editor.window.createFile.${languageDef.id}`] : languageDef.id} (${languageDef.fileExtension})`;
                optionElement.value = languageDef.fileExtension;

                this.type.appendChild(optionElement);
            });

            this.type.onchange = () => {
                this.path.value = `${this.path.value.split(".")[0]}.${this.type.value}`;
            };

            //This is our file path
            this.path = document.createElement("input");
            this.path.type = "text";
            this.path.value = "newFile.txt";
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
                    this.createFile(this.path.value);
                    this._dispose();
                })
            };

            container.appendChild(this.type);
            container.appendChild(this.path);
            container.appendChild(this.createButton);

            //Make sure the layout corrolates
            this.type.onchange();
        }

        createFile(path) {
            project.setFile(path, editor.findFileTypeFromExtension(this.type.value).contents, "text/javascript").then((path) => {
                editor.sendFileHook(path.split(".")[1], path);
            });
        }
    };    
})();