(function () {
    editor.home = {};

    editor.home.splashAuthor = "ObviousAlexC";

    editor.home.initilize = () => {
        console.log("Initilizing Home Page");

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
                width:60%,
                min-width:60%;
                min-height:10%;

                margin-left:20%;
                margin-right:20%;
                margin-top:2.5%;

                background-color: var(--background-1);

                animation: boot 500ms cubic-bezier(0.65, 0, 0.35, 1) 1;
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

            .projectButton {
                --childID: 0;
                width:0%;
                height:96px;

                opacity:0%;

                text-align: left;

                margin-left:4px;

                animation: projectAdded 750ms cubic-bezier(0.65, 0, 0.35, 1) 1;
                animation-fill-mode: forwards;
                animation-delay: calc(125ms * var(--childID));
            }

            .noCenterElements {
                align-content: left;
                justify-content: left;
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

            @keyframes boot {
                0% {
                    opacity:0%;
                    margin-top:7.5%;
                }
                100% {
                    opacity:100%;
                    margin-top:2.5%;
                }
            }

            @keyframes projectAdded {
                0% {
                    opacity:0%;
                    width:0%;
                }
                100% {
                    opacity:100%;
                    width:75%;
                }
            }
        </style>
        <div id="centerPanel" class="CenterPanel">
            <div class="fullWidth">
                <img class="fullWidth" style="height:auto" src="editor/images/splash.png">
            </div>
            <div class="fullWidth">
                <p class="centerText" style="margin:1px;">${editor.language["engine.home.splashAuthor"].replace("[AUTHOR]", editor.home.splashAuthor)}</p>
                <h1 class="centerText">${editor.language["engine.home.welcome"]}</h1>
            </div>

            <div class="fullWidth centerContents">
                <button class="projectInitButton" id="newProject">${editor.language["engine.home.newProject"]}</button>
                <button class="projectInitButton" id="loadFile">${editor.language["engine.home.loadFile"]}</button>
                <button class="projectInitButton" id="loadFolder">${editor.language["engine.home.loadFolder"]}</button>
            </div>

            <div class="fullWidth centerContents" style="grid-template-columns: 27.75% 27.75%;">
                <button class="projectInitButton" id="openSettings">${editor.language["engine.home.engineCredits"]}</button>
                <button class="projectInitButton" id="openSettings">${editor.language["engine.home.engineConfig"]}</button>
            </div>

            <div class="fullWidth centerText noCenterElements" style="border-top: 4px solid var(--background-3); background-color: var(--background-2); padding-bottom:4px;" id="recentProjects">
                <h1>${editor.language["engine.home.noRecentProjects"]}</h1>
            </div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);

        document.getElementById("openSettings").onclick = () => {
            editor.settings.initilize();
        };

        const newButton = document.getElementById("newProject");
        const loadFile = document.getElementById("loadFile");
        const loadFolder = document.getElementById("loadFolder");

        //For starting a new project
        newButton.onclick = () => {
            editor.projectSetup.initilize();
        };

        loadFile.onclick = () => {
            //The two genders. Firefox, google
            if (!window.showOpenFilePicker) {
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = ".decaf";
                fileInput.click();
            }
            else {
                window.showOpenFilePicker({types: [{
                    description:"Coffee Engine Project",
                    accept: {
                        'application/decaf':[".decaf"]
                    }
                }]});
            }
        }

        //Loading from a folder isn't allowed on all browsers. See chromium browsers for this.
        if (editor.safeties.folderPerimissions) {
            loadFolder.onclick = () => {
                window
                    .showDirectoryPicker()
                    .then((result) => {
                        project.load("folder", result);
                    })
                    .catch((error) => {});
            };
        } else {
            loadFolder.className = "projectInitButton disabledButton";
        }

        const recentProjectsPage = document.getElementById("recentProjects");

        const addRecentProject = (projectJSON) => {
            projectJSON = projectJSON || {};
            if (recentProjectsPage.children[0].nodeName.toLowerCase() == "h1") {
                recentProjectsPage.innerHTML = "";
            }

            const holder = document.createElement("button");
            holder.className = "projectInitButton projectButton";

            holder.innerHTML = `
            <h2 style="margin-bottom:2px;">${projectJSON.Name || "Project"}</h2>
            <p style="margin-top:2px;">${editor.language["engine.home.lastEdited"].replace("[TIME]", projectJSON.modified || Date.now())}</p>
            `;

            holder.style.setProperty("--childID", recentProjectsPage.children.length);

            recentProjectsPage.appendChild(holder);

            recentProjectsPage.innerHTML += "<br>";
        };
    };
})();
