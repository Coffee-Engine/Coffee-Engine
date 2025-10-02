(function () {
    //The tools for the window
    editor.artTools = {};

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
            this.toolOptions.appendChild(CUGI.createList(this.toolFunction.CUGI(this)));
        }

        getCanvasPosition(x, y) {
            const {top, left} = this.canvas.getBoundingClientRect();
            return [Math.floor((x - Math.floor(left)) / this.zoom), Math.floor((y - Math.floor(top)) / this.zoom)];
        }

        setupCanvas(container) {
            //Create the canvas and setup the layout
            this.canvas = document.createElement("canvas");
            this.canvas.width = 32;
            this.canvas.height = 32;

            //Add the canvas
            container.appendChild(this.canvas);

            //Setup the background grid
            editor.quickCSS(this.canvas, {
                backgroundSize: "8px 8px",
                backgroundColor: "var(--background-2)",
                backgroundImage: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAA5JREFUCJljYICAaDgBAAVnALfcXD16AAAAAElFTkSuQmCC)",
                imageRendering: "pixelated",

                //Scroller
                transform: "scale(var(--zoom)) translate(var(--scrollX), var(--scrollY))",
                position: "relative",
                top: "50%",
                left: "50%",
                margin: "0%",
            });

            this.GL = this.canvas.getContext("2d");
            //Sometimes we need this. Sometimes we don't?
            //I dunno, just no IE11
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
                        const [red, green, blue, alpha] = this.GL.getImageData(...this.getCanvasPosition(event.clientX, event.clientY, true), 1, 1).data;
                        const converted = coffeeEngine.ColorMath.RGBtoHex({ r:red, g:green, b:blue, a:alpha });

                        this.toolProperties.strokeColor = converted;
                        this.toolProperties.fillColor = converted;

                        //Refresh options
                        this.refreshToolOptions();
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
