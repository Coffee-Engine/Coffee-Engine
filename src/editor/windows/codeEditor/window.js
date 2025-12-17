(function () {
    editor.windows.codeEditor = class extends editor.windows.base {
        init(container) {
            //Declare some small variables
            this.title = editor.language["editor.window.codeEditor"];
            this.usingSugarCube = false;
            this.filePath = false;
            this.closable = false;

            //This windows funny variables
            this.scriptShortcuts = [];
            this.fileReader = new FileReader();

            //Setup stuff
            this.setupFileHooks();
            this.makeLayout(container);
            this.addButtonsAndFileSelection();
            this.appendButtonAction();

            //The two IDEs?
            this.workspace = {
                codeMirror: mirrorManager.inject(this.codeMirrorArea, true),
                sugarcube: sugarcube.inject(this.blocklyArea),
            };

            this.codeMirrorArea.style.height = "100%";
        }

        //The layout of the editor
        addScriptToSidebar(path) {
            //Make sure we don't already have this path
            if (this.scriptShortcuts.includes(path)) return;

            //Add and style the button appropriately
            const button = document.createElement("button");
            button.style.width = "116px";
            button.style.textAlign = "left";

            //Split it up and get the correct file extension and pathing
            const splitPath = path.split("/");
            button.innerText = splitPath[splitPath.length - 1];
            button.setAttribute("path", path);

            //When we click open the file
            button.onclick = () => {
                //Remove the button once it doesn't work
                this.openFile(path, path.split(".")[1]).catch(() => {
                    button.onclick = () => {};
                    this.scriptShortcuts.splice(this.scriptShortcuts.indexOf(path), 1);
                    this.scriptContainer.removeChild(button);
                });
            };

            //And add our context functions
            button.contextFunction = () => {
                return [
                    { text: editor.language["editor.window.codeEditor.openShortcut"], value: "open" },
                    { text: editor.language["editor.window.codeEditor.closeShortcut"], value: "close" },
                ];
            };

            button.contentAnswer = (value) => {
                switch (value) {
                    case "open":
                        //I'a open da file.
                        this.openFile(path, path.split(".")[1]).catch(() => {
                            button.onclick = () => {};
                            this.scriptShortcuts.splice(this.scriptShortcuts.indexOf(path), 1);
                            this.scriptContainer.removeChild(button);
                        });
                        break;

                    case "close":
                        //Remove the button
                        button.onclick = () => {};
                        this.scriptShortcuts.splice(this.scriptShortcuts.indexOf(path), 1);
                        this.scriptContainer.removeChild(button);
                        break;

                    default:
                        break;
                }
            };

            this.scriptContainer.appendChild(button);
            this.scriptShortcuts.push(path);
        }

        makeLayout(container) {
            container.style.position = "relative";
            container.style.overflowY = "clip";
            this.split = document.createElement("div");
            editor.quickCSS(this.split, {
                display: "grid",
                gridTemplateColumns: "128px auto",
                height: "100%"
            });

            //This is where we put our actions
            this.actionBar = document.createElement("div");
            editor.quickCSS(this.actionBar, {
                display: "grid",
                overflowY: "hidden",
                height: "100%",
                backgroundColor: "var(--background-1)",
                gridTemplateRows: "32px 32px 32px 1fr",
            });

            //code area!
            this.codeArea = document.createElement("div");
            editor.quickCSS(this.codeArea, {
                height: "100%",
                position: "relative"
            });

            //Nothing Open text
            this.nothingOpen = document.createElement("div");
            this.nothingOpen.innerText = "Nothing Open";
            this.nothingOpen.className = "genericNonSelect";
            editor.quickCSS(this.nothingOpen, {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "xx-large",
                position: "absolute"
            });

            //Blockly
            this.blocklyArea = document.createElement("div");
            this.codeMirrorArea = document.createElement("div");
            editor.quickCSS([this.blocklyArea, this.codeMirrorArea], {
                width: "100%",
                height: "100%",
                top: "0px",
                left: "0px",
                position: "absolute",
                visibility: "hidden"
            });

            this.codeArea.appendChild(this.nothingOpen);
            this.codeArea.appendChild(this.blocklyArea);
            this.codeArea.appendChild(this.codeMirrorArea);

            container.appendChild(this.split);

            this.split.appendChild(this.actionBar);
            this.split.appendChild(this.codeArea);
        }

        addButtonsAndFileSelection() {
            this.newScriptButton = document.createElement("button");
            this.saveScriptButton = document.createElement("button");
            this.loadScriptButton = document.createElement("button");
            this.scriptContainer = document.createElement("button");
            
            this.newScriptButton.innerText = editor.language["editor.window.codeEditor.newScript"];
            this.saveScriptButton.innerText = editor.language["editor.window.codeEditor.saveScript"];
            this.loadScriptButton.innerText = editor.language["editor.window.codeEditor.loadScript"];

            this.actionBar.appendChild(this.newScriptButton);
            this.actionBar.appendChild(this.saveScriptButton);
            this.actionBar.appendChild(this.loadScriptButton);
            this.actionBar.appendChild(this.scriptContainer);

            editor.quickCSS([this.newScriptButton, this.saveScriptButton, this.loadScriptButton, this.scriptContainer], {
                width: "120px",
                margin: "4px"
            });

            editor.quickCSS(this.scriptContainer, {
                padding: "0px",
                backgroundColor: "var(--background-2)",
                overflowX: "hidden",
                overflowY: "scroll",
                flex: "flex",
                flowDirection: "column",
            });
        }

        saveCurrentFile() {
            if (!this.filePath) return;

            const { compileFunction, useBlocklyEditor, stopCompileFileCreation } = editor.getLanguageDefFromExtension(this.readType);

            //Saving for our two code editors
            project.setFile(this.filePath, useBlocklyEditor ? JSON.stringify(sugarcube.serialize()) : mirrorManager.workspace.getValue(), "text/javascript").then(() => {
                console.log(editor.language["editor.notification.saveScript"].replace("[path]", this.filePath));
            });

            //If our scripting language has a compile function compile it
            if (compileFunction) {
                const compiled = compileFunction(useBlocklyEditor ? sugarcube.workspace : mirrorManager.workspace.getValue(), `${this.filePath.split(".")[0]}.cjs`, this.filePath);
                if (!stopCompileFileCreation)
                    project.setFile(`${this.filePath.split(".")[0]}.cjs`, compiled, "text/javascript").then(() => {
                        console.log(editor.language["editor.notification.compileScript"].replace("[input]", this.filePath).replace("[output]", `${this.filePath.split(".")[0]}.cjs`));
                    });
            }

            //If its our special little fella (sugarcube)  do nothing?
            //! if (this.filePath.split(".")[1].toLowerCase() == "cescr") {
            //! }
            //! I'm keeping this as a word of warning
        }

        appendButtonAction() {
            this.newScriptButton.onclick = () => {
                //Create and show the new script window
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
            editor.addFileHook(["txt", "js", "cjs", "json", "cappu", "cescr", "glsl"], this.openFile, this);

            //If we error hide both editors in punishment
            this.fileReader.onerror = () => {
                this.blocklyArea.style.visibility = "hidden";
                this.codeMirrorArea.style.visibility = "hidden";
                this.title = editor.language["editor.window.codeEditor"];
            };
        }
        
        //Remove stuff
        dispose() {
            editor.removeOpenFileHook("txt", this.openFile, this);
            editor.removeOpenFileHook("js", this.openFile, this);
            editor.removeOpenFileHook("cjs", this.openFile, this);
            editor.removeOpenFileHook("json", this.openFile, this);
            editor.removeOpenFileHook("cappu", this.openFile, this);
            editor.removeOpenFileHook("cescr", this.openFile, this);
            editor.removeOpenFileHook("glsl", this.openFile, this);
        }

        fileLoaded(path, content, extension) {
            const { useBlocklyEditor } = editor.getLanguageDefFromExtension(extension);
            this.readType = extension;

            //Swap 'em
            if (!useBlocklyEditor) {
                this.codeMirrorArea.style.visibility = "inherit";
                this.blocklyArea.style.visibility = "hidden";
                this.usingSugarCube = false;

                mirrorManager.setScript(content, editor.languageRedirects[extension] || extension);
                sugarcube.deserialize({});
            } else {
                this.codeMirrorArea.style.visibility = "hidden";
                this.blocklyArea.style.visibility = "inherit";
                this.usingSugarCube = true;

                sugarcube.deserialize(JSON.parse(content));
                mirrorManager.setScript("", "");
            }

            this.title = `${path} | ${editor.language["editor.window.codeEditor"]}`;
        }

        openFile(path, extension) {
            //Make sure its lowercase
            extension = extension.toLowerCase();

            return new Promise((resolve, reject) => {
                //Grab our file and read it
                project
                    .getFileContents(path)
                    .then((text) => resolve(this.fileLoaded(path, text, extension)))
            });
        }
    };

    editor.windows.__Serialization.register(editor.windows.codeEditor, "codeEditor", { onlyOne: true });
})();
