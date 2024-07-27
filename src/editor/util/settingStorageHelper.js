(function() {
    editor.Storage = {};

    editor.Storage.getStorage = (storageKey, defaultValue) => {
        if (localStorage.getItem(storageKey) === null) {
            return defaultValue;
        }

        try {
            const parsed = JSON.parse(localStorage.getItem(storageKey));
            return parsed;
            
        } catch (error) {
            return localStorage.getItem(storageKey);
        }
    }

    editor.Storage.setStorage = (storageKey, value) => {
        if (typeof value == "object") {
            localStorage.setItem(storageKey,JSON.stringify(value));
            return;
        }
        localStorage.setItem(storageKey,value);
    }
})();