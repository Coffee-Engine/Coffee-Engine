(function () {
    editor.windows.newScript = class extends editor.windows.base {
        minWidth = 400;
        minHeight = 200;

        init(container) {
            this.resizable = false;
            this.dockable = false;
            this.title = editor.language["editor.window.createScript"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "50px 50px 50px 50px";

            //This dropdown is where we select our programming language
            this.type = document.createElement("select");
            this.type.style.margin = "12px";
            this.type.style.marginLeft = "50px";
            this.type.style.marginRight = "50px";

            //Sugarcube inheritence to make sure we have the right blocks
            let sugarcubeInheritence = "Node";
            this.inheritence = document.createElement("button");
            this.inheritence.style.margin = "12px";
            this.inheritence.style.marginLeft = "50px";
            this.inheritence.style.marginRight = "50px";

            this.inheritence.innerHTML = `${editor.language["editor.window.createScript.inherits"]} : ${editor.language["engine.nodeNames.Node"]}`;
            this.inheritence.onclick = () => {
                const nodeMaker = new editor.windows.nodeMaker(400, 200);

                nodeMaker.__moveToTop();

                nodeMaker.x = window.innerWidth / 2 - 200;
                nodeMaker.y = window.innerHeight / 2 - 100;

                nodeMaker.title = editor.language["editor.window.createScript.selectInheritence"];

                nodeMaker.onNodeClicked = (nodeName) => {
                    sugarcubeInheritence = nodeName;
                    this.inheritence.innerHTML = `${editor.language["editor.window.createScript.inherits"]} : ${editor.language[`engine.nodeNames.${nodeName}`] || nodeName}`;
                    nodeMaker._dispose();
                };
            };

            //Populate the type dropdown
            programmingLanguages.forEach((languageDef) => {
                const optionElement = document.createElement("option");

                optionElement.innerHTML = `${languageDef.hasTranslation ? editor.language[`editor.window.${languageDef.id}`] : languageDef.id} (${languageDef.fileExtension})`;
                optionElement.value = languageDef.fileExtension;

                this.type.appendChild(optionElement);
            });

            this.type.onchange = () => {
                this.path.value = `${this.path.value.split(".")[0]}.${this.type.value}`;

                if (editor.getLanguageDefFromExtension(this.type.value).useBlocklyEditor) {
                    container.style.gridTemplateRows = "50px 50px 50px 50px";
                    this.inheritence.style.visibility = "visible";
                    this.inheritence.style.pointerEvents = "all";
                } else {
                    container.style.gridTemplateRows = "66px 66px 0px 66px";
                    this.inheritence.style.visibility = "hidden";
                    this.inheritence.style.pointerEvents = "none";
                }
            };

            //This is our file path
            this.path = document.createElement("input");
            this.path.type = "text";
            this.path.value = "scripts/newScript.js";
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
                    project.setFile(this.path.value, editor.getLanguageDefFromExtension(this.type.value).defaultBehavior(sugarcubeInheritence, this.path.value), "text/javascript").then((path) => {
                        editor.sendFileHook(path.split(".")[1], path);
                        this._dispose();
                    });
                });
            };

            container.appendChild(this.type);
            container.appendChild(this.path);
            container.appendChild(this.inheritence);
            container.appendChild(this.createButton);

            //Make sure the layout corrolates
            this.type.onchange();
        }
    };
})();
