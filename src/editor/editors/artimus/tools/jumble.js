artimus.tools.jumble = class extends artimus.tool {
    get icon() { return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="153.92384" height="153.92384" viewBox="0,0,153.92384,153.92384"><g transform="translate(-163.03808,-103.03808)"><g stroke-miterlimit="10"><path d="M294.42454,152.19081c0,0 -12.56477,0.64938 -39.90761,1.06787c-13.99108,0.21413 -15.47284,55.35862 -28.33588,55.31166c-20.49912,-0.07486 -40.60558,-0.05202 -40.60558,-0.05202" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><path d="M285.90245,134.89291l17.04418,17.04417l-17.04418,17.04418z" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="butt"/><path d="M294.42454,207.80919c0,0 -12.56477,-0.64938 -39.90762,-1.06787c-0.75384,-0.01154 -1.47136,-0.18254 -2.1563,-0.49578" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><path d="M228.07626,151.84432c-0.60388,-0.27388 -1.23454,-0.41707 -1.89523,-0.41466c-20.49912,0.07486 -40.60557,0.05203 -40.60557,0.05203" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><path d="M285.90245,189.87722l17.04418,17.04417l-17.04418,17.04418z" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="butt"/><path d="M163.03808,256.96192v-153.92384h153.92384v153.92384z" fill="none" stroke="none" stroke-width="0" stroke-linecap="butt"/></g></g></svg><!--rotationCenter:76.96192039595141:76.96192039595137-->'; }
    
    jumblePixelsAt(gl, x, y, { jumbleSize, jumbleWholeSquare, mix }) {
        //Calculations
        const halfSize = Math.floor(jumbleSize / 2);
        const rx = x - halfSize;
        const ry = y - halfSize;

        const imageData = gl.getImageData(rx, ry, jumbleSize, jumbleSize);
        const data = imageData.data;

        //Detection for selection, since we do this a lot it's good to have this.
        const insideSelection = (this.workspace.hasSelection) ? 
            (x, y) => this.inSelection(gl, x + rx, y + ry) :
            () => true;

        //For my jumble, whole square
        if (jumbleWholeSquare) {
            const jumbled = [];
            //Randomize
            for (let i = 0; i < data.length; i+=4) {
                const sx = Math.floor(i / 4) % jumbleSize;
                const sy = Math.floor((i / 4) / jumbleSize);

                if (Math.random() > 0.5) jumbled.push([i, sx, sy]); 
                else jumbled.splice(0, 0, [i, sx, sy]); 
            }

            for (let wy = 0; wy < jumbleSize; wy++) { for (let wx = 0; wx < jumbleSize; wx++) {
                const [i1, sx, sy] = jumbled.pop();
                const i2 = ((wy * jumbleSize) + wx) * 4;

                const r1 = data[i1];
                const g1 = data[i1 + 1];
                const b1 = data[i1 + 2];
                const a1 = data[i1 + 3];

                const r2 = data[i2];
                const g2 = data[i2 + 1];
                const b2 = data[i2 + 2];
                const a2 = data[i2 + 3];
                
                if (insideSelection(sx, sy)) {
                    imageData.data[i1]     += (r2 - r1) * mix;
                    imageData.data[i1 + 1] += (g2 - g1) * mix;
                    imageData.data[i1 + 2] += (b2 - b1) * mix;
                    imageData.data[i1 + 3] += (a2 - a1) * mix;
                }
                
                if (insideSelection(wx, wy)) {
                    imageData.data[i2]     += (r1 - r2) * mix;
                    imageData.data[i2 + 1] += (g1 - g2) * mix;
                    imageData.data[i2 + 2] += (b1 - b2) * mix;
                    imageData.data[i2 + 3] += (a1 - a2) * mix;
                }
            }}
        }
        //For Chiragon's jumble, little bits.
        //We may or may not have argued for 30 minutes on this... I'm sorry for getting so heated
        //I decided to make a happy little compromise between our ideas.
        else {
            for (let i = 0; i < jumbleSize * 2; i++) {
                const x1 = artimus.iRandRange(0, jumbleSize);
                const x2 = artimus.iRandRange(0, jumbleSize);
                const y1 = artimus.iRandRange(0, jumbleSize);
                const y2 = artimus.iRandRange(0, jumbleSize);

                const i1 = (((y1) * jumbleSize) + x1) * 4;
                const i2 = (((y2) * jumbleSize) + x2) * 4;


                const r1 = data[i1];
                const g1 = data[i1 + 1];
                const b1 = data[i1 + 2];
                const a1 = data[i1 + 3];

                const r2 = data[i2];
                const g2 = data[i2 + 1];
                const b2 = data[i2 + 2];
                const a2 = data[i2 + 3];

                if (insideSelection(x1, y1)) {
                    imageData.data[i1]     += (r2 - r1) * mix;
                    imageData.data[i1 + 1] += (g2 - g1) * mix;
                    imageData.data[i1 + 2] += (b2 - b1) * mix;
                    imageData.data[i1 + 3] += (a2 - a1) * mix;
                }
                
                if (insideSelection(x2, y2)) {
                    imageData.data[i2]     += (r1 - r2) * mix;
                    imageData.data[i2 + 1] += (g1 - g2) * mix;
                    imageData.data[i2 + 2] += (b1 - b2) * mix;
                    imageData.data[i2 + 3] += (a1 - a2) * mix;
                }
            }
        }

        gl.putImageData(imageData, rx, ry);
    }

    mouseDown(gl, x, y, toolProperties) { this.jumblePixelsAt(gl, x, y, toolProperties); }
    mouseMove(gl, x, y, vx, vy, toolProperties) { this.jumblePixelsAt(gl, x, y, toolProperties); }

    preview(gl, x, y, toolProperties) {
        //Calculations
        const halfSize = Math.floor(toolProperties.jumbleSize / 2);
        const rx = x - halfSize;
        const ry = y - halfSize;

        gl.fillStyle = getComputedStyle(document.body).getPropertyValue("--artimus-eraser-outline");
        gl.fillRect(rx,ry,toolProperties.jumbleSize,toolProperties.jumbleSize);

        if (toolProperties.jumbleSize >= 3) {
            gl.fillStyle = getComputedStyle(document.body).getPropertyValue("--artimus-eraser-inline");
            gl.fillRect(rx + 1,ry + 1,toolProperties.jumbleSize - 2,toolProperties.jumbleSize - 2);
        }
    }

    CUGI(artEditor) { return [
        { target: artEditor.toolProperties, key: "jumbleSize", type: "int" },
        { target: artEditor.toolProperties, key: "jumbleWholeSquare", type: "boolean" },
        { target: artEditor.toolProperties, key: "mix", type: "slider", min: 0, max: 1, step: 0.05 },
    ]}

    properties = {
        jumbleSize: 10,
        jumbleWholeSquare: false,
        mix: 1,
    }
}