let require = {
    paths: {
      vs: "https://unpkg.com/monaco-editor@0.34.0/min/vs",
    },
};
  
window.monacoManager = {
    workspace:null,
    
    inject: (container) => {
        //This? This is it?   yes
        monacoManager.workspace = monaco.editor.create(container, {
            automaticLayout: true
        });
        monaco.editor.setTheme("coffee-engine");

        return monacoManager.workspace;
    },

    setScript: (contents,type) => {
        monacoManager.workspace.setValue(contents);
        monaco.editor.setModelLanguage(monacoManager.workspace.getModel(),type);
    },

    refreshTheme: () => {
        //We stylin now
        monaco.editor.defineTheme("coffee-engine", {
            base: `vs-dark`,
            inherit: true,
            rules: [
                //Comments
                {
                    token: "comment",
                    foreground: document.body.style.getPropertyValue("--text-3"),
                    fontStyle: "bold",
                },
                {
                    token: "comment.doc",
                    foreground: "#958072",
                    fontStyle: "bold",
                },

                //classes
                {
                    token: "type.identifier",
                    foreground: "#e5823f",
                    fontStyle: "bold",
                },

                //delimiters
                {
                    token: "delimiter",
                    foreground: "#e38d55",
                },
                {
                    token: "delimiter.bracket",
                    foreground: "#e7b252",
                },

                //Strings
                {
                    token: "string.invalid",
                    foreground: document.body.style.getPropertyValue("--error"),
                    fontStyle: "bold",
                },
                {
                    token: "string.escape.invalid",
                    foreground: document.body.style.getPropertyValue("--error"),
                    fontStyle: "bold",
                },
                {
                    token: "string",
                    foreground: document.body.style.getPropertyValue("--text-2"),
                },
                {
                    token: "string.escape",
                    foreground: document.body.style.getPropertyValue("--text-1"),
                    fontStyle: "bold",
                },

                //regexp
                {
                    token: "regexp",
                    foreground: "#eba2ce",
                },
                {
                    token: "regexp.invalid",
                    foreground: document.body.style.getPropertyValue("--error"),
                    fontStyle: "bold",
                },
                {
                    token: "regexp.escape",
                    foreground: document.body.style.getPropertyValue("--text-1"),
                    fontStyle: "bold",
                },
                {
                    token: "regexp.escape.control",
                    foreground: document.body.style.getPropertyValue("--text-1"),
                    fontStyle: "bold",
                },

                //numbers
                {
                    token: "number",
                    foreground: "#bce579",
                    fontStyle: "italic",
                },
                {
                    token: "number.float",
                    foreground: "#bce579",
                    fontStyle: "italic",
                },
                {
                    token: "number.hex",
                    foreground: "#5bb498",
                    fontStyle: "bold",
                },
                {
                    token: "number.octal",
                    foreground: "#5bb498",
                    fontStyle: "bold",
                },
                {
                    token: "number.binary",
                    foreground: "#5bb498",
                    fontStyle: "bold",
                },

                //keywords
                {
                    token: "keyword",
                    foreground: "#d76f2b"
                }
            ],
            colors: {
                "editor.foreground": document.body.style.getPropertyValue("--text-1"),
                "editor.background": document.body.style.getPropertyValue("--background-2"),
                "editor.selectionBackground": document.body.style.getPropertyValue("--background-4"),
                "editor.lineHighlightBackground": document.body.style.getPropertyValue("--background-1"),
                "editor.highlightBackground": document.body.style.getPropertyValue("--background-4"),
                "editorCursor.foreground": document.body.style.getPropertyValue("--text-1"),
                "editorWhitespace.foreground": document.body.style.getPropertyValue("--background-3"),
                "editorIndentGuide.background": document.body.style.getPropertyValue("--text-2"),
                "editor.selectionHighlightBorder": document.body.style.getPropertyValue("--background-4"),
                'editorIndentGuides': document.body.style.getPropertyValue("--background-3"),
                'editorActiveIndentGuides': document.body.style.getPropertyValue("--background-1"),
                'editor.inactiveSelectionBackground': document.body.style.getPropertyValue("--text-3") + "66",
                'editor.selectionHighlight': document.body.style.getPropertyValue("--text-1") + "66",
            },
        });

        monaco.editor.setTheme("coffee-engine");
    }
}