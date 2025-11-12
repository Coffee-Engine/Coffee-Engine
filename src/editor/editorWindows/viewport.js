//Old obsolete window. Here for historical reasons. and incase I want to restore some LOST MEDIA
(function () {
    const perspectiveIcon = `<svg style="position:absolute;top:0px;left:0px;width:16px;height:16px;margin:4px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="80.36947" height="73.61275" viewBox="0,0,80.36947,73.61275">
    <g transform="translate(-197.88792,-143.21948)">
        <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke="currentColor"
            stroke-width="5.5" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray=""
            stroke-dashoffset="0" style="mix-blend-mode: normal">
            <path d="M204.4926,179.52866l71.01479,-32.05092l0,65.04452z" />
            <path d="M274.72183,180l-33.30782,0" />
        </g>
    </g>
</svg>
<!--rotationCenter:42.112076450298645:36.78052141087767-->`;

    const orthographicIcon = `<svg version="1.1" style="position:absolute;top:0px;left:0px;width:16px;height:16px;margin:4px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="77.61458"
    height="73.05832" viewBox="0,0,77.61458,73.05832">
    <g transform="translate(-199.85726,-143.47084)">
        <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke="currentColor"
            stroke-width="5.5" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0"
            style="mix-blend-mode: normal">
            <path d="M274.72183,180h-33.30782" stroke-linecap="round" />
            <path d="M202.60726,213.77916v-67.55832h72.11458v67.55832z" stroke-linecap="butt" />
        </g>
    </g>
</svg>
<!--rotationCenter:40.14274417710297:36.529159655786174-->`;

    const profilerIcon = `<svg style="position:absolute;top:0px;left:0px;width:16px;height:16px;margin:4px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="80.18823" height="80.18823" viewBox="0,0,80.18823,80.18823">
    <g transform="translate(-199.90588,-139.90588)">
        <g fill="none" stroke-miterlimit="10">
            <path d="M206.48312,211.805h67.03375v-63.60999" stroke="currentColor" stroke-width="4"
                stroke-linecap="round" />
            <path
                d="M207.20392,201.53369l8.46689,-7.439l16.70362,9.66789l16.79956,-11.82384l7.27997,8.54477l13.45895,-47.42317"
                stroke="currentColor" stroke-width="4" stroke-linecap="round" />
            <path d="M199.90588,220.09412v-80.18823h80.18823v80.18823z" stroke="none"
                stroke-width="0" stroke-linecap="butt" />
        </g>
    </g>
</svg><!--rotationCenter:40.09411684282881:40.094116842829095-->`;

    editor.windows.viewport = class extends editor.windows.base {
        setupInput() {
            //Our controls and render time
            this.canvas.addEventListener("mousedown", (event) => {
                switch (event.button) {
                    //Camera control
                    case 2: {
                        this.canvas.requestPointerLock();

                        this.dragging = true;
                        break;
                    }

                    //Mouse selection
                    case 0: {
                        const drawBufferSizeMul = this.renderer.drawBufferSizeMul;

                        let hit = this.renderer.daveShade.readTexture(this.renderer.drawBuffer.ATTACHMENTS[5], event.layerX * drawBufferSizeMul, event.layerY * drawBufferSizeMul);
                        hit = (((hit[2]*65536)+hit[1]*256)+hit[0]) - 1;
                        hit = coffeeEngine.runtime.currentScene.drawList[hit];
                        
                        //Target our prefab if needed
                        if (hit) {
                            const inPrefab = hit.inPrefab;
                            if (inPrefab) hit = inPrefab;
                        }

                        //Node dragging
                        if (this.previouslySelectedNode == hit) {
                            const moveEvent = (event) => {
                                const cameraMatrix = this.camera.matrix.contents;

                                if (!this.previouslySelectedNode) return;
                                
                                if (!this.draggingNode) {
                                    this.canvas.requestPointerLock();
                                    this.draggingNode = true;
                                }
                                //Make sure we don't fling it immediately
                                else if (hit instanceof coffeeEngine.getNode("Node2D")) {
                                    const moveArr = [
                                        event.movementX * cameraMatrix[0][0] * 0.05,
                                        event.movementY * cameraMatrix[1][1] * 0.05
                                    ];

                                    if (!isNaN(moveArr[0])) hit.position.x += moveArr[0];
                                    if (!isNaN(moveArr[1])) hit.position.y -= moveArr[1];
                                }
                                else if (hit instanceof coffeeEngine.getNode("Node3D")) {
                                    const moveArr = [
                                        event.movementX * cameraMatrix[0][0] * 0.05,
                                        event.movementX * cameraMatrix[0][1] * 0.05,
                                        event.movementX * cameraMatrix[0][2] * 0.05,

                                        -event.movementY * cameraMatrix[1][0] * 0.05,
                                        -event.movementY * cameraMatrix[1][1] * 0.05,
                                        -event.movementY * cameraMatrix[1][2] * 0.05,
                                    ];

                                    if (!isNaN(moveArr[0])) hit.position.x += moveArr[0];
                                    if (!isNaN(moveArr[1])) hit.position.y += moveArr[1];
                                    if (!isNaN(moveArr[2])) hit.position.z += moveArr[2];

                                    if (!isNaN(moveArr[3])) hit.position.x += moveArr[3];
                                    if (!isNaN(moveArr[4])) hit.position.y += moveArr[4];
                                    if (!isNaN(moveArr[5])) hit.position.z += moveArr[5];
                                }
                            }

                            document.addEventListener("mousemove", moveEvent);

                            document.addEventListener("mouseup", () => {
                                if (this.draggingNode) document.exitPointerLock();
                                document.removeEventListener("mouseup",moveEvent); 
                                document.removeEventListener("mousemove", moveEvent);
                                this.draggingNode = false;
                            });
                        }

                        this.previouslySelectedNode = hit;

                        //Select the hit node
                        if (hit) editor.sendEvent("nodeSelected", { target: hit, type: "node" });
                        break;
                    }
                
                    default:
                        break;
                }
            });

            //Removal of control
            document.addEventListener("pointerlockerror", () => {
                this.dragging = false;
            });
            this.canvas.addEventListener("mouseup", (event) => {
                if (event.button == 2) {
                    document.exitPointerLock();
                    this.dragging = false;
                }
            });

            //Wheel stuff
            this.canvas.addEventListener("wheel", (event) => {
                event.preventDefault();
                if (this.camera.orthographic) {
                    this.camera.zoom += event.deltaY * 0.0125;

                    if (this.camera.zoom > 25) {
                        this.camera.zoom = 25;
                    } else if (this.camera.zoom < 1) {
                        this.camera.zoom = 1;
                    }
                } else {
                    if (this.dragging) {
                        this.camera.speed -= event.deltaY * 0.0125;
                        if (this.camera.speed < 0.25) {
                            this.camera.speed = 0.25;
                        } else if (this.camera.speed > 10) {
                            this.camera.speed = 10;
                        }
                    }
                }
            });
        }

        setupButtons(container) {
            //The profiler in the corner
            this.profiler = document.createElement("div");
            this.profiler.style.position = "absolute";
            this.profiler.style.left = "100%";
            this.profiler.style.top = "0%";
            this.profiler.style.transform = "translate(-100%,0%";
            this.profiler.style.backgroundColor = "var(--background-1)";

            this.buttonHolder = document.createElement("div");
            {
                //Style the button holder
                this.buttonHolder.style.position = "absolute";
                this.buttonHolder.style.aspectRatio = "1/3";
                this.buttonHolder.style.display = "grid";
                this.buttonHolder.style.gridTemplateRows = "33.3333% 33.3333% 33.3333%";

                this.buttonHolder.style.width = "24px";
                this.buttonHolder.style.top = "4px";
                this.buttonHolder.style.left = "4px";

                //ortho Button
                this.viewmodeButton = document.createElement("button");
                this.viewmodeButton.innerHTML = perspectiveIcon;
                this.viewmodeButton.style.position = "relative";
                this.viewmodeButton.onclick = () => {
                    this.camera.orthographic = !this.camera.orthographic;
                    this.viewmodeButton.innerHTML = this.camera.orthographic ? orthographicIcon : perspectiveIcon;
                };
                this.buttonHolder.appendChild(this.viewmodeButton);

                //profiler Button
                this.profilerButton = document.createElement("button");
                this.profilerButton.innerHTML = profilerIcon;
                this.profilerButton.style.position = "relative";
                this.profiler.style.visibility = this.profilerToggle ? "visible" : "hidden";
                {
                    this.profilerButton.onclick = () => {
                        this.profilerToggle = !this.profilerToggle;
                        this.profiler.style.visibility = this.profilerToggle ? "visible" : "hidden";
                    };
                }
                this.buttonHolder.appendChild(this.profilerButton);
            }
            container.appendChild(this.buttonHolder);
            container.appendChild(this.profiler);
        }

        init(container) {
            coffeeEngine.mainViewport = this;

            this.closable = false;
            this.title = editor.language["editor.window.viewport"];

            //The main canvas

            container.style.overflow = "hidden";

            //The buttons
            this.setupButtons(container);

            //Setup our renderer, make sure to grab and configure the canvas
            this.renderer = coffeeEngine.renderer;

            this.camera = new editor.viewportCamera(this.renderer);
            const camera = this.camera;

            this.canvas = this.renderer.canvas;
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            container.appendChild(this.canvas);

            //Size it to be practical
            this.resized();
            window.addEventListener("resize", () => {
                this.resized();
            });

            this.setupInput(camera);

            setInterval(() => {
                this.profiler.innerHTML = `
                FPS:${Math.floor(1 / coffeeEngine.runtime.deltaTime)}<br>
                Delta:${coffeeEngine.runtime.deltaTime}<br>
                Triangles:${this.renderer.daveShade.POINT_COUNT / 3}<br>
                Nodes:${this.renderer.nodesRendered}<br>
                Lights:${coffeeEngine.runtime.currentScene.lightCount}`;

                coffeeEngine.timer += coffeeEngine.runtime.deltaTime;

                //Make sure the mouse movement goes unupdated in this.
                coffeeEngine.runtime.frameStart(true);
                if (window.getComputedStyle(this.canvas).visibility == "visible") {
                    camera.update(coffeeEngine.runtime.deltaTime, this.dragging);
                    coffeeEngine.runtime.currentScene.draw();
                }
                //Now we update the mouse movement
                coffeeEngine.inputs.mouse.movementX = 0;
                coffeeEngine.inputs.mouse.movementY = 0;
            }, 16);

            coffeeEngine.addEventListener("sceneLoaded", (data) => {
                if (data.isPrefab) {
                    //Handle different prefab positions
                    if (data.root instanceof coffeeEngine.getNode("Node3D")) {
                        camera.position.x = -data.root.position.x;
                        camera.position.y = -data.root.position.y;
                        camera.position.z = -data.root.position.z + 4;
    
                        camera.rotation.y = 0;
                        camera.rotation.x = 0;
                        camera.orthographic = false;
                    }
                    else if (data.root instanceof coffeeEngine.getNode("Node2D")) {
                        camera.position.x = -data.root.position.x;
                        camera.position.y = -data.root.position.y;
                        camera.position.z = 0;
    
                        camera.rotation.y = 0;
                        camera.rotation.x = 0;
                        camera.orthographic = true;
                    }
                    //The oponomous blank node!
                    else {
                        camera.position.x = 0;
                        camera.position.y = 0;
                        camera.position.z = 0;
    
                        camera.rotation.yaw = 0;
                        camera.rotation.pitch = 0;
                    }
                }
                //If we are a scene just move to 0,0,0
                else {
                    camera.position.x = 0;
                    camera.position.y = 0;
                    camera.position.z = 0;

                    camera.rotation.yaw = 0;
                    camera.rotation.pitch = 0;
                }
            })
        }

        resized() {
            const clientSize = this.canvas.getBoundingClientRect();
            this.canvas.width = clientSize.width;
            this.canvas.height = clientSize.height;
            this.renderer.resize(this.canvas.width, this.canvas.height);
        }
    };

    editor.windows.__Serialization.register(editor.windows.viewport, "viewport", { onlyOne: true });
})();
