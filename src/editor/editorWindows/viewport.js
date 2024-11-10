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

    editor.windows.viewport = class extends editor.windows.base {
        viewportControlsProjection() {
            //Dragging on the screen!
            if (coffeeEngine.inputs.mouse["2"]) {
                this.previewCamera.yaw -= coffeeEngine.inputs.mouse.movementX / 360;
                this.previewCamera.pitch += coffeeEngine.inputs.mouse.movementY / 360;

                this.previewCamera.pitch = Math.min(Math.max(this.previewCamera.pitch, -1.5707), 1.5707);

                if (coffeeEngine.inputs.keys["e"]) this.previewCamera.y -= 0.05;
                if (coffeeEngine.inputs.keys["q"]) this.previewCamera.y += 0.05;

                if (coffeeEngine.inputs.keys["d"]) {
                    this.previewCamera.x -= Math.cos(this.previewCamera.yaw) * 0.05;
                    this.previewCamera.z -= Math.sin(this.previewCamera.yaw) * 0.05;
                }
                if (coffeeEngine.inputs.keys["a"]) {
                    this.previewCamera.x += Math.cos(this.previewCamera.yaw) * 0.05;
                    this.previewCamera.z += Math.sin(this.previewCamera.yaw) * 0.05;
                }

                if (coffeeEngine.inputs.keys["w"]) {
                    this.previewCamera.x += Math.sin(this.previewCamera.yaw) * 0.05;
                    this.previewCamera.z -= Math.cos(this.previewCamera.yaw) * 0.05;
                }
                if (coffeeEngine.inputs.keys["s"]) {
                    this.previewCamera.x -= Math.sin(this.previewCamera.yaw) * 0.05;
                    this.previewCamera.z += Math.cos(this.previewCamera.yaw) * 0.05;
                }
            }

            this.matrix = this.matrix.rotationX(this.previewCamera.pitch);
            this.matrix = this.matrix.rotationY(this.previewCamera.yaw);

            this.matrix = this.matrix.translate(this.previewCamera.x, this.previewCamera.y, this.previewCamera.z);
            this.projection = coffeeEngine.matrix4.projection(90, this.canvas.width / this.canvas.height, 0.001, 1000);

            this.wFactor += (1 - this.wFactor) * 0.0625;
            if (this.wFactor > 0.975) {
                this.wFactor = 1;
            }
        }

        viewportControlsOrtho() {
            if (coffeeEngine.inputs.mouse["2"]) {
                this.previewCamera.x += coffeeEngine.inputs.mouse.movementX / 180;
                this.previewCamera.y -= coffeeEngine.inputs.mouse.movementY / 180;
            }

            this.previewCamera.yaw += (0 - this.previewCamera.yaw) * 0.0625;
            this.previewCamera.pitch += (0 - this.previewCamera.pitch) * 0.0625;

            this.matrix = this.matrix.rotationX(this.previewCamera.pitch);
            this.matrix = this.matrix.rotationY(this.previewCamera.yaw);

            this.matrix = this.matrix.translate(this.previewCamera.x, this.previewCamera.y, this.previewCamera.z);
            this.projection = coffeeEngine.matrix4.projection(90, this.canvas.width / this.canvas.height, 0.001, 1000);

            //Smooth transition
            this.wFactor += (0 - this.wFactor) * 0.0625;
            if (this.wFactor < 0.025) {
                this.wFactor = 0;
            }
        }

        renderLoop() {
            this.matrix = coffeeEngine.matrix4.identity();

            if (this.orthographicMode) this.viewportControlsOrtho();
            else this.viewportControlsProjection();

            //Set our matrices
            coffeeEngine.renderer.cameraData.transform = this.matrix.webGLValue();
            coffeeEngine.renderer.cameraData.projection = this.projection.webGLValue();
            coffeeEngine.renderer.cameraData.wFactor = this.wFactor;

            coffeeEngine.runtime.currentScene.draw();
        }

        init(container) {
            this.title = editor.language["editor.window.viewport"];

            this.canvas = document.createElement("canvas");
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            this.orthographicMode = false;
            this.wFactor = 1;

            container.style.overflow = "hidden";

            container.appendChild(this.canvas);

            this.resized();
            window.addEventListener("resize", () => {
                this.resized();
            });

            //Setup our renderer
            this.renderer = coffeeEngine.renderer.create(this.canvas);

            this.previewCamera = {
                x: 0,
                y: 0,
                z: 0,
                yaw: 0,
                pitch: 0,
            };
            setInterval(() => {
                this.renderLoop();
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

                //orthoButton
                this.viewmodeButton = document.createElement("button");
                this.viewmodeButton.innerHTML = perspectiveIcon;
                this.viewmodeButton.onclick = () => {
                    this.orthographicMode = !this.orthographicMode;
                    this.viewmodeButton.innerHTML = this.orthographicMode ? orthographicIcon : perspectiveIcon;
                };
                this.buttonHolder.appendChild(this.viewmodeButton);

                //orthoButton
                this.otherButton = document.createElement("button");
                {
                    this.otherButton.onclick = () => {
                        console.log(this.orthographicMode);
                        this.orthographicMode = !this.orthographicMode;
                    };
                }
                this.buttonHolder.appendChild(this.otherButton);
            }
            container.appendChild(this.buttonHolder);
        }

        resized() {
            const clientSize = this.canvas.getBoundingClientRect();
            this.canvas.width = clientSize.width;
            this.canvas.height = clientSize.height;
        }
    };

    editor.windows.__Serialization.register(editor.windows.viewport, "viewport", {onlyOne:true});
})();
