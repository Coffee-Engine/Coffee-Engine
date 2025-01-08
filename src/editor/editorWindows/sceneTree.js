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
            };

            this.logControls.appendChild(this.addObject);
            container.appendChild(this.logControls);
            container.appendChild(this.sceneContainer);

            const myself = this;

            this.refreshContents = () => {
                //Remove 'em
                myself.sceneContainer.innerHTML = "";

                myself.createNodeElement(coffeeEngine.runtime.currentScene, myself.sceneContainer, false, true);
            };

            this.refreshContents();
            coffeeEngine.runtime.currentScene.addEventListener("childAdded", this.refreshContents);
            coffeeEngine.runtime.currentScene.addEventListener("childMoved", this.refreshContents);
        }

        createNodeElement(Node, parentElement, even, root) {
            const element = document.createElement("div");
            element.setAttribute("even", even.toString());
            element.className = "fileButton";

            if (!root) {
                element.contextFunction = () => {
                    return [
                        { text: editor.language["editor.window.sceneTree.duplicate"], value: "duplicate" },
                        { text: editor.language["editor.window.sceneTree.delete"], value: "delete" }
                    ];
                };

                element.contentAnswer = (value) => {
                    switch (value) {
                        case "duplicate": { 
                            const nodeKeys = Node.getProperties();
                            const duplicated = new Node.constructor();

                            for (let keyID in nodeKeys) {
                                const key = nodeKeys[keyID];

                                if (typeof key != "object") continue;
                                if (key == "parent" || key == "children") continue;

                                if (Node[key.name] && Node[key.name].__duplicate) {
                                    Node[key.name].__duplicate(duplicated[key.name]);
                                }
                                else {
                                    duplicated[key.name] = Node[key.name];
                                }
                            }

                            Node.parent.addChild(duplicated);
                            break;
                        }

                        case "delete":
                            Node._dispose();
                            break;

                        default:
                            break;
                    }
                };
            }

            element.onclick = (event) => {
                event.stopPropagation();
                editor.selectedNode = Node;

                editor.sendEvent("nodeSelected", { target: Node, type: "node" });
            };

            element.innerHTML = `<p style="padding:0px; margin:0px; pointer-events:none;">${Node.name}</p>`;

            const lowerDiv = document.createElement("div");
            lowerDiv.style.margin = "0px";
            lowerDiv.style.padding = "0px";
            lowerDiv.style.marginLeft = "4px";
            lowerDiv.className = "fileFolder";
            element.appendChild(lowerDiv);

            parentElement.appendChild(element);

            Node.children.forEach((childNode) => {
                this.createNodeElement(childNode, lowerDiv, !even, false);
            });

            return element;
        }

        dispose() {
            coffeeEngine.runtime.currentScene.removeEventListener("childAdded", this.refreshContents);
            coffeeEngine.runtime.currentScene.removeEventListener("childMoved", this.refreshContents);
        }
    };

    editor.windows.__Serialization.register(editor.windows.sceneTree, "sceneTree");
})();
