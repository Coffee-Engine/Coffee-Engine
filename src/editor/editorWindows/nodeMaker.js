(function() {
    editor.windows.nodeMaker = class extends editor.windows.base {
        init(container) {
            this.elements = {};
            this.title = editor.language["editor.window.nodeMaker"];
            const myself = this;

            Object.keys(coffeeEngine.nodeRegister).forEach(key => {
                const nodeElement = document.createElement("button");
                const nodeData = coffeeEngine.nodeRegister[key];

                nodeElement.innerText = editor.language[`engine.nodeNames.${key}`] || key;

                //Add our node and close the window once we select the node we want.
                nodeElement.onclick = () => {
                    myself.onNodeClicked(key);
                }
                
                //Get our layers deep and data off the parent if plausible
                if (this.elements[nodeData[1]]) {
                    nodeElement.layersDeep = this.elements[nodeData[1]].layersDeep + 1;
                    this.elements[nodeData[1]].insertAdjacentElement("afterend", nodeElement);
                }
                else {
                    nodeElement.layersDeep = 0;
                    container.appendChild(nodeElement);
                };

                this.elements[key] = nodeElement;
                nodeElement.style.marginLeft = `${nodeElement.layersDeep * 8}px`;
            });

            //create our shiz
            container.style.display = "grid";
            container.style.gridTemplateRows = "24px ".repeat(Object.keys(coffeeEngine.nodeRegister).length);
            container.style.margin = "0px";
            container.style.overflow = "hidden";
        }

        onNodeClicked = (nodeName) => {
            const NewNode = new (coffeeEngine.getNode(nodeName))();
            NewNode.name = editor.language[`engine.nodeNames.${nodeName}`] || key;
            coffeeEngine.runtime.currentScene.addChild(NewNode);
            this._dispose();
        }

        resized() {}

        dispose() {}
    };
})();