(function () {
    if (!editor.Storage.keyExists("language")) {
        editor.setup.initilizeLang()
    } else {
        editor.home.initilize();
    }
})();
