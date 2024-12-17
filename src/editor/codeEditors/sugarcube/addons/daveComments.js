(function () {
    //Remove default comments
    const browserEvents = Blockly.browserEvents;

    class daveComment {
        #x = 0;
        #y = 0;

        set x(value) {
            this.rect.setAttribute("x", value);
            this.bar.setAttribute("x", value);
            this.foreignObject.setAttribute("x", value);
            this.#x = value;
        }
        set y(value) {
            this.rect.setAttribute("y", value);
            this.bar.setAttribute("y", value);
            this.foreignObject.setAttribute("y", value + 20);
            this.#y = value;
        }

        get x() {
            return this.#x;
        }
        get y() {
            return this.#y;
        }

        #c1 = "#000000";
        #c2 = "#000000";
        #c3 = "#000000";

        set color1(value) {
            this.#c1 = value;
            this.rect.style.fill = value;
        }
        set color2(value) {
            this.#c2 = value;
            this.rect.style.stroke = value;
            this.bar.style.stroke = value;
        }
        set color3(value) {
            this.#c3 = value;
            this.bar.style.fill = value;
        }

        get color1() {
            return this.#c1;
        }
        get color2() {
            return this.#c2;
        }
        get color3() {
            return this.#c3;
        }

        #width = 0;
        #height = 0;

        set width(value) {
            if (value < 100) value = 100;
            this.rect.setAttribute("width", value);
            this.bar.setAttribute("width", value);
            this.foreignObject.setAttribute("width", value);
            this.#width = value;
        }
        set height(value) {
            if (value < 20) value = 20;
            this.rect.setAttribute("height", value);
            this.foreignObject.setAttribute("height", value - 20);
            this.#height = value;
        }

        get width() {
            return this.#width;
        }
        get height() {
            return this.#height;
        }

        constructor(x, y) {
            this.group = sugarcube.createSVGEL("g");
            this.rect = sugarcube.createSVGEL("rect");
            this.bar = sugarcube.createSVGEL("rect");
            this.foreignObject = sugarcube.createSVGEL("foreignObject");
            this.text = document.createElement("p");
            this.dragger = document.createElement("img");

            //Dragger icon and stuff
            this.dragger.style.position = "absolute";
            this.dragger.style.top = "100%";
            this.dragger.style.left = "100%";
            this.dragger.style.width = "16px";
            this.dragger.style.height = "16px";
            this.dragger.style.transform = "translate(-100%,-100%)";
            this.dragger.draggable = "false"
            this.dragger.className = "genericNonSelect";
            this.dragger.ondragstart = () => {return false;};

            //Using a dataURI because the svg was a no show
            this.dragger.src = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOC45OTEzMiIgaGVpZ2h0PSIxOC45OTEzMiIgdmlld0JveD0iMCwwLDE4Ljk5MTMyLDE4Ljk5MTMyIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMwLjUwNDM0LC0xNzAuNTA0MzQpIj48ZyBmaWxsPSJub25lIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMzMuMjkxNjIsMTg2LjYzNzUybDEzLjM2OTUyLC0xMy4zNjk1MiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIzOC4wMTU4MywxODYuNzMybDguNjkyNTUsLTguNjkyNTQiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMzMuMjkxNjIsMTg2LjYzNzUybDEzLjM2OTUyLC0xMy4zNjk1MiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIzOC4wMTU4MywxODYuNzMybDguNjkyNTUsLTguNjkyNTQiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMzAuNTA0MzQsMTg5LjQ5NTY2di0xOC45OTEzMmgxOC45OTEzMnYxOC45OTEzMnoiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjkuNDk1NjU5OTk5OTk5OTg3OjkuNDk1NjU5OTk5OTk5OTg3LS0+`;

            //Style the text area
            this.text.contentEditable = true;

            this.text.style.width = "100%";
            this.text.style.height = "100%";
            this.text.style.margin = "0px";
            this.text.style.padding = "0px";
            this.text.style.top = "0px";
            this.text.style.left = "0px";
            this.text.style.position = "absolute";
            this.text.style.backgroundColor = "#00000000";
            this.text.style.color = "#000000";
            this.text.style.borderStyle = "none";
            this.text.style.borderWidth = "0px";
            this.text.placeholder = "comment here!";

            //Resizing
            browserEvents.bind(this.dragger, "pointerdown", this, (event) => {
                event.stopImmediatePropagation();
                let desiredWidth = this.width;
                let desiredHeight = this.height;

                this.dragging = browserEvents.bind(document, "pointermove", this, (subEvent) => {
                    desiredWidth += (subEvent.movementX) / sugarcube.workspace.scale;
                    desiredHeight += (subEvent.movementY) / sugarcube.workspace.scale;

                    this.width = desiredWidth;
                    this.height = desiredHeight;
                });

                this.up = browserEvents.bind(document, "pointerup", this, () => {
                    if (this.dragging) {
                        browserEvents.unbind(this.dragging);
                        browserEvents.unbind(this.up);
                        this.dragging = null;
                        this.up = null;
                    }
                });
            });

            this.foreignObject.appendChild(this.text);
            this.foreignObject.appendChild(this.dragger);

            //Style the comment temporarily
            this.rect.setAttribute("rx", 2.5);
            this.rect.setAttribute("ry", 2.5);

            this.bar.setAttribute("rx", 2.5);
            this.bar.setAttribute("ry", 2.5);
            this.bar.setAttribute("height", 20);

            //Set the temporary width and height
            this.width = 100;
            this.height = 100;

            //Stroke stuff
            this.rect.style.strokeWidth = "2px";
            this.bar.style.strokeWidth = "2px";

            //The movement and stuff
            browserEvents.bind(this.bar, "pointerdown", this, (event) => {
                event.stopImmediatePropagation();
                this.dragging = browserEvents.bind(document, "pointermove", document, (event) => {
                    this.x += event.movementX / sugarcube.workspace.scale;
                    this.y += event.movementY / sugarcube.workspace.scale;
                });

                this.up = browserEvents.bind(document, "pointerup", document, () => {
                    if (this.dragging) {
                        browserEvents.unbind(this.dragging);
                        browserEvents.unbind(this.up);
                        this.dragging = null;
                        this.up = null;
                    }
                });
            });

            this.x = x;
            this.y = y;

            this.group.appendChild(this.rect);
            this.group.appendChild(this.bar);
            this.group.appendChild(this.foreignObject);
            sugarcube.addElementToWorkspace(this.group);

            this.color1 = "#fef49c";
            this.color2 = "#bcA903";
            this.color3 = "#e4db8c";
        }
    }

    const commentCallback = (scope) => {
        //Setup our comment structure
        const comment = new daveComment(0, 0);

        //Attach the comment to a block
        console.log(scope);
        if (scope.block) {
            comment.x = scope.block.relativeCoords.x - 125;
            comment.y = scope.block.relativeCoords.y;
            comment.color1 = scope.block.style.colourPrimary;
            comment.color2 = scope.block.style.colourSecondary;
            comment.color3 = scope.block.style.colourTertiary;
        } else if (scope.workspace) {
            comment.x = scope.workspace.scrollX;
            comment.y = scope.workspace.scrollY;
        }
    };

    const contextMenuBlock = {
        displayText: "Add Comment",
        id: "sugarcube_commentBlock",
        preconditionFn: () => {
            return "enabled";
        },
        callback: commentCallback,
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    };
    const contextMenuWorkspace = {
        displayText: "Add Comment",
        id: "sugarcube_commentWorkspace",
        preconditionFn: () => {
            return "enabled";
        },
        callback: commentCallback,
        scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
    };

    Blockly.ContextMenuRegistry.registry.unregister("blockComment");
    Blockly.ContextMenuRegistry.registry.register(contextMenuBlock);
    Blockly.ContextMenuRegistry.registry.register(contextMenuWorkspace);
})();
