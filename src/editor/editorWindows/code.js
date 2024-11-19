(function () {
    editor.windows.codeEditor = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.codeEditor"];
            this.usingSugarCube = false;
            this.filePath = false;

            //This windows funny variables
            this.scriptShortcuts = [];
            this.fileReader = new FileReader();

            //Setup stuff
            this.setupFileHooks();
            this.makeLayout(container);
            this.addButtonsAndFileSelection();
            this.appendButtonAction();

            monacoManager.refreshTheme();
            //The two IDEs?
            this.workspace = {
                monaco: monacoManager.inject(this.monacoArea),
                sugarcube: sugarcube.inject(this.blocklyArea),
            };
        }

        //The layout of the editor
        addScriptToSidebar(path) {
            if (this.scriptShortcuts.includes(path)) return;

            const button = document.createElement("button");
            button.style.width = "116px";
            button.style.textAlign = "left";
            const splitPath = path.split("/");
            button.innerText = splitPath[splitPath.length - 1];
            button.setAttribute("path", path);

            button.onclick = () => {
                //Remove the button once it doesn't work
                this.openFile(path, path.split(".")[1]).catch(() => {
                    this.scriptContainer.removeChild(button);
                });
            };

            this.scriptContainer.appendChild(button);
            this.scriptShortcuts.push(path);
        }
        makeLayout(container) {
            container.style.position = "relative";
            container.style.overflowY = "clip";
            this.split = document.createElement("div");
            this.split.style.display = "grid";
            this.split.style.gridTemplateColumns = "128px auto";
            this.split.style.height = "100%";

            //This is where we put our actions
            this.actionBar = document.createElement("div");
            this.actionBar.style.display = "grid";
            this.actionBar.style.height = "100%";
            this.actionBar.style.overflowY = "hidden";
            this.actionBar.style.backgroundColor = "var(--background-1)";
            this.actionBar.style.gridTemplateRows = "32px 32px 32px 1fr";

            //code area!
            this.codeArea = document.createElement("div");
            this.codeArea.style.height = "100%";
            this.codeArea.style.position = "relative";

            //Nothing Open text
            this.nothingOpen = document.createElement("div");
            this.nothingOpen.style.top = "50%";
            this.nothingOpen.style.left = "50%";
            this.nothingOpen.style.transform = "translate(-50%,-50%)";
            this.nothingOpen.style.fontSize = "xx-large";
            this.nothingOpen.style.position = "absolute";
            this.nothingOpen.innerText = "Nothing Open";
            this.nothingOpen.className = "genericNonSelect";

            //Blockly
            this.blocklyArea = document.createElement("div");
            this.blocklyArea.style.width = "100%";
            this.blocklyArea.style.height = "100%";
            this.blocklyArea.style.top = "0px";
            this.blocklyArea.style.left = "0px";
            this.blocklyArea.style.position = "absolute";
            this.blocklyArea.style.visibility = "hidden";

            //Monaco
            this.monacoArea = document.createElement("div");
            this.monacoArea.style.width = "100%";
            this.monacoArea.style.height = "100%";
            this.monacoArea.style.top = "0px";
            this.monacoArea.style.left = "0px";
            this.monacoArea.style.position = "absolute";
            this.monacoArea.style.visibility = "hidden";

            this.codeArea.appendChild(this.nothingOpen);
            this.codeArea.appendChild(this.blocklyArea);
            this.codeArea.appendChild(this.monacoArea);

            container.appendChild(this.split);

            this.split.appendChild(this.actionBar);
            this.split.appendChild(this.codeArea);
        }
        addButtonsAndFileSelection() {
            this.newScriptButton = document.createElement("button");
            this.newScriptButton.style.width = "120px";
            this.newScriptButton.style.margin = "4px";
            this.newScriptButton.innerText = editor.language["editor.window.codeEditor.newScript"];
            this.actionBar.appendChild(this.newScriptButton);

            this.saveScriptButton = document.createElement("button");
            this.saveScriptButton.style.width = "120px";
            this.saveScriptButton.style.margin = "4px";
            this.saveScriptButton.innerText = editor.language["editor.window.codeEditor.saveScript"];
            this.actionBar.appendChild(this.saveScriptButton);

            this.loadScriptButton = document.createElement("button");
            this.loadScriptButton.style.width = "120px";
            this.loadScriptButton.style.margin = "4px";
            this.loadScriptButton.innerText = editor.language["editor.window.codeEditor.loadScript"];
            this.actionBar.appendChild(this.loadScriptButton);

            this.scriptContainer = document.createElement("button");
            this.scriptContainer.style.width = "120px";
            this.scriptContainer.style.margin = "4px";
            this.scriptContainer.style.padding = "0px";
            this.scriptContainer.style.backgroundColor = "var(--background-2)";
            this.scriptContainer.style.overflowX = "hidden";
            this.scriptContainer.style.overflowY = "scroll";
            //this.scriptContainer.style.alignContent = "start";
            //this.scriptContainer.style.alignItems = "start";
            this.scriptContainer.style.display = "flex";
            this.scriptContainer.style.flexDirection = "column";
            this.actionBar.appendChild(this.scriptContainer);
        }

        saveCurrentFile() {
            if (!this.filePath) return;

            const { compileFunction, useBlocklyEditor } = editor.getLanguageDefFromExtension(this.readType);

            //Saving for our two code editors
            project.setFile(this.filePath, useBlocklyEditor ? JSON.stringify(sugarcube.serialize()) : monacoManager.workspace.getValue(), "text/javascript").then(() => {
                console.log(`Saved ${this.filePath} sucessfully`);
            });

            if (compileFunction) {
                project.setFile(`${this.filePath.split(".")[0]}.cjs`, compileFunction((useBlocklyEditor) ? sugarcube.workspace : monacoManager.workspace.getValue()), "text/javascript").then(() => {
                    console.log(`Compiled ${this.filePath} as ${`${this.filePath.split(".")[0]}.cjs`} sucessfully`);
                });
            }

            if (this.filePath.split(".")[1].toLowerCase() == "cescr") {
                
            }
        }

        appendButtonAction() {
            this.newScriptButton.onclick = () => {
                const createdWindow = new editor.windows.newScript(400, 200);
                createdWindow.__moveToTop();

                createdWindow.x = window.innerWidth / 2 - 200;
                createdWindow.y = window.innerHeight / 2 - 100;
            };

            this.saveScriptButton.onclick = () => {
                this.saveCurrentFile();
            };

            this.loadScriptButton.onclick = () => {
                //Its like a loading modal... like some sort of loadal. Get it loadal.
                const newLoadal = new editor.windows.modalFileExplorer(400, 400);

                newLoadal.__moveToTop();

                newLoadal.x = window.innerWidth / 2 - 200;
                newLoadal.y = window.innerHeight / 2 - 200;
                newLoadal.onFileSelected = (path) => {
                    this.openFile(path, path.split(".")[1]);
                };
            };

            //Add our save key
            window.addEventListener("keydown", (event) => {
                if (event.ctrlKey && event.key.toLowerCase() == "s") {
                    event.preventDefault();
                    this.saveCurrentFile();
                }
            });
        }

        resized() {
            Blockly.svgResize(sugarcube.workspace);
        }

        //Setup our file hooks
        setupFileHooks() {
            editor.addFileOpenHook("txt", this.openFile, this);
            editor.addFileOpenHook("js", this.openFile, this);
            editor.addFileOpenHook("cjs", this.openFile, this);
            editor.addFileOpenHook("json", this.openFile, this);
            editor.addFileOpenHook("cappu", this.openFile, this);
            editor.addFileOpenHook("cescr", this.openFile, this);

            //Load stuff
            this.fileReader.onload = () => {
                const { useBlocklyEditor } = editor.getLanguageDefFromExtension(this.readType);
                //Swap 'em
                if (!useBlocklyEditor) {
                    this.monacoArea.style.visibility = "visible";
                    this.blocklyArea.style.visibility = "hidden";
                    this.usingSugarCube = false;

                    monacoManager.setScript(this.fileReader.result, editor.languageRedirects[this.readType] || this.readType);
                } else {
                    this.monacoArea.style.visibility = "hidden";
                    this.blocklyArea.style.visibility = "visible";
                    this.usingSugarCube = true;

                    sugarcube.deserialize(JSON.parse(this.fileReader.result));
                }
            };
        }

        openFile(path, extension) {
            //Make sure its lowercase
            extension = extension.toLowerCase();

            return new Promise((resolve,reject) => {
                //Grab our file and read it
                project.getFile(path).then((file) => {
                    this.fileReader.readAsText(file);
                    this.readType = extension;
                    this.filePath = path;

                    this.addScriptToSidebar(path);
                    resolve();
                }).catch(() => {reject()});
            })
        }
    };

    editor.windows.__Serialization.register(editor.windows.codeEditor, "codeEditor", {onlyOne:true});
})();
