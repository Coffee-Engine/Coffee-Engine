(function() {
    editor.windows.codeEditor = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.codeEditor"];
            this.makeLayout(container);
            
            monacoManager.refreshTheme();
            //monacoManager.inject(this.codeArea);
            sugarcube.inject(this.codeArea);
        }

        makeLayout(container) {
            this.split = document.createElement("div");
            this.split.style.display = "grid";
            this.split.style.gridTemplateColumns = "128px auto";
            this.split.style.height = "100%";

            this.actionBar = document.createElement("div");
            this.actionBar.style.height = "100%";
            this.actionBar.style.backgroundColor = "var(--background-1)";

            this.codeArea = document.createElement("div");
            this.codeArea.style.height = "100%";

            container.appendChild(this.split);

            this.split.appendChild(this.actionBar);
            this.split.appendChild(this.codeArea);
        }
    }

    editor.windows.__Serialization.register(editor.windows.codeEditor,"codeEditor");
})();