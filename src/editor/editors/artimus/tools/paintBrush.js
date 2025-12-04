artimus.tools.paintBrush = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70.5" height="70.5" viewBox="0,0,70.5,70.5"> <g transform="translate(-204.75002,-144.75)">    <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">        <path d="M204.75003,215.25v-70.5h70.5v70.5z" fill="none" stroke-width="0"/>        <path d="M220.9868,205.17696c1.77179,-0.89842 3.45323,-2.83003 3.92284,-4.18449c0.48941,-2.20805 2.09187,-5.70927 4.03585,-6.94886c1.41138,-1.79045 6.7982,-2.72387 8.25105,-0.51354c3.63129,2.41038 4.42564,4.90457 4.65906,6.97496c0.87449,2.30301 -2.19833,6.25534 -4.02505,7.55363c-2.70649,1.77061 -6.09868,1.76254 -9.25182,2.13584c-3.36677,0.39859 -5.03047,-0.4888 -7.98273,-1.41774c-0.53432,-0.4212 -3.55958,-2.15572 -3.34232,-2.965c0.23096,-0.8603 2.73102,-0.52502 3.38089,-0.60196l0.28441,-0.03367c0,0 0.02808,-0.00332 0.06782,0.00082z" fill="currentColor" stroke-width="0.5"/>        <path d="M254.7307,185.57527c-5.41655,12.21861 -8.83657,10.44178 -13.17454,8.51874c-4.33797,-1.92303 -7.95119,-3.26405 -2.53464,-15.48266c5.41655,-12.21861 17.81172,-30.68787 22.14969,-28.76483c4.33797,1.92304 -1.02396,23.51014 -6.4405,35.72876z" fill="currentColor" stroke-width="0"/></g></g></svg><!--rotationCenter:35.249975000000006:35.25000499999999-->'; }
    
    mouseDown(gl, x, y, toolProperties) {
        //if (toolProperties.pixelBrush) { x--; y--; };
        //Set stroke properties
        gl.lineCap = "round";
        gl.lineJoin = "round";
        gl.lineWidth = toolProperties.strokeSize;
        gl.strokeStyle = toolProperties.strokeColor;
        gl.fillStyle = toolProperties.strokeColor;

        //Then start drawing
        toolProperties.linePos = [x,y];

        //For the smooth brush
        if (!toolProperties.pixelBrush) {
            gl.moveTo(x,y);
            gl.beginPath();
            gl.lineTo(x,y);
            gl.stroke();
        }
        else {
            //Calculations
            const halfSize = Math.floor(toolProperties.strokeSize / 2);
            const rx = x - halfSize;
            const ry = y - halfSize;

            gl.fillRect(rx,ry,toolProperties.strokeSize,toolProperties.strokeSize);
        }
    }

    mouseMove(gl, x, y, vx, vy, toolProperties) {
        if (toolProperties.pixelBrush) {
            //For non-AA line drawing;
            const {linePos, strokeSize} = toolProperties;
            const halfSize = Math.floor(strokeSize / 2);
            const distance = 1 / Math.sqrt(Math.pow(linePos[0] - x, 2.0) + Math.pow(linePos[1] - y, 2.0));

            //Draw the line
            for (let i = 0; i < 1; i+=distance) {
                const rx = Math.floor((linePos[0] + (x - linePos[0]) * i) - halfSize);
                const ry = Math.floor((linePos[1] + (y - linePos[1]) * i) - halfSize);

                gl.fillRect(rx,ry,strokeSize,strokeSize);
            }

            toolProperties.linePos = [x,y];
        }
        //Smooth brush
        else {
            const {linePos} = toolProperties;
            const distance = Math.sqrt(Math.pow(linePos[0] - x, 2.0) + Math.pow(linePos[1] - y, 2.0));

            //Assure we don't overdraw
            if (distance > 1) {
                gl.lineTo(x,y);
                gl.stroke();

                gl.closePath(); //! We do it in this order or else firefox throws a fit.
                gl.beginPath();
                gl.moveTo(x,y);

                toolProperties.linePos = [x,y];
            }
        }
    }

    mouseUp(gl, x, y, toolProperties) {
        if (toolProperties.pixelBrush) { x++; y++; };
        if (!toolProperties.pixelBrush) {
            gl.lineTo(x,y);
            gl.stroke();
            gl.moveTo(x,y);
            gl.closePath();
        }
    }

    preview(gl, x, y, toolProperties) {
        //if (toolProperties.pixelBrush) { x--; y--; };
        //Set stroke properties
        gl.lineCap = "round";
        gl.lineJoin = "round";
        gl.lineWidth = toolProperties.strokeSize;
        gl.strokeStyle = toolProperties.strokeColor;
        gl.fillStyle = toolProperties.strokeColor;

        //For the smooth brush
        if (!toolProperties.pixelBrush) {
            gl.moveTo(x,y);
            gl.beginPath();
            gl.lineTo(x,y);
            gl.lineTo(x + 0.1,y + 0.1);
            gl.stroke();
            gl.closePath();
        }
        else {
            //Calculations
            const halfSize = Math.floor(toolProperties.strokeSize / 2);
            const rx = x - halfSize;
            const ry = y - halfSize;

            gl.fillRect(rx,ry,toolProperties.strokeSize,toolProperties.strokeSize);
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