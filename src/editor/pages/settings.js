(function () {
    editor.settings = {};
    editor.settings.values = {};
    editor.settings.elements = {};

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
        };

        const sidebar = document.getElementById("sidebar");
        const settingsPanel = document.getElementById("settingsPanel");

        //Loop through categories
        Object.keys(editor.settingDefs).forEach((key) => {
            //Add category buttons make sure each one has an onclick to go to that category as well
            const button = document.createElement("button");
            button.style.width = "100%";
            button.innerHTML = editor.language[`engine.settings.category.${key}`] || key;
            sidebar.appendChild(button);

            const category = editor.settingDefs[key];

            //When the sidebar button is clicked open that category
            button.onclick = () => {
                //Clear elements and html
                //editor.settings.elements = {};
                settingsPanel.innerHTML = "";

                //Add our panel
                settingsPanel.appendChild(CUGI.createList(category, {
                    globalChange: () => {editor.Storage.setStorage("settingsValues", editor.settings.values);},
                    //Provide translations
                    preprocess: (item) => {
                        const translationKey = `engine.settings.category.${key}.${item.translationKey || item.key}`;
                        item.text = editor.language[translationKey] || (item.translationKey || item.key);

                        //Intercept items call
                        if (typeof item.items == "function") {
                            const oldItems = item.items;
                            item.items = (data) => {
                                const parsed = oldItems(data);

                                //translate the keys
                                for (let itemID in parsed) {
                                    parsed[itemID] = {text: (editor.language[`${translationKey}.${parsed[itemID]}`] || parsed[itemID]), value: parsed[itemID]};
                                }

                                return parsed
                            }
                        };

                        return item;
                    }
                }));
            };
        });

        if (sidebar.children[0]) sidebar.children[0].onclick();
    };

    editor.initilizeSettings();
})();
