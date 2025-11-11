(function () {
    class cameraNode extends coffeeEngine.getNode("EditorVisible") {
        activeCamera = false;
        fov = 90;
        orthographic = false;
        zoom = 1.0;
        nearPlane = 0.05;

        //The difference between this camera data and the one in the renderer is the fact this may or may not currently be in use.
        cameraData = new coffeeEngine.renderer.pipeline.CameraData();

        //Shhhh
        postProcessing = [];

        //We have two ways to do this. The actual view matrix, and the "Fake" editor matrix
        updateMatrix() {
            //Editor ordering
            if (coffeeEngine.isEditor) {
                this.matrix = coffeeEngine.matrix4.identity().translate(this.position).rotation(this.rotation);
            } 
            //In game ordering
            else {
                this.matrix = coffeeEngine.matrix4.identity().rotation(this.rotation.invert()).translate(-this.position.invert());
            }
        }

        pushPostProcessData(target, data) {
            target.postProcessing = [];
            for (let shaderID in data) {
                if (data[shaderID]) {
                    //Check to see if we have a processed shader
                    if (data[shaderID].$processedShader && data[shaderID].$processedShader != "processing") {
                        target.postProcessing.push(data[shaderID]);
                    }
                    //If not processing, process.
                    else if (!data[shaderID].$processedShader) {
                        data[shaderID].$processedShader = "processing";

                        //Make it our processed shader
                        coffeeEngine.renderer.fileToShader(data[shaderID].shader).then((shader) => {
                            data[shaderID].$processedShader = shader;
                        }).catch(() => {
                            data[shaderID].$processedShader = null;
                        });
                    }
                }
            }

            return target.postProcessing;
        }

        update(deltaTime, noChildren) {
            super.update(deltaTime, noChildren);
            // prettier-ignore
            if (!coffeeEngine.isEditor) {
                if (this.activeCamera) {
                    const translatedWorld = this.mixedMatrix.getTranslation();
                    const canvas = coffeeEngine.renderer.daveshade.CANVAS;

                    this.cameraData.matrix = this.matrix.multiply(this.parent.mixedMatrix.inverse());
                    this.cameraData.projection = coffeeEngine.matrix4.projection(this.fov, 1, 0.01, 1000);
                    this.cameraData.position = translatedWorld;
                    this.cameraData.rotationEuler = this.rotation;
                    this.cameraData.wFactor = [(this.orthographic) ? 0 : 1, this.zoom, this.nearPlane];
                    this.cameraData.aspectRatio = canvas.width / canvas.height;

                    this.pushPostProcessData(this.cameraData, this.postProcessing);

                    coffeeEngine.renderer.pipeline.addCameraToQueue(this.cameraData);
                }
            }
        }

        draw(renderer, daveShade, camera, drawID) {
            super.draw(renderer, daveShade, camera, drawID);
            //Editor display
            if (coffeeEngine.isEditor) {
                this.drawBillboard(renderer, daveShade, camera, drawID, coffeeEngine.renderer.engineTextures.camera);
                this.drawDirectionalArrow(renderer, camera, drawID);                

                if (editor.lastSelectedNode == this) {
                    this.pushPostProcessData(coffeeEngine.mainViewport.cameraData, this.postProcessing);
                }
            }
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true }, 
                "---", 
                { name: "fov", translationKey: "engine.nodeProperties.Camera.fov", type: coffeeEngine.PropertyTypes.FLOAT }, 
                { name: "nearPlane", translationKey: "engine.nodeProperties.Camera.nearPlane", type: coffeeEngine.PropertyTypes.FLOAT }, 
                { name: "orthographic", translationKey: "engine.nodeProperties.Camera.flatten", type: coffeeEngine.PropertyTypes.BOOLEAN }, 
                { name: "zoom", translationKey: "engine.nodeProperties.Camera.zoom", type: coffeeEngine.PropertyTypes.FLOAT }, 
                "---",
                { name: "activeCamera", translationKey: "engine.nodeProperties.Camera.active", type: coffeeEngine.PropertyTypes.BOOLEAN},
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" },
                { name: "postProcessing", translationKey:"engine.nodeProperties.Camera.postProcessing", type: "shaderArray", types: ["shader"] }
            ];
        }
    }

    coffeeEngine.registerNode(cameraNode, "Camera", "Node3D");
})();
