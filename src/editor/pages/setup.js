(function() {
    editor.setup = {};

    editor.language = editor.Storage.getStorage("language", editor.EnglishLang)

    editor.setup.initilize = () => {
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
                width:0%;
                height:0%;

                position:absolute;

                top:50%;
                left:50%;
                opacity:0%;

                display: flex;
                flex-direction: column;

                transform:translate(-50%,-50%);

                background-color: var(--background-2);

                animation: boot 500ms cubic-bezier(0.65, 0, 0.35, 1) 1;
                animation-fill-mode: forwards;
            }

            .innerBox {
                width:100%; 
                height:80%; 
                margin-top:0px;
                background-color: var(--background-3);
                flex-grow: 1;

                overflow-y: scroll;
            }

            .centerText {
                text-align: center;
            }

            @keyframes boot {
                0% {
                    opacity:0%;
                    width:0%;
                    height:0%;
                }
                100% {
                    opacity:100%;
                    width:80%;
                    height:80%;
                }
            }
        </style>
        <div id="centerPanel" class="CenterPanel">
            <h1 class="centerText" style="margin:2px; margin-top:4px;">${editor.language["engine.setup.start"]}</h1>
            <h2 class="centerText" style="margin:2px; margin-bottom:4px;">${editor.language["engine.setup.languageSelect"]}</h2>
            <div class="innerBox" id="languages">
                <h1 style="position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);">Fetching Languages</h1>
            </div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);

        const languageContainer = document.getElementById("languages");

        fetch("https://raw.githubusercontent.com/ObviousStudios/CE-LANG/main/Languages.json").then(response => response.json()).then(response => {
            languageContainer.innerHTML = "";
            response.forEach(langDef => {
                const button = document.createElement("button");
                button.style.width = "100%";
                button.style.height = "48px";

                button.innerHTML = langDef.Name;

                languageContainer.appendChild(button);
            });
        })
        .catch(error => {
            editor.home.initilize();
        });
    }
})();