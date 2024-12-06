(function () {
    editor.boot = () => {
        if (!editor.Storage.keyExists("language")) {
            editor.setup.initilizeLang();
        } else {
            editor.home.initilize();
        }
    }
})();
