(function() {
    editor.viewportCamera = class {
        matrix = coffeeEngine.matrix4.identity();

        orthographic = false;
        speed = 1;

        position = new coffeeEngine.vector3(0);
        rotation = new coffeeEngine.vector3(0);

        cameraData = new coffeeEngine.renderer.pipeline.CameraData();

        wFactor = 1;
        zoom = 1;


        constructor(renderer) {
            this.renderer = renderer;
            this.daveShade = renderer.daveShade;
        }

        orthographic(delta) {
            this.position.x += (coffeeEngine.inputs.mouse.movementX / 180) * this.zoom * editor.mouseSensitivity;
            this.position.y -= (coffeeEngine.inputs.mouse.movementY / 180) * this.zoom * editor.mouseSensitivity;

            this.projection = coffeeEngine.matrix4.projection(90, 1, 0.001, 1000);
        }

        perspective(delta) {
            //Look around with the mouse
            this.rotation.y -= (coffeeEngine.inputs.mouse.movementX / 360) * editor.mouseSensitivity;
            this.rotation.x += (coffeeEngine.inputs.mouse.movementY / 360) * editor.mouseSensitivity;

            //Clamp it
            this.rotation.x = Math.min(Math.max(this.rotation.x, -1.5707), 1.5707);

            const sin = Math.sin(this.rotation.y);
            const cos = Math.cos(this.rotation.y);

            //Then do some basic fps flight controls
            if (coffeeEngine.inputs.keys[editor.controls.up]) this.position.y -= delta * this.speed;
            if (coffeeEngine.inputs.keys[editor.controls.down]) this.position.y += delta * this.speed;

            if (coffeeEngine.inputs.keys[editor.controls.right]) {
                this.position.x -= cos * delta * this.speed;
                this.position.z -= sin * delta * this.speed;
            }
            if (coffeeEngine.inputs.keys[editor.controls.left]) {
                this.position.x += cos * delta * this.speed;
                this.position.z += sin * delta * this.speed;
            }

            if (coffeeEngine.inputs.keys[editor.controls.forward]) {
                this.position.x += sin * delta * this.speed;
                this.position.z -= cos * delta * this.speed;
            }
            if (coffeeEngine.inputs.keys[editor.controls.back]) {
                this.position.x -= sin * delta * this.speed;
                this.position.z += cos * delta * this.speed;
            }

        }

        update(delta, dragging) {
            //Make sure we are dragging to do the main controls
            if (dragging) {
                if (this.orthographic) this.orthographic(delta);
                else this.perspective(delta);
            }

            if (this.orthographic) {
                //Smooth transition
                this.wFactor += (0 - this.wFactor) * 0.125;
                if (this.wFactor < 0.0125) { this.wFactor = 0; }

                //No camera rotation
                this.previewCamera.yaw += (0 - this.previewCamera.yaw) * 0.125;
                this.previewCamera.pitch += (0 - this.previewCamera.pitch) * 0.125;
            }
            else {
                this.wFactor += (1 - this.wFactor) * 0.125;
                if (this.wFactor > 0.9875) { this.wFactor = 1; }
            }

            this.cameraData.matrix = coffeeEngine.matrix4.identity().rotation(this.rotation).translate(this.position);
            this.cameraData.projection = coffeeEngine.matrix4.projection(90, 1, 0.001, 1000);

            this.cameraData.resolution = [this.renderer.canvas.width, this.renderer.canvas.height];
            this.cameraData.aspectRatio = this.cameraData.resolution[0] / this.cameraData.resolution[1];
            this.cameraData.wFactor = [this.wFactor, this.zoom, 0.05];

            this.cameraData.postProcessing = [];
            coffeeEngine.renderer.pipeline.addCameraToQueue(this.cameraData);
        }
    }
})();