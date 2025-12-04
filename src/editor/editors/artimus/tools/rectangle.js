artimus.tools.rectangle = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="117.67375" height="117.67375" viewBox="0,0,117.67375,117.67375"><g transform="translate(-181.16313,-121.16313)"><g stroke-miterlimit="10"><path d="M192.97015,220.49563c0,-17.94819 0,-68.5386 0,-79.52869c0,-4.08576 3.63282,-7.99679 7.49224,-7.99679c10.74005,0 61.91507,0 80.12042,0c4.03218,0 6.44704,3.78015 6.44704,7.7601c0,10.65885 0,59.85658 0,78.81861c0,4.64939 -3.44967,7.48099 -7.15712,7.48099c-10.54351,0 -61.76111,0 -80.23877,0c-4.16274,0 -6.66382,-2.5926 -6.66382,-6.53422z" fill="currentColor" stroke="currentColor" stroke-width="0.5"/><path d="M181.16313,238.83687v-117.67375h117.67375v117.67375z" fill="none" stroke="none" stroke-width="0"/></g></g></svg><!--rotationCenter:58.83687282811721:58.83687282811724-->'; }
    
    mouseDown(gl, x, y, toolProperties) {
        toolProperties.start = [x, y];
    }

    drawRectangle(gl, sx, sy, ex, ey, toolProperties) {
        let width = ex - sx;
        let height = ey - sy;

        if (width == 0) width = 1;
        if (height == 0) height = 1;

        gl.fillStyle = toolProperties.fillColor;
        gl.strokeStyle = toolProperties.strokeColor;
        gl.lineWidth = toolProperties.strokeSize;

        if (toolProperties.cornerRounding > 0) {
            gl.beginPath();
            gl.roundRect(sx, sy, width, height, toolProperties.cornerRounding);
            gl.fill();
            if (toolProperties.strokeSize > 0) gl.stroke();
            gl.closePath();
        }
        else {
            gl.fillRect(sx, sy, width, height);
            if (toolProperties.strokeSize > 0) gl.strokeRect(sx, sy, width, height);
        }
    }

    mouseUp(gl, x, y, toolProperties) {
        this.drawRectangle(gl, ...toolProperties.start, x, y, toolProperties);
        toolProperties.start = null;
    }

    preview(gl, x, y, toolProperties) {
        if (toolProperties.start) {
            this.drawRectangle(gl, ...toolProperties.start, x, y, toolProperties);
        }
    }

    CUGI(artEditor) { return [
        { target: artEditor.toolProperties, key: "fillColor", type: "color" },
        { target: artEditor.toolProperties, key: "strokeColor", type: "color" },
        { target: artEditor.toolProperties, key: "strokeSize", type: "int" },
        { target: artEditor.toolProperties, key: "cornerRounding", type: "int" },
    ]}

    properties = {
        fillColor: "#ff0000",
        strokeColor: "#000000",
        strokeSize: 2,
        cornerRounding: 0,
    }
}