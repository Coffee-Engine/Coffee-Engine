(function() {
    window.project = {
        fileSystem:{},

        setFile: (path,contents,type) => {
            const split = path.split("/");
            new File([contents], split[split.length], {
                type: type,
            });
        },

        //create stuff
        new: (json,type) => {
            delete project.fileSystem;
            project.fileSystem = {};

            project.setFile("project.json",JSON.stringify(json),"text/plain");
        },

        load:() => {

        }
    }
})()