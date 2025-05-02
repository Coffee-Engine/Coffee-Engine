(function() {
    coffeeEngine.renderer.pipeline.CameraData = class {
        #matrix = coffeeEngine.matrix4.identity();
        #webglMatrix = coffeeEngine.matrix4.identity().webGLValue();
        #projection = coffeeEngine.matrix4.projection(90, 1, 0.01, 1000);
        #webglProjection = coffeeEngine.matrix4.projection(90, 1, 0.01, 1000).webGLValue();

        position = new coffeeEngine.vector3(0,0,0);
        rotationEuler = new coffeeEngine.vector3(0,0,0);
        wFactor = [1, 1, 0.05];
        aspectRatio = 1;
        postProcessing = [];

        //Matrix setting
        set matrix(value) { 
            this.#matrix = value; 
            this.#webglMatrix = value.webGLValue(); 
        }
        get matrix() { return this.#matrix; }

        //Projection setting
        set projection(value) { 
            this.#projection = value;
            this.#webglProjection = value.webGLValue();
        }
        get projection() { return this.#projection; }

        //The main sauce
        use(isMain) {
            const cameraData = coffeeEngine.renderer.cameraData;
            const audioListener = coffeeEngine.audio.context.listener;
            const matrixRotationData = this.#matrix.getRotation();

            //Positional non matrix (E,G billboard, audio)
            cameraData.position.x = this.position.x;
            cameraData.position.y = this.position.y;
            cameraData.position.z = this.position.z;
            cameraData.cameraRotationEul.x = -this.rotationEuler.y;
            cameraData.cameraRotationEul.y = -this.rotationEuler.x;
            cameraData.cameraRotationEul.z = -this.rotationEuler.z;

            //Auditorial
            if (isMain && audioListener) {
                //Position
                if (audioListener.positionX !== undefined) audioListener.positionX.value = -this.position.x;
                if (audioListener.positionX !== undefined) audioListener.positionY.value = -this.position.y;
                if (audioListener.positionX !== undefined) audioListener.positionZ.value = -this.position.z * this.wFactor[0];

                //Rotation, the right is determined by the cross product of up and forward by the browser
                if (audioListener.forwardX !== undefined) audioListener.forwardX.value = matrixRotationData.contents[2][0];
                if (audioListener.forwardY !== undefined) audioListener.forwardY.value = matrixRotationData.contents[2][1];
                if (audioListener.forwardZ !== undefined) audioListener.forwardZ.value = matrixRotationData.contents[2][2];

                if (audioListener.upX !== undefined) audioListener.upX.value = matrixRotationData.contents[1][0];
                if (audioListener.upY !== undefined) audioListener.upY.value = matrixRotationData.contents[1][1];
                if (audioListener.upZ !== undefined) audioListener.upZ.value = matrixRotationData.contents[1][2];
            }

            //Our matrices
            cameraData.unflattenedTransform = this.#matrix;
            cameraData.transform = this.#webglMatrix;
            cameraData.projection = this.#webglProjection;

            //Misc
            cameraData.wFactor = this.wFactor;
            cameraData.aspectRatio = this.aspectRatio;

            //Finally set our post processing
            coffeeEngine.renderer.pipeline.postProcessOrder = this.postProcessing;
        }
    }

    coffeeEngine.renderer.pipeline.BackupCamera = new coffeeEngine.renderer.pipeline.CameraData();
})();