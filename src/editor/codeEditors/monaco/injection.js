window.monacoManager = {
    workspace:null,
    
    inject: (container) => {
        //This? This is it?   yes
        window.monacoManager.workspace = monaco.editor.create(container, {
            automaticLayout: true
        });

        return window.monacoManager.workspace;
    }
}