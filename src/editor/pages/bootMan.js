(function() {
    if (!editor.Storage.keyExists("language")) {
        editor.setup.initilize();
    }
    else {
        editor.home.initilize();
    }
})();