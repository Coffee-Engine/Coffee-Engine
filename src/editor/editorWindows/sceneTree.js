(function () {
    editor.windows.sceneTree = class extends editor.windows.base {
        init(container) {
            const currentScene = coffeeEngine.runtime.currentScene;
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

                //If we are a prefab set our scene root to the prefab
                if (currentScene.prefabEditMode) createdWindow.TargetRoot = currentScene.children[0];
            };

            this.logControls.appendChild(this.addObject);
            container.appendChild(this.logControls);
            container.appendChild(this.sceneContainer);

            const myself = this;

            this.refreshContents = () => {
                //Remove 'em
                myself.sceneContainer.innerHTML = "";

                //If we are a scene show the scene, if we are a prefab, show only the prefab
                if (!currentScene.prefabEditMode) myself.createNodeElement(currentScene, myself.sceneContainer, false, true);
                else myself.createNodeElement(currentScene.children[0], myself.sceneContainer, false, true);
            };

            this.refreshContents();
            currentScene.addEventListener("childAdded", this.refreshContents);
            currentScene.addEventListener("childMoved", this.refreshContents);
        }

        createNodeElement(Node, parentElement, even, root) {
            if (!Node) return;

            const element = document.createElement("div");
            element.setAttribute("even", even.toString());
            element.className = "fileButton";

            if (!root) {
                element.contextFunction = () => {
                    return [
                        { text: editor.language["editor.window.sceneTree.addChild"], value: "addChild" },
                        { text: editor.language["editor.window.sceneTree.addDuplicateChild"], value: "addDuplicateChild" },
                        { text: editor.language["editor.window.sceneTree.duplicate"], value: "duplicate" },
                        { text: editor.language["editor.window.sceneTree.createPrefab"], value: "createPrefab" },
                        { text: editor.language["editor.window.sceneTree.delete"], value: "delete" },
                    ];
                };

                element.contentAnswer = (value) => {
                    switch (value) {
                        case "addChild": {
                            const createdWindow = new editor.windows.nodeMaker(400, 350);
                            createdWindow.__moveToTop();
            
                            createdWindow.x = window.innerWidth / 2 - 200;
                            createdWindow.y = window.innerHeight / 2 - 175;

                            createdWindow.TargetRoot = Node;
                            break;
                        }

                        case "addDuplicateChild": {
                            const nodeKeys = Node.getProperties();
                            const duplicated = new Node.constructor();

                            for (let keyID in nodeKeys) {
                                const key = nodeKeys[keyID];

                                if (typeof key != "object") continue;
                                if (key == "parent" || key == "children") continue;

                                if (Node[key.name] && Node[key.name].__duplicate) {
                                    Node[key.name].__duplicate(duplicated[key.name]);
                                } else {
                                    duplicated[key.name] = Node[key.name];
                                }
                            }

                            Node.addChild(duplicated);
                            break;
                        }

                        case "duplicate": {
                            const nodeKeys = Node.getProperties();
                            const duplicated = new Node.constructor();

                            for (let keyID in nodeKeys) {
                                const key = nodeKeys[keyID];

                                if (typeof key != "object") continue;
                                if (key == "parent" || key == "children") continue;

                                if (Node[key.name] && Node[key.name].__duplicate) {
                                    Node[key.name].__duplicate(duplicated[key.name]);
                                } else {
                                    duplicated[key.name] = Node[key.name];
                                }
                            }

                            Node.parent.addChild(duplicated);
                            break;
                        }

                        //Prefab creation duh
                        case "createPrefab": {
                            const serialized = coffeeEngine.runtime.currentScene.__serializeChildren([Node])[0];

                            //Create our file creator
                            const fileCreator = new editor.windows.fileCreator(400, 150);
                            fileCreator.x = (window.innerWidth/2)-200;
                            fileCreator.y = (window.innerHeight/2)-75;

                            //A hacky solution. It works
                            fileCreator.type.innerHTML = `<option value="prefab">${editor.language[`editor.window.createFile.prefab`]} (prefab)</option>`;
                            fileCreator.type.value = "prefab";

                            //Override some stuff for the file creator pt2
                            fileCreator.path.value = "prefabs/newPrefab.prefab";
                            fileCreator.createFile = (path) => {
                                project.setFile(path, JSON.stringify(serialized), "text/javascript").then((path) => {
                                    editor.sendFileHook(path.split(".")[1], path);
                                });
                            };

                            //Move to the top
                            fileCreator.__moveToTop();
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
