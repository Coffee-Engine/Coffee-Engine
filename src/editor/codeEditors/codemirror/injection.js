require = {
    paths: {
      vs: "https://unpkg.com/monaco-editor@0.34.0/min/vs",
    },
};
  
window.mirrorManager = {
    workspace:null,
    fontSize:12,
    
    inject: (container) => {
        //This? This is it?   yes
        mirrorManager.workspace = CodeMirror(container, {
            dragDrop: false,
            theme: "coffee-engine",
            lineNumbers: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        return mirrorManager.workspace;
    },

    setScript: (contents,type) => {
        mirrorManager.workspace.setValue(contents);
        mirrorManager.workspace.setOption("mode", type);
    },
}