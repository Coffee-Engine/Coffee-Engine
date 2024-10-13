(function()  {
    //Remove default comments
    const browserEvents = Blockly.browserEvents;

    class daveComment {
        #x = 0;
        #y = 0;

        set x(value) {
            this.rect.setAttribute("x", value);
            this.bar.setAttribute("x", value);
            this.#x = value;
        }
        set y(value) {
            this.rect.setAttribute("y", value);
            this.bar.setAttribute("y", value);
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

        constructor(x,y) {
            this.group = sugarcube.createSVGEL("g");
            this.rect = sugarcube.createSVGEL("rect");
            this.bar = sugarcube.createSVGEL("rect");
    
            //Style the comment temporarily
            this.rect.setAttribute("width",100);
            this.rect.setAttribute("height",100);
            this.rect.setAttribute("rx",2.5);
            this.rect.setAttribute("ry",2.5);

            this.bar.setAttribute("rx",2.5);
            this.bar.setAttribute("ry",2.5);
            this.bar.setAttribute("width",100);
            this.bar.setAttribute("height",20);
            
            this.rect.style.strokeWidth = "2px";
            this.bar.style.strokeWidth = "2px";
            
            browserEvents.bind(
                this.bar,
                'pointerdown',
                this,
                (event) => {
                    event.stopImmediatePropagation();
                    this.dragging = browserEvents.bind(document,"pointermove",this,(event) => {
                        this.x += event.movementX / sugarcube.workspace.scale;
                        this.y += event.movementY / sugarcube.workspace.scale;
                        console.log(event);
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
                    console.log(event);
                },
            );

            this.x = x;
            this.y = y;

            this.group.appendChild(this.rect);
            this.group.appendChild(this.bar);
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