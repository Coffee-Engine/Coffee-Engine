let require = {
    paths: {
      vs: "https://unpkg.com/monaco-editor@0.34.0/min/vs",
    },
};
  
window.monacoManager = {
    workspace:null,
    fontSize:12,
    
    inject: (container) => {
        //This? This is it?   yes
        monacoManager.workspace = monaco.editor.create(container, {
            automaticLayout: true,
            fontSize: monacoManager.fontSize,
            fontFamily: monacoManager.fontStyle
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
                    foreground: document.body.style.getPropertyValue("--comment"),
                    fontStyle: "bold",
                },
                {
                    token: "comment.doc",
                    foreground: document.body.style.getPropertyValue("--comment-doc"),
                    fontStyle: "bold",
                },
                {
                    token: "comment.doc.keyword",
                    foreground: document.body.style.getPropertyValue("--comment-doc-keyword"),
                    fontStyle: "bold",
                },
                {
                    token: "comment.doc.type",
                    foreground: document.body.style.getPropertyValue("--comment-doc-type"),
                    fontStyle: "bold",
                },

                //classes
                {
                    token: "type.identifier",
                    foreground: document.body.style.getPropertyValue("--class-name"),
                    fontStyle: "bold",
                },

                //delimiters
                {
                    token: "delimiter",
                    foreground: document.body.style.getPropertyValue("--delimiter"),
                },
                {
                    token: "delimiter.bracket",
                    foreground: document.body.style.getPropertyValue("--delimiter-bracket"),
                },

                //Strings
                {
                    token: "string.invalid",
                    foreground: document.body.style.getPropertyValue("--string-error"),
                    fontStyle: "bold",
                },
                {
                    token: "string.escape.invalid",
                    foreground: document.body.style.getPropertyValue("--string-error"),
                    fontStyle: "bold",
                },
                {
                    token: "string",
                    foreground: document.body.style.getPropertyValue("--string"),
                },
                {
                    token: "string.escape",
                    foreground: document.body.style.getPropertyValue("--string-escape"),
                    fontStyle: "bold",
                },

                //regexp
                {
                    token: "regexp",
                    foreground: document.body.style.getPropertyValue("--regexp"),
                },
                {
                    token: "regexp.invalid",
                    foreground: document.body.style.getPropertyValue("--regexp-invalid"),
                    fontStyle: "bold",
                },
                {
                    token: "regexp.escape",
                    foreground: document.body.style.getPropertyValue("--regexp-escape"),
                    fontStyle: "bold",
                },
                {
                    token: "regexp.escape.control",
                    foreground: document.body.style.getPropertyValue("--regexp-escape"),
                    fontStyle: "bold",
                },

                //numbers
                {
                    token: "number",
                    foreground: document.body.style.getPropertyValue("--number-color"),
                    fontStyle: "italic",
                },
                {
                    token: "number.float",
                    foreground: document.body.style.getPropertyValue("--number-color"),
                    fontStyle: "italic",
                },
                {
                    token: "number.hex",
                    foreground: document.body.style.getPropertyValue("--number-color-unusual"),
                    fontStyle: "bold",
                },
                {
                    token: "number.octal",
                    foreground: document.body.style.getPropertyValue("--number-color-unusual"),
                    fontStyle: "bold",
                },
                {
                    token: "number.binary",
                    foreground: document.body.style.getPropertyValue("--number-color-unusual"),
                    fontStyle: "bold",
                },

                //keywords
                {
                    token: "keyword",
                    foreground: document.body.style.getPropertyValue("--keyword")
                }
            ],
            colors: {
                "editor.foreground": document.body.style.getPropertyValue("--code-text"),
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