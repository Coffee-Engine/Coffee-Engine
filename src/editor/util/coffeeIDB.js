//Just an API to store recent projects.
//If we need anything more we can always expand this.
(function () {
    const coffeeDBRequest = window.indexedDB.open(coffeeEngine.recentProjectDB, coffeeEngine.recentProjectDBVersion);

    editor.indexedDB = {
        available: false,

        promisifyRequest: (request) => {
            return new Promise((resolve, reject) => {
                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = (event) => {
                    console.log(event);
                    reject("Request failed");
                };
            });
        },

        //Creates our storage and the objects within
        getStore: (name, fromUpgrade) => {
            //Set up our store and transaction
            let transaction;
            let objectStore;

            if (fromUpgrade) {
                if (!editor.indexedDB.db.objectStoreNames.contains(name)) objectStore = editor.indexedDB.db.createObjectStore(name);
            } else {
                transaction = editor.indexedDB.db.transaction([name], "readwrite");
                objectStore = transaction.objectStore(name);
            }

            //Huh
            editor.indexedDB.stores[name] = {
                object: objectStore,
                transaction: transaction,

                //Allows us to initilize a transaction
                prepareTransaction: () => {
                    transaction = editor.indexedDB.db.transaction([name], "readwrite");
                    objectStore = transaction.objectStore(name);
                },

                //Our transactions
                setKey: (key, value) => {
                    return new Promise((resolve, reject) => {
                        editor.indexedDB.stores[name].deleteKey(key).then(() => {
                            editor.indexedDB.stores[name].prepareTransaction();
                            editor.indexedDB.promisifyRequest(objectStore.add(value, key)).then(resolve).catch(reject);
                        });
                    });
                },
                deleteKey: (key, value) => {
                    //Pain
                    return new Promise((resolve, reject) => {
                        editor.indexedDB.stores[name].getKey(key).then((result) => {
                            if (result) {
                                editor.indexedDB.stores[name].prepareTransaction();
                                editor.indexedDB.promisifyRequest(objectStore.delete(key)).then(resolve).catch(reject);
                            } else {
                                resolve();
                            }
                        });
                    });
                },
                getKey: (key) => {
                    editor.indexedDB.stores[name].prepareTransaction();
                    return editor.indexedDB.promisifyRequest(objectStore.get(key));
                },
                getKeys: () => {
                    editor.indexedDB.stores[name].prepareTransaction();
                    return editor.indexedDB.promisifyRequest(objectStore.getAllKeys());
                },
            };

            return editor.indexedDB.stores[name];
        },

        stores: {},
    };

    coffeeDBRequest.onerror = (event) => {
        console.log("Cannot connect to recent project database");
    };

    coffeeDBRequest.onupgradeneeded = (event) => {
        console.log(`Upgraded DB version to ${coffeeEngine.recentProjectDBVersion}`);
        editor.indexedDB.available = true;
        editor.indexedDB.upgraded = true;
        editor.indexedDB.db = event.target.result;

        editor.indexedDB.getStore("recentprojects", true);
    };

    coffeeDBRequest.onsuccess = (event) => {
        console.info("Connected to recent database");
        editor.indexedDB.available = true;
        editor.indexedDB.db = event.target.result;

        if (!editor.indexedDB.upgraded) editor.indexedDB.getStore("recentprojects", false);
        editor.boot();
    };
})();
