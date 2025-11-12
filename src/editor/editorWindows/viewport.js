(function () {
    editor.windows.viewport = class extends editor.windows.base {
        async setupIcons() {
            this.orthographicIcon = editor.elementFromString(await fetch("editor/images/viewport/orthographic.svg").then(result => result.text()));
            this.perspectiveIcon = editor.elementFromString(await fetch("editor/images/viewport/perspective.svg").then(result => result.text()));
            this.profilerIcon = editor.elementFromString(await fetch("editor/images/viewport/profiler.svg").then(result => result.text()));

            this.profilerButton.appendChild(this.profilerIcon);
            this.viewmodeButton.appendChild(this.camera.orthographic ? this.orthographicIcon : this.perspectiveIcon);
        }

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
                editor.quickCSS(this.buttonHolder, {
                    position: "absolute",
                    aspectRatio: "1/3",
                    display: "grid",
                    gridTemplateRows: "33.3333% 33.3333% 33.3333%",

                    width: "24px",
                    top: "4px",
                    left: "4px"
                });

                //ortho Button
                this.viewmodeButton = document.createElement("button");
                this.viewmodeButton.style.position = "relative";
                this.viewmodeButton.onclick = () => {
                    this.camera.orthographic = !this.camera.orthographic;
                    if (this.orthographicIcon && this.perspectiveIcon) {
                        this.viewmodeButton.removeChild(this.viewmodeButton.children[0]);
                        this.viewmodeButton.appendChild(this.camera.orthographic ? this.orthographicIcon : this.perspectiveIcon);
                    }
                };
                this.buttonHolder.appendChild(this.viewmodeButton);

                //profiler Button
                this.profilerButton = document.createElement("button");
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
            this.setupIcons();
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

            const viewport = this;
            const loop = () => {
                viewport.profiler.innerHTML = `
                FPS:${Math.floor(1 / coffeeEngine.runtime.deltaTime)}<br>
                Delta:${coffeeEngine.runtime.deltaTime}<br>
                Triangles:${viewport.renderer.daveShade.POINT_COUNT / 3}<br>
                Nodes:${viewport.renderer.nodesRendered}<br>
                Lights:${coffeeEngine.runtime.currentScene.lightCount}`;

                coffeeEngine.timer += coffeeEngine.runtime.deltaTime;

                //Make sure the mouse movement goes unupdated in this.
                coffeeEngine.runtime.frameStart(true);
                if (window.getComputedStyle(viewport.canvas).visibility == "visible") {
                    camera.update(coffeeEngine.runtime.deltaTime, viewport.dragging);
                    coffeeEngine.runtime.currentScene.draw();
                }
                //Now we update the mouse movement
                coffeeEngine.inputs.mouse.movementX = 0;
                coffeeEngine.inputs.mouse.movementY = 0;

                requestAnimationFrame(loop);
            }

            requestAnimationFrame(loop);

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
