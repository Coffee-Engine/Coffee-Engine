//Just an API to store recent projects.
//If we need anything more we can always expand this.
(function() {
    const coffeeDBRequest = window.indexedDB.open(coffeeEngine.recentProjectDB, coffeeEngine.recentProjectDBVersion);

    editor.indexedDB = {
        available:false,

        promisifyRequest:(request) => {
            return new Promise((resolve,reject) => {
                request.onsuccess = () => {
                    resolve(request.result);
                };

                request.onerror = () => {
                    reject("Request failed");
                }
            })
        },

        //Creates our storage and the objects within
        createStore:(name,fromUpgrade) => {
            //Set up our store and transaction
            let transaction;
            let objectStore;

            if (fromUpgrade) {
                objectStore = editor.indexedDB.db.createObjectStore(name);
            }
            else {
                transaction = editor.indexedDB.db.transaction([name], "readwrite");
                objectStore = transaction.objectStore(name);
            }

            //Huh
            editor.indexedDB.stores[name] = {
                object: objectStore,
                transaction: transaction,
                setKey: (key, value) => {
                    transaction = editor.indexedDB.db.transaction([name], "readwrite");
                    objectStore = transaction.objectStore(name);
                    return editor.indexedDB.promisifyRequest(objectStore.add(value, key));
                },
                getKey: (key) => {
                    transaction = editor.indexedDB.db.transaction([name], "readwrite");
                    objectStore = transaction.objectStore(name);
                    return editor.indexedDB.promisifyRequest(objectStore.get(key));
                },
                getKeys: () => {
                    transaction = editor.indexedDB.db.transaction([name], "readwrite");
                    objectStore = transaction.objectStore(name);
                    return editor.indexedDB.promisifyRequest(objectStore.getAllKeys());
                }
            }

            return editor.indexedDB.stores[name];
        },

        stores: {}
    }

    coffeeDBRequest.onerror = (event) => {
        console.log("Cannot connect to recent project database");
    };
    
    coffeeDBRequest.onsuccess = (event) => {
        console.info("Connected to recent database");
        editor.indexedDB.available = true;
        editor.indexedDB.db = event.target.result;
    };

    coffeeDBRequest.onupgradeneeded = (event) => {
        console.log(`Upgraded DB version to ${coffeeEngine.recentProjectDBVersion}`);
        editor.indexedDB.available = true;
        editor.indexedDB.db = event.target.result;

        editor.indexedDB.createStore("recentprojects",true);
    }
})();