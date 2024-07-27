(function() {
    editor.Storage = {};

    editor.Storage.getStorage = (storageKey, defaultValue) => {
        return localStorage.getItem(storageKey) === null ? defaultValue : localStorage.getItem(storageKey)
    }
})();