(function () {
    editor.windows.artEditor = class extends editor.windows.base {
        init(container) {
            //Declare some small variables
            this.title = editor.language["editor.window.artEditor"];
            this.filePath = false;
            this.closable = false;
            this.extensions = ["png", "jpeg", "jpg"];

            //This windows funny variables
            this.fileReader = new FileReader();

            //Setup stuff
            this.setupLayout(container);
            this.setupFileHooks();
        }

        //Setup our file hooks
        setupLayout(container) {
            container.style.gridTemplateColumns = "auto auto";

            //Top Bar
            this.topBar = document.createElement("div");
            this.topBar.style.backgroundColor = "var(--background-2)";

            this.topBar.appendChild(editor.createDropdown({
                text:"File",
                items: [
                    "New",
                    "Save",
                    "Load"
                ]
            }));
            container.appendChild(this.topBar);
        }

        setupFileHooks() {
            editor.addFileOpenHook(this.extensions, this.openFile, this);
            
            //Load stuff
            this.fileReader.onload = () => {
                const { useBlocklyEditor } = editor.getLanguageDefFromExtension(this.readType);
                //Swap 'em
                if (!useBlocklyEditor) {
                    this.codeMirrorArea.style.visibility = "inherit";
                    this.blocklyArea.style.visibility = "hidden";
                    this.usingSugarCube = false;

                    mirrorManager.setScript(this.fileReader.result, editor.languageRedirects[this.readType] || this.readType);
                    sugarcube.deserialize({});
                } else {
                    this.codeMirrorArea.style.visibility = "hidden";
                    this.blocklyArea.style.visibility = "inherit";
                    this.usingSugarCube = true;

                    sugarcube.deserialize(JSON.parse(this.fileReader.result));
                    mirrorManager.setScript("", "");
                }

                this.title = `${this.filePath} | ${editor.language["editor.window.codeEditor"]}`;
            };

            this.fileReader.onerror = () => {
                this.title = editor.language["editor.window.codeEditor"];
            };
        }

        openFile() {

        }
        
        //Remove stuff
        dispose() {
            editor.removeOpenFileHook(this.extensions, this.openFile, this);
        }
    };

    editor.windows.__Serialization.register(editor.windows.artEditor, "artEditor", { onlyOne: true });
})();
