require = {
    paths: {
      vs: "https://unpkg.com/monaco-editor@0.34.0/min/vs",
    },
};
  
window.mirrorManager = {
    workspace:null,
    fontSize:12,
    
    inject: (container, mainWorkspace) => {
        //This? This is it?   yes
        const newWorkspace = CodeMirror(container, {
            dragDrop: false,
            theme: "coffee-engine",
            lineNumbers: true,
            foldGutter: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            hintOptions: {
                hint: CodeMirror.hint.javascript,
            },
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        newWorkspace.on("inputRead", (cm, changeObj) => {
            const positiveChange = changeObj.text[0];

            //Check for validity
            let valid = positiveChange.length == 1;
            valid = valid && (positiveChange != " " || positiveChange != "\n" || positiveChange != "\t");
            valid = valid && (positiveChange == "." || (/\p{L}/u).test(positiveChange));

            if (valid) newWorkspace.showHint({ completeSingle: false });
        })
        
        if (mainWorkspace) mirrorManager.workspace = newWorkspace;

        return newWorkspace;
    },

    setScript: (contents,type) => {
        mirrorManager.workspace.setValue(contents);
        mirrorManager.workspace.setOption("mode", type);
    },
}