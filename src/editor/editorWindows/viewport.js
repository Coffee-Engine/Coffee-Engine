//Old obsolete window. Here for historical reasons. and incase I want to restore some LOST MEDIA
(function () {
    editor.windows.viewport = class extends editor.windows.base {        
        viewportControls() {
            this.matrix = coffeeEngine.matrix4.identity();
            
            //Dragging on the screen!
            if (coffeeEngine.inputs.mouse["2"]) {
                this.previewCamera.yaw -= coffeeEngine.inputs.mouse.movementX / 360;
                this.previewCamera.pitch += coffeeEngine.inputs.mouse.movementY / 360;

                this.previewCamera.pitch = Math.min(Math.max(this.previewCamera.pitch,-1.5707),1.5707);

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

            this.matrix = this.matrix.translate(this.previewCamera.x,this.previewCamera.y,this.previewCamera.z);

            //Editor projection matrix
            this.projection = coffeeEngine.matrix4.projection(90,1,0.1,1000);

            coffeeEngine.renderer.cameraData.transform = this.matrix.webGLValue();
            coffeeEngine.renderer.cameraData.projection = this.projection.webGLValue();
        }

        renderLoop() {
            this.viewportControls();
            coffeeEngine.runtime.currentScene.draw();
        }

        init(container) {
            this.canvas = document.createElement("canvas");
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";

            container.style.overflow = "hidden";

            container.appendChild(this.canvas);

            this.resized();

            //Setup our renderer
            this.renderer = coffeeEngine.renderer.create(this.canvas);

            this.previewCamera = {
                x:0,
                y:0,
                z:0,
                yaw:0,
                pitch:0
            }
            setInterval(() => {this.renderLoop()},16);
        }

        resized() {
            const clientSize = this.canvas.getBoundingClientRect();
            this.canvas.width = 720//clientSize.width;
            this.canvas.height = 720//clientSize.height;
        }
    };

    editor.windows.__Serialization.register(editor.windows.viewport,"viewport");
})();
