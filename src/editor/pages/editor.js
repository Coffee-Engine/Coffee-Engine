(function () {
    editor.editorPage = {};

    editor.editorPage.initilize = () => {
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
            .window {
                min-height:32px;
                min-width:96px;

                overflow: hidden;

                background-color:var(--background-3);

                display:grid;
                grid-template-rows: ${editor.taskbarHeight}px auto;
            }

            .TaskBar {
                width:100%;
                height:${editor.taskbarHeight}px;

                margin:0px;

                background-color:var(--background-1);

                display:grid;
                grid-template-columns: auto ${editor.taskbarHeight}px;
                overflow: hidden;
                
                line-height: ${editor.taskbarHeight}px;
                text-align: center;
                vertical-align: middle;
                font-size: Large;

                cursor: grab;
            }

            .closeButton {
                line-height: -${editor.taskbarHeight}px;
                text-align: center;
                vertical-align: middle;
                font-size: Large;
                height:${editor.taskbarHeight}px;
                border-width:0px;
            }

            .logInfo {
                width: 100%;
            }

            .logWarn {                
                background-color: var(--warn);
                color: var(--warn-text);
                font-weight: bold;
            }

            .logError {
                background-color: var(--error);
                color: var(--error-text);
                font-weight: bold;
            }

            .italicThing {
                font-style: italic;
                color: var(--text-2);
            }

            .dockDefault {
                position:absolute;
                top:0px;
                left:0px;
                padding:0px;
                margin:0px;

                width:100%;
                height:100%;
            
                display: grid;

                --dockGridHorizontal: 1fr;

                grid-template-columns: var(--dockGridHorizontal)
            }

            @keyframes closeWindow {
                0% {
                    min-height:0px;
                    opacity: 100%;
                }

                50% {
                    opacity: 100%;
                }

                100% {
                    height:0px;
                    opacity: 0%;
                }
            }
        </style>
        <div class="dockDefault" id="coffeeEngineDock"></div>
        `;

        document.body.appendChild(editor.currentPage.root);

        editor.dock = {
            refreshLayout:() => {
                editor.dock.element.style.setProperty("--dockGridHorizontal",("1fr ").repeat(editor.layout.layout.length));
                for (let ID = 0; ID < editor.layout.layout.length; ID++) {
                    let subDock = editor.dock.element.children[ID];
                    if (subDock) {
                        subDock.style.setProperty("--dockGridVertical",("1fr ").repeat(editor.layout.layout[ID].length));
                    }
                    else {
                        subDock = document.createElement("div");
                        subDock.style.display = "grid";
                        subDock.style.setProperty("--dockGridVertical",("1fr ").repeat(editor.layout.layout[ID].length));

                        editor.dock.element.appendChild(subDock);
                    }
                }
            },

            dockWindow:(window,column) => {
                if (window.windowDiv.parentNode) {
                    window.windowDiv.parentNode.removeChild(window.windowDiv);
                }
                
                window.docked = true;
                editor.dock.element.children[column].appendChild(window.windowDiv);
            }
        };

        editor.dock.element = document.getElementById("coffeeEngineDock");

        //Deserialize our windows
        editor.dock.refreshLayout();
        for (let X = 0; X < editor.layout.layout.length; X++) {
            for (let Y = 0; Y < editor.layout.layout[X].length; Y++) {
                //Our deserialization!
                const newWindow = new editor.windows.__Serialization.all[editor.layout.layout[X][Y]];
                editor.layout.layout[X][Y] = newWindow;
                editor.dock.dockWindow(newWindow,X);
            }
        }
    };

    editor.editorPage.initilizePanels = () => {
        console.log("initilizing panels");
    };
})();
