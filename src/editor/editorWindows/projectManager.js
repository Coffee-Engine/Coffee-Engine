(function() {
    editor.windows.projectManager = class extends editor.windows.base {
        init (container) {
            //Make title bar
            this.title = editor.language["editor.window.projectManager"];

            this.sideBar = document.createElement("div");
            this.configurationArea = document.createElement("div");
            
            //Style our container and add our areas
            container.style.display = "grid";
            container.style.gridTemplateColumns = "10% auto";

            container.appendChild(this.sideBar);
            container.appendChild(this.configurationArea);

            //style our sidebar
            this.sideBar.style.background = "var(--background-2)";
            this.sideBar.style.borderRight = "4px solid var(--background-4)";
            this.configurationArea.style.borderLeft = "4px solid var(--background-4)";

            Object.keys(project.settingConfigs).forEach(key => {
                const button = document.createElement("button");
                button.innerText = key;
                button.style.width = "100%";
                this.sideBar.appendChild(button);
            })
        }
    }

    editor.windows.__Serialization.register(editor.windows.projectManager, "projectManager", { onlyOne: true });
})();