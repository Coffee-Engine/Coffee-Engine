(function () {
    const folderICON = `<svg version="1.1" style="margin:8px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="92.96333"
    height="47.9742" viewBox="0,0,92.96333,47.9742">
    <g transform="translate(-193.53187,-156.0129)">
        <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="currentColor"
            stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
            style="mix-blend-mode: normal">
            <path
                d="M237.10128,159.2629c12.42843,0 40.47036,0 46.14393,0c1.96583,0 2.55621,2.61661 1.44131,5.08362c-2.98293,6.60053 -16.44574,36.39058 -16.44574,36.39058h-42.41594"
                data-paper-data="{&quot;index&quot;:null}" fill="none" stroke-width="6.5" stroke-linecap="round" />
            <path
                d="M196.78188,162.85203c7.33786,0 52.09193,0 52.09193,0l16.61627,37.88508h-53.70377c0,0 -13.46282,-27.21207 -16.44575,-33.2414c-1.1149,-2.25352 -0.52451,-4.64368 1.44132,-4.64368z"
                fill="none" stroke-width="6.5" stroke-linecap="round" />
            <path d="M212.30149,199.07686l-17.54677,-34.36371l54.10255,0.36427l15.39064,35.65465z" fill="currentColor"
                stroke-width="0" stroke-linecap="butt" />
        </g>
    </g>
</svg>`;

    const fileIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="52.47554"
    height="74.47126" viewBox="0,0,52.47554,74.47126">
    <g transform="translate(-213.76223,-142.76437)">
        <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="currentColor" fill-rule="nonzero" stroke="none"
            stroke-width="NaN" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray=""
            stroke-dashoffset="0" style="mix-blend-mode: normal">
            <path fill="currentColor"
                d="M213.76224,211.57958c0,-7.05836 0,-37.36901 0,-52.02283h14.77674v0.01466h1.88335v-16.80703c9.99367,0 26.14984,0 30.78785,0c2.46594,0 5.0276,2.05398 5.0276,4.39914c0,7.76851 0,50.91363 0,65.35875c0,2.95871 -2.32227,4.71337 -4.71337,4.71337c-6.05814,0 -32.72895,0 -43.36302,0c-2.7268,0 -4.39915,-2.77101 -4.39915,-5.65604zM213.76224,155.9618c0,-2.75328 1.03949,-5.79135 1.84485,-6.62654c0.80102,-0.83069 2.58711,-2.59656 4.10515,-4.08865c1.37736,-1.35382 3.71661,-2.48224 5.67631,-2.48224c0.89948,0 1.96269,0 3.15042,0v14.90903h-14.77674c0,-0.6091 0,-1.18092 0,-1.7116zM246.1266,153.06675c0.55229,0 1,-0.44771 1,-1v-1.45951c0,-0.55229 -0.44771,-1 -1,-1h-12.25319c-0.55229,0 -1,0.44771 -1,1v1.45951c0,0.55229 0.44771,1 1,1zM263.30408,153.06675c0.55228,0 1,-0.44771 1,-1v-1.45951c0,-0.55229 -0.44772,-1 -1,-1h-12.25319c-0.55229,0 -1,0.44771 -1,1v1.45951c0,0.55229 0.44771,1 1,1zM262.87689,160.45566c0.78821,0 1.42719,-0.44771 1.42719,-1v-1.45951c0,-0.55229 -0.63898,-1 -1.42719,-1h-17.48756c-0.78821,0 -1.42719,0.44771 -1.42719,1v1.45951c0,0.55229 0.63898,1 1.42719,1zM240.27614,168.12132c0.97589,0 1.76699,-0.44771 1.76699,-1v-1.45951c0,-0.55229 -0.79111,-1 -1.76699,-1h-21.65126c-0.97589,0 -1.76699,0.44771 -1.76699,1v1.45951c0,0.55229 0.79111,1 1.76699,1zM262.8952,168.12132c0.78821,0 1.42719,-0.44771 1.42719,-1v-1.45951c0,-0.55229 -0.63898,-1 -1.42719,-1h-17.48756c-0.78821,0 -1.42719,0.44771 -1.42719,1v1.45951c0,0.55229 0.63898,1 1.42719,1zM229.52094,177.46361c0.55229,0 1,-0.44771 1,-1v-1.45951c0,-0.55229 -0.44772,-1 -1,-1h-12.25318c-0.55229,0 -1,0.44771 -1,1v1.45951c0,0.55229 0.44771,1 1,1zM262.30506,177.46361c0.78821,0 1.42718,-0.44771 1.42718,-1v-1.45951c0,-0.55229 -0.63897,-1 -1.42718,-1h-17.48756c-0.78821,0 -1.42719,0.44771 -1.42719,1v1.45951c0,0.55229 0.63898,1 1.42719,1zM260.99228,185.42426c1.83916,0 3.3301,-0.44771 3.3301,-1v-1.45951c0,-0.55229 -1.49095,-1 -3.3301,-1h-40.80428c-1.83916,0 -3.33011,0.44771 -3.33011,1v1.45951c0,0.55229 1.49095,1 3.33011,1zM239.68601,192.39802c0.97588,0 1.767,-0.44771 1.767,-1v-1.45951c0,-0.55229 -0.79112,-1 -1.767,-1h-21.65125c-0.97588,0 -1.767,0.44771 -1.767,1v1.45951c0,0.55229 0.79112,1 1.767,1zM250.46463,197.9174c-0.55229,0 -1.00001,0.44771 -1.00001,1v1.45951c0,0.55229 0.44772,1 1.00001,1h12.25318c0.55228,0 1,-0.44771 1,-1v-1.45951c0,-0.55229 -0.44772,-1 -1,-1zM239.38338,197.9174c-0.34853,0 -0.63107,0.44771 -0.63107,1v1.45951c0,0.55229 0.28254,1 0.63107,1h7.7326c0.34853,0 0.63107,-0.44771 0.63107,-1v-1.45951c0,-0.55229 -0.28254,-1 -0.63107,-1z"
                stroke-width="NaN" />
        </g>
    </g>
</svg>`;
    editor.projectSetup = {};

    editor.projectSetup.initilize = () => {
        console.log("Initilizing Project Setup");

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
            }

            .nameBox {
                font-size:larger;
                margin:8px;
                text-align: center;
            }

            .centerText {
                text-align: center;
            }
            
            .nameDiv {
                position:relative;
                
                margin: 0px;
                margin-left: 25%;
                margin-right: 25%;
                padding:0px;
                
                width:50%;

                display:grid;

                grid-template-columns: 1fr 1fr;
            }
            
            .fileDiv {
                position:relative;
                
                margin: 0px;
                margin-left: 25%;
                margin-right: 25%;
                padding:0px;
                
                width:50%;

                display:grid;

                grid-template-columns: 1fr 1fr;
            }

            .buttonDiv {
                position:relative;
                
                margin: 0px;
                margin-left: 25%;
                margin-right: 25%;
                margin-top: 13.5%;
                
                width:50%;

                display:grid;

                grid-template-columns: 1fr;
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
            <h1 class="centerText" style="margin:2px; margin-top:4px;">${editor.language["engine.projectSetup.title"]}</h1>
            <div class="innerBox">
                <div class="nameDiv">
                    <input type="text" placeholder="Project Name" class="nameBox" id="projectName"></input>
                    <input type="text" placeholder="Author" class="nameBox" id="authorName"></input>
                </div>
                <div>
                    <h2 class="centerText" id="fileIndicator">File Type</h2>
                    <div class="fileDiv" id="fileDiv">
                        <button id="fileButton">
                            ${fileIcon}
                            <p style="margin:8px; padding:0px;">File</p>
                        </button>
                        <button id="folderButton">
                            ${folderICON}
                            <p style="margin:8px; padding:0px;">Folder</p>
                        </button>
                    </div>
                </div>
                <div class="buttonDiv">
                    <button style="padding:16px;" id="createProject">Create Project</button>
                </div>
            </div>
        </div>
        `;

        document.body.appendChild(editor.currentPage.root);

        const fileButton = document.getElementById("fileButton");
        const folderButton = document.getElementById("folderButton");
        const createProject = document.getElementById("createProject");

        const projectName = document.getElementById("projectName");
        const authorName = document.getElementById("authorName");
        let type = "file";

        //If we don't have these saftey permissions remove stuff
        if (!(editor.safeties.folderPerimissions && editor.safeties.secureContext)) {
            const fileDiv = document.getElementById("fileDiv");
            const fileIndicator = document.getElementById("fileIndicator");

            fileButton.className = "disabledButton";
            folderButton.className = "disabledButton";
            fileDiv.style.filter = "blur(4px)";
            fileIndicator.innerText = "Your project will be a file";
        } else {
            fileButton.className = "disabledButton";

            fileButton.onclick = () => {
                fileButton.className = "disabledButton";
                folderButton.className = "";
                type = "file";
                createProject.innerHTML = "Create Project";
            };

            folderButton.onclick = () => {
                fileButton.className = "";
                folderButton.className = "disabledButton";
                type = "folder";
                createProject.innerHTML = "Select Folder";
            };
        }

        createProject.onclick = () => {
            project.new(
                {
                    name: projectName.value || "project",
                    author: authorName.value || "author",
                    version: project.formatVersion,
                    type: type,
                },
                type
            );
        };
    };
})();
