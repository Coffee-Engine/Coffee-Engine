artimus.tools.sprayPaint = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="85.95915" height="85.95915" viewBox="0,0,85.95915,85.95915"><g transform="translate(-197.02043,-137.02043)"><g stroke="none" stroke-width="0" stroke-miterlimit="10"><g><path d="M237.56815,212.15798c-1.71311,-4.66548 -15.63394,-40.05941 -15.63394,-40.05941l27.42722,-10.07099c0,0 13.92083,35.39393 15.63394,40.05941c0.25281,0.68849 -0.24174,1.43369 -1.37758,1.85077c-0.68467,0.2514 -1.01017,1.99635 -1.98062,2.35269c-5.24208,1.92484 -13.95692,5.12483 -18.62006,6.83709c-1.21414,0.44582 -2.67954,-0.64153 -3.21152,-0.44619c-0.94966,0.34871 -1.98463,0.16513 -2.23744,-0.52337z" fill="currentColor"/><path d="M221.25298,165.90214c0,0 -4.14933,-11.30025 -5.24952,-14.29649c-0.50445,-1.3738 0.51595,-3.60024 1.77955,-4.06422c2.06485,-0.75819 8.36189,-3.0704 13.97208,-5.1304c4.94303,-1.81503 6.43572,2.85996 6.43572,2.85996c0,0 4.54577,-1.98006 5.47268,0.54425c1.14456,3.11708 3.83682,10.44916 3.83682,10.44916z" fill="currentColor"/><path d="M241.94457,155.56777l-2.54391,-6.92806l9.34051,-3.42974l2.54391,6.92806z" fill="currentColor"/><path d="M197.02043,222.97957v-85.95915h85.95915v85.95915z" fill="none"/></g></g></g></svg><!--rotationCenter:42.97957434003874:42.97957434003874-->'; }
    
    spray(gl, x, y, toolProperties) {
        for (let i = 0; i < toolProperties.points; i++) {
            const dist = (toolProperties.radius) * Math.pow(Math.random(), 2);
            const angle = Math.random() * (2 * Math.PI);

            const dx = x + Math.floor(Math.sin(angle) * dist);
            const dy = y + Math.floor(Math.cos(angle) * dist);

            gl.fillStyle = toolProperties.color;
            gl.fillRect(dx, dy, 1, 1);
        }
    }

    mouseDown (gl, x, y, toolProperties) { this.spray(gl, x, y, toolProperties); toolProperties.down = true; }
    mouseMove (gl, x, y, vx, vy, toolProperties) { this.spray(gl, x, y, toolProperties); }
    mouseUp (gl, x, y, toolProperties) { toolProperties.down = false;}

    preview (gl, x, y, toolProperties) {
        //if (toolProperties.start) {
        //}
        if (!toolProperties.down) {
            gl.strokeStyle = artimus.getCSSVariable("eraser-outline");
            gl.fillStyle = artimus.getCSSVariable("eraser-inline");
            gl.lineWidth = 2;

            gl.beginPath();
            gl.ellipse(x, y, toolProperties.radius, toolProperties.radius, 0, 0, 2 * Math.PI);
            gl.fill();
            gl.stroke();
            gl.closePath();
        }
    }

    CUGI(artEditor) { return [
        { target: artEditor.toolProperties, key: "color", type: "color" },
        { target: artEditor.toolProperties, key: "radius", type: "int" },
        { target: artEditor.toolProperties, key: "points", type: "int" },
    ]}

    properties = {
        color: "#ff0000",
        radius: 10,
        points: 5,
    }
}