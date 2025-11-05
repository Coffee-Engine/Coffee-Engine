(function () {
    class editorVisible extends coffeeEngine.getNode("Node3D") {
        #shader = coffeeEngine.renderer.mainShaders.unlit;
        #shaderShape = coffeeEngine.renderer.mainShaders.unlitSolid;

        drawBillboard(renderer, daveShade, camera, drawID, sprite) {
            //This is only for editor objects so any draw this stuff if it is visible.
            if (coffeeEngine.isEditor && sprite) {
                const translatedWorld = this.mixedMatrix.getTranslation();

                //Move matrix to be at the entity's position;
                let modelMat = coffeeEngine.matrix4.identity()
                        .translate(translatedWorld.x, translatedWorld.y, translatedWorld.z)
                        .rotationY(camera.rotationEuler.y)
                        .rotationX(camera.rotationEuler.x)
                        .scale(this.scale.x, this.scale.y, -1)
                        .scale((sprite.width / sprite.height) * 0.5, 0.5, 0.5)
                        .webGLValue();
                
                //This sets uniforms and creates a camera stamp to prevent resetting un-needed uniforms.
                renderer.pipeline.setUniforms(camera, this.#shader, {
                    u_model: modelMat,
                    u_texture: sprite.TEXTURE,
                    u_colorMod: [1, 1, 1, 1],
                    u_objectID: drawID
                });

                this.#shader.setBuffers(coffeeEngine.shapes.plane);
                sprite.setFiltering(daveShade.FILTERING.LINEAR);

                daveShade.cullFace();
                this.#shader.drawFromBuffers(6);
            }
        }

        drawDirectionalArrow(renderer, camera, drawID) {
            renderer.pipeline.setUniforms(camera, this.#shaderShape, {
                u_model: this.mixedMatrix.rotationY(3.1415962).translate(0, 0, -1).webGLValue(),
                u_colorMod: [1, 1, 1, 1],
                u_objectID: drawID
            });
            
            this.#shaderShape.setBuffers(coffeeEngine.shapes.arrow);
            this.#shaderShape.drawFromBuffers(48);
        }
    }

    coffeeEngine.registerNode(editorVisible, "EditorVisible", "Node3D");
})();
