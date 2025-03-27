(function () {
    const audioListener = coffeeEngine.audio.context.listener;

    class cameraNode extends coffeeEngine.getNode("Node3D") {
        activeCamera = false;
        fov = 90;
        orthographic = false;
        zoom = 1.0;
        nearPlane = 0.05;

        shader = coffeeEngine.renderer.mainShaders.unlit;
        shaderArrow = coffeeEngine.renderer.mainShaders.unlitSolid;
        sprite = coffeeEngine.renderer.sprites.camera;

        //We have two ways to do this. The actual view matrix, and the "Fake" editor matrix
        updateMatrix() {
            //Editor ordering
            if (coffeeEngine.isEditor) {
                this.matrix = coffeeEngine.matrix4.identity();
                this.matrix = this.matrix.translate(this.position.x, this.position.y, this.position.z);
                this.matrix = this.matrix.rotationY(this.rotation.y);
                this.matrix = this.matrix.rotationX(this.rotation.x);
                this.matrix = this.matrix.rotationZ(this.rotation.z);
            } 
            //In game ordering
            else {
                this.matrix = coffeeEngine.matrix4.identity();
                this.matrix = this.matrix.rotationZ(-this.rotation.z);
                this.matrix = this.matrix.rotationX(-this.rotation.x);
                this.matrix = this.matrix.rotationY(-this.rotation.y);
                this.matrix = this.matrix.translate(-this.position.x, -this.position.y, -this.position.z);
            }
        }

        update(deltaTime, noChildren) {
            super.update(deltaTime, noChildren);
            // prettier-ignore
            if (!coffeeEngine.isEditor) {
                if (this.activeCamera) {
                    const translatedWorld = this.mixedMatrix.getTranslation();
                    const cameraData = coffeeEngine.renderer.cameraData;
                    const canvas = coffeeEngine.renderer.daveshade.CANVAS;

                    //Update our camera data
                    cameraData.transform = this.matrix.multiply(this.parent.mixedMatrix.inverse()).webGLValue();
                    cameraData.unflattenedTransform = this.mixedMatrix;
                    cameraData.projection = coffeeEngine.matrix4.projection(this.fov, 1, 0.01, 1000).webGLValue();
                    cameraData.wFactor = [(this.orthographic) ? 0 : 1, this.zoom, this.nearPlane];
                    cameraData.aspectRatio = canvas.width / canvas.height;
                    cameraData.position.x = -translatedWorld.x;
                    cameraData.position.y = -translatedWorld.y;
                    cameraData.position.z = -translatedWorld.z;

                    coffeeEngine.renderer.cameraData.cameraRotationEul.x = -this.rotation.y;
                    coffeeEngine.renderer.cameraData.cameraRotationEul.y = -this.rotation.x;
                    coffeeEngine.renderer.cameraData.cameraRotationEul.z = -this.rotation.z;

                    //Set audio data
                    audioListener.positionX.value = -translatedWorld.x;
                    audioListener.positionY.value = -translatedWorld.y;
                    audioListener.positionZ.value = (this.orthographic) ? 0 : -translatedWorld.z;

                    const rotationData = this.mixedMatrix.getRotation();

                    //Now our rotations
                    audioListener.forwardX.value = rotationData.contents[2][0];
                    audioListener.forwardY.value = rotationData.contents[2][1];
                    audioListener.forwardZ.value = rotationData.contents[2][2];

                    //Now our rotations
                    audioListener.upX.value = rotationData.contents[1][0];
                    audioListener.upY.value = rotationData.contents[1][1];
                    audioListener.upZ.value = rotationData.contents[1][2];
                }
            }
        }

        draw(drawID) {
            super.draw();
            //Editor display
            if (coffeeEngine.isEditor) {
                this.shader.setBuffers(coffeeEngine.shapes.plane);
                const translatedWorld = this.mixedMatrix.getTranslation();

                const renderMatrix = coffeeEngine.matrix4
                    .identity()
                    .translate(translatedWorld.x, translatedWorld.y, translatedWorld.z)
                    .rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x)
                    .rotationX(-coffeeEngine.renderer.cameraData.cameraRotationEul.y)
                    .scale((this.sprite.width / this.sprite.height) * 0.5, 0.5, 0.5)
                    .webGLValue();

                this.shader.uniforms.u_texture.value = this.sprite.texture;
                this.shader.uniforms.u_model.value = renderMatrix;
                this.shader.uniforms.u_colorMod.value = [1, 1, 1, 1];
                this.shader.uniforms.u_objectID.value = drawID;
                this.shader.drawFromBuffers(6);

                this.shaderArrow.setBuffers(coffeeEngine.shapes.arrow);

                this.shaderArrow.uniforms.u_model.value = this.mixedMatrix.rotationY(3.1415962).translate(0, 0, -1).webGLValue();
                this.shaderArrow.uniforms.u_colorMod.value = [1, 1, 1, 1];
                this.shaderArrow.uniforms.u_objectID.value = drawID;
                this.shaderArrow.drawFromBuffers(48);
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
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(cameraNode, "Camera", "Node3D");
})();
