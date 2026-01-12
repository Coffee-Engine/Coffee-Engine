window.artimus = {
    tools: {},
    maxHistory: 10,

    defaultArrow: `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="67.79628" height="19.99114" viewBox="0,0,67.79628,19.99114"><g transform="translate(-206.10043,-170.79353)"><g fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-miterlimit="10"><path d="M272.39671,189.28467c-0.45144,-8.7306 -24.09936,-17.06276 -32.46692,-16.99068c-7.9521,0.06851 -31.96292,7.81916 -32.32935,16.92539c-0.00186,0.04618 16.25066,-3.22684 32.24773,-3.1737c16.40198,0.05449 32.55854,3.43226 32.54855,3.23898z" /></g></g></svg>`,

    degreeToRad: (deg) => (deg * (3.1415962 / 180)),
    radToDegree: (rad) => (rad * (180 / 3.1415962)),

    getCSSVariable: (variable) => {
        return getComputedStyle(document.body).getPropertyValue(`--artimus-${variable}`);
    },

    iRandRange: (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    HexToRGB: (Hex) => {
        if (typeof Hex === "string") {
            Hex = Hex.trim();

            if (Hex.length > 7) {
                const splitHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex) || [0,0,0,255];
                return {
                    r: parseInt(splitHex[1], 16),
                    g: parseInt(splitHex[2], 16),
                    b: parseInt(splitHex[3], 16),
                    a: parseInt(splitHex[4], 16),
                };
            } else if (Hex.length > 5) {
                const splitHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(Hex);
                return {
                    r: parseInt(splitHex[1], 16),
                    g: parseInt(splitHex[2], 16),
                    b: parseInt(splitHex[3], 16),
                    a: 255,
                };
            } else {
                const splitHex = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(Hex);
                return {
                    r: parseInt(splitHex[1], 16),
                    g: parseInt(splitHex[2], 16),
                    b: parseInt(splitHex[3], 16),
                    a: 255,
                };
            }
        }

        return {
            r: Math.floor(Hex / 65536),
            g: Math.floor(Hex / 256) % 256,
            b: Hex % 256,
            a: 255,
        };
    },

    RGBtoHex: (RGB) => {
        let hexR = Math.floor(RGB.r).toString(16);
        let hexG = Math.floor(RGB.g).toString(16);
        let hexB = Math.floor(RGB.b).toString(16);

        if (hexR.length == 1) hexR = "0" + hexR;
        if (hexG.length == 1) hexG = "0" + hexG;
        if (hexB.length == 1) hexB = "0" + hexB;

        //Transparency
        if (typeof RGB.a == "number") {
            let hexA = Math.floor(RGB.a).toString(16);
            if (hexA.length == 1) hexA = "0" + hexA;

            return `#${hexR}${hexG}${hexB}${hexA.toLowerCase() == "ff" ? "" : hexA}`;
        }

        return `#${hexR}${hexG}${hexB}`;
    },

    translate: (item, context) => {
        return item;
    },

    //Should probably make a default one but for now this works.
    layerPropertyMenu: (workspace, layer) => {},

    //Other stuff
    extensionToMIME: {
        "png": "image/png",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",

        //Eww
        "webp": "image/webp",
    },

    //Mostly used in saving but can be used for other purposes, like making a list of global composite operations
    blendModes: [
        "source-over",
        "source-in",
        "source-out",
        "source-atop",
        "destination-over",
        "destination-in",
        "destination-out",
        "destination-atop",
        "lighter",
        "copy",
        "xor",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
    ],

    tool: class {
        get icon() { return ""; }

        constructor(workspace) {
            this.workspace = workspace;
        }

        mouseDown() {}
        mouseUp() {}
        preview() {}
        CUGI() { return [] }

        inSelection(gl, x, y) {
            if (this.workspace.hasSelection > 0) return gl.isPointInPath(this.workspace.selectionPath, x + 0.5, y + 0.5);
            else return true;
        }

        properties = {};
        constructive = true;
    },
    
    layer: class {

        blendMode = "source-over";
        bitmap = null;
        visibility = true;

        get data() {
            if (this.dataRaw) return this.dataRaw.data;
            else return new Uint8Array(4);
        }

        get width() {
            if (this.dataRaw) return this.dataRaw.width;
            else return 1;
        }

        get height() {
            if (this.dataRaw) return this.dataRaw.height;
            else return 1;
        }

        constructor(width, height, name, workspace, noSwitch) {
            //Create internal image data
            this.dataRaw = new ImageData(width, height);
            
            this.workspace = workspace;
            this.name = name || `${artimus.translate("layer#", "layer").replace("#", this.layers.length + 1)}`;

            //Do a thing, guarenteed to not exist (hopefully)
            if (this.workspace.layerExists(name)) {
                let num = 1;
                name = (`${artimus.translate("layer#", "layer").replace("#", num)}`);
                
                //Find one that doesn't exist.
                while (this.workspace.layerExists(name)) {
                    num++;
                    name = (`${artimus.translate("layer#", "layer").replace("#", num)}`);
                }
            }

            
            this.element = this.workspace._createLayerElement(this);

            this.workspace.layers.push(this);
            this.workspace.layerList.appendChild(this.element);

            this.element.positionID = this.workspace.layers.length - 1;

            //Finally use the new layer
            if (!noSwitch) this.workspace.setLayer(name);
        }

        updateBitmap() {
            if (this.bitmap) this.bitmap.close();

            return new Promise((resolve, reject) => createImageBitmap(this.dataRaw).then(bitmap => {
                this.bitmap = bitmap;
                resolve(bitmap);
            }));
        }

        dispose(ID) {            
            //Clean up clean up!
            this.element.parentElement.removeChild(this.element);
            this.workspace.layers.splice(ID, 1);

            if (this.bitmap) this.bitmap.close();
            delete this;
        }

        resize(active, width, height, editingData) {
            const layer = (active) ? editingData : this;

            //Get needed attributes for the transfer
            const output = new ImageData(width, height);
            const readWidth = Math.min(width, layer.width);
            const readHeight = Math.min(height, layer.height);

            //Transfer data
            for (let y = 0; y < readHeight; y++) {
                for (let x = 0; x < readWidth; x++) {
                    const lID = ((y * layer.width) + x) * 4;
                    const oID = ((y * output.width) + x) * 4;
                    output.data[oID] = layer.data[lID];
                    output.data[oID + 1] = layer.data[lID + 1];
                    output.data[oID + 2] = layer.data[lID + 2];
                    output.data[oID + 3] = layer.data[lID + 3];
                }
            }
            
            //Blit image data to editing canvas if needed
            if (active) {
                this.workspace.GL.putImageData(output, 0, 0);
            }

            this.dataRaw = output;
            this.updateBitmap();
        }
    },

    workspace: class {
        //Scrolling
        #scrollX = 0;
        set scrollX(value) {
            this.#scrollX = Math.min(Math.max(this.width / -2, value), this.width / 2);
            this.updatePosition();
        }
        get scrollX() { return this.#scrollX; }

        #scrollY = 0;
        set scrollY(value) {
            this.#scrollY = Math.min(Math.max(this.height / -2, value), this.height / 2);
            this.updatePosition();
        }
        get scrollY() { return this.#scrollY; }

        #zoom = 2;
        invZoom = 1;
        set zoom(value) {
            this.#zoom = Math.max(Math.min(value, 25), 0.25);
            this.updatePosition();
        }
        get zoom() { return this.#zoom; }

        //Tools
        #tool = ""
        toolFunction = {};
        set tool(value) {
            if (artimus.tools[value]) this.toolFunction = new artimus.tools[value]();
            else this.toolFunction = {};
            this.toolFunction.workspace = this;

            this.toolProperties = Object.assign({},this.toolFunction.properties, this.toolProperties);

            this.#tool = value;
            this.refreshToolOptions();

            //We also want to clear the previewGL
            if (this.toolFunction.preview) this.previewGL.clearRect(0, 0, this.width, this.height);
        }
        get tool() { return this.#tool; }

        toolProperties = {};

        //Canvas
        #width = 300;
        set width(value) { this.resize(value, this.height); }
        get width() { return this.#width; }

        #height = 150;
        set height(value) { this.resize(this.width, value); }
        get height() { return this.#height; }
        
        dirty = true;

        //Layers
        layerHiddenAnimation = 0;
        #currentLayer = 0;
        set currentLayer(value) {
            this.setLayer(value);
        }
        get currentLayer() {
            return this.#currentLayer;
        }

        //History
        layerHistory = [];
        historyIndex = 0;

        //CSS classes
        toolClass = "artimus-button artimus-sideBarButton artimus-tool ";
        layerClass = "artimus-button artimus-sideBarButton artimus-layer ";
        toolClassSelected = "artimus-button-selected artimus-tool-selected ";
        layerClassSelected = "artimus-button-selected artimus-layer-selected ";

        //Selection stuff
        selection = [];
        selectionAnimation = 0;
        selectionPath = new Path2D();
        hasSelection = false;

        //And finally...
        projectStorage = {};

        //Objects and data needed for the artimus format
        tEncoder = new TextEncoder();
        tDecoder = new TextDecoder();
        magic = Array.from("COFE", char => String(char).charCodeAt(0));
        jsonMagic = Array.from("JSON", char => String(char).charCodeAt(0));

        updatePosition() {
            //Setup some CSS
            this.quickVar(this.container, {
                "scrollX": `${this.scrollX}px`,
                "scrollY": `${this.scrollY}px`,
                "zoom": this.zoom,
                "canvasWidth": `${this.width}px`,
                "canvasHeight": `${this.height}px`
            });
            
            this.invZoom = 1 / this.#zoom;
        }

        //General helper functions ported from Coffee Engine
        quickCSS(element, css) {
            if (Array.isArray(element)) {
                for (let elID in element) {
                    editor.quickCSS(element[elID], css);
                }
            }

            if (!(element instanceof HTMLElement)) return element;

            for (let key in css) {
                element.style[key] = css[key];
            }

            return element;
        }

        //Quickly sets css variables
        quickVar(element, variables) {
            if (Array.isArray(element)) {
                for (let elID in element) {
                    editor.quickVar(element[elID], variables);
                }
            }

            if (!(element instanceof HTMLElement)) return element;

            for (let key in variables) {
                element.style.setProperty(`--${key}`, variables[key]);
            }

            return element;
        }

        //Host/Parasite relationship
        host = document.createElement("div");

        elementFromString(element) {
            this.host.innerHTML = element;

            //Remove the parasite
            const parasite = this.host.children[0];
            this.host.removeChild(parasite);
            return parasite;
        }

        //Now for the meat and potatoes
        constructor() {
            //Look for existing CUGI if one doesn't exist, add it.
            if (!window.CUGI) {
                window.CUGI = {};

                const CUGIScript = document.createElement("script");
                CUGIScript.src = "https://coffee-engine.github.io/CUGI/dist/CUGI.js";
                document.body.appendChild(CUGIScript);
            }

            this.createLayout();
            this.addControls();

            //Create layers
            this.layers = [];

            //For editing
            this.editingCanvas = document.createElement("canvas");
            this.previewCanvas = document.createElement("canvas");
            this.compositeCanvas = document.createElement("canvas");
            this.gridCanvas = document.createElement("canvas");

            this.GL = this.editingCanvas.getContext("2d", { willReadFrequently: true });
            this.fullviewGL = this.canvas.getContext("2d", { alpha: false, desynchronized: true });
            this.compositeGL = this.compositeCanvas.getContext("2d");
            this.previewGL = this.previewCanvas.getContext("2d");
            this.gridGL = this.gridCanvas.getContext("2d", { alpha: false });

            this.resize(640, 480);
            this.createLayer();

            this.fileReader = new FileReader();

            artimus.activeWorkspaces.push(this);

            const workspace = this;

            let start = 0;
            const loop = (ts) => {
                if (!workspace) return;

                workspace.renderLoop.call(workspace, (ts - start) / 1000);
                requestAnimationFrame(loop);

                start = ts;
            }

            //Setup our grid then loop
            this.setGridSize(4);
            this.refreshGridPattern(() => {
                loop(0.016);
            });

            this.refreshTranslation();
        }

        refreshGridPattern(then) {
            const c1 = artimus.HexToRGB(artimus.getCSSVariable("grid-1"));
            const c2 = artimus.HexToRGB(artimus.getCSSVariable("grid-2"));

            const imageData = new ImageData(2, 2);

            //Set data
            imageData.data[0] = c1.r; imageData.data[1] = c1.g; imageData.data[2] = c1.b; imageData.data[3] = 255;
            imageData.data[4] = c2.r; imageData.data[5] = c2.g; imageData.data[6] = c2.b; imageData.data[7] = 255;
            imageData.data[8] = c2.r; imageData.data[9] = c2.g; imageData.data[10] = c2.b; imageData.data[11] = 255;
            imageData.data[12] = c1.r; imageData.data[13] = c1.g; imageData.data[14] = c1.b; imageData.data[15] = 255;
            
            createImageBitmap(imageData).then(bitmap => {
                if (this.gridBitmap) this.gridBitmap.close();
                this.gridBitmap = bitmap;
                
                //Create the pattern and position it
                this.gridPattern = this.fullviewGL.createPattern(bitmap, "repeat");
                this.gridPattern.setTransform(this.gridMatrix);

                //Update grid canvas
                this.gridGL.fillStyle = this.gridPattern;
                this.gridGL.fillRect(0, 0, this.width, this.height);

                if (then) then();
            });
        }

        setGridSize(size) {
            this.gridMatrix = new DOMMatrix([
                size, 0,
                0, size,
                0, 0
            ]);

            if (this.gridPattern) {
                this.gridPattern.setTransform(this.gridMatrix);
            }
        }

        renderLoop(delta) {
            this.fullviewGL.drawImage(this.gridCanvas, 0, 0);

            if (this.dirty) {
                this.renderComposite();
                this.dirty = false;
            }

            this.fullviewGL.drawImage(this.compositeCanvas, 0, 0);

            //Render hidden layers
            if (!this.getLayerVisibility(this.currentLayer)) {
                this.layerHiddenAnimation += delta * 5.0;
                this.fullviewGL.globalAlpha = (Math.sin(this.layerHiddenAnimation) * 0.25) + 0.6;
                this.fullviewGL.drawImage(this.editingCanvas, 0, 0);
                this.fullviewGL.globalAlpha = 1;
            }

            this.fullviewGL.drawImage(this.previewCanvas, 0, 0);

            if (this.hasSelection) {
                this.selectionAnimation = (this.selectionAnimation + (delta * 7.5)) % 6;
                this.fullviewGL.setLineDash([4, 2]);
                this.fullviewGL.lineDashOffset = this.selectionAnimation;
                this.fullviewGL.strokeStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
                this.fullviewGL.lineWidth = 1;
                this.fullviewGL.stroke(this.selectionPath);
            }
        }

        renderComposite(final) {
            this.compositeGL.clearRect(0, 0, this.width, this.height);
            for (let layerID in this.layers) {
                const layer = this.layers[layerID];
                this.compositeGL.globalCompositeOperation = layer.blendMode || "source-over";

                if (layer.visibility) {
                    if (layerID == this.currentLayer) this.compositeGL.drawImage(this.editingCanvas, 0, 0);
                    else {
                        const bitmap = layer.bitmap;
                        if (bitmap instanceof ImageBitmap) this.compositeGL.drawImage(bitmap, 0, 0);
                    }
                }
            }
        }

        createLayout() {
            //Create needed elements
            this.container = document.createElement("div");
            
            this.toolbar = document.createElement("div");
            this.toolbox = document.createElement("div");
            this.toolPropertyHolder = document.createElement("div");
            this.layerHolder = document.createElement("div");

            this.layerList = document.createElement("div");
            this.layerCreationHolder = document.createElement("div");
            this.layerCreationName = document.createElement("input");
            this.layerCreationButton = document.createElement("button");
            this.layerCreationButton.innerText = "✓";

            this.canvasArea = document.createElement("div");
            this.canvas = document.createElement("canvas");
            
            //Fix for it resizing it's parents
            //this.canvas.style.width = "1px";
            //this.canvas.style.height = "1px";
            
            //Now we can style our children
            this.container.className = "artimus-container";

            this.toolbar.className = "artimus-toolbar";
            this.toolbox.className = "artimus-sideBarList artimus-toolbox";
            this.toolPropertyHolder.className = "artimus-sideBarList artimus-toolPropertyHolder";
            this.layerHolder.className = "artimus-sideBarList artimus-layerHolder";

            this.layerList.className = "artimus-layerList";

            this.layerCreationHolder.className = "artimus-layerCreationHolder";
            this.layerCreationName.className = "artimus-layerCreationName";
            this.layerCreationButton.className = "artimus-button artimus-layerCreationButton";

            this.canvasArea.className = "artimus-canvasArea";
            this.canvas.className = "artimus-canvas";
            
            this.container.appendChild(this.toolbar);
            this.toolbar.appendChild(this.toolbox);
            this.toolbar.appendChild(this.toolPropertyHolder);
            this.toolbar.appendChild(this.layerHolder);

            this.layerHolder.appendChild(this.layerList);
            this.layerHolder.appendChild(this.layerCreationHolder);
            this.layerCreationHolder.appendChild(this.layerCreationName);
            this.layerCreationHolder.appendChild(this.layerCreationButton);

            this.container.appendChild(this.canvasArea);
            this.canvasArea.appendChild(this.canvas);

            this.layerCreationButton.onclick = () => {
                if (!this.layerExists(this.layerCreationName.value)) {
                    this.createLayer(this.layerCreationName.value);
                    this.layerCreationName.value = "";
                }
            }

            this.updatePosition();
        }

        //Control stuffs
        fingersDown = 0;
        panning = false;
        controlSets = {
            kbMouse: {
                mouseDown: (event) => {
                    switch (event.button) {
                        case 0:
                            if (event.target != this.canvas) return;
                            if (this.toolFunction.mouseDown && !this.toolDown) this.toolFunction.mouseDown(this.GL, ...this.getCanvasPosition(event.clientX, event.clientY), this.toolProperties);
                            this.toolDown = true;
                            break;

                        case 2:
                            if (event.target != this.canvas) return;
                            const [red, green, blue, alpha] = this.GL.getImageData(...this.getCanvasPosition(event.clientX, event.clientY, true), 1, 1).data;
                            const converted = artimus.RGBtoHex({ r:red, g:green, b:blue, a:alpha });

                            //The three typical colours
                            this.toolProperties.strokeColor = converted;
                            this.toolProperties.fillColor = converted;
                            this.toolProperties.color = converted;

                            //Refresh options
                            this.refreshToolOptions();
                            break;

                        case 1:
                            this.panning = true;
                            break;
                    
                        default:
                            break;
                    }
                },

                mouseUp: (event) => {
                    switch (event.button) {
                        case 0:
                            const position = this.getCanvasPosition(event.clientX, event.clientY);
                            if (this.toolFunction.mouseUp && this.toolDown) this.toolFunction.mouseUp(this.GL, ...position, this.toolProperties);
                            if (this.toolFunction.preview) {
                                this.previewGL.clearRect(0, 0, this.width, this.height);
                                this.toolFunction.preview(this.previewGL, ...position, this.toolProperties);
                            }
                            
                            //For the undoing
                            if (this.toolDown && this.tool && this.toolFunction.constructive) {
                                this.updateLayerHistory();
                                this.dirty = true;
                            }
                            this.toolDown = false; 
                            break;
                        
                        case 1:
                            this.panning = false;
                            break;
                    
                        default:
                            break;
                    }
                    
                    
                },

                mouseMove: (event) => {
                    if (this.panning) {
                        this.scrollX += event.movementX * this.invZoom;
                        this.scrollY += event.movementY * this.invZoom;
                    }

                    const position = this.getCanvasPosition(event.clientX, event.clientY);
                    
                    if (this.toolFunction.preview) {
                        //For previews
                        this.previewGL.clearRect(0, 0, this.width, this.height);
                        this.toolFunction.preview(this.previewGL, ...position, this.toolProperties);
                    }

                    if (this.toolDown && this.toolFunction.mouseMove) {
                        this.toolFunction.mouseMove(this.GL, ...position, event.movementX * this.invZoom, event.movementY * this.invZoom, this.toolProperties);
                        if (this.toolFunction.constructive) this.dirty = true;
                    }
                },

                mouseWheel: (event) => {
                    if (event.ctrlKey) {
                        event.preventDefault();
                        this.zoom += event.deltaY / -100;
                    }
                    else if (event.shiftKey) {
                        this.scrollX -= (event.deltaY) * this.invZoom;
                        this.scrollY -= (event.deltaX) * this.invZoom;
                        this.zoom += event.deltaZ / -100;
                    }
                    else {
                        this.scrollX -= (event.deltaX) * this.invZoom;
                        this.scrollY -= (event.deltaY) * this.invZoom;
                        this.zoom += event.deltaZ / -100;
                    }
                }
            },

            //Mobile support
            touch: {
                lastDrewX: 0,
                lastDrewY: 0,
                touches: {},
                
                fingerDown: (event) => {
                    event.preventDefault();
                    this.fingersDown++;

                    //Update the touches
                    for (let touchID in Array.from(event.changedTouches)) {
                        const touch = event.changedTouches[touchID];
                        
                        this.controlSets.touch.touches[touch.identifier] = {
                            lx: touch.clientX,
                            ly: touch.clientY
                        }
                    }
                },

                fingerMove: (event) => {
                    const firstTouch = event.changedTouches[0];
                    const touches = Array.from(event.changedTouches);
                    
                    switch ((this.toolFunction) ? this.fingersDown : 0) {
                        //Panning
                        default:
                            for (let touchID in touches) {
                                const touch = touches[touchID];
                                const heldData = this.controlSets.touch.touches[touch.identifier];
                                this.scrollX += (touch.clientX - heldData.lx) * (this.invZoom / this.fingersDown);
                                this.scrollY += (touch.clientY - heldData.ly) * (this.invZoom / this.fingersDown);
                            }
                            break;

                        //Drawing
                        case 1:
                            if (event.target != this.canvas) return;

                            const position = this.getCanvasPosition(firstTouch.clientX, firstTouch.clientY);
                            const heldData = this.controlSets.touch.touches[touch.identifier];

                            //Initilize drawing if we haven't
                            if (!this.toolDown) {
                                if (this.toolFunction.mouseDown && !this.toolDown) this.toolFunction.mouseDown(this.GL, ...position, this.toolProperties);
                                this.toolDown = true;
                            }
                            else {
                                const position = this.getCanvasPosition(firstTouch.clientX, firstTouch.clientY);
                    
                                if (this.toolFunction.preview) {
                                    //For previews
                                    this.previewGL.clearRect(0, 0, this.width, this.height);
                                    this.toolFunction.preview(this.previewGL, ...position, this.toolProperties);
                                }

                                if (this.toolDown && this.toolFunction.mouseMove) this.toolFunction.mouseMove(this.GL, ...position, (firstTouch.clientX - heldData.lx) * this.invZoom, (firstTouch.clientY - heldData.ly) * this.invZoom, this.toolProperties);
                            }

                            this.controlSets.touch.lastDrewX = firstTouch.clientX;
                            this.controlSets.touch.lastDrewY = firstTouch.clientY;
                            break;
                    }
                    
                    //Update the touches
                    for (let touchID in Array.from(event.changedTouches)) {
                        const touch = event.changedTouches[touchID];
                        
                        this.controlSets.touch.touches[touch.identifier] = {
                            lx: touch.clientX,
                            ly: touch.clientY
                        }
                    }
                    event.preventDefault();
                },

                fingerUp: (event) => {
                    this.fingersDown--;

                    if (this.fingersDown == 0 && this.toolDown) {
                        if (this.toolFunction.mouseUp && this.toolDown) this.toolFunction.mouseUp(this.GL, ...this.getCanvasPosition(this.controlSets.touch.lastDrewX, this.controlSets.touch.lastDrewY), this.toolProperties);
                        if (this.toolFunction.preview) this.previewGL.clearRect(0, 0, this.width, this.height);
                        
                        //For the undoing
                        if (this.tool) this.updateLayerHistory();
                        this.toolDown = false; 
                    }
                }
            }
        }

        addControls() {
            //Drawing
            this.canvas.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            this.canvasArea.addEventListener("mousedown", this.controlSets.kbMouse.mouseDown);
            this.container.addEventListener("mouseup", this.controlSets.kbMouse.mouseUp);
            this.canvasArea.addEventListener("mousemove", this.controlSets.kbMouse.mouseMove);
            this.canvasArea.addEventListener("wheel", this.controlSets.kbMouse.mouseWheel, { passive: false });

            this.canvasArea.addEventListener("touchstart", this.controlSets.touch.fingerDown);
            this.canvasArea.addEventListener("touchmove", this.controlSets.touch.fingerMove);
            this.canvasArea.addEventListener("touchend", this.controlSets.touch.fingerUp);

            document.addEventListener("keydown", (event) => {
                if (event.key.toLowerCase() == "z" && event.ctrlKey) {
                    //Determine undo/redo
                    if (event.shiftKey) {
                        this.redo();
                    }
                    else {
                        this.undo();
                    }
                }
            })
        }

        refreshTranslation() {
            this.layerCreationName.placeholder = artimus.translate("inputPlaceholder", "layer");

            this.refreshTools();
            this.refreshToolOptions();
        }

        //Canvas movement
        setCanvasPosition(x, y) {
            this.#scrollX = -x;
            this.#scrollX = -y;
        }

        getCanvasPosition(x, y) {
            const {top, left, right, bottom} = this.canvas.getBoundingClientRect();
            return [Math.floor(((x -left) / (right - left)) * this.canvas.width), Math.floor(((y - top) / (bottom - top)) * this.canvas.height)];
        }

        //Tools
        refreshToolOptions() {
            this.toolPropertyHolder.innerHTML = "";

            if (!this.toolFunction.CUGI) return;
            this.toolPropertyHolder.appendChild(CUGI.createList(this.toolFunction.CUGI(this), {
                preprocess: (item) => {
                    item.text = artimus.translate(item.translationKey || item.key || item.text, "toolProperty") || item.text || item.key;
                    return item;
                }
            }));
        }

        refreshTools() {
            this.toolbox.innerHTML = "";
            this.selectedElement = null;

            for (let toolID in artimus.tools) {
                const tool = artimus.tools[toolID].prototype;

                const button = document.createElement("button");

                //Set icon and text if needed
                if (typeof tool.icon == "string") {
                    let icon = null;

                    //For svgs
                    if (tool.icon.startsWith("<svg version=\"")) icon = this.elementFromString(tool.icon);
                    else {
                        icon = document.createElement("img");
                        icon.src = tool.icon;
                    }

                    if (icon instanceof HTMLElement || icon instanceof SVGElement) {
                        //? dunno why classname is not supported for SVG
                        icon.classList = "artimus-toolIcon";
                        button.appendChild(icon);
                    }
                }

                //?Labels are easy but I'm going to group the append with the other append and classNames
                const label = document.createElement("p");
                label.innerText = tool.name || artimus.translate(toolID, "tool");

                button.onclick = () => {
                    this.tool = toolID;

                    //Set the last selected to not be selected
                    if (this.selectedElement) this.selectedElement.className = this.toolClass;
                    button.className = this.toolClass + this.toolClassSelected;

                    this.selectedElement = button;
                }

                //Add cugi related things
                button.CUGI_CONTEXT = () => {
                    return [
                        { type: "button", text: "use", translationKey: "use", onclick: () => {
                            button.onclick();
                        }},
                        { type: "button", text: "useWithDefaults", translationKey: "useWithDefaults", onclick: () => {
                            button.onclick();
                            this.toolProperties = Object.assign(this.toolProperties, this.toolFunction.properties);
                            this.refreshToolOptions();
                        }}
                    ];
                }

                button.CUGI_PREPROCESS = (item) => {
                    item.text = artimus.translate(item.translationKey || item.key || item.text, "toolDropdown") || item.text || item.key;
                    return item;
                }

                //Then setup items
                button.className = (toolID == this.tool) ? this.toolClass + this.toolClassSelected : this.toolClass;
                label.className = "artimus-toolLabel";
                this.toolbox.appendChild(button);
                button.appendChild(label);
            }
        }

        //For selections
        setSelection(newSelection) {
            if (this.selection.length == 0) this.GL.save();
            else {
                this.GL.restore();
                this.GL.save();
            }

            //Reset animation
            this.selectionAnimation = 0;

            //Make sure it is a polygon
            if (!Array.isArray(newSelection)) {
                console.warn("Selection is not an array!", newSelection);
                return this.clearSelection();
            }
            if (newSelection.length < 6) {
                console.warn("Selection is not a polygon!", newSelection);
                return this.clearSelection();
            }

            //Make sure we use pairs of 2
            if (newSelection.length % 2 == 1) {
                console.warn("Selection is not x y pairs!", newSelection);
                return this.clearSelection();
            }

            this.selection = newSelection;
            this.updateSelectionPath();
        }

        clearSelection() {
            this.selection = [];
            this.selectionAnimation = 0;
            this.updateSelectionPath();
        }

        updateSelectionPath() {
            this.selectionPath = new Path2D();

            if (this.selection.length > 0) {
                this.hasSelection = true;

                //Create selection path
                for (let i = 0; i < this.selection.length; i+=2) {
                    if (i == 0) this.selectionPath.moveTo(this.selection[i] + 0.5, this.selection[i + 1] + 0.5);
                    else this.selectionPath.lineTo(this.selection[i] + 0.5, this.selection[i + 1] + 0.5);
                }
                //Finally end it
                this.selectionPath.lineTo(this.selection[0] + 0.5, this.selection[1] + 0.5);

                this.GL.clip(this.selectionPath, "evenodd");
            }
            else {
                this.GL.restore();
                this.hasSelection = false;
            }
        }

        //Layer manipulation, for use inside of the library itself but exposed for people to use for their own purposes
        setLayer(ID, then) {
            return new Promise((resolve, reject) => {
                ID = this.getLayerIndex(ID);

                if (typeof ID == "number") {
                    //Save current data to the layer position
                    const oldLayer = this.layers[this.#currentLayer];
                    const label = oldLayer.label;

                    //Clean up data and save layer data to previous layer.
                    this.layers[this.#currentLayer].dataRaw = this.GL.getImageData(0, 0, this.width, this.height);
                    this.transferLayerData(oldLayer, this.layers[this.#currentLayer]);

                    this.updateLayer(this.#currentLayer, () => {
                        this.#currentLayer = ID;

                        //Now setup stuff we need/want like blitting the newly selected layer onto the editing canvas
                        const current = this.layers[this.#currentLayer];
                        this.GL.putImageData(current.dataRaw, 0, 0);
                        this.layerHistory = [this.GL.getImageData(0, 0, this.width, this.height)];

                        label.className = this.layerClass;
                        current.label.className = this.layerClass + this.layerClassSelected;

                        if (then) then();
                        resolve();
                    });
                }
                else {
                    reject(`Couldn't find or update layer ${ID}`);
                }
            });
        }

        getLayerIndex(ID) {
            if (typeof ID == "string") {
                const locID = this.layers.findIndex((layer) => layer.name == ID);
                if (locID != -1) ID = locID;
            }

            if (typeof ID == "number") {
                return ID;
            }

            return;
        }

        getLayer(ID) {
            if (typeof ID == "string") {
                const locID = this.layers.findIndex((layer) => layer.name == ID);
                if (locID != -1) ID = locID;
            }

            if (typeof ID == "number") {
                return this.layers[ID];
            }

            return;
        }

        createLayer(name, noSwitch) {
            const layer = new artimus.layer(this.canvas.width, this.canvas.height, name || (`${artimus.translate("layer#", "layer").replace("#", this.layers.length + 1)}`), this, noSwitch);
            return layer;
        }

        _createLayerElement(layerData) {
            const element = document.createElement("div");
            element.className = "artimus-layerWrapper";
            element.targetLayer = layerData.name;
            layerData.element = element;

            const label = document.createElement("button");
            label.className = this.layerClass;
            label.innerText = layerData.name;
            label.onclick = () => this.setLayer(element.targetLayer);
            layerData.label = label;

            //Create CUGI bindings for the button, more specifically the label
            label.CUGI_CONTEXT = () => {
                return [
                    { type: "button", text: "delete", onclick: () => this.removeLayer(element.targetLayer) },
                    { type: "button", text: "properties", onclick: () => (artimus.layerPropertyMenu)(this, this.getLayer(element.targetLayer)) }
                ]
            }

            label.CUGI_PREPROCESS = (item) => {
                item.text = artimus.translate(item.translationKey || item.key || item.text, "layerDropdown") || item.text || item.key;
                return item;
            }

            //This button changes depending on whether or not the layer was hidden
            const hideButton = document.createElement("button");
            hideButton.className = "artimus-button artimus-layerButton";
            hideButton.innerText = "👁";
            hideButton.onclick = () => {
                this.setLayerVisibility(element.targetLayer, !this.getLayerVisibility(element.targetLayer));
                hideButton.className = "artimus-button artimus-layerButton " + ((this.getLayerVisibility(element.targetLayer)) ? "" : "artimus-button-selected")
            }

            //This is the thing that holds the buttons that allow 
            // you to move the layer up and down, 
            // I may replace this with a drag and drop thing in the future
            const layerButtonHolder = document.createElement("div");
            layerButtonHolder.className = "artimus-layerButtonHolder";

            const upButton = document.createElement("button");
            upButton.className = "artimus-button artimus-layerButton artimus-layerButton-thin";
            upButton.appendChild(this.elementFromString(artimus.defaultArrow));
            upButton.onclick = () => {
                this.moveLayer(element.targetLayer, 1);
            }

            upButton.children[0].classList = "artimus-layerArrow artimus-layerArrow-up";

            const downButton = document.createElement("button");
            downButton.className = "artimus-button artimus-layerButton artimus-layerButton-thin";
            downButton.appendChild(this.elementFromString(artimus.defaultArrow));
            downButton.onclick = () => {
                this.moveLayer(element.targetLayer, -1);
            }

            downButton.children[0].classList = "artimus-layerArrow artimus-layerArrow-down";

            layerButtonHolder.appendChild(upButton);
            layerButtonHolder.appendChild(downButton);

            element.appendChild(hideButton);
            element.appendChild(layerButtonHolder);
            element.appendChild(label);

            return element;
        }

        setLayerVisibility(ID, to) {
            ID = this.getLayerIndex(ID);

            if (typeof ID == "number") this.layers[ID].visibility = to == true;
        }

        getLayerVisibility(ID) {
            ID = this.getLayerIndex(ID);

            if (typeof ID == "number") return this.layers[ID].visibility;
            return false;
        }

        moveLayer(ID, by) {
            ID = this.getLayerIndex(ID);

            if (typeof ID == "number") {
                const target = ID + by;
                if (target < 0 || target >= this.layers.length) return;

                const elFrom = this.layers[ID].element;
                const elTo = this.layers[target].element;

                const layerFrom = this.layers[ID];
                const layerTo = this.layers[target];

                this.layers[ID] = layerTo;
                this.layers[target] = layerFrom;

                elFrom.positionID = target;
                elTo.positionID = ID;

                if (ID == this.currentLayer) {
                    this.#currentLayer = target;
                }
                else if (target == this.currentLayer) {
                    this.#currentLayer = ID;
                }

                const parent = elFrom.parentElement;

                if (ID == target - 1) {
                    parent.removeChild(elTo);
                    parent.insertBefore(elTo, elFrom);
                }
                else if (target == ID - 1) {
                    parent.removeChild(elFrom);
                    parent.insertBefore(elFrom, elTo);  
                }
                else {
                    parent.removeChild(elFrom);
                    parent.removeChild(elTo);

                    if (target + 1 >= this.layers.length) parent.appendChild(elFrom);
                    else parent.insertBefore(elFrom, this.layers[target + 1].element);

                    if (ID + 1 >= this.layers.length) parent.appendChild(elTo);
                    else parent.insertBefore(elTo, this.layers[ID + 1].element);
                }
            }
        }

        updateLayer(ID, then) {
            return new Promise((resolve, reject) => {
                ID = this.getLayerIndex(ID);

                if (typeof ID == "number") {
                    this.layers[ID].updateBitmap().then(newBitmap => {
                        if (then) then(newBitmap);
                        resolve(newBitmap);
                        this.dirty = true;
                    });
                }
                else {
                    reject(`Couldn't find or update layer ${ID}`);
                }
            });
        }

        colorsOfLayer(ID, includeAlpha) {
            ID = this.getLayerIndex(ID);

            if (typeof ID == "number") {
                const dataRaw = this.layers[ID].dataRaw;

                includeAlpha = (typeof includeAlpha == "boolean") ? includeAlpha : true;

                //Faster than a generator and a map.filter to use data.reduce
                let layerColours = dataRaw.data.reduce((ac, _, ind) => {
                    //Check for two things, we are the R value, and that we aren't alpha if we are not looking for alpha
                    if (ind % 4 == 0 && (includeAlpha || dataRaw.data[ind + 3] > 0)) ac.add((
                        (includeAlpha) ? (dataRaw.data[ind + 3] << 24 >>> 0) : 0 + 
                        (dataRaw.data[ind + 2] << 16 >>> 0) + 
                        (dataRaw.data[ind + 1] << 8 >>> 0) + 
                        dataRaw.data[ind]
                    ));
                    return ac;
                }, new Set());

                console.log(layerColours);

                //Map the value back. ^ up there is really noisy
                if (includeAlpha) {
                    layerColours = [...layerColours].map((val) => [
                        val & 0x000000ff,
                        (val & 0x0000ff00) >>> 8,
                        (val & 0x00ff0000) >>> 16,
                        (val & 0xff000000) >>> 24
                    ]);
                }
                else {
                    layerColours = [...layerColours].map((val) => [
                        val & 0x000000ff,
                        (val & 0x0000ff00) >>> 8,
                        (val & 0x00ff0000) >>> 16
                    ]);
                }

                return layerColours;
            }

            return [];
        }

        updateLayerHistory() {
            if (this.historyIndex > 0) {
                this.layerHistory.splice(0, this.historyIndex);
            }

            this.historyIndex = 0;
            this.layerHistory.splice(0, 0, this.GL.getImageData(0, 0, this.width, this.height));
            if (this.layerHistory.length > artimus.maxHistory) {
                this.layerHistory.pop();
            }
        }

        transferLayerData(from, to) {
            to.name = from.name;
            to.element = from.element;
            to.label = from.label;
        }

        resizeLayer(ID, width, height, editingData) {
            if (typeof ID == "string") {
                const locID = this.layers.findIndex((layer) => layer.name == ID);
                if (locID != -1) ID = locID;
            }

            if (typeof ID == "number") {
                this.layers[ID].resize(ID == this.currentLayer, width, height, editingData);
            }
        }

        removeLayer(ID) {
            //Make sure we don't remove our only layer
            if (this.layers.length <= 1) return;

            if (typeof ID == "string") {
                const locID = this.layers.findIndex((layer) => layer.name == ID);
                if (locID != -1) ID = locID;
            }

            if (ID == this.currentLayer) return;

            if (typeof ID == "number") {
                if (this.#currentLayer > ID) {
                    this.#currentLayer -= 1;
                }

                this.layers[ID].dispose(ID);
            }
        }

        layerExists(name) {
            return this.layers.findIndex((layer) => layer.name == name) != -1;
        }

        //Now for the stuff people want to interact with
        resize(width, height) {
            if (width < 1 || typeof width != "number") width = 1;
            if (height < 1 || typeof height != "number") height = 1;

            this.#width = width;
            this.#height = height;

            //Get editing data before resizing due to resizing removing all image data;
            const editingData = (this.GL) ? this.GL.getImageData(0, 0, this.width, this.height) : null;

            this.canvas.width = width;
            this.canvas.height = height;

            this.previewCanvas.width = width;
            this.previewCanvas.height = height;
            
            this.editingCanvas.width = width;
            this.editingCanvas.height = height;
            
            this.gridCanvas.width = width;
            this.gridCanvas.height = height;
            
            this.compositeCanvas.width = width;
            this.compositeCanvas.height = height;

            //resize layers
            for (let index = 0; index < this.layers.length; index++) {
                this.resizeLayer(index, this.#width, this.#height, editingData);
            }

            //Finally set smoothing
            this.fullviewGL.imageSmoothingEnabled = false;
            this.previewGL.imageSmoothingEnabled = false;
            this.gridGL.imageSmoothingEnabled = false;
            this.GL.imageSmoothingEnabled = false;

            //Redraw the grid
            this.gridGL.fillStyle = this.gridPattern;
            this.gridGL.fillRect(0, 0, this.width, this.height);

            this.scrollX = this.scrollX;
            this.scrollY = this.scrollY;
            this.updatePosition();
        }

        undo() {
            if (this.historyIndex >= this.layerHistory.length - 1) return;
            this.historyIndex++;

            this.GL.putImageData(this.layerHistory[this.historyIndex], 0, 0);
        }

        redo() {
            if (this.historyIndex <= 0) return;
            this.historyIndex--;

            this.GL.putImageData(this.layerHistory[this.historyIndex], 0, 0);
        }

        new(width, height, then) {
            this.scrollX = 0;
            this.scrollY = 0;

            //Remove layers
            this.#currentLayer = 0;
            for (let ID = this.layers.length - 1; ID > 0; ID--) {
                this.removeLayer(Number(ID));
            }

            //Then clear our current layer
            this.GL.clearRect(0, 0, this.width, this.height);
            this.updateLayer(this.#currentLayer, () => {
                this.resize(width, height);
                this.currentLayer = 0;

                if (then) then();
            });

            this.historyIndex = 0;
            this.layerHistory = [];
        }
        
        //Artimus Files
        //==-- MODES --==//
        //0 : Standard : All colours 6 bytes per strip
        //      COUNT : 2 bytes
        //      COLOR : 4 bytes
        //1 : 256 palette : 256 colours max, 3 bytes per strip, beginning header with 1 + n bytes
        //      -- Header
        //      COLORS : 1 byte
        //      PALETTE : N * 4 bytes
        //      -- Contents
        //      COUNT : 2 bytes
        //      COLOR : 1 byte
        //2 : Single Color : 1 colour max, yknow this one is self explanitory...
        //     COLOR : 4 bytes
        //3 : Single Color, w alpha : 1 colour max, yknow this one is self explanitory...
        //      -- Header
        //      COLOR : 3 bytes
        //      -- Contents
        //      COUNT : 2 bytes
        //      ALPHA : 1 byte
        encodingModes = [
            //FC
            (data, bytesPerLayer, palette, colours) => {
                let colour = [-1, -1, -1, -1];
                let count = 0;
                let savedBytes = 0;

                for (let i = 0; i < bytesPerLayer; i+=4) {
                    //Count colours
                    if ((
                        colour[0] == colours[i] &&
                        colour[1] == colours[i + 1] &&
                        colour[2] == colours[i + 2] &&
                        colour[3] == colours[i + 3]) &&
                        (count + 1) < Math.pow(2, 16)
                    ) count++;
                    else {
                        //If the colour is not the same, or we are almost out of space we can begin anew
                        if (count > 0) {
                            data.push(
                                (count & 0xff00) >> 8,
                                (count & 0x00ff),

                                ...colour
                            )
                        }
                        
                        savedBytes += 6;

                        //The begin anew part
                        colour = [colours[i], colours[i + 1], colours[i + 2], colours[i + 3]];
                        count = 1;
                    }
                }

                //Push the data once we hit the edge
                data.push(
                    (count & 0xff00) >> 8,
                    (count & 0x00ff),

                    ...colour
                )

                savedBytes += 6;
                return savedBytes;
            },
            
            //256 color
            (data, bytesPerLayer, palette, colours) => {
                let colour = [-1, -1, -1, -1];
                let count = 0;
                let savedBytes = 0;

                //Start from 0 to get full range
                data.push(palette.length - 1);
                data.push(palette.flat(1));

                for (let i = 0; i < bytesPerLayer; i+=4) {
                    //Count colours
                    if ((
                        colour[0] == colours[i] &&
                        colour[1] == colours[i + 1] &&
                        colour[2] == colours[i + 2] &&
                        colour[3] == colours[i + 3]) &&
                        (count + 1) < Math.pow(2, 16)
                    ) count++;
                    else {
                        //If the colour is not the same, or we are almost out of space we can begin anew
                        if (count > 0) {
                            data.push(
                                (count & 0xff00) >> 8,
                                (count & 0x00ff),

                                palette.findIndex((val) => (
                                    val[0] == colour[0] && 
                                    val[1] == colour[1] &&
                                    val[2] == colour[2] &&
                                    val[3] == colour[3]
                                ))
                            )
                        }
                        
                        savedBytes += 6;

                        //The begin anew part
                        colour = [colours[i], colours[i + 1], colours[i + 2], colours[i + 3]];
                        count = 1;
                    }
                }

                //Push the data once we hit the edge
                data.push(
                    (count & 0xff00) >> 8,
                    (count & 0x00ff),

                    palette.findIndex((val) => (
                        val[0] == colour[0] && 
                        val[1] == colour[1] &&
                        val[2] == colour[2] &&
                        val[3] == colour[3]
                    ))
                )

                savedBytes += 6;
                return savedBytes;
            },

            //1 Color... pretty simple
            (data, bytesPerLayer, palette, colours) => {
                data.push(...palette[0]);
                return 4;
            },

            //1 color with alpha channel
            (data, bytesPerLayer, palette, colours) => {
                let alpha = -1;
                let count = 0;
                let savedBytes = 0;

                //Start from 0 to get full range
                data.push(...palette[0]);

                for (let i = 0; i < bytesPerLayer; i+=4) {
                    //Count colours
                    if ((alpha == colours[i + 3]) &&
                        (count + 1) < Math.pow(2, 16)
                    ) count++;
                    else {
                        //If the alpha is not the same, or we are almost out of space we can begin anew
                        if (count > 0) {
                            data.push(
                                (count & 0xff00) >> 8,
                                (count & 0x00ff),
                                alpha
                            )
                        }
                        
                        savedBytes += 7;

                        //The begin anew part
                        alpha = colours[i + 3];
                        count = 1;
                    }
                }

                //Push the data once we hit the edge
                data.push(
                    (count & 0xff00) >> 8,
                    (count & 0x00ff),
                    alpha
                )

                savedBytes += 6;
                return savedBytes;
            }
        ]

        //These align with encoding modes
        decodingModes = [
            (data, imageData, index, bytesPerLayer) => {
                let filled = 0;

                while (filled < bytesPerLayer) {
                    const stripSize = (data[index + 1] << 8) + (data[index + 2]);
                    const stripColor = [
                        data[index + 3],
                        data[index + 4],
                        data[index + 5],
                        data[index + 6]
                    ];

                    let extended = Array(stripSize);
                    extended.fill(stripColor);
                    imageData.set(extended.flat(2), filled);
                    filled += stripSize * 4;

                    index += 6;
                }

                return index;
            },
            
            (data, imageData, index, bytesPerLayer) => {
                let filled = 0;

                const palette = [];
                const paletteSize = data[index + 1] + 1;

                index++;
                for (let i = 0; i < paletteSize; i++) { 
                    palette.push([data[index + 1], data[index + 2], data[index + 3], data[index + 4]]);
                    index += 4;
                }

                while (filled < bytesPerLayer) {
                    const stripSize = (data[index + 1] << 8) + (data[index + 2]);

                    let extended = Array(stripSize);
                    extended.fill(palette[data[index + 3]]);
                    imageData.set(extended.flat(2), filled);
                    filled += stripSize * 4;

                    index += 3;
                }

                return index;
            },

            (data, imageData, index, bytesPerLayer) => {
                const colour = [data[index + 1], data[index + 2], data[index + 3], data[index + 4]]

                let extended = Array(bytesPerLayer / 4);
                extended.fill(colour);
                imageData.set(extended.flat(2), 0);

                return index + 4;
            },
            
            (data, imageData, index, bytesPerLayer) => {
                let filled = 0;

                const colour = [data[index + 1], data[index + 2], data[index + 3]]
                index += 3;

                while (filled < bytesPerLayer) {
                    const stripSize = (data[index + 1] << 8) + (data[index + 2]);

                    let extended = Array(stripSize);
                    extended.fill([...colour, data[index + 3]]);
                    imageData.set(extended.flat(2), filled);
                    filled += stripSize * 4;

                    index += 3;
                }

                return index;
            },
        ]

        //These align with the artimus format
        layerReaders = [
            1, //Numbers redirect so 0 would redirect to 1
            (data, layer, bytesPerLayer, index) => {
                //Decode name and blend mode
                const nameLength = (data[index + 1] << 16) + (data[index + 2] << 8) + (data[index + 3]);
                const blendMode = artimus.blendModes[data[index + 4]];
                index += 4;

                //Extract name bytes and decode
                let name = [];
                for (let i = 0; i < nameLength; i++) {
                    name.push(data[index + i + 1]);
                }

                index += name.length;
                name = this.tDecoder.decode(new Uint8Array(name));

                //Parse the image now
                let imageData = new Uint8ClampedArray(bytesPerLayer);
                let filled = 0;

                while (filled < bytesPerLayer) {
                    const stripSize = (data[index + 1] << 8) + (data[index + 2]);
                    const stripColor = [
                        data[index + 3],
                        data[index + 4],
                        data[index + 5],
                        data[index + 6]
                    ];

                    let extended = Array(stripSize);
                    extended.fill(stripColor);
                    imageData.set(extended.flat(2), filled);
                    filled += stripSize * 4;

                    index += 6;
                }

                this.createLayer(name, true);

                //Set layer data
                this.layers[layer + 1].dataRaw = new ImageData(imageData, this.width, this.height);
                this.layers[layer + 1].blendMode = blendMode;

                this.updateLayer(layer + 1);

                return index;
            },
            //Format v2
            (data, layer, bytesPerLayer, index) => {
                //Decode name and blend mode
                const nameLength = (data[index + 1] << 16) + (data[index + 2] << 8) + (data[index + 3]);
                const encodingMode = data[index + 4];
                const blendMode = artimus.blendModes[data[index + 5]];
                index += 5;

                //Extract name bytes and decode
                let name = [];
                for (let i = 0; i < nameLength; i++) {
                    name.push(data[index + i + 1]);
                }

                index += name.length;
                name = this.tDecoder.decode(new Uint8Array(name));

                //Parse the image now
                let imageData = new Uint8ClampedArray(bytesPerLayer);
                
                index = this.decodingModes[encodingMode](data, imageData, index, bytesPerLayer);

                this.createLayer(name, true);

                //Set layer data
                this.layers[layer + 1].dataRaw = new ImageData(imageData, this.width, this.height);
                this.layers[layer + 1].blendMode = blendMode;

                this.updateLayer(layer + 1);

                return index;
            },
            //Format v2
            (data, layer, bytesPerLayer, index) => {
                //Decode name and blend mode
                const nameLength = (data[index + 1] << 16) + (data[index + 2] << 8) + (data[index + 3]);
                const encodingMode = data[index + 4];
                const visibility = data[index + 5] == 1;
                const blendMode = artimus.blendModes[data[index + 6]];
                index += 6;

                //Extract name bytes and decode
                let name = [];
                for (let i = 0; i < nameLength; i++) {
                    name.push(data[index + i + 1]);
                }

                index += name.length;
                name = this.tDecoder.decode(new Uint8Array(name));

                //Parse the image now
                let imageData = new Uint8ClampedArray(bytesPerLayer);
                
                index = this.decodingModes[encodingMode](data, imageData, index, bytesPerLayer);

                this.createLayer(name, true);

                //Set layer data
                this.layers[layer + 1].dataRaw = new ImageData(imageData, this.width, this.height);
                this.layers[layer + 1].blendMode = blendMode;

                this.updateLayer(layer + 1);
                this.setLayerVisibility(layer + 1, visibility);

                return index;
            },
        ];
        
        importArtimus(input) {
            const data = new Uint8Array(input);

            //Make sure it is an artimus image
            if (
                data[0] == this.magic[0] &&
                data[1] == this.magic[1] &&
                data[2] == this.magic[2] &&
                data[3] == this.magic[3]
            ) {
                this.new(
                (data[5] << 16) + (data[6] << 8) + (data[7]),
                (data[8] << 16) + (data[9] << 8) + (data[10]),
                () => {
                    //Count bytes needed
                    const bytesPerLayer = this.width * this.height * 4;
                    const layerCount = (data[11] << 8) + data[12];
                    const format = (data[4]);

                    console.log(`Artimus format is ${format}!`);

                    let idx = 12;

                    //layer 1 is set to NaN as to not confuse it with an actual layer
                    this.layers[0].name = NaN;
                    
                    //Loop through layers, and read them with whatever format of reader is needed;
                    let layerReader = this.layerReaders[format];
                    if (typeof layerReader == "number") this.layerReaders[layerReader];
                    if (typeof layerReader != "function") {
                        console.log(`Invalid layer reader ${layerReader} with origin of ${this.layerReaders[format]} on format ${format}`);
                        return;
                    }

                    for (let layer = 0; layer < layerCount; layer++) {
                        idx = layerReader(data, layer, bytesPerLayer, idx);
                    }

                    this.setLayer(1).then(() => {
                        this.removeLayer(0)
                        this.setLayer(0);
                    });

                    if (
                        data[idx + 1] == this.jsonMagic[0] &&
                        data[idx + 2] == this.jsonMagic[1] &&
                        data[idx + 3] == this.jsonMagic[2] &&
                        data[idx + 4] == this.jsonMagic[3]
                    ) {
                        idx += 4;
                        
                        try {
                            const parsed = JSON.parse(this.tDecoder.decode(data.slice(idx + 1, data.length)));
                            this.projectStorage = parsed;
                        } catch (error) {
                            console.error("Json header could possibly be corrupted :(");
                        }
                    }
                });
            }
            else console.error("Artimus File invalid!");
        }


        exportArtimus() {
            return new Promise((resolve, reject) => {
                //Just a simple measure of how many bytes we will need to take up
                let bytesPerLayer = this.width * this.height * 4;
                const layerCount = this.layers.length;
                
                //==-- HEADER FORMAT --==//
                //Magic  : 4 bytes : Should be COFE
                //Format : 1 byte  : For versioning and revisions
                //Width  : 3 bytes
                //Height : 3 bytes
                //Layers : 2 bytes
                let data = new Array(
                    ...this.magic,
                    3,
                    
                    //Conver both width and height into their 3 byte components
                    (this.width & 0xff0000) >> 16,
                    (this.width & 0x00ff00) >> 8,
                    (this.width & 0x0000ff),
                    
                    (this.height & 0xff0000) >> 16,
                    (this.height & 0x00ff00) >> 8,
                    (this.height & 0x0000ff),

                    //And the layer count
                    (layerCount & 0xff00) >> 8,
                    (layerCount & 0x00ff),
                );

                //==-- LAYER FORMAT --==//
                //Name Length : 3 bytes : Nobody should be more than 16777216 bytes... Right?
                //Encoding Mode : 1 byte
                //Visibility    : 1 byte : Will probably be shared with individual transparency in the future
                //Blend Mode  : 1 byte
                //Name String : N bytes
                //Data        : A bytes
                for (let layerID in this.layers) {
                    const {name, blendMode, dataRaw, visibility} = this.layers[layerID];
                    const encodedName = this.tEncoder.encode(name);

                    //Get colors for determining an encoding method. See VV for a list
                                                                //==-- MODES --==//
                    let layerColours = this.colorsOfLayer(Number(layerID));
                    let noAlphaColours = this.colorsOfLayer(Number(layerID), false);
                    let preferAlpha = true;

                    //Find the mode finally
                    let encodingMode = 0;
                    if (layerColours.length == 1) encodingMode = 2; // Solid colour
                    else if (noAlphaColours.length == 1) { preferAlpha = false; encodingMode = 3; }// Single Colour w Alpha
                    else if (layerColours.length <= 256) encodingMode = 1; // Paletted
                    
                    console.log(`Saving layer ${name} with mode ${encodingMode}`)
                    //Add layer header
                    data.push(
                        (encodedName.length & 0xff0000) >> 16,
                        (encodedName.length & 0x00ff00) >> 8,
                        (encodedName.length & 0x0000ff),
                        (encodingMode & 0xff),

                        (visibility) ? 1 : 0,

                        artimus.blendModes.indexOf(blendMode) || 0,
                        ...encodedName,
                    );

                    //Now parse the layer data
                    console.log(`Reading ${bytesPerLayer} bytes, for ${name}`);

                    const savedBytes = this.encodingModes[encodingMode](data, bytesPerLayer, (preferAlpha) ? layerColours : noAlphaColours, dataRaw.data) || "unknown";

                    console.log(`Layer ${name} compressed to ${savedBytes} bytes`);
                }

                data.push(
                    ...this.jsonMagic,

                    ...this.tEncoder.encode(JSON.stringify(this.projectStorage))
                )

                //With the slight, and somewhat strange compression I added above I'm sure this will be good
                const file = new Uint8Array(data.flat(5));
                this.fileReader.onload = () => resolve(this.fileReader.result);
                this.fileReader.readAsDataURL(new Blob([file]));
            });
        }

        //Image import export
        importTypes = {
            "artimus": "readAsArrayBuffer"
        };

        importFromPC(image) {
            let extension = image.name.split(".");
            extension = extension[extension.length - 1];
            
            this.fileReader.onload = () => { this.onImageLoad(this.fileReader.result, extension); };
            this.fileReader[this.importTypes[extension] || "readAsDataURL"](image);
        }

        onImageLoad(data, extension) {
            switch (extension) {
                case "art":
                case "artimus":
                    this.importArtimus(data);
                    break;
            
                default:
                    const image = new Image();
                    image.onload = () => {
                        this.new(image.width, image.height, () => {
                            this.setLayer(0, () => {
                                this.GL.drawImage(image, 0, 0);
                            });
                        });
                    }

                    image.src = data;
                    break;
            }
        }

        export(format) {
            return new Promise((resolve, reject) => {
                format = format || "artimus";

                //Just render the frame, and update the layer
                this.renderComposite(true);

                //Force update it aswell
                this.setLayer(this.currentLayer).then(() => {
                    switch (format) {
                        case "art":
                        case "artimus":
                            return this.exportArtimus().then(item => resolve(item));
                        
                        default:
                            return resolve(this.compositeCanvas.toDataURL(artimus.extensionToMIME[format] || artimus.extensionToMIME.png));
                    }
                });
            });
        }

        exportToPC(format) {
            format = format || "artimus";

            const link = document.createElement("a");
            this.export(format).then(value => {
                link.href = value;
                link.download = `picture.${format}`;
                link.click();
            });
        }
    },

    activeWorkspaces: [],

    globalRefreshTools: () => {
        for (let workspaceID in artimus.activeWorkspaces) {
            artimus.activeWorkspaces[workspaceID].refreshTools();
        }
    },

    inject: (element) => {
        if (!(element instanceof HTMLElement)) return;

        const workspace = new artimus.workspace();
        element.appendChild(workspace.container);

        return workspace;
    }
}