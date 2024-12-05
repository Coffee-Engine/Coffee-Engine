(function () {
    editor.creditsPage = {};

    editor.creditsPage.initilize = () => {
        console.log("Initilizing Engine Credits");

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

            .disabledButton {
                color: var(--text-2);
                background-color: var(--background-3);

                border-style: solid;
                border-radius: 2px;
                border-width: 2px;
                border-color: var(--background-3);
                
                font-size: large;
            }

            .disabledButton:active {
                color: var(--text-2);
                background-color: var(--background-3);

                border-style: solid;
                border-radius: 2px;
                border-width: 2px;
                border-color: var(--background-3);
                
                font-size: large;
            }

            .innerBox {
                width:100%; 
                height:80%; 
                margin-top:0px;
                background-color: var(--background-3);
                flex-grow: 1;

                border-top: 8px solid var(--background-4);

                overflow-y:scroll;
            }

            .centerText {
                text-align: left;
            }
            
            .contributorContainerDiv {
                display: grid;
                grid-template-columns: auto auto auto auto auto;
            }
            
            .contributorDiv {
                display: grid;
                grid-template-columns: auto auto;

                font-size:larger;
                margin:4px;
                background-color: var(--background-4);
            }

            @keyframes boot {
                0% {
                    opacity:0%;
                    width:0%;
                    height:0%;
                }
                100% {
                    opacity:100%;
                    width:50%;
                    height:60%;
                }
            }
        </style>
        <div id="centerPanel" class="CenterPanel">
            <h1 class="centerText" style="margin:2px; margin-top:4px;">
                <button id="goBack">${editor.language["engine.generic.back"]}</button>
                ${editor.language["engine.credits.welome"]}
            </h1>
            <div class="innerBox">
                <h1>${editor.language["engine.credits.madeBy"]}</h1>
                <h2>${editor.language["engine.credits.programmers"]}</h2>
                <div class="contributorContainerDiv" id="coffeeProgrammers"></div>
                <h2>${editor.language["engine.credits.translators"]}</h2>
                <div class="contributorContainerDiv" id="coffeeTranslators"></div>
                <h2>${editor.language["engine.credits.assetMaker"]}</h2>
                <div class="contributorContainerDiv" id="coffeeMakers"></div>
                <h2>${editor.language["engine.credits.resources"]}</h2>
                <div class="contributorContainerDiv">
                    <div class="contributorDiv"><img style="height:48px;" src="https://developers.google.com/static/blockly/images/logos/logo_only.png"></img><p><a href="https://github.com/google/blockly">Blockly</a></p></div>
                    <!--The only monaco logo I could find--->
                    <div class="contributorDiv"><img style="height:48px;" src="https://microsoft.github.io/monaco-editor/9a60a3b3c5fcf6a9d2de2c28e5eaa986.svg"></img><p><a href="https://github.com/microsoft/monaco-editor">Monaco</a></p></div>
                    <!--Marked version 15--->
                    <div class="contributorDiv"><img style="height:48px;" src="https://avatars.githubusercontent.com/u/19886934?s=200&v=4"></img><p><a href="https://github.com/markedjs/marked">Marked</a></p></div>
                </div>
            </div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);

        const programmers = document.getElementById("coffeeProgrammers");
        const translators = document.getElementById("coffeeTranslators");
        const makers = document.getElementById("coffeeMakers");

        const makeElement = (userInf) => {
            const element = document.createElement("div");
            element.className = "contributorDiv";

            element.innerHTML = `<img style="height:48px;" src="${userInf.image}"></img><p><a href="${userInf.link}">${userInf.name}</a></p>`;

            return element;
        };

        document.getElementById("goBack").onclick = () => {
            editor.home.initilize();
        };

        editor.credits.engineContributors.forEach((contributor) => {
            programmers.appendChild(makeElement(contributor));
        });
        editor.credits.translators.forEach((contributor) => {
            translators.appendChild(makeElement(contributor));
        });
        editor.credits.assetMakers.forEach((contributor) => {
            makers.appendChild(makeElement(contributor));
        });
    };
})();
