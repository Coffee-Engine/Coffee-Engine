(function () {
    editor.setup = {
        scratchedSVG:`<svg class="layoutImage" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="71.91134"
            height="71.91134" viewBox="0,0,71.91134,71.91134">
            <g transform="translate(-204.04433,-144.04433)">
                <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-linecap="butt"
                    stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
                    style="mix-blend-mode: normal">
                    <path
                        d="M209.2858,207.0396c0,-11.57945 0,-47.40122 0,-53.9301c0,-1.99676 1.2789,-3.76085 2.65749,-3.76085c4.83497,0 32.68821,0 32.68821,0v61.3027c0,0 -27.07811,0 -32.19338,0c-1.60067,0 -3.15232,-1.33887 -3.15232,-3.61175z"
                        fill="currentcolor" stroke-width="none" />
                    <path
                        d="M246.7035,210.65135v-34.45708h24.0107c0,0 0,22.91722 0,28.81096c0,2.60908 -1.73499,5.64612 -3.3122,5.64612c-3.94276,0 -20.6985,0 -20.6985,0z"
                        fill="currentcolor" stroke-width="0" />
                    <path
                        d="M246.7035,174.41504v-25.06639c0,0 16.00182,0 20.1027,0c1.80812,0 3.908,3.33201 3.908,5.84299c0,4.5545 0,19.2234 0,19.2234z"
                        fill="currentcolor" stroke-width="0" />
                    <path d="M204.04433,215.95567v-71.91134h71.91134v71.91134z" fill="none" stroke-width="0" />
                </g>
            </g>
        </svg>`,
        caffinatedSVG:`
        <svg class="layoutImage" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="71.91134"
            height="71.91134" viewBox="0,0,71.91134,71.91134">
            <g transform="translate(-204.04433,-144.04433)">
                <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-width="0"
                    stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray=""
                    stroke-dashoffset="0" style="mix-blend-mode: normal">
                    <path d="M204.04433,215.95567v-71.91134h71.91134v71.91134z" fill="none" />
                    <path
                        d="M207.21689,205.55558c0,-3.89758 0,-22.58207 0,-22.58207h13.01655v25.33788c0,0 -8.77788,0 -10.98113,0c-0.94857,0 -2.03543,-1.39425 -2.03543,-2.75581z"
                        fill="currentcolor" />
                    <path
                        d="M251.74321,208.31139v-56.63951c0,0 14.48113,0 17.98145,0c1.4436,0 3.05845,1.67665 3.05845,3.56336c0,6.09486 0,39.17229 0,49.79204c0,2.06776 -1.47405,3.28411 -2.82542,3.28411c-3.43117,0 -18.21449,0 -18.21449,0z"
                        fill="currentcolor" />
                    <path
                        d="M207.21689,181.36822c0,0 0,-22.17721 0,-26.66127c0,-1.51291 1.30602,-3.03506 2.38497,-3.03506c2.27803,0 10.63158,0 10.63158,0v29.69633z"
                        fill="currentcolor" />
                    <path d="M221.82521,181.42211v-29.69633h28.35253v29.69633z" fill="currentcolor" />
                    <path d="M221.82521,208.45338v-25.33788h28.35253v25.33788z" fill="currentcolor" />
                </g>
            </g>
        </svg>
        `
    };

    editor.language = Object.assign({}, editor.EnglishLang, editor.Storage.getStorage("language", {}));
    editor.languageName = editor.Storage.getStorage("languageName", "English");

    editor.layout = editor.Storage.getStorage("layout", {});

    editor.setup.initilizeLang = () => {
        console.log("Initilizing Setup");

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

        fetch("https://raw.githubusercontent.com/ObviousStudios/CE-LANG/main/Languages.json")
            .then((response) => response.json())
            .then((response) => {
                languageContainer.innerHTML = "";
                response.forEach((langDef) => {
                    const button = document.createElement("button");
                    button.style.width = "100%";
                    button.style.height = "48px";

                    button.style.fontSize = "x-Large";

                    button.innerHTML = langDef.Name;

                    button.setAttribute("languageURL", `https://raw.githubusercontent.com/ObviousStudios/CE-LANG/main/LANG/${langDef.File}.json`);

                    languageContainer.appendChild(button);

                    button.onclick = () => {
                        fetch(button.getAttribute("languageURL"))
                            .then((response) => response.json())
                            .then((response) => {
                                //set the language
                                editor.Storage.setStorage("language", response);
                                editor.language = Object.assign({}, editor.EnglishLang, response);

                                //Set the language name
                                editor.Storage.setStorage("languageName", langDef.Name);

                                editor.setup.initilizeLayout();
                            })
                            .catch((error) => {
                                button.innerText += ` : ${error}`;
                                button.onclick = () => {};
                            });
                    };
                });
            })
            .catch((error) => {
                editor.setup.initilizeLayout();
            });
    };

    editor.setup.initilizeLayout = () => {
        console.log("Initilizing Setup Part 2");

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

                display:grid;
                grid-template-columns: 1fr 1fr 1fr;

                overflow-y: hidden;
            }

            .centerText {
                text-align: center;
            }

            .layoutDiv {
                margin: 16px;
                background-color: var(--background-1);
                aspect-ratio: 1; 
                transition: all 100ms;
            }

            .layoutDiv:hover {
                background-color: var(--background-2);
            }

            .layoutDiv:active {
                background-color: var(--background-4);
            }

            .layoutImage {
                width: 80%;
                height: 80%;
                aspect-ratio: 1;
                margin-top:0%;
                margin-left:10%;
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
            <h2 class="centerText" style="margin:2px; margin-bottom:4px;">${editor.language["engine.setup.layoutSelect"]}</h2>
            <div class="innerBox" id="languages">
                <div id="scratched" class="layoutDiv">
                    <h1 class="centerText">Scratched</h1>
                    ${editor.setup.scratchedSVG}
                </div>
                <div id="caffinated" class="layoutDiv">
                    <h1 class="centerText">Caffinated</h1>
                    ${editor.setup.caffinatedSVG}
                </div>
                <div id="empty" class="layoutDiv">
                    <h1 class="centerText">Blank</h1>
                </div>
            </div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);

        document.getElementById("scratched").onclick = () => {
            editor.layout = {
                layout:[],
                floating:{}
            };
            editor.Storage.setStorage("layout", editor.layout);
            editor.home.initilize();
        }

        document.getElementById("caffinated").onclick = () => {
            editor.layout = {
                layout:[],
                floating:[]
            };
            editor.Storage.setStorage("layout", editor.layout);
            editor.home.initilize();
        }

        document.getElementById("empty").onclick = () => {
            editor.layout = {
                layout:[],
                floating:{}
            };
            editor.Storage.setStorage("layout", editor.layout);
            editor.home.initilize();
        }
    }
})();
