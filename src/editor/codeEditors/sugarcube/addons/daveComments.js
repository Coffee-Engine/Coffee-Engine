(function()  {
    //Remove default comments
    const contextMenu = {
        displayText:"Add Comment",
        id:"sugarcube_comment",
        preconditionFn: () => {
            return "enabled";
        },
        callback: (scope, e) => {
            //Setup our comment structure
            const group = sugarcube.createSVGEL("g");
            const rect = sugarcube.createSVGEL("rect");
            const bar = sugarcube.createSVGEL("rect");
    
            //Style the comment temporarily
            rect.setAttribute("width",100);
            rect.setAttribute("height",100);
            rect.setAttribute("rx",2.5);
            rect.setAttribute("ry",2.5);

            bar.setAttribute("rx",2.5);
            bar.setAttribute("ry",2.5);
            bar.setAttribute("width",100);
            bar.setAttribute("height",20);
            
            rect.style.strokeWidth = "2px";
            bar.style.strokeWidth = "2px";
    
            //In the end we always have these 2
            group.appendChild(rect);
            group.appendChild(bar);

            console.log(scope,e);

            browserEvents.bind(
                bar,
                'pointerdown',
                this,
                (event) => {
                    event.stopImmediatePropagation();
                    console.log(event);
                },
              );

            //Attach the comment to a block
            if (scope.block) {
                rect.setAttribute("x", scope.block.relativeCoords.x-125);
                rect.setAttribute("y", scope.block.relativeCoords.y);
                bar.setAttribute("x", scope.block.relativeCoords.x-125);
                bar.setAttribute("y", scope.block.relativeCoords.y);

                //The background
                rect.style.fill = scope.block.style.colourPrimary;
                rect.style.stroke = scope.block.style.colourTertiary;

                //The bar
                bar.style.fill = scope.block.style.colourSecondary;
                bar.style.stroke = scope.block.style.colourTertiary;
            }

            sugarcube.addElementToWorkspace(group);
        },
        scopeType:Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    };

    const browserEvents = Blockly.browserEvents;

    class daveComment {
        constructor(workspace) {
            this.workspace = workspace;
        }

        init() {
            this.group = sugarcube.createSVGEL("g");

            this.workspace.getComponentManager().addComponent({
                component: this,
                weight: 2,
                capabilities: [Blockly.ComponentManager.Capability.DRAG_TARGET],
            });
        }
    }


    Blockly.ContextMenuRegistry.registry.unregister("blockComment");
    Blockly.ContextMenuRegistry.registry.register(contextMenu);

    console.log(contextMenu);
})();