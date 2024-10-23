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
            inherit: false,
            rules: [],
            colors: {
                "editor.foreground": document.body.style.getPropertyValue("--text-1"),
                "editor.background": document.body.style.getPropertyValue("--background-2"),
            },
        });

        monaco.editor.setTheme("coffee-engine");
    }
}