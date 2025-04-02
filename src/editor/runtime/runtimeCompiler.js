//TODAY WE START THE RUNTIME!
(function () {
    //Function for compiling the runtime into a general html file
    editor.runtime.compile = (prefixes, suffixes) => {
        //Make sure our suffixes and stuff are arrays
        prefixes = prefixes || [];
        suffixes = suffixes || [];

        //grab every script we need for runtime
        const scripts = Array.from(document.getElementsByTagName("script"));
        for (let i = 0; i < scripts.length; i++) {
            //Make sure the script is a RUNTIME script
            const src = scripts[i].getAttribute("src");
            if (
                src &&
                //Depandancies
                (src.startsWith("engine/") || src.startsWith("project/") || src.startsWith("editor/codeEditors/sugarcube/defaultBlocks") || src.startsWith("editor/codeEditors/sugarcube/sugarcubeUtils") || src.startsWith("editor/codeEditors/sugarcube/main.js") || src.startsWith("editor/codeEditors/sugarcube/types.js")) &&
                //Exclude this one this one likes blockly
                !src.startsWith("editor/codeEditors/sugarcube/sugarcubeUtils/zelosRenderOverrides.js")
            ) {
                scripts[i] = src;
            }
            //If it isn't a runtime script splice it out.
            else {
                scripts.splice(i, 1);
                i--;
            }
        }

        //Now we do the actual compiling
        return new Promise(async (resolve, reject) => {
            let returned = [editor.runtime.prefixes.join("\n")];
            returned.push(...prefixes);

            for (const scriptID in scripts) {
                const scriptContents = await fetch(scripts[scriptID]).then((result) => result.text());
                returned.push(`<script origin="${scripts[scriptID]}">`, scriptContents, "</script>");
            }

            returned.push(...suffixes);
            returned.push(editor.runtime.suffixes.join("\n"));

            resolve(returned.join("\n"));
        });
    };

    editor.runtime.compileWithDecaf = () => {
        const zipInstance = new JSZip();

        return new Promise((resolve, reject) => {
            project.decaf.loopThroughSave("", project.fileSystem, zipInstance, () => {
                zipInstance.generateAsync({ type: "base64" }).then((base64) => {
                    //base64 = "data:application/zip;base64," + base64;

                    resolve(
                        editor.runtime.compile(
                            `
<script>
    //editor.language is a strange requirement of sugarcube.
(function(){
    window.editor = {
        language: {}
    };
})()
</script>`.split("\n"),
                            `
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

    //resizing
    coffeeEngine.renderer.resizeToProject();
    window.addEventListener("resize", coffeeEngine.renderer.resizeToProject);

    //Start the frameloop when the settings are loaded
    coffeeEngine.addEventListener("projectSettingsLoaded", () => {
        coffeeEngine.renderer.resizeToProject();
        coffeeEngine.runtime.startFrameLoop(60);
    });
});
</script>
<style>
canvas {
    image-rendering: optimizeSpeed;             // Older versions of FF
    image-rendering: -moz-crisp-edges;          // FF 6.0+
    image-rendering: -webkit-optimize-contrast; // Webkit
                                                //  (Safari now, Chrome soon)
    image-rendering: optimize-contrast;         // Possible future browsers.
    -ms-interpolation-mode: nearest-neighbor;   // IE
}

body {
    background-color: #000000;
}
</style>
                    `.split("\n")
                        )
                    );
                });
            });
        });
    };
})();
