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

            Object.keys(project.settingDefinitions).forEach(key => {
                const button = document.createElement("button");
                button.innerText = key;
                button.style.width = "100%";

                //functionality
                button.onclick = () => {
                    this.configurationArea.innerHTML = "";
                    this.configurationArea.appendChild(CUGI.createList(project.settingDefinitions[key], {
                        globalChange: () => {
                            //Save our project.json
                            project.getFile("project.json").then((file) => {
                                const fileReader = new FileReader();
                                
                                //Once read.
                                fileReader.onload = () => {
                                    //Get our parsed JSON
                                    let parsed = JSON.parse(fileReader.result);
                                    if (!parsed) parsed = {};
                    
                                    parsed.settings = project.saveSettings();

                                    //Resave our file
                                    project.setFile("project.json", JSON.stringify(parsed), "text/plain");
                                };
                    
                                fileReader.readAsText(file);
                            });
                        }
                    }));
                }

                this.sideBar.appendChild(button);
            });

            this.sideBar.children[0].onclick();
        }
    }

    editor.windows.__Serialization.register(editor.windows.projectManager, "projectManager", { onlyOne: true });
})();