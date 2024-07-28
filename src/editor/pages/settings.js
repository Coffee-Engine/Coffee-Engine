(function() {
    editor.settings = {};

    editor.settings.values = Object.assign({}, editor.defaultSettings, editor.Storage.getStorage("settingsValues", {}));

    editor.settings.initilize = () => {
        console.log("Initilizing Settings Page");

        editor.changePage();

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

                border-top: 8px solid var(--background-4);

                overflow-y: scroll;
                display: flex;
            }

            .centerText {
                text-align: Left;
            }

            .settingsSidebar {
                width:196px;
                height:100%;
                background-color: var(--background-2);
                border-right: 8px solid var(--background-4);
            }

            .settingsPanel {
                height:100%;
                flex-grow: 1;
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
            <h1 class="centerText" style="margin:2px; margin-top:4px;">
                <button id="goBack">${editor.language["engine.generic.back"]}</button>
                ${editor.language["engine.settings.welcome"]}
            </h1>
            <div class="innerBox">
                <div class="settingsSidebar" id="sidebar"></div>
                <div class="settingsPanel" id="settingsPanel"></div>
            </div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);

        document.getElementById("goBack").onclick = () => {
            editor.home.initilize();
        }

        const sidebar = document.getElementById("sidebar");
        const settingsPanel = document.getElementById("settingsPanel");

        Object.keys(editor.defaultSettings).forEach(key => {
            const button = document.createElement("button");
            button.style.width = "100%";
            button.innerHTML = editor.language[`engine.settings.category.${key}`];

            sidebar.appendChild(button);

            button.onclick = () => {
                settingsPanel.innerHTML = "";

                Object.keys(editor.defaultSettings[key]).forEach(settingKey => {
                    const settingSpan = document.createElement("p");
                    settingSpan.innerHTML = editor.language[`engine.settings.category.${key}.${settingKey}`];
                    settingSpan.style.fontSize = "Large";
                    settingSpan.style.margin = "2px";

                    settingsPanel.appendChild(settingSpan);
                });
            }
        });
    }
})();