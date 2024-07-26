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

                background-color: var(--background-1);

                padding-bottom:4px;
            }

            .centerText {
                text-align: center;
            }

            .fullWidth {
                width:100%;
            }

            .centerContents {
                align-content: center;
                justify-content: center;

                display:grid;
                grid-template-columns: 18.5% 18.5% 18.5%;
            }

            .projectInitButton {
                margin: 4px;
            }
        </style>
        <div class="CenterPanel">
            <div class="fullWidth">
                <img class="fullWidth" style="height:auto" src="editor/images/splash.png">
            </div>
            <div class="fullWidth">
                <p class="centerText" style="margin:1px;">Splash by ObviousAlexC</p>
                <h1 class="centerText">Welcome to Coffee Engine</h1>
            </div>

            <div class="fullWidth centerContents">
                <button class="projectInitButton">New Project</button>
                <button class="projectInitButton">Load from File</button>
                <button class="projectInitButton">Load from Folder</button>
            </div>

            <div class="fullWidth">
                <button class="projectInitButton fullWidth">project test</button>
            </div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);
    }

    editor.home.initilize();
})();