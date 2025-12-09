artimus.tools.sheetTool = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="43.78882" height="43.78882" viewBox="0,0,43.78882,43.78882"><g transform="translate(-218.10559,-158.10559)"><g fill="none" stroke-miterlimit="10"><path d="M224.72126,195.60047l0.30414,-3.28406" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M225.38759,188.40561l0.30414,-3.28406" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M226.05565,181.19199l0.30414,-3.28406" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M226.72197,173.99712l0.30414,-3.28406" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M249.09768,193.24798l-3.21653,0.31053" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M242.05076,193.9283l-3.21653,0.31053" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M234.98549,194.61038l-3.21653,0.31053" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M227.93858,195.2907l-3.21653,0.31053" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M255.26475,164.41328l-3.21653,0.31053" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M248.21784,165.0936l-3.21652,0.31053" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M241.15258,165.77568l-3.21653,0.31053" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M234.10566,166.456l-3.21653,0.31053" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M252.97389,189.28619l0.30414,-3.28406" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M253.64021,182.09132l0.30414,-3.28406" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M254.30827,174.87771l0.30414,-3.28406" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M254.9746,167.68284l0.30414,-3.28406" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M218.10559,201.89441v-43.78882h43.78882v43.78882z" stroke="none" stroke-width="0" stroke-linecap="butt"/></g></g></svg><!--rotationCenter:21.894410590842682:21.894410590842682-->'; }
    
    mouseDown(gl, x, y, toolProperties) {
        //If subsprites doesn't exist add it.
        this.workspace.subSprites = this.workspace.subSprites || [];

        if (this[`mode_${toolProperties.mode}`]) this[`mode_${toolProperties.mode}`](gl, x, y, toolProperties);
    }

    mouseUp(gl, x, y, toolProperties) {
        if (this[`mode_up_${toolProperties.mode}`]) this[`mode_up_${toolProperties.mode}`](gl, x, y, toolProperties);
    }

    mode_create(gl, x, y, toolProperties) {
        toolProperties.start = [x, y];
    }

    mode_delete(gl, x, y, toolProperties) {
        for (let sprID = 0; sprID < this.workspace.subSprites.length; sprID++) {
            //delete any we collide with
            const sprite = this.workspace.subSprites[sprID];
            if ((x >= sprite[0] && x <= sprite[2]) && 
                (y >= sprite[1] && y <= sprite[3])) {
                this.workspace.subSprites.splice(sprID, 1);
                sprID--;
            }
        }
    }

    mode_modify(gl, x, y, toolProperties) {
        if (toolProperties.modifyStep == 1) toolProperties.start = [x, y];
    }

    mode_up_create(gl, x, y, toolProperties) {
        if (toolProperties.start) {
            if (toolProperties.start[0] == x && toolProperties.start[1] == y) return;

            let start = [...toolProperties.start];
            let end = [ x, y ];

            if (start[0] > end[0]) {
                const temp = start[0];
                start[0] = end[0];
                end[0] = temp;
            }

            if (start[1] > end[1]) {
                const temp = start[1];
                start[1] = end[1];
                end[1] = temp;
            }

            this.workspace.subSprites.push([...start, ...end]);
        }

        toolProperties.start = null; 
    }

    mode_up_modify(gl, x, y, toolProperties) {
        if (toolProperties.modifyStep == 0) {
            for (let sprID in this.workspace.subSprites) {
                //Fill the rectangle.
                const sprite = this.workspace.subSprites[sprID];
                
                if (((x >= sprite[0] && x <= sprite[2]) && 
                    (y >= sprite[1] && y <= sprite[3]))) toolProperties.modifySubSprite = sprID;
            }

            if (toolProperties.modifySubSprite) toolProperties.modifyStep = 1;
        }
        else {
            if (toolProperties.start[0] == x && toolProperties.start[1] == y) {
                toolProperties.modifyStep = 0;
                toolProperties.modifySubSprite = null;
                toolProperties.start = null;
                return;
            }

            let start = [...toolProperties.start];
            let end = [ x, y ];

            if (start[0] > end[0]) {
                const temp = start[0];
                start[0] = end[0];
                end[0] = temp;
            }

            if (start[1] > end[1]) {
                const temp = start[1];
                start[1] = end[1];
                end[1] = temp;
            }

            this.workspace.subSprites[toolProperties.modifySubSprite] = [...start, ...end];

            toolProperties.modifyStep = 0;
            toolProperties.modifySubSprite = null;
            toolProperties.start = null; 
        }
    }

    draw_subSprites(gl, x, y, toolProperties) {
        //Make sure subsprites exists
        if (this.workspace.subSprites) {
            for (let sprID in this.workspace.subSprites) {
                //Fill the rectangle.
                const sprite = this.workspace.subSprites[sprID];
                
                //If we have a function that modifies fillstyle use it
                gl.fillStyle = (this[`mode_fillStyle_${toolProperties.mode}`]) ? 
                    this[`mode_fillStyle_${toolProperties.mode}`](gl, x, y, toolProperties, sprite, sprID) : 
                    getComputedStyle(document.body).getPropertyValue("--artimus-subsprite-box");
                
                gl.fillRect(sprite[0], sprite[1], sprite[2] - sprite[0] + 1, sprite[3] - sprite[1] + 1);
            }
        }
    }

    mode_view_create(gl, x, y, toolProperties) {
        this.draw_subSprites(gl, x, y, toolProperties);

        //Otherwise normal box select
        if (toolProperties.start) {
            const [sx, sy] = toolProperties.start;
            const width = x - sx;
            const height = y - sy;

            gl.setLineDash([4, 2]);
            gl.strokeStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
            gl.lineWidth = 1;

            gl.strokeRect(sx + 0.5, sy + 0.5, width, height);
            gl.setLineDash([]);
        }
        else {
            gl.fillStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
            gl.fillRect(x, y, 1, 1);
        }
    }

    mode_view_delete(gl, x, y, toolProperties) {
        this.draw_subSprites(gl, x, y, toolProperties);
    }

    mode_fillStyle_delete(gl, x, y, toolProperties, sprite, sprID) {
        return ((x >= sprite[0] && x <= sprite[2]) && (y >= sprite[1] && y <= sprite[3])) ? 
            getComputedStyle(document.body).getPropertyValue("--artimus-subsprite-delete")
            : getComputedStyle(document.body).getPropertyValue("--artimus-subsprite-box");
    }

    mode_view_modify(gl, x, y, toolProperties) {
        this.draw_subSprites(gl, x, y, toolProperties);

        //Otherwise normal box select
        if (toolProperties.modifyStep == 1) {
            if (toolProperties.start) {
                const [sx, sy] = toolProperties.start;
                const width = x - sx;
                const height = y - sy;

                gl.setLineDash([4, 2]);
                gl.strokeStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
                gl.lineWidth = 1;

                gl.strokeRect(sx + 0.5, sy + 0.5, width, height);
                gl.setLineDash([]);
            }
            else {
                gl.fillStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
                gl.fillRect(x, y, 1, 1);
            }
        }
    }

    mode_fillStyle_modify(gl, x, y, toolProperties, sprite, sprID) {
        return (sprID === toolProperties.modifySubSprite) ? 
            getComputedStyle(document.body).getPropertyValue("--artimus-subsprite-modify")
            : getComputedStyle(document.body).getPropertyValue("--artimus-subsprite-box");
    }

    preview(gl, x, y, toolProperties) {
        if (this[`mode_view_${toolProperties.mode}`]) this[`mode_view_${toolProperties.mode}`](gl, x, y, toolProperties);
    }

    CUGI(artEditor) { return [
        { target: artEditor.toolProperties, key: "mode", type: "dropdown", items: [
            "create",
            "delete",
            "modify"
        ] },
    ]}

    properties = {
        mode: "create",
        modifyStep: 0,
        modifySubSprite: null,
    };
}