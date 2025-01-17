//TODAY WE START THE RUNTIME!
(function() {
    //Function for compiling the runtime into a general html file
    editor.runtime.compile = (prefixes,suffixes) => {
        //Make sure our suffixes and stuff are arrays
        prefixes = prefixes || [];
        suffixes = suffixes || [];

        //grab every script we need for runtime
        const scripts = Array.from(document.getElementsByTagName("script"));
        for (let i = 0; i < scripts.length; i++) {
            //Make sure the script is a RUNTIME script
            const src = scripts[i].getAttribute("src");
            if (src && (src.startsWith("engine/") || src.startsWith("project/"))) {
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
            returned.push(...prefixes);

            for (const scriptID in scripts) {
                const scriptContents = await fetch(scripts[scriptID]).then(result => result.text());
                returned.push("<script>",scriptContents,"</script>");
            }

            returned.push(...suffixes);
            returned.push(editor.runtime.suffixes.join("\n"));

            resolve(returned.join("\n"));
        })
    }

    editor.runtime.compileWithDecaf = () => {
        const zipInstance = new JSZip();

        return new Promise((resolve, reject) => {
            project.decaf.loopThroughSave("", project.fileSystem, zipInstance, () => {
                zipInstance.generateAsync({type:"base64"}).then((base64) => {
                    //base64 = "data:application/zip;base64," + base64;

                    resolve(editor.runtime.compile(null, (`
<script>
project.load("base64",
"${base64}"
).then(() => {
    //Initilize the renderer
    const coffeeDrawCanvas = document.getElementById("coffeeEngine_MainCanvas");
    coffeeEngine.renderer.create(coffeeDrawCanvas);
    
    //Scene Stuff
    const currentScene = coffeeEngine.runtime.currentScene;
    currentScene.openScene("scenes/default.scene");
    currentScene.addEventListener("update",() => {
        coffeeDrawCanvas.width = window.innerWidth;
        coffeeDrawCanvas.height = window.innerHeight;
        coffeeEngine.renderer.drawBuffer.resize(coffeeDrawCanvas.width,coffeeDrawCanvas.height);
    });

    //Start the frameloop
    coffeeEngine.runtime.startFrameLoop(60);
});
</script>
                    `).split("\n")))
                })
            })
        })
    }
})();