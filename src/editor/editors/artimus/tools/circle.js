artimus.tools.circle = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="117.67375" height="117.67375" viewBox="0,0,117.67375,117.67375"><g transform="translate(-181.16313,-121.16312)"><g stroke-miterlimit="10"><path d="M181.16313,238.83687v-117.67375h117.67375v117.67375z" fill="none" stroke="none" stroke-width="0"/><path d="M192.04716,179.99999c0,-26.48362 21.46922,-47.95284 47.95284,-47.95284c26.48362,0 47.95284,21.46922 47.95284,47.95284c0,26.48362 -21.46922,47.95284 -47.95284,47.95284c-26.48362,0 -47.95284,-21.46922 -47.95284,-47.95284z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/></g></g></svg><!--rotationCenter:58.83687282811721:58.836882828117226-->'; }
    
    mouseDown(gl, x, y, toolProperties) {
        toolProperties.start = [x, y];
    }

    drawCircle(gl, sx, sy, ex, ey, toolProperties) {
        const hx = (ex + sx) / 2;
        const hy = (ey + sy) / 2;

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

        gl.fillStyle = toolProperties.fillColor;
        gl.strokeStyle = toolProperties.strokeColor;
        gl.lineWidth = toolProperties.strokeSize;
        gl.beginPath();
        gl.ellipse(hx, hy, (ex - sx) / 2, (ey - sy) / 2, 0, 0, 2 * Math.PI);
        gl.fill();
        if (toolProperties.strokeSize > 0) gl.stroke();
        gl.closePath();
    }

    mouseUp(gl, x, y, toolProperties) {
        this.drawCircle(gl, ...toolProperties.start, x, y, toolProperties);
        toolProperties.start = null;
    }

    preview(gl, x, y, toolProperties) {
        if (toolProperties.start) {
            this.drawCircle(gl, ...toolProperties.start, x, y, toolProperties);
        }
    }

    CUGI(artEditor) { return [
        { target: artEditor.toolProperties, key: "fillColor", type: "color" },
        { target: artEditor.toolProperties, key: "strokeColor", type: "color" },
        { target: artEditor.toolProperties, key: "strokeSize", type: "int" },
    ]}

    properties = {
        fillColor: "#ff0000",
        strokeColor: "#000000",
        strokeSize: 2,
    };
}