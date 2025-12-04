artimus.tools.curve = class extends artimus.tools.line {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="117.67375" height="117.67375" viewBox="0,0,117.67375,117.67375"><g transform="translate(-181.16313,-121.16312)"><g fill="none" stroke-miterlimit="10"><path d="M181.16313,238.83687v-117.67375h117.67375v117.67375z" stroke="none" stroke-width="0" stroke-linecap="butt"/><path d="M195.20082,211.04658c0,0 2.79019,-34.67254 29.19166,-48.10458c34.49444,-17.54943 60.40671,-13.61048 60.40671,-13.61048" stroke="currentColor" stroke-width="9.5" stroke-linecap="round"/></g></g></svg><!--rotationCenter:58.83687282811721:58.836882828117226-->'; }
    
    mouseDown(gl, x, y, toolProperties) {
        if (toolProperties.state == 0) {
            toolProperties.start = [x, y];
            toolProperties.end = [x, y];
        }
    }

    mouseMove(gl, x, y, toolProperties) {
        if (toolProperties.state == 0) {
            toolProperties.end = [x, y];
        }
    }

    drawLine(gl, sx, sy, ex, ey, cx, cy, toolProperties) {
        if (toolProperties.pixelBrush) {
            
            const strokeSize = toolProperties.strokeSize;
            const halfSize = Math.floor(strokeSize / 2);

            //Due to the line being denser than the base line, we will interpolate by the distance between all points
            const distance = 1 / (
                Math.sqrt(Math.pow(cx - ex, 2.0) + Math.pow(cy - ey, 2.0)) +
                Math.sqrt(Math.pow(sx - cx, 2.0) + Math.pow(sy - cy, 2.0))
            );

            //Draw the line
            let lx = sx;
            let ly = sy;

            for (let i = 0; i < 1; i+=distance) {
                //Quadratic curve formula by Chiragon
                //https://scratch.mit.edu/projects/1222346427/
                let ii = 1 - i;
                let ii2 = Math.pow(ii, 2);
                let i2 = Math.pow(i, 2);

                let rx = (ii2 * ((ii * sx) + (3 * i * cx))) + (((3 * ii * cx) + (i * ex)) * i2);
                let ry = (ii2 * ((ii * sy) + (3 * i * cy))) + (((3 * ii * cy) + (i * ey)) * i2);

                rx = Math.floor(rx);
                ry = Math.floor(ry);

                this.drawLine(gl, lx, ly, rx, ry, toolProperties);
                lx = rx;
                ly = ry;
            }
        }
        else {
            gl.strokeStyle = toolProperties.strokeColor;
            gl.lineWidth = toolProperties.strokeSize;
            gl.lineCap = "round";
            gl.lineJoin = "round";
            gl.beginPath();
            gl.moveTo(sx,sy);
            gl.quadraticCurveTo(cx, cy, ex,ey);
            gl.stroke();
            gl.closePath();
        }
    }

    mouseUp(gl, x, y, toolProperties) {
        if (toolProperties.state == 1) {
            this.drawLine(gl, ...toolProperties.start, ...toolProperties.end, x, y, toolProperties);
            toolProperties.start = null;
            toolProperties.state = 0;
        }
        else {
            toolProperties.end = [x, y];
            toolProperties.state = 1;
        }
    }

    preview(gl, x, y, toolProperties) {
        if (toolProperties.start) {
            if (toolProperties.state == 0) this.drawLine(gl, ...toolProperties.start, x, y, x, y, toolProperties);
            else this.drawLine(gl, ...toolProperties.start, ...toolProperties.end, x, y, toolProperties);
        }
        else {
            this.drawLine(gl, x, y, x + 0.1, y + 0.1, x, y, toolProperties);
        }
    }

    CUGI(artEditor) { return [
        { target: artEditor.toolProperties, key: "strokeColor", type: "color" },
        { target: artEditor.toolProperties, key: "strokeSize", type: "int" },
        { target: artEditor.toolProperties, key: "pixelBrush", type: "boolean" },
    ]}

    properties = {
        strokeColor: "#000000",
        strokeSize: 2,
        pixelBrush: false,
        state: 0,
    };
}