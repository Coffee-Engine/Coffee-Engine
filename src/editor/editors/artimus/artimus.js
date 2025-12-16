window.artimus = {
    tools: {},
    maxHistory: 10,

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
    },
    
    layer: class {

        blendMode = "source-over";
        bitmap = null;

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

        constructor(width, height, name, workspace) {
            //Create internal image data
            this.dataRaw = new ImageData(width, height);
            
            this.workspace = workspace;
            this.name = name || `Layer ${this.workspace.layers.length + 1}`;

            //Do a thing, guarenteed to not exist (hopefully)
            if (this.workspace.layerExists(name)) {
                let num = 1;
                name = (`Layer ${num}`);
                
                //Find one that doesn't exist.
                while (this.workspace.layerExists(name)) {
                    num++;
                    name = (`Layer ${num}`);
                }
            }

            
            this.element = this.workspace._createLayerElement(this);

            this.workspace.layers.push(this);
            this.workspace.layerList.appendChild(this.element);

            this.element.positionID = this.workspace.layers.length - 1;

            //Finally use the new layer
            this.workspace.setLayer(name);
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
            this.#scrollX = value;
            this.updatePosition();
        }
        get scrollX() { return this.#scrollX; }

        #scrollY = 0;
        set scrollY(value) {
            this.#scrollY = value;
            this.updatePosition();
        }
        get scrollY() { return this.#scrollY; }

        #zoom = 2;
        set zoom(value) {
            this.#zoom = Math.max(Math.min(value, 25), 0.25);
            this.updatePosition();
        }
        get zoom() { return this.#zoom; }

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

        #width = 300;
        set width(value) { this.resize(value, this.height); }
        get width() { return this.#width; }

        #height = 150;
        set height(value) { this.resize(this.width, value); }
        get height() { return this.#height; }

        #currentLayer = 0;
        set currentLayer(value) {
            this.setLayer(value);
        }
        get currentLayer() {
            return this.#currentLayer;
        }

        layerHistory = [];
        historyIndex = 0;

        toolClass = "artimus-button artimus-sideBarButton artimus-tool ";
        layerClass = "artimus-button artimus-sideBarButton artimus-layer ";
        toolClassSelected = "artimus-sideBarButton-selected artimus-tool-selected ";
        layerClassSelected = "artimus-sideBarButton-selected artimus-layer-selected ";

        selection = [];
        selectionAnimation = 0;
        selectionPath = new Path2D();
        hasSelection = false;

        updatePosition() {
            //Setup some CSS
            this.quickVar(this.container, {
                "scrollX": `${this.scrollX}px`,
                "scrollY": `${this.scrollY}px`,
                "zoom": this.zoom,
                "canvasWidth": this.width,
                "canvasHeight": this.height
            });
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
            this.fullviewGL = this.canvas.getContext("2d");
            this.compositeGL = this.compositeCanvas.getContext("2d");
            this.previewGL = this.previewCanvas.getContext("2d");
            this.gridGL = this.gridCanvas.getContext("2d");

            this.resize(640, 480);
            this.createLayer();

            this.fileReader = new FileReader();
            this.fileReader.onload = () => { this.onImageLoad(); };

            artimus.activeWorkspaces.push(this);

            const workspace = this;
            const loop = () => {
                if (!workspace) return;

                workspace.renderLoop.call(workspace);
                requestAnimationFrame(loop);
            }

            //Setup our grid then loop
            this.setGridSize(4);
            this.refreshGridPattern(() => {
                loop();
            });

            this.refreshTools();
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

        renderLoop() {
            this.fullviewGL.drawImage(this.gridCanvas, 0, 0);

            this.renderComposite();

            this.fullviewGL.drawImage(this.compositeCanvas, 0, 0);
            this.fullviewGL.drawImage(this.previewCanvas, 0, 0);

            if (this.hasSelection) {
                this.selectionAnimation = (this.selectionAnimation + 0.1) % 6;
                this.fullviewGL.setLineDash([4, 2]);
                this.fullviewGL.lineDashOffset = this.selectionAnimation;
                this.fullviewGL.strokeStyle = getComputedStyle(document.body).getPropertyValue("--artimus-selection-outline");
                this.fullviewGL.lineWidth = 1;
                this.fullviewGL.stroke(this.selectionPath);
            }
        }

        renderComposite() {
            this.compositeGL.clearRect(0, 0, this.width, this.height);
            for (let layerID in this.layers) {
                const layer = this.layers[layerID];
                this.compositeGL.globalCompositeOperation = layer.blendMode || "source-over";

                if (layerID == this.currentLayer) this.compositeGL.drawImage(this.editingCanvas, 0, 0);
                else {
                    const bitmap = layer.bitmap;
                    if (bitmap instanceof ImageBitmap) this.compositeGL.drawImage(bitmap, 0, 0);
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
            this.layerCreationName.placeholder = "layer";
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

        addControls() {
            //Drawing
            this.canvas.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                event.stopPropagation();
            });

            this.canvas.addEventListener("mousedown", (event) => {
                switch (event.button) {
                    case 0:
                        if (this.toolFunction.mouseDown && !this.toolDown) this.toolFunction.mouseDown(this.GL, ...this.getCanvasPosition(event.clientX, event.clientY), this.toolProperties);
                        this.toolDown = true;
                        break;

                    case 2:
                        const [red, green, blue, alpha] = this.GL.getImageData(...this.getCanvasPosition(event.clientX, event.clientY, true), 1, 1).data;
                        const converted = artimus.RGBtoHex({ r:red, g:green, b:blue, a:alpha });

                        //The three typical colours
                        this.toolProperties.strokeColor = converted;
                        this.toolProperties.fillColor = converted;
                        this.toolProperties.color = converted;

                        //Refresh options
                        this.refreshToolOptions();
                        break;
                
                    default:
                        break;
                }
            });

            //For instances of the mouse being up or gone we want to clear the preview GL.
            this.canvas.addEventListener("mouseup", (event) => {
                if (event.button != 0) return;
                
                const position = this.getCanvasPosition(event.clientX, event.clientY);
                if (this.toolFunction.mouseUp && this.toolDown) this.toolFunction.mouseUp(this.GL, ...position, this.toolProperties);
                if (this.toolFunction.preview) {
                    this.previewGL.clearRect(0, 0, this.width, this.height);
                    this.toolFunction.preview(this.previewGL, ...position, this.toolProperties);
                }
                
                //For the undoing
                if (this.toolDown && this.tool) this.updateLayerHistory();
                this.toolDown = false; 
            });
            this.canvas.addEventListener("mouseout", (event) => { 
                const position = this.getCanvasPosition(event.clientX, event.clientY);
                if (this.toolFunction.mouseUp && this.toolDown) this.toolFunction.mouseUp(this.GL, ...position, this.toolProperties);
                if (this.toolFunction.preview) {
                    this.previewGL.clearRect(0, 0, this.width, this.height);
                    this.toolFunction.preview(this.previewGL, ...position, this.toolProperties);
                }
                //For the undoing
                if (this.toolDown && this.tool) this.updateLayerHistory();
                this.toolDown = false;
            });
            this.canvas.addEventListener("mousemove", (event) => {
                const position = this.getCanvasPosition(event.clientX, event.clientY);
                
                if (this.toolFunction.preview) {
                    //For previews
                    this.previewGL.clearRect(0, 0, this.width, this.height);
                    this.toolFunction.preview(this.previewGL, ...position, this.toolProperties);
                }

                if (this.toolDown && this.toolFunction.mouseMove) this.toolFunction.mouseMove(this.GL, ...position, event.movementX / this.zoom, event.movementY / this.zoom, this.toolProperties);
            });

            //Add movement
            this.container.addEventListener("mousedown", (event) => {
                if (event.button == 1) {
                    const moveEvent = (event) => {
                        this.scrollX += event.movementX / this.zoom;
                        this.scrollY += event.movementY / this.zoom;
                    }

                    const upEvent = (event) => {
                        if (event.button == 1) {
                            document.removeEventListener("mousemove", moveEvent);
                            document.removeEventListener("mouseup", upEvent);
                        }
                    }

                    //Bind events
                    document.addEventListener("mousemove", moveEvent);
                    document.addEventListener("mouseup", upEvent)
                }
            });

            this.canvasArea.addEventListener("wheel", (event) => {
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.zoom += event.deltaY / -100;
                }
                else if (event.shiftKey) {
                    this.scrollX -= (event.deltaY) / this.zoom;
                    this.scrollY -= (event.deltaX) / this.zoom;
                    this.zoom += event.deltaZ / -100;
                }
                else {
                    this.scrollX -= (event.deltaX) / this.zoom;
                    this.scrollY -= (event.deltaY) / this.zoom;
                    this.zoom += event.deltaZ / -100;
                }
            }, { passive: false });

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
            if (typeof ID == "string") {
                const locID = this.layers.findIndex((layer) => layer.name == ID);
                if (locID != -1) ID = locID;
            }

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
                });
            }
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

        createLayer(name) {
            const layer = new artimus.layer(this.canvas.width, this.canvas.height, name || ("Layer " + (this.layers.length + 1)), this);
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

            const upButton = document.createElement("button");
            upButton.className = "artimus-button artimus-layerButton";
            upButton.innerText = "^";
            upButton.onclick = () => {
                this.moveLayer(element.targetLayer, 1);
            }

            const downButton = document.createElement("button");
            downButton.className = "artimus-button artimus-layerButton";
            downButton.innerText = "v";
            downButton.onclick = () => {
                this.moveLayer(element.targetLayer, -1);
            }

            element.appendChild(upButton);
            element.appendChild(downButton);
            element.appendChild(label);

            return element;
        }

        moveLayer(ID, by) {
            if (typeof ID == "string") {
                const locID = this.layers.findIndex((layer) => layer.name == ID);
                if (locID != -1) ID = locID;
            }

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
            if (typeof ID == "string") {
                const locID = this.layers.findIndex((layer) => layer.name == ID);
                if (locID != -1) ID = locID;
            }

            if (typeof ID == "number") {
                this.layers[ID].updateBitmap().then(newBitmap => {
                    if (then) then(newBitmap);
                });
            }
        }

        //For updating the undo history
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

        importFromPC(image) {
            this.fileReader.readAsDataURL(image);
        }

        onImageLoad() {
            const image = new Image();
            image.onload = () => {
                this.new(image.width, image.height, () => {
                    this.setLayer(0, () => {
                        this.GL.drawImage(image, 0, 0);
                    });
                });
            }

            image.src = this.fileReader.result;
        }

        export() {
            //Before the frame gets render this already gets obliterated lol, so it's a no notice export
            this.renderComposite();
            return this.compositeCanvas.toDataURL();
        }

        exportToPC() {
            const link = document.createElement("a");
            link.href = this.export();
            link.download = "picture.png";
            link.click();
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
