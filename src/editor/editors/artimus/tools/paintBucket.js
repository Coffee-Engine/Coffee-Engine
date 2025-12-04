artimus.tools.paintBucket = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="118.62312" height="118.62312" viewBox="0,0,118.62312,118.62312"><g transform="translate(-180.68844,-120.68844)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M206.88545,153.56346l45.57272,18.09505c0,0 -19.23228,45.38499 -22.37737,52.68799c-1.17446,2.72714 -6.58805,4.01735 -10.1454,2.65112c-5.19795,-1.99631 -20.08784,-7.7149 -29.75857,-11.42902c-5.107,-1.96138 -7.01752,-7.3726 -5.41078,-11.07232c4.13006,-9.51001 22.1194,-50.93282 22.1194,-50.93282z" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linecap="round"/><path d="M223.97522,179.36566l-17.75996,-46.9131l12.06337,3.68603l9.71771,25.13202" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linecap="round"/><path d="M268.77477,157.22889c3.94788,-0.6674 12.67299,0.90255 18.54715,4.14104c3.54973,1.957 8.63085,7.67998 8.46231,11.96793c-0.14335,3.64728 -5.10401,6.07102 -7.14621,6.23577c-4.69174,0.37849 -10.41826,-5.26039 -13.06099,-5.73818c-3.77463,-0.68244 -6.72444,0.24778 -10.47752,0.3855c-7.39699,0.27144 -13.69105,-0.30207 -20.23043,-4.04606c-1.66373,-1.35238 -7.55745,-6.36988 -7.55745,-6.36988c0,0 23.62505,-5.25108 31.46314,-6.57613z" fill="currentColor" stroke="currentColor" stroke-width="5" stroke-linecap="butt"/><path d="M216.60316,179.36566c0,-3.88641 3.15056,-7.03696 7.03696,-7.03696c3.88641,0 7.03696,3.15056 7.03696,7.03696c0,3.88641 -3.15056,7.03696 -7.03696,7.03696c-3.88641,0 -7.03696,-3.15056 -7.03696,-7.03696z" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linecap="butt"/><path d="M206.88545,153.56346l45.57272,18.09505c0,0 -19.23228,45.38499 -22.37737,52.68799c-1.17446,2.72714 -6.58805,4.01735 -10.1454,2.65112c-5.19795,-1.99631 -20.08784,-7.7149 -29.75857,-11.42902c-5.107,-1.96138 -7.01752,-7.3726 -5.41078,-11.07232c4.13006,-9.51001 22.1194,-50.93282 22.1194,-50.93282z" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M223.97522,179.36566l-17.75996,-46.9131l12.06337,3.68603l9.71771,25.13202" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M268.77477,157.22889c3.94788,-0.6674 12.67299,0.90255 18.54715,4.14104c3.54973,1.957 8.63085,7.67998 8.46231,11.96793c-0.14335,3.64728 -5.10401,6.07102 -7.14621,6.23577c-4.69174,0.37849 -10.41826,-5.26039 -13.06099,-5.73818c-3.77463,-0.68244 -6.72444,0.24778 -10.47752,0.3855c-7.39699,0.27144 -13.69105,-0.30207 -20.23043,-4.04606c-1.66373,-1.35238 -7.55745,-6.36988 -7.55745,-6.36988c0,0 23.62505,-5.25108 31.46314,-6.57613z" fill="currentColor" stroke="none" stroke-width="0.5" stroke-linecap="butt"/><path d="M216.60316,179.36566c0,-3.88641 3.15056,-7.03696 7.03696,-7.03696c3.88641,0 7.03696,3.15056 7.03696,7.03696c0,3.88641 -3.15056,7.03696 -7.03696,7.03696c-3.88641,0 -7.03696,-3.15056 -7.03696,-7.03696z" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="butt"/><path d="M180.68844,239.31156v-118.62312h118.62312v118.62312z" fill="none" stroke="none" stroke-width="0" stroke-linecap="butt"/></g></g></svg><!--rotationCenter:59.31155955341217:59.31155955341211-->'; }
    
    coordToColourID(x, y, width) {
        return ((y * width) + x) * 4;
    }

    mixMult = 1 / 255;

    mouseDown(gl, x, y, toolProperties) {
        //Get image data as array here so we don't run continous calls
        const {data, width, height} = gl.getImageData(0,0, gl.canvas.width, gl.canvas.height);
        const myColor = artimus.HexToRGB(toolProperties.fillColor);
        
        //Get the target colour
        let targetCoord = this.coordToColourID(x, y, width);
        const targetColor = [
            data[targetCoord],
            data[targetCoord + 1],
            data[targetCoord + 2],
            data[targetCoord + 3]
        ]

        //Make sure we aren't targeting ourselves (Infinite loop)
        if (targetColor[0] == myColor.r && targetColor[1] == myColor.g && targetColor[2] == myColor.b && targetColor[3] == myColor.a) return;

        //Our compare and set functions, these are used in propigation, we need to make sure to stop transparent stuff when working with non transparent pixels
        const colorCompare = (toolProperties.respectTransparency && (targetColor[3] == 0)) ?
            (() => (targetColor[0] == data[targetCoord] && targetColor[1] == data[targetCoord + 1] && targetColor[2] == data[targetCoord + 2] && data[targetCoord + 3] == targetColor[3]) || data[targetCoord + 3] < 240):
            (() => (targetColor[0] == data[targetCoord] && targetColor[1] == data[targetCoord + 1] && targetColor[2] == data[targetCoord + 2] && targetColor[3] == data[targetCoord + 3]));

        const colorSet = (toolProperties.respectTransparency && (targetColor[3] == 0)) ? () => {
            const mix = (255 - data[targetCoord + 3]) * this.mixMult;
            data[targetCoord] += (myColor.r - data[targetCoord]) * mix;
            data[targetCoord + 1] += (myColor.g - data[targetCoord + 1]) * mix;
            data[targetCoord + 2] += (myColor.b - data[targetCoord + 2]) * mix;
            data[targetCoord + 3] = 255;
        } : () => {
            data[targetCoord] = myColor.r;
            data[targetCoord + 1] = myColor.g;
            data[targetCoord + 2] = myColor.b;
            data[targetCoord + 3] = myColor.a;
        }

        //Detection for selection, since we do this a lot it's good to have this.
        const outsideSelection = (this.workspace.hasSelection > 0) ? 
            (x, y) => !(this.inSelection(gl, x, y)) : 
            () => false;

        //Queue related stuff to prevent backtracking
        let paintQueue = [[x, y]];

        const queueIncludes = (pos) => paintQueue.filter((comp) => comp[0] == pos[0] && comp[1] == pos[1]).length > 0;

        //Go through the paint queue setting colours and getting next positions, finally ending when none are left
        while (paintQueue.length > 0) {
            let [ px, py ] = paintQueue[0];

            if (outsideSelection(px, py)) {
                paintQueue.splice(0, 1);
                continue;
            }

            targetCoord = this.coordToColourID(px, py, width);
            const isTransparent = data[targetCoord + 3] == 0 || data[targetCoord + 3] == 255;

            colorSet();

            if (isTransparent) {
                targetCoord = this.coordToColourID(px - 1, py, width);
                if ((px - 1) >= 0 && colorCompare() && !queueIncludes([px - 1, py])) paintQueue.push([px - 1, py]);
                targetCoord = this.coordToColourID(px + 1, py, width);
                if ((px + 1) < width && colorCompare() && !queueIncludes([px + 1, py])) paintQueue.push([px + 1, py]);

                targetCoord = this.coordToColourID(px, py - 1, width);
                if ((py - 1) >= 0 && colorCompare() && !queueIncludes([px, py - 1])) paintQueue.push([px, py - 1]);
                targetCoord = this.coordToColourID(px, py + 1, width);
                if ((py + 1) < height && colorCompare() && !queueIncludes([px, py + 1])) paintQueue.push([px, py + 1]);
            }

            paintQueue.splice(0, 1);
        }

        //Blit
        gl.putImageData(new ImageData(data, width, height), 0, 0);
    }

    CUGI(artEditor) { return [
        { target: artEditor.toolProperties, key: "fillColor", type: "color" },
        { target: artEditor.toolProperties, key: "respectTransparency", type: "boolean" },
    ]}

    properties = {
        fillColor: "#000000",
        respectTransparency: true,
    }
}