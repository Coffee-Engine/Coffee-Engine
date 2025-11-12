(function () {
    editor.boot = async () => {
        //First, get the splash author
        editor.home.splashAuthor = await fetch("editor/images/splashAuthor.txt").then(result => result.text());

        //Then start the engine.
        if (!editor.Storage.keyExists("language")) {
            editor.setup.initilizeLang();
        } else {
            editor.home.initilize();
        }
    };
})();
