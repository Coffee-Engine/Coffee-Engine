(function()  {
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
            this.rect.setAttribute("width",value);
            this.bar.setAttribute("width",value);
            this.foreignObject.setAttribute("width",value);
            this.#width = value;
        }
        set height(value) {
            this.rect.setAttribute("height",value);
            this.foreignObject.setAttribute("height",value - 20);
            this.#height = value;
        }

        get width() {
            return this.#width;
        }
        get height() {
            return this.#height;
        }

        constructor(x,y) {
            this.group = sugarcube.createSVGEL("g");
            this.rect = sugarcube.createSVGEL("rect");
            this.bar = sugarcube.createSVGEL("rect");
            this.foreignObject = sugarcube.createSVGEL("foreignObject");
            this.text = document.createElement("textarea");

            //Style the text area
            this.text.style.width = "100%";
            this.text.style.height = "100%";
            this.text.style.margin = "0px";
            this.text.style.padding = "0px";
            this.text.style.top = "0px";
            this.text.style.left = "0px";
            this.text.style.position = "absolute";
            this.text.style.backgroundColor = "#00000000";
            this.text.style.borderStyle = "none";
            this.text.style.borderWidth = "0px";
            this.text.placeholder = "comment here!";

            this.text.onresize = () => {
                this.width = this.text.width;
                this.height = this.text.height;
            }

            browserEvents.bind(
                this.foreignObject,
                'pointerdown',
                this,
                () => {
                    this.dragging = browserEvents.bind(document,"pointermove",this,(event) => {
                        console.log(this.text.clientHeight)
                        this.width = this.text.clientWidth;
                        this.height = this.text.clientHeight + 20;
                    });

                    this.up = browserEvents.bind(
                        document,
                        'pointerup',
                        this,
                        () => {
                            if (this.dragging) {
                                browserEvents.unbind(this.dragging);
                                browserEvents.unbind(this.up);
                                this.dragging = null;
                                this.up = null;
                            }
                        },
                    );
            });
            this.foreignObject.appendChild(this.text);
    
            //Style the comment temporarily
            this.rect.setAttribute("rx",2.5);
            this.rect.setAttribute("ry",2.5);

            this.bar.setAttribute("rx",2.5);
            this.bar.setAttribute("ry",2.5);
            this.bar.setAttribute("height",20);

            this.width = 100;
            this.height = 100;
            
            this.rect.style.strokeWidth = "2px";
            this.bar.style.strokeWidth = "2px";
            
            browserEvents.bind(
                this.bar,
                'pointerdown',
                this,
                (event) => {
                    event.stopImmediatePropagation();
                    this.dragging = browserEvents.bind(document,"pointermove",document,(event) => {
                        this.x += event.movementX / sugarcube.workspace.scale;
                        this.y += event.movementY / sugarcube.workspace.scale;
                        console.log(event);
                    });

                    this.up = browserEvents.bind(
                        document,
                        'pointerup',
                        document,
                        () => {
                            if (this.dragging) {
                                browserEvents.unbind(this.dragging);
                                browserEvents.unbind(this.up);
                                this.dragging = null;
                                this.up = null;
                            }
                        },
                    );
                    console.log(event);
                },
            );

            this.x = x;
            this.y = y;

            this.group.appendChild(this.rect);
            this.group.appendChild(this.bar);
            this.group.appendChild(this.foreignObject);
            sugarcube.addElementToWorkspace(this.group);
        }
    }

    const contextMenu = {
        displayText:"Add Comment",
        id:"sugarcube_comment",
        preconditionFn: () => {
            return "enabled";
        },
        callback: (scope, e) => {
            //Setup our comment structure
            const comment = new daveComment(0,0);

            //Attach the comment to a block
            if (scope.block) {
                comment.x = scope.block.relativeCoords.x-125;
                comment.y = scope.block.relativeCoords.y;
                comment.color1 = scope.block.style.colourPrimary;
                comment.color2 = scope.block.style.colourSecondary;
                comment.color3 = scope.block.style.colourTertiary;
            }
        },
        scopeType:Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    };

    Blockly.ContextMenuRegistry.registry.unregister("blockComment");
    Blockly.ContextMenuRegistry.registry.register(contextMenu);

    console.log(contextMenu);
})();