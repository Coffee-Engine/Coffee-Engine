(function() {
    window.editorFS = {
        find: (src) => {
            let grabbed = window.editorFSObject;
            src.split("/").forEach(path => {
                if (!grabbed) return;
                grabbed = grabbed[path];
            });
            return grabbed || "";
        }
    }
})();