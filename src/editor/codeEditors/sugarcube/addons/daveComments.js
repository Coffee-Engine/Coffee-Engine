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

            //Attach the comment to a block
            if (scope.block) {
                rect.setAttribute("x", -125);
                rect.setAttribute("y", 0);
                bar.setAttribute("x", -125);
                bar.setAttribute("y", 0);

                //The background
                rect.style.fill = scope.block.style.colourPrimary;
                rect.style.stroke = scope.block.style.colourSecondary;

                //The bar
                bar.style.fill = scope.block.style.colourSecondary;
                bar.style.stroke = scope.block.style.colourTertiary;

                scope.block.svgGroup_.appendChild(group);

                //Stop if we aren't in the workspace
                return;
            }

            sugarcube.addElementToWorkspace();
        },
        scopeType:Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    };


    Blockly.ContextMenuRegistry.registry.unregister("blockComment");
    Blockly.ContextMenuRegistry.registry.register(contextMenu);

    console.log(contextMenu);
})();