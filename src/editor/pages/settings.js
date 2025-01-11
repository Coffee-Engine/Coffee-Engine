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
        Object.keys(editor.defaultSettings).forEach((key) => {
            const button = document.createElement("button");
            button.style.width = "100%";
            button.innerHTML = editor.language[`engine.settings.category.${key}`];

            sidebar.appendChild(button);

            button.onclick = () => {
                //Clear elements and html
                editor.settings.elements = {};
                settingsPanel.innerHTML = "";

                //Loop through settings in that category
                Object.keys(editor.defaultSettings[key]).forEach((settingKey) => {
                    //Create our text for the editor element
                    const settingSpan = document.createElement("p");
                    settingSpan.innerHTML = `${editor.language[`engine.settings.category.${key}.${settingKey}`]} : `;
                    settingSpan.style.fontSize = "Large";
                    settingSpan.style.margin = "2px";

                    //This is where we get inputs for the setting
                    let elementEditor = editor.settings.elementFromType(editor.settingDefs[key][settingKey].type, editor.settingDefs[key][settingKey], key, settingKey);
                    editor.settings.elements[settingKey] = {
                        span: settingSpan,
                        input: elementEditor,
                    };

                    if (elementEditor) {
                        //If we have an array we need to check for something
                        if (Array.isArray(elementEditor)) {
                            //Set our element to be proper
                            if (elementEditor[1]) {
                                settingSpan.innerHTML = "";
                                elementEditor[0].innerHTML = `${editor.language[`engine.settings.category.${key}.${settingKey}`]}`;
                                elementEditor = elementEditor[0];
                            }
                        }
                        settingSpan.appendChild(elementEditor);
                    }

                    settingsPanel.appendChild(settingSpan);

                    if (editor.settingDefs[key][settingKey].menuInit) editor.settingDefs[key][settingKey].menuInit(editor.settings.values[key], editor.settings.elements[settingKey]);
                });
            };
        });

        if (sidebar.children[0]) sidebar.children[0].onclick();
    };

    editor.initilizeSettings();
})();
