(function () {
    //The tools for the window
    editor.artTools = {
        paintBrush: {
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="70.5" height="70.5" viewBox="0,0,70.5,70.5"> <g transform="translate(-204.75002,-144.75)">    <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">        <path d="M204.75003,215.25v-70.5h70.5v70.5z" fill="none" stroke-width="0"/>        <path d="M220.9868,205.17696c1.77179,-0.89842 3.45323,-2.83003 3.92284,-4.18449c0.48941,-2.20805 2.09187,-5.70927 4.03585,-6.94886c1.41138,-1.79045 6.7982,-2.72387 8.25105,-0.51354c3.63129,2.41038 4.42564,4.90457 4.65906,6.97496c0.87449,2.30301 -2.19833,6.25534 -4.02505,7.55363c-2.70649,1.77061 -6.09868,1.76254 -9.25182,2.13584c-3.36677,0.39859 -5.03047,-0.4888 -7.98273,-1.41774c-0.53432,-0.4212 -3.55958,-2.15572 -3.34232,-2.965c0.23096,-0.8603 2.73102,-0.52502 3.38089,-0.60196l0.28441,-0.03367c0,0 0.02808,-0.00332 0.06782,0.00082z" fill="currentColor" stroke-width="0.5"/>        <path d="M254.7307,185.57527c-5.41655,12.21861 -8.83657,10.44178 -13.17454,8.51874c-4.33797,-1.92303 -7.95119,-3.26405 -2.53464,-15.48266c5.41655,-12.21861 17.81172,-30.68787 22.14969,-28.76483c4.33797,1.92304 -1.02396,23.51014 -6.4405,35.72876z" fill="currentColor" stroke-width="0"/></g></g></svg><!--rotationCenter:35.249975000000006:35.25000499999999-->',
            mouseDown: (gl, x, y, toolProperties) => {
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
                    const offset = (toolProperties.strokeSize % 2);
                    const rx = Math.floor(x - halfSize) - offset;
                    const ry = Math.floor(y - halfSize) - offset;

                    gl.fillRect(rx,ry,toolProperties.strokeSize,toolProperties.strokeSize);
                }
            },
            mouseMove: (gl, x, y, vx, vy, toolProperties) => {
                if (toolProperties.pixelBrush) {
                    //For non-AA line drawing;
                    const {linePos, strokeSize} = toolProperties;
                    const halfSize = Math.floor(strokeSize / 2);
                    const offset = (strokeSize % 2);
                    const distance = 1 / Math.sqrt(Math.pow(linePos[0] - x, 2.0) + Math.pow(linePos[1] - y, 2.0));

                    //Draw the line
                    for (let i = 0; i <= 1; i+=distance) {
                        const rx = Math.floor((linePos[0] + (x - linePos[0]) * i) - halfSize) - offset;
                        const ry = Math.floor((linePos[1] + (y - linePos[1]) * i) - halfSize) - offset;

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
            },
            mouseUp: (gl, x, y, toolProperties) => {
                if (!toolProperties.pixelBrush) {
                    gl.lineTo(x,y);
                    gl.stroke();
                    gl.moveTo(x,y);
                    gl.closePath();
                }
            },

            CUGI:(artEditor) => { return [
                { target: artEditor.toolProperties, key: "strokeColor", type: "color" },
                { target: artEditor.toolProperties, key: "strokeSize", type: "int" },
                { target: artEditor.toolProperties, key: "pixelBrush", type: "boolean" },
            ]}
        }
    }

    //The actual window
    editor.windows.artEditor = class extends editor.windows.base {
        //Scrolling
        #scrollX = 0;
        set scrollX(value) {
            this.#scrollX = value;
            this.Content.style.setProperty("--scrollX", `${this.scrollX}px`);
        }
        get scrollX() { return this.#scrollX; }

        #scrollY = 0;
        set scrollY(value) {
            this.#scrollY = value;
            this.Content.style.setProperty("--scrollY", `${this.scrollY}px`);
        }
        get scrollY() { return this.#scrollY; }

        #zoom = 2;
        set zoom(value) {
            this.#zoom = Math.max(Math.min(value, 25), 0.25);
            this.Content.style.setProperty("--zoom", value);
        }
        get zoom() { return this.#zoom; }

        #tool = "paintBrush"
        set tool(value) {
            if (editor.artTools[value]) this.toolFunction = editor.artTools[value];
            else this.toolFunction = editor.artTools.paintBrush;

            this.#tool = value;
        }
        get tool() { return this.#tool; }

        init(container) {
            //Setup Window
            this.title = editor.language["editor.window.artEditor"];
            this.filePath = false;
            this.closable = false;
            
            //Setup our variables
            this.extensions = ["png", "jpeg", "jpg"];
            this.fileReader = new FileReader();

            //Define tool values
            this.toolDown = false;
            this.toolFunction = editor.artTools.paintBrush;
            this.toolProperties = {
                strokeColor: "#ffffff",
                strokeSize: 2,
                pixelBrush: true,
                fillColor: "#ffffff"
            };

            //Setup some CSS
            this.Content.style.setProperty("--scrollX", `${0}px`);
            this.Content.style.setProperty("--scrollY", `${0}px`);
            this.Content.style.setProperty("--zoom", `2`);

            //Setup window functionality
            this.setupLayout(container);
            this.setupFileHooks();
        }

        //Setup our file hooks
        setupLayout(container) {
            container.style.display = "grid";
            container.style.gridTemplateRows = "min-content auto";

            //Top Bar
            this.topBar = document.createElement("div");
            this.topBar.style.backgroundColor = "var(--background-2)";

            //The dropdowns for the top bar
            this.fileDropdown = editor.dropdown.create({
                text:"File",
                items: [
                    "New",
                    "Save",
                    "Load"
                ]
            });
            this.fileDropdown.onchange = (value) => {
                console.log(value);
            }
            this.topBar.appendChild(this.fileDropdown);

            this.spriteDropdown = editor.dropdown.create({
                text:"Sprite",
                items: [
                    "Resize Sprite",
                    "Resize Canvas"
                ]
            });
            this.spriteDropdown.onchange = (value) => {
                console.log(value);
            }
            this.topBar.appendChild(this.spriteDropdown);

            //The canvas area
            this.canvasArea = document.createElement("div");
            this.canvasArea.style.backgroundColor = "var(--background-4)";
            this.canvasArea.style.overflow = "hidden";
            this.setupCanvas(this.canvasArea);

            //Tool Options, like brush size and stuff
            this.toolOptions = document.createElement("div");
            this.toolOptions.style.position = "absolute";
            this.toolOptions.style.top = "100%";
            this.toolOptions.style.left = "100%";
            this.toolOptions.style.transform = "translate(-100%, -100%)";

            this.refreshToolOptions();

            container.appendChild(this.topBar);
            container.appendChild(this.canvasArea);
            container.appendChild(this.toolOptions);
        }

        refreshToolOptions() {
            this.toolOptions.innerHTML = "";
            console.log(this.toolFunction.CUGI(this));
            this.toolOptions.appendChild(CUGI.createList(this.toolFunction.CUGI(this)));
        }

        getCanvasPosition(x, y) {
            const {top, left} = this.canvas.getBoundingClientRect();
            console.log([Math.floor((x - left) / this.zoom), Math.floor((y - top) / this.zoom)]);
            return [Math.floor((x - left) / this.zoom), Math.floor((y - top) / this.zoom)];
        }

        setupCanvas(container) {
            //Create the canvas and setup the layout
            this.canvas = document.createElement("canvas");
            this.canvas.width = 32;
            this.canvas.height = 32;

            //Add the canvas
            container.appendChild(this.canvas);

            //Setup the background grid
            this.canvas.style.backgroundSize = "8.2px 8px";
            this.canvas.style.backgroundColor = "var(--background-2)";
            this.canvas.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAA5JREFUCJljYICAaDgBAAVnALfcXD16AAAAAElFTkSuQmCC)";
            this.canvas.style.imageRendering = "pixelated";
            
            //The scrolling functionality
            this.canvas.style.transform = "scale(var(--zoom)) translate(var(--scrollX), var(--scrollY))";
            this.canvas.style.position = "relative";
            this.canvas.style.top = "50%";
            this.canvas.style.left = "50%";
            this.canvas.style.margin = "0%";

            this.GL = this.canvas.getContext("2d");
            //this.GL.translate(-0.5, -0.5);
            this.GL.imageSmoothingEnabled = false;

            //Drawing
            this.canvas.addEventListener("mousedown", (event) => {
                switch (event.button) {
                    case 0:
                        if (this.toolFunction.mouseDown && !this.toolDown) this.toolFunction.mouseDown(this.GL, ...this.getCanvasPosition(event.clientX, event.clientY), this.toolProperties);
                        this.toolDown = true;
                        break;

                    case 2:
                        const [red, green, blue, alpha] = this.GL.getImageData(...this.getCanvasPosition(event.clientX, event.clientY), 1, 1).data;
                        const converted = coffeeEngine.ColorMath.RGBtoHex({ r:red, g:green, b:blue, a:alpha });

                        console.log(event);
                        console.log(event.offsetX, event.offsetY)

                        this.toolProperties.strokeColor = converted;
                        this.toolProperties.fillColor = converted;
                        break;
                
                    default:
                        break;
                }
            });
            this.canvas.addEventListener("mouseup", (event) => {
                if (event.button != 0) return;
                
                if (this.toolFunction.mouseUp && this.toolDown) this.toolFunction.mouseUp(this.GL, ...this.getCanvasPosition(event.clientX, event.clientY), this.toolProperties);
                this.toolDown = false; 
            });
            this.canvas.addEventListener("mouseout", (event) => { 
                if (this.toolFunction.mouseUp && this.toolDown) this.toolFunction.mouseUp(this.GL, ...this.getCanvasPosition(event.clientX, event.clientY), this.toolProperties);
                this.toolDown = false; 
            });
            this.canvas.addEventListener("mousemove", (event) => {
                if (this.toolDown && this.toolFunction.mouseMove) this.toolFunction.mouseMove(this.GL, ...this.getCanvasPosition(event.clientX, event.clientY), event.movementX / this.zoom, event.movementY / this.zoom, this.toolProperties);
            });

            //Add movement
            container.addEventListener("mousedown", (event) => {
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
                else {
                    this.scrollX -= (event.deltaX) / this.zoom;
                    this.scrollY -= (event.deltaY) / this.zoom;
                    this.zoom += event.deltaZ / -100;
                }
            }, { passive: false });
        }

        setupFileHooks() {
            editor.addFileOpenHook(this.extensions, this.openFile, this);
            
            //Load stuff
            this.fileReader.onload = () => {
                const { useBlocklyEditor } = editor.getLanguageDefFromExtension(this.readType);
                //Swap 'em
                if (!useBlocklyEditor) {
                    this.codeMirrorArea.style.visibility = "inherit";
                    this.blocklyArea.style.visibility = "hidden";
                    this.usingSugarCube = false;

                    mirrorManager.setScript(this.fileReader.result, editor.languageRedirects[this.readType] || this.readType);
                    sugarcube.deserialize({});
                } else {
                    this.codeMirrorArea.style.visibility = "hidden";
                    this.blocklyArea.style.visibility = "inherit";
                    this.usingSugarCube = true;

                    sugarcube.deserialize(JSON.parse(this.fileReader.result));
                    mirrorManager.setScript("", "");
                }

                this.title = `${this.filePath} | ${editor.language["editor.window.codeEditor"]}`;
            };

            this.fileReader.onerror = () => {
                this.title = editor.language["editor.window.codeEditor"];
            };
        }

        openFile() {

        }
        
        //Remove stuff
        dispose() {
            editor.removeOpenFileHook(this.extensions, this.openFile, this);
        }
    };

    editor.windows.__Serialization.register(editor.windows.artEditor, "artEditor", { onlyOne: true });
})();
