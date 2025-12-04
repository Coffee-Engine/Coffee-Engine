artimus.tools.selectionCircle = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="117.67375" height="117.67375" viewBox="0,0,117.67375,117.67375"><g transform="translate(-181.16313,-121.16312)"><g stroke-miterlimit="10"><path d="M181.16313,238.83687v-117.67375h117.67375v117.67375z" fill="none" stroke="none" stroke-width="0" /><path d="M192.04716,179.99999c0,-26.48362 21.46922,-47.95284 47.95284,-47.95284c26.48362,0 47.95284,21.46922 47.95284,47.95284c0,26.48362 -21.46922,47.95284 -47.95284,47.95284c-26.48362,0 -47.95284,-21.46922 -47.95284,-47.95284z" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="16 8" /></g></g></svg><!--rotationCenter:58.83687282811721:58.836882828117226-->'; }
    
    mouseDown(gl, x, y, toolProperties) {
        toolProperties.start = [x, y];
    }

    mouseUp(gl, x, y, toolProperties) {
        if (toolProperties.start) {
            if (toolProperties.start[0] == x && toolProperties.start[1] == y) this.workspace.clearSelection();
            else {
                const [sx, sy] = toolProperties.start;
                let cx = (x + sx) / 2;
                let cy = (y + sy) / 2;

                let rx = (x - sx) / 2;
                let ry = (y - sy) / 2;

                const points = [];

                //This is probably good enough.
                //! Shown above is sloth
                for (let i = 0; i < 360; i++) {
                    let rad = artimus.degreeToRad(i);
                    points.push(
                        (Math.sin(rad) * rx) + cx,
                        (Math.cos(rad) * ry) + cy
                    )
                }

                this.workspace.setSelection(points);
            }
        }

        toolProperties.start = null;
    }

    preview(gl, x, y, toolProperties) {
        if (toolProperties.start) {
            let [sx, sy] = toolProperties.start;
            let [ex, ey] = [x, y];
            const hx = (x + sx) / 2;
            const hy = (y + sy) / 2;

            //Flip due to canvas context 2d not supporting ellipses of negative proportions
            if (ex < sx) {
                let t = sx;
                sx = ex;
                ex = t;
            }

            if (ey < sy) {
                let t = sy;
                sy = ey;
                ey = t;
            }

            gl.setLineDash([4, 2]);
            gl.strokeStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
            gl.lineWidth = 1;

            gl.beginPath();
            gl.ellipse(hx + 0.5, hy + 0.5, (ex - sx) / 2, (ey - sy) / 2, 0, 0, 2 * Math.PI);
            gl.stroke();
            gl.setLineDash([]);
        }
        gl.fillStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
        gl.fillRect(x, y, 1, 1);
    }
}