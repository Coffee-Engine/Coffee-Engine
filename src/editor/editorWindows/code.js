(function() {
    editor.windows.codeEditor = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.codeEditor"];
            
            //This windows funny variables
            this.scriptShortcuts = [];
            this.fileReader = new FileReader();

            //Setup stuff
            this.setupFileHooks();
            this.makeLayout(container);
            this.addButtonsAndFileSelection();
            
            monacoManager.refreshTheme();
            monacoManager.inject(this.monacoArea);
            sugarcube.inject(this.blocklyArea);
        }

        //The layout of the editor
        addScriptToSidebar(path) {
            const button = document.createElement("button");
            const splitPath = path.split("/")
            button.innerText = splitPath[splitPath.length - 1];
            button.setAttribute("path",path);

            this.scriptContainer.appendChild(button);
            this.scriptShortcuts.push({
                button:button,
                path:path
            });
        }
        makeLayout(container) {
            container.style.position = "relative";
            container.style.overflowY = "clip";
            this.split = document.createElement("div");
            this.split.style.display = "grid";
            this.split.style.gridTemplateColumns = "128px auto";
            this.split.style.height = "100%";

            this.actionBar = document.createElement("div");
            this.actionBar.style.display = "grid";
            this.actionBar.style.height = "100%";
            this.actionBar.style.overflowY = "hidden";
            this.actionBar.style.backgroundColor = "var(--background-1)";
            this.actionBar.style.gridTemplateRows = "32px 32px 32px 1fr";

            this.codeArea = document.createElement("div");
            this.codeArea.style.height = "100%";
            this.codeArea.style.position = "relative";

            this.blocklyArea = document.createElement("div");
            this.blocklyArea.style.width = "100%";
            this.blocklyArea.style.height = "100%";
            this.blocklyArea.style.top = "0px";
            this.blocklyArea.style.left = "0px";
            this.blocklyArea.style.position = "absolute";
            this.blocklyArea.style.visibility = "hidden";

            this.monacoArea = document.createElement("div");
            this.monacoArea.style.width = "100%";
            this.monacoArea.style.height = "100%";
            this.monacoArea.style.top = "0px";
            this.monacoArea.style.left = "0px";
            this.monacoArea.style.position = "absolute";
            this.monacoArea.style.visibility = "hidden";

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
            this.newScriptButton.innerText = `New Script`;
            this.actionBar.appendChild(this.newScriptButton);

            this.saveScriptButton = document.createElement("button");
            this.saveScriptButton.style.width = "120px";
            this.saveScriptButton.style.margin = "4px";
            this.saveScriptButton.innerText = `Save Script`;
            this.actionBar.appendChild(this.saveScriptButton);

            this.loadScriptButton = document.createElement("button");
            this.loadScriptButton.style.width = "120px";
            this.loadScriptButton.style.margin = "4px";
            this.loadScriptButton.innerText = `Load Script`;
            this.actionBar.appendChild(this.loadScriptButton);

            this.scriptContainer = document.createElement("button");
            this.scriptContainer.style.width = "120px";
            this.scriptContainer.style.margin = "4px";
            this.scriptContainer.style.backgroundColor = "var(--background-2)";
            this.scriptContainer.style.display = "grid";
            this.scriptContainer.style.overflowY = "scroll";
            this.scriptContainer.style.gridTemplateColumns = "1fr";
            this.actionBar.appendChild(this.scriptContainer);
        }

        //Setup our file hooks
        setupFileHooks() {
            editor.addFileOpenHook("txt",this.openFile,this);
            editor.addFileOpenHook("md",this.openFile,this);
            editor.addFileOpenHook("js",this.openFile,this);
            editor.addFileOpenHook("json",this.openFile,this);
            editor.addFileOpenHook("cappu",this.openFile,this);
            editor.addFileOpenHook("cescr",this.openFile,this);

            this.fileReader.onload = () => {
                //Swap 'em
                if (this.readType != "cescr") {
                    this.monacoArea.style.visibility = "visible";
                    this.blocklyArea.style.visibility = "hidden";

                    monacoManager.setScript(this.fileReader.result,this.readType);
                }
                else {
                    this.monacoArea.style.visibility = "hidden";
                    this.blocklyArea.style.visibility = "visible";
                }
            }
        }

        openFile(path,extension) {
            //Grab our file and read it
            project.getFile(path)[0].getFile().then(file => {
                this.fileReader.readAsText(file);
                this.readType = extension;
            })
        }
    }

    editor.windows.__Serialization.register(editor.windows.codeEditor,"codeEditor");
})();