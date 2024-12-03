(function () {
    editor.windows.sceneTree = class extends editor.windows.base {
        init(container) {
            this.title = editor.language["editor.window.sceneTree"];

            //create our shiz
            container.style.display = "grid";
            container.style.gridTemplateRows = "24px 1fr";
            container.style.margin = "0px";

            //Where log controls are stored
            this.logControls = document.createElement("div");
            this.logControls.style.width = "100%";
            this.logControls.style.backgroundColor = "var(--background-2)";

            this.addObject = document.createElement("button");
            this.addObject.innerText = editor.language["editor.window.sceneTree.addObject"];

            this.sceneContainer = document.createElement("div");

            //when we click this add our window that adds a node to the scene
            this.addObject.onclick = () => {
                const createdWindow = new editor.windows.nodeMaker(400, 350);
                createdWindow.__moveToTop();

                createdWindow.x = window.innerWidth / 2 - 200;
                createdWindow.y = window.innerHeight / 2 - 175;
            }

            this.logControls.appendChild(this.addObject);
            container.appendChild(this.logControls);
            container.appendChild(this.sceneContainer);

            const myself = this;

            this.refreshContents = () => {
                //Remove 'em
                myself.sceneContainer.innerHTML = "";
    
                myself.createNodeElement(coffeeEngine.runtime.currentScene, myself.sceneContainer, false);
            }

            this.refreshContents();
            coffeeEngine.runtime.currentScene.addEventListener("childAdded",this.refreshContents);
        }

        createNodeElement(Node, parentElement, even) {
            const element = document.createElement("div");
            element.setAttribute("even", even.toString());
            element.className = "fileButton";

            element.onclick = (event) => {
                event.stopPropagation();
                editor.selectedNode = Node;

                editor.sendEvent("nodeSelected", {target:Node, type:"node"});
            }

            element.innerHTML = `<p style="padding:0px; margin:0px; pointer-events:none;">${Node.name}</p>`;

            const lowerDiv = document.createElement("div");
            lowerDiv.style.margin = "0px";
            lowerDiv.style.padding = "0px";
            lowerDiv.style.marginLeft = "4px";
            lowerDiv.className = "fileFolder";
            element.appendChild(lowerDiv);

            parentElement.appendChild(element);

            Node.children.forEach(childNode => {
                this.createNodeElement(childNode, lowerDiv, !even);
            });

            return element;
        }

        dispose() {
            coffeeEngine.runtime.currentScene.removeEventListener("childAdded",this.refreshContents);
        }
    };

    editor.windows.__Serialization.register(editor.windows.sceneTree, "sceneTree");
})();
