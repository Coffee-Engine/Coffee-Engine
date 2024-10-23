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

    refreshTheme: () => {
        //We stylin now
        monaco.editor.defineTheme("coffee-engine", {
            base: `vs-dark`,
            inherit: true,
            rules: [],
            colors: {
                "editor.foreground": document.body.style.getPropertyValue("--text-1"),
                "editor.background": document.body.style.getPropertyValue("--background-2"),
                "editor.selectionBackground": document.body.style.getPropertyValue("--background-4"),
                "editor.lineHighlightBackground": document.body.style.getPropertyValue("--background-1"),
                "editor.highlightBackground": document.body.style.getPropertyValue("--background-4"),
                "editorCursor.foreground": document.body.style.getPropertyValue("--text-1"),
                "editorWhitespace.foreground": document.body.style.getPropertyValue("--background-3"),
                "editorIndentGuide.background": document.body.style.getPropertyValue("--text-4"),
                "editor.selectionHighlightBorder": document.body.style.getPropertyValue("--background-4"),
                'editorIndentGuides': document.body.style.getPropertyValue("--background-3"),
                'editorActiveIndentGuides': document.body.style.getPropertyValue("--background-1"),
                'editor.inactiveSelectionBackground': document.body.style.getPropertyValue("--error") + "66",
                'editor.selectionHighlight': document.body.style.getPropertyValue("--text-1") + "66",
            },
        });

        monaco.editor.setTheme("coffee-engine");
    }
}