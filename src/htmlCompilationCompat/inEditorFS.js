(function() {
    window.isSingleFile = true;
    
    window.editorFS = {
        find: (src) => {
            let grabbed = window.editorFSObject;
            src.split("/").forEach(path => {
                if (!grabbed) return;
                grabbed = grabbed[path];
            });
            return grabbed || null;
        }
    }

    const oldFetch = fetch;
    fetch = (src) => {
        return new Promise((resolve,reject) => {
            const editorFSfetch = editorFS.find(src);

            //Horrible idea. Will expand later hopefully
            if (editorFSfetch) {
                resolve({text:() => {editorFSfetch}});
                return;
            }

            fetch(src).then(response => {resolve(response)}).catch(response => {reject(response)});
        })
    }
})();