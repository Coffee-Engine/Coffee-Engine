(function () {
    editor.quickCSS = (element, css) => {
        if (Array.isArray(element)) {
            for (let elID in element) {
                editor.quickCSS(element[elID], css);
            }
        }

        if (!(element instanceof HTMLElement)) return element;

        for (let key in css) {
            element.style[key] = css[key];
        }

        return element;
    }

    editor.cssObjects = {};

    editor.useCSSCode = (code, name) => {
        if (!editor.cssObjects[name]) {
            const element = document.createElement("style");
            document.body.appendChild(element);

            editor.cssObjects[name] = element;
        }

        editor.cssObjects[name].innerHTML = code;
    }

    editor.useCSSFile = (url, name) => {
        fetch(url).then(result => result.text()).then(code => {
            editor.useCSSCode(code, name);
        })
    }

    //Quickly sets css variables
    editor.quickVar = (element, variables) => {
        if (Array.isArray(element)) {
            for (let elID in element) {
                editor.quickVar(element[elID], variables);
            }
        }

        if (!(element instanceof HTMLElement)) return element;

        for (let key in variables) {
            element.style.setProperty(`--${key}`, variables[key]);
        }

        return element;
    }


    //Host/Parasite relationship
    const host = document.createElement("div");

    editor.elementFromString = (element) => {
        host.innerHTML = element;

        //Remove the parasite
        const parasite = host.children[0];
        host.removeChild(parasite);
        return parasite;
    }

    const cache = {};

    editor.elementFromLink = (url) => {
        if (cache[url] instanceof Promise) return new Promise((resolve, reject) => cache[url].then(() => { resolve(editor.elementFromString(cache[url])); }));

        if (cache[url] && !(cache[url] instanceof Promise)) return new Promise((resolve, reject) => { resolve(editor.elementFromString(cache[url])); });

        cache[url] = new Promise((resolve, reject) => {
            fetch(url).then(result => result.text()).then(element => {
                cache[url] = element;
                resolve(editor.elementFromString(element));
            });
        });

        return cache[url];
    }
})();