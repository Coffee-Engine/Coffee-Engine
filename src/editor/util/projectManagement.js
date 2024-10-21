(function() {
    window.project = {
        formatVersion:1,
        fileSystem:{},

        setFile: (path,contents,type) => {
            const split = path.split("/");
            let fold = project.fileSystem;
            for (let id = 0; id < split.length; id++) {
                //If we reach the end of the path continue!
                if (id == (split.length - 1)) {
                    fold[split[id]] = new File([contents], split[id], {
                        type: type,
                    });
                    return;
                }

                //make folders if need be
                if (!fold[split[id]]) fold[split[id]] = {};
                fold = fold[split[id]];
            }
        },

        getFile: (path) => {
            const split = path.split("/");
            let fold = project.fileSystem;
            for (let id = 0; id < split.length; id++) {
                //If we reach the end of the path continue!
                if (id == (split.length - 1)) {
                    return fold[split[id]];
                }

                //make folders if need be
                if (!fold[split[id]]) return null;
                fold = fold[split[id]];
            }
        },

        //create stuff
        new: (json,type) => {
            delete project.fileSystem;
            project.fileSystem = {};

            if (type == "folder") {
                window
                    .showDirectoryPicker()
                    .then((result) => {
                        console.log(result);
                    })
                    .catch((error) => {});
            }
            else {
                project.setFile("project.json",JSON.stringify(json),"text/plain");
            }
        },

        load:() => {

        }
    }
})()