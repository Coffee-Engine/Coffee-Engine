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
        `;

        document.body.appendChild(editor.currentPage.root);

        new editor.windows.log()
    };
})();
