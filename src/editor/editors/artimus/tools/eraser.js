artimus.tools.eraser = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="36.51093" height="36.51093" viewBox="0,0,36.51093,36.51093"><g transform="translate(-221.74453,-161.74453)"><g stroke-miterlimit="10"><path d="M227.16521,186.83448c1.47201,-2.88916 8.06591,-15.8312 10.77023,-21.13904c0.7023,-1.37842 2.49531,-1.8217 3.84242,-1.13535c1.66161,0.84658 6.79208,3.46053 9.69748,4.94081c1.72103,0.87686 1.87542,2.56066 1.19576,3.89464c-2.66871,5.23796 -9.17135,18.00088 -10.77023,21.13904c-0.69377,1.36168 -1.93838,1.51307 -3.30225,0.81819c-3.2313,-1.64633 -8.91549,-4.54239 -10.53742,-5.36876c-0.8249,-0.42028 -1.45418,-2.05397 -0.896,-3.14953z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M237.93543,165.69544c0.7023,-1.37842 2.49531,-1.8217 3.84242,-1.13535c1.66161,0.84658 6.79208,3.46053 9.69748,4.94081c1.72103,0.87686 1.87542,2.56066 1.19576,3.89464c-2.66871,5.23796 -5.43602,10.10312 -5.43602,10.10312l-14.35532,-7.31396c0,0 2.35136,-5.18142 5.05568,-10.48926z" fill="currentColor" stroke="none" stroke-width="none"/><path d="M221.74453,198.25547v-36.51093h36.51093v36.51093z" fill="none" stroke="none" stroke-width="none"/></g></g></svg>'; }
    
    mouseDown(gl, x, y, toolProperties) {
        toolProperties.linePos = [x,y];

        //Calculations
        const halfSize = Math.floor(toolProperties.strokeSize / 2);
        const rx = x - halfSize;
        const ry = y - halfSize;

        gl.clearRect(rx,ry,toolProperties.strokeSize,toolProperties.strokeSize);
    }

    mouseMove(gl, x, y, vx, vy, toolProperties) {
        const {linePos, strokeSize} = toolProperties;
        const halfSize = Math.floor(strokeSize / 2);
        const distance = 1 / Math.sqrt(Math.pow(linePos[0] - x, 2.0) + Math.pow(linePos[1] - y, 2.0));

        //Draw the line
        for (let i = 0; i < 1; i+=distance) {
            const rx = Math.floor((linePos[0] + (x - linePos[0]) * i) - halfSize);
            const ry = Math.floor((linePos[1] + (y - linePos[1]) * i) - halfSize);

            gl.clearRect(rx,ry,strokeSize,strokeSize);
        }

        toolProperties.linePos = [x,y];
    }

    preview(gl, x, y, toolProperties) {
        //Calculations
        const halfSize = Math.floor(toolProperties.strokeSize / 2);
        const rx = x - halfSize;
        const ry = y - halfSize;

        gl.fillStyle = getComputedStyle(document.body).getPropertyValue("--artimus-eraser-outline");
        gl.fillRect(rx,ry,toolProperties.strokeSize,toolProperties.strokeSize);

        if (toolProperties.strokeSize >= 3) {
            gl.fillStyle = getComputedStyle(document.body).getPropertyValue("--artimus-eraser-inline");
            gl.fillRect(rx + 1,ry + 1,toolProperties.strokeSize - 2,toolProperties.strokeSize - 2);
        }
    }

    CUGI(artEditor) { return [
        { target: artEditor.toolProperties, key: "strokeSize", type: "int" },
    ]}

    properties = {
        strokeSize: 2
    }
}