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
        viewportControlsProjection() {
            //Dragging on the screen!
            if (coffeeEngine.inputs.mouse["2"]) {
                this.previewCamera.yaw -= coffeeEngine.inputs.mouse.movementX / 360;
                this.previewCamera.pitch += coffeeEngine.inputs.mouse.movementY / 360;

                this.previewCamera.pitch = Math.min(Math.max(this.previewCamera.pitch, -1.5707), 1.5707);

                if (coffeeEngine.inputs.keys["e"]) this.previewCamera.y -= 0.05 * this.previewCamera.speed;
                if (coffeeEngine.inputs.keys["q"]) this.previewCamera.y += 0.05 * this.previewCamera.speed;

                if (coffeeEngine.inputs.keys["d"]) {
                    this.previewCamera.x -= Math.cos(this.previewCamera.yaw) * 0.05 * this.previewCamera.speed;
                    this.previewCamera.z -= Math.sin(this.previewCamera.yaw) * 0.05 * this.previewCamera.speed;
                }
                if (coffeeEngine.inputs.keys["a"]) {
                    this.previewCamera.x += Math.cos(this.previewCamera.yaw) * 0.05 * this.previewCamera.speed;
                    this.previewCamera.z += Math.sin(this.previewCamera.yaw) * 0.05 * this.previewCamera.speed;
                }

                if (coffeeEngine.inputs.keys["w"]) {
                    this.previewCamera.x += Math.sin(this.previewCamera.yaw) * 0.05 * this.previewCamera.speed;
                    this.previewCamera.z -= Math.cos(this.previewCamera.yaw) * 0.05 * this.previewCamera.speed;
                }
                if (coffeeEngine.inputs.keys["s"]) {
                    this.previewCamera.x -= Math.sin(this.previewCamera.yaw) * 0.05 * this.previewCamera.speed;
                    this.previewCamera.z += Math.cos(this.previewCamera.yaw) * 0.05 * this.previewCamera.speed;
                }
            }

            this.matrix = this.matrix.rotationX(this.previewCamera.pitch);
            this.matrix = this.matrix.rotationY(this.previewCamera.yaw);

            this.matrix = this.matrix.translate(this.previewCamera.x, this.previewCamera.y, this.previewCamera.z);
            this.projection = coffeeEngine.matrix4.projection(this.previewCamera.fov, 1, 0.001, 1000);
            this.aspectRatio = this.canvas.width / this.canvas.height;

            this.wFactor[0] += (1 - this.wFactor[0]) * 0.125;
            if (this.wFactor[0] > 0.9875) {
                this.wFactor[0] = 1;
            }

            this.wFactor[1] += (1 - this.wFactor[1]) * 0.125;
        }

        viewportControlsOrtho() {
            if (coffeeEngine.inputs.mouse["2"]) {
                this.previewCamera.x += (coffeeEngine.inputs.mouse.movementX / 180) * this.previewCamera.zoom;
                this.previewCamera.y -= (coffeeEngine.inputs.mouse.movementY / 180) * this.previewCamera.zoom;
            }

            this.previewCamera.yaw += (0 - this.previewCamera.yaw) * 0.125;
            this.previewCamera.pitch += (0 - this.previewCamera.pitch) * 0.125;

            this.matrix = this.matrix.rotationX(this.previewCamera.pitch);
            this.matrix = this.matrix.rotationY(this.previewCamera.yaw);

            this.matrix = this.matrix.translate(this.previewCamera.x, this.previewCamera.y, 0);
            this.projection = coffeeEngine.matrix4.projection(90, 1, 0.001, 1000);
            this.aspectRatio = this.canvas.width / this.canvas.height;

            //Smooth transition
            this.wFactor[0] += (0 - this.wFactor[0]) * 0.125;
            if (this.wFactor[0] < 0.0125) {
                this.wFactor[0] = 0;
            }

            this.wFactor[1] += (this.previewCamera.zoom - this.wFactor[1]) * 0.125;
        }

        renderLoop() {
            this.matrix = coffeeEngine.matrix4.identity();

            if (this.orthographicMode) this.viewportControlsOrtho();
            else this.viewportControlsProjection();

            //Set our matrices
            coffeeEngine.renderer.cameraData.transform = this.matrix.webGLValue();
            coffeeEngine.renderer.cameraData.projection = this.projection.webGLValue();
            coffeeEngine.renderer.cameraData.wFactor = this.wFactor;
            coffeeEngine.renderer.cameraData.aspectRatio = this.aspectRatio;
            coffeeEngine.renderer.cameraData.position.x = this.previewCamera.x;
            coffeeEngine.renderer.cameraData.position.y = this.previewCamera.y;
            coffeeEngine.renderer.cameraData.position.z = this.previewCamera.z;

            coffeeEngine.runtime.currentScene.draw();
        }

        init(container) {
            this.closable = false;
            this.title = editor.language["editor.window.viewport"];

            //The main canvas
            this.canvas = document.createElement("canvas");
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            container.appendChild(this.canvas);

            //The profiler in the corner
            this.profiler = document.createElement("div");
            this.profiler.style.position = "absolute";
            this.profiler.style.left = "100%";
            this.profiler.style.top = "0%";
            this.profiler.style.transform = "translate(-100%,0%";
            this.profiler.style.backgroundColor = "var(--background-1)";

            container.style.overflow = "hidden";

            this.resized();
            window.addEventListener("resize", () => {
                this.resized();
            });

            //Setup our renderer
            this.renderer = coffeeEngine.renderer.create(this.canvas);

            //Our camera
            this.orthographicMode = false;
            this.profilerToggle = false;
            this.wFactor = [1, 1];
            this.previewCamera = {
                x: 0,
                y: 0,
                z: 0,
                yaw: 0,
                pitch: 0,
                zoom: 1,
                fov: 90,
                speed: 1,
            };

            //Our controls and render time
            this.canvas.addEventListener("wheel", (event) => {
                if (this.orthographicMode) {
                    this.previewCamera.zoom += event.deltaY * 0.0125;

                    if (this.previewCamera.zoom > 25) {
                        this.previewCamera.zoom = 25;
                    } else if (this.previewCamera.zoom < 1) {
                        this.previewCamera.zoom = 1;
                    }
                } else {
                    if (coffeeEngine.inputs.mouse["2"]) {
                        this.previewCamera.speed -= event.deltaY * 0.0125;
                        if (this.previewCamera.speed < 0.25) {
                            this.previewCamera.speed = 0.25;
                        } else if (this.previewCamera.speed > 10) {
                            this.previewCamera.speed = 10;
                        }
                    }
                }
            });

            setInterval(() => {
                this.profiler.innerHTML = `
                FPS:${Math.floor(1 / coffeeEngine.runtime.deltaTime)}<br>
                Delta:${coffeeEngine.runtime.deltaTime}<br>
                Triangles:${coffeeEngine.renderer.daveshade.triCount}<br>
                Nodes:${coffeeEngine.renderer.nodesRendered}`;

                //Make sure the mouse movement goes unupdated in this.
                coffeeEngine.runtime.frameStart(true);
                this.renderLoop();
                //Now we update the mouse movement
                coffeeEngine.inputs.mouse.movementX = 0;
                coffeeEngine.inputs.mouse.movementY = 0;
            }, 16);

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
                    this.orthographicMode = !this.orthographicMode;
                    this.viewmodeButton.innerHTML = this.orthographicMode ? orthographicIcon : perspectiveIcon;
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

        resized() {
            const clientSize = this.canvas.getBoundingClientRect();
            this.canvas.width = clientSize.width;
            this.canvas.height = clientSize.height;
        }
    };

    editor.windows.__Serialization.register(editor.windows.viewport, "viewport", { onlyOne: true });
})();
