artimus.tools.line = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="117.67375" height="117.67375" viewBox="0,0,117.67375,117.67375"><g transform="translate(-181.16313,-121.16312)"><g fill="none" stroke-miterlimit="10"><path d="M181.16313,238.83687v-117.67375h117.67375v117.67375z" stroke="none" stroke-width="0" stroke-linecap="butt"/><path d="M195.20082,210.85752l89.59837,-61.71506" stroke="currentColor" stroke-width="9.5" stroke-linecap="round"/></g></g></svg><!--rotationCenter:58.83687282811721:58.836882828117226-->'; }
    
    mouseDown(gl, x, y, toolProperties) {
        toolProperties.start = [x, y];
    }

    drawLine(gl, sx, sy, ex, ey, toolProperties) {
        if (toolProperties.pixelBrush) {
            const strokeSize = toolProperties.strokeSize;
            const halfSize = Math.floor(strokeSize / 2);
            const distance = 1 / Math.sqrt(Math.pow(sx - ex, 2.0) + Math.pow(sy - ey, 2.0));

            gl.fillStyle = toolProperties.strokeColor;

            //Draw the line
            for (let i = 0; i < 1; i+=distance) {
                const rx = Math.floor((sx + (ex - sx) * i) - halfSize);
                const ry = Math.floor((sy + (ey - sy) * i) - halfSize);

                gl.fillRect(rx,ry,strokeSize,strokeSize);
            }
        }
        else {
            gl.strokeStyle = toolProperties.strokeColor;
            gl.lineWidth = toolProperties.strokeSize;
            gl.lineCap = "round";
            gl.lineJoin = "round";
            gl.beginPath();
            gl.moveTo(sx,sy);
            gl.lineTo(ex,ey);
            gl.stroke();
            gl.closePath();
        }
    }

    mouseUp(gl, x, y, toolProperties) {
        this.drawLine(gl, ...toolProperties.start, x, y, toolProperties);
        toolProperties.start = null;
    }

    preview(gl, x, y, toolProperties) {
        if (toolProperties.start) {
            this.drawLine(gl, ...toolProperties.start, x, y, toolProperties);
        }
        else {
            this.drawLine(gl, x, y, x + 0.1, y + 0.1, toolProperties);
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
    }
}