(function() {
    editor.home = {};

    editor.home.initilize = () => {
        console.log("Initilizing Home Page");

        if (editor.currentPage.root) {
            coffeeEngine.renderer.dispose();
            editor.currentPage.root.parentElement.removeChild(editor.currentPage.root);
            delete editor.currentPage.root;
        }

        editor.currentPage.root = document.createElement("div");

        editor.currentPage.root.style.position = "absolute";
        editor.currentPage.root.style.top = "0px";
        editor.currentPage.root.style.left = "0px";
        editor.currentPage.root.style.width = "100%";
        editor.currentPage.root.style.height = "100%";

        editor.currentPage.root.innerHTML = `
        <style>
            .CenterPanel {
                width:60%,
                min-width:60%;
                min-height:10%;

                margin-left:20%;
                margin-right:20%;
                margin-top:2.5%;

                background-color: #ff00ff;
            }

            .fullWidth {
                width:100%;
            }
        </style>
        <div class="CenterPanel">
            <div class="fullWidth">
                <img class="fullWidth" style="height:auto" src="editor/images/splash.png">
            </div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);
    }

    editor.home.initilize();
})();