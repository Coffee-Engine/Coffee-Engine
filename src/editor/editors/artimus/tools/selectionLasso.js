artimus.tools.selectionLasso = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="117.67375" height="117.67375" viewBox="0,0,117.67375,117.67375"><g transform="translate(-181.16313,-121.16312)"><g fill="none" stroke-miterlimit="10"><path d="M181.16313,238.83687v-117.67375h117.67375v117.67375z" stroke="none" stroke-width="0" stroke-dasharray=""/><path d="M190.55159,167.6298c0,-15.56525 1.83406,-5.71715 13.32556,-14.47754c8.06081,-6.14505 23.47548,-14.19121 21.09515,-3.53546c-3.94639,17.6663 8.50634,38.00487 27.04476,35.2442c13.58945,-2.02369 34.44021,-17.2312 34.44021,-17.2312c0,0 8.79123,19.53258 -3.76922,33.32304c-8.43364,9.25953 -37.45465,14.6298 -44.18362,14.6298c-11.05852,0 2.10751,-15.4448 2.10751,-15.4448c0,0 -18.69154,3.11012 -32.79013,-4.66286c-10.33925,-5.70034 -17.27021,-21.31908 -17.27021,-27.84518z" stroke="currentColor" stroke-width="5" stroke-dasharray="16,8"/></g></g></svg><!--rotationCenter:58.83687282811721:58.836882828117226-->'; }
    
    mouseDown(gl, x, y, toolProperties) {
        toolProperties.path = [x, y];
        toolProperties.drawing = true;
    }

    mouseMove(gl, x, y, vx, vy, toolProperties) {
        if (toolProperties.drawing) {
            const last = toolProperties.path.length - 2;
            const ex = [toolProperties.path[last]];
            const ey = [toolProperties.path[last + 1]];

            //Make sure that we are only adding more path when the pixel is moved.
            if (Math.sqrt((Math.pow(ex - x, 2)) + Math.pow(ey - y, 2)) >= 1) toolProperties.path.push(x, y);
        }
    }

    mouseUp(gl, x, y, toolProperties) {
        if (toolProperties.path) {
            toolProperties.path.push(x, y);
            if (toolProperties.path.length == 0) this.workspace.clearSelection();
            else this.workspace.setSelection(toolProperties.path);
        }

        toolProperties.path = null;
        toolProperties.drawing = false;
    }

    preview(gl, x, y, toolProperties) {
        if (toolProperties.drawing) {
            gl.setLineDash([4, 2]);
            gl.strokeStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
            gl.lineWidth = 1;

            //Set line
            gl.beginPath();

            //Define the path
            for (let i = 0; i<toolProperties.path.length; i+=2) {
                if (i == 0) gl.moveTo(toolProperties.path[i] + 0.5, toolProperties.path[i + 1] + 0.5);
                else gl.lineTo(toolProperties.path[i] + 0.5, toolProperties.path[i + 1] + 0.5);
                gl.moveTo(toolProperties.path[i] + 0.5, toolProperties.path[i + 1] + 0.5)
            }
            gl.lineTo(toolProperties.path[0] + 0.5, toolProperties.path[1] + 0.5);
            
            //Then draw and reset
            gl.stroke();
            gl.closePath();
            gl.setLineDash([]);
        }
        else {
            gl.fillStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
            gl.fillRect(x, y, 1, 1);
        }
    }
}