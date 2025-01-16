//TODAY WE START THE RUNTIME!
(function() {
    //Function for compiling the runtime into a general html file
    editor.runtime.compile = () => {
        //grab every script we need for runtime
        const scripts = Array.from(document.getElementsByTagName("script"));
        for (let i = 0; i < scripts.length; i++) {
            //Make sure the script is a RUNTIME script
            const src = scripts[i].getAttribute("src");
            if (src && src.startsWith("engine/")) {
                scripts[i] = src;
            }
            //If it isn't a runtime script splice it out.
            else {
                scripts.splice(i,1);
                i--;
            }
        }

        //Now we do the actual compiling
        return new Promise(async (resolve, reject) => {
            let returned = [editor.runtime.prefixes.join("\n")];

            for (const scriptID in scripts) {
                const scriptContents = await fetch(scripts[scriptID]).then(result => result.text());
                returned.push("<script>",scriptContents,"</script>");
            }

            returned.push(editor.runtime.suffixes.join("\n"));

            resolve(returned.join("\n"));
        })
    }
})();