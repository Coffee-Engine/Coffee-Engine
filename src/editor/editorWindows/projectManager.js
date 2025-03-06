(function() {
    const settingDisplays = {
        label: (container, data) => {
            const label = document.createElement("p");
            label.innerText = data.text;
            console.log("hello label world")
            container.appendChild(label);
        }
    };

    
    editor.windows.projectManager = class extends editor.windows.base {
        //For list types
        content_list(container, data, refresh) {
            //Loop through our items in our list
            for (let itemID in data.contents) {
                //Get our item and add a container
                const item = data.contents[itemID];
                const itemContainer = document.createElement("div");

                //Then add our inner data and append the child
                if (settingDisplays[item.type]) settingDisplays[item.type](itemContainer, item);
                container.appendChild(itemContainer);
            }
        }

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
                    //Clear the configuration area
                    this.configurationArea.innerHTML = "";

                    //run our content button
                    const menuType = project.settingDefinitions[key].type;
                    if (this[`content_${menuType}`]) {
                        const refresh = () => {this[`content_${menuType}`](this.configurationArea, project.settingDefinitions[key], refresh)}
                        refresh(this.configurationArea);
                    }
                }

                this.sideBar.appendChild(button);
            });

            this.sideBar.children[0].onclick();
        }
    }

    editor.windows.__Serialization.register(editor.windows.projectManager, "projectManager", { onlyOne: true });
})();