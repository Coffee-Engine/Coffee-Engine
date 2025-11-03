(function() {
    coffeeEngine.renderPipeline = class {
        cameraDrawQueue = [];
        postProcessOrder = [];

        renderer = null;

        addCameraToQueue(camera) { this.cameraDrawQueue.push(camera) }
        clearCameraQueue() { this.cameraDrawQueue = [] }

        pipelineOrder = [];

        draw(scene) {
            //We will assume the item is a function, and camera is a camera.
            for (let camera in this.cameraDrawQueue) {
                //Use camera
                camera.use(true); 
                
                for (let item in this.pipelineOrder) {
                    item(this.renderer, this.daveShade, scene, camera);
                }
            }
        }

        drawSky(renderer, daveShade, scene, camera) {
            daveShade.clear(daveShade.CLEAR_TARGET.DEPTH);

            //Set our uniforms
            const skyShader = renderer.mainShaders.skyplane;
            const {width, height} = renderer.drawBuffer;

            camera.apply(skyShader);

            skyShader.setBuffers(coffeeEngine.shapes.plane);
            skyShader.setUniforms({
                horizonColor: scene.horizonColor,
                skyColor: scene.skyColor,
                groundColor: scene.groundColor,
                centerColor: scene.centerColor,
                u_res: [width, height]
            });

            skyShader.drawFromBuffers(6);
        }

        drawScene(_renderer, _daveShade, scene) {
            daveShade.clear(daveShade.CLEAR_TARGET.DEPTH);
            
            //Sort nodes within the scene
            scene.drawList.sort((node1, node2) => {
                //Don't spend the extra time recomputing the value
                let node1Sort = node1.sortValue(false);
                let node2Sort = node2.sortValue(false);
                if (node1Sort < node2Sort) {
                    return -1;
                } else if (node1Sort > node2Sort) {
                    return 1;
                }
                //Dual pass sorting, just in case two are the same value
                else {
                    node1Sort = node1.sortValue(true);
                    node2Sort = node2.sortValue(true);

                    if (node1Sort < node2Sort) {
                        return -1;
                    } else if (node1Sort > node2Sort) {
                        return 1;
                    }
                }

                return 0;
            });

            //Now lets draw the objects
            for (let drawItem = scene.drawList.length - 1; drawItem >= 0; drawItem--) {
                const node = scene.drawList[drawItem];
                node.draw(drawItem + 1);
            }
        }

        drawFinal(renderer, daveShade, scene, camera) {
            //Render it back to the main draw pass.
            daveShade.cullFace();
            renderer.swapPost();

            const {canvas, viewport, drawBufferSizeMul} = renderer;

            //If we are using antiAliasing resize the buffer to support it.
            if (viewport.antiAlias) {
                renderer.getPost().resize(canvas.width * drawBufferSizeMul, canvas.height * drawBufferSizeMul);
                renderer.getPost().use();
            }

            if (viewport.antiAlias) camera.resolution = [canvas.width * drawBufferSizeMul, canvas.height * drawBufferSizeMul];
            else camera.resolution = [canvas.width, canvas.height];
            
            const drawBuffer =  renderer.drawBuffer.ATTACHMENTS;
            mainPass.setBuffers(coffeeEngine.shapes.plane);
            
            //Neato!
            mainPass.setUniforms({
                //Textures
                u_color: drawBuffer[0].texture, 
                u_materialAttributes: drawBuffer[1].texture, 
                u_emission: drawBuffer[2].texture, 
                u_position: drawBuffer[3].texture, 
                u_normal: drawBuffer[4].texture,

                //The sun
                u_sunDir: scene.sunDirection,
                u_sunColor: scene.sunColor,
                u_ambientColor: scene.ambientColor,

                //Lights
                u_lightCount: scene.lightCount,

                //fog data
                u_fogData: scene.fogData.flat(),
                u_cameraPosition: camera.position.webGLValue(),
            });

            //Draw main pass!
            mainPass.drawFromBuffers(6);

            if (viewport.antiAlias) camera.resolution = [canvas.width, canvas.height];
        }

        drawPost(renderer, _daveShade, scene, camera) {
            //If we are in the editor make sure we use the camera once more to account for things
            if (coffeeEngine.isEditor) renderer.pipeline.cameraDrawQueue[0].use(true);

            //For some sillies!
            const drawBuffer = renderer.drawBuffer.ATTACHMENTS;

            //Do our AA pass first
            if (renderer.viewport.antiAlias) {
                renderer.swapPost();
                renderer.mainShaders.antiAliasPass.setBuffers(coffeeEngine.shapes.plane);
                renderer.mainShaders.antiAliasPass.setUniforms({ u_texture: renderer.getPrevPost().ATTACHMENTS[0].texture, u_reductionAmount: renderer.drawBufferSizeMul });
                renderer.mainShaders.antiAliasPass.drawFromBuffers(6);

                renderer.getPrevPost().resize(renderer.canvas.width, renderer.canvas.height);
            }

            //Yeah
            const conjoiner = {
                //Textures
                u_color: drawBuffer[0].texture, 
                u_materialAttributes: drawBuffer[1].texture, 
                u_emission: drawBuffer[2].texture, 
                u_position: drawBuffer[3].texture, 
                u_normal: drawBuffer[4].texture,

                //The sun
                u_sunDir: scene.sunDirection,
                u_sunColor: scene.sunColor,
                u_ambientColor: scene.ambientColor,

                //Lights
                u_lightCount: scene.lightCount,

                //fog data
                u_fogData: scene.fogData.flat(),
                u_cameraPosition: camera.position.webGLValue(),

                u_time: coffeeEngine.timer,
            }

            //Do our post processing
            for (let shaderID in renderer.pipeline.postProcessOrder) {
                if (!renderer.pipeline.postProcessOrder[shaderID]) return;
                
                renderer.swapPost();
                
                //Our previous
                const previous = renderer.getPrevPost().ATTACHMENTS[0].texture;
                const shader = renderer.pipeline.postProcessOrder[shaderID].$processedShader;
                const parameters = renderer.pipeline.postProcessOrder[shaderID].parameters;

                //Buffers and uniforms
                shader.setBuffers(coffeeEngine.shapes.plane);
                shader.setUniforms({
                    ...conjoiner,
                    ...parameters,
                });

                //Do our passes
                let increment = 0;
                for (increment = 0; increment<shader.passes; increment++) {
                    //Set uniforms
                    shader.setUniforms({
                        //The previous pipeline object
                        u_initial: previous,
                        u_screen: (increment > 0) ? renderer.getPrevStore().attachments[0].texture : previous,
                        u_renderPass: increment
                    });

                    shader.drawFromBuffers(6);

                    //Swap our store buffer
                    if (shader.passes > 1) renderer.swapStore();
                }

                if (!renderer.usingStore) {
                    renderer.mainShaders.viewportPass.setBuffers(coffeeEngine.shapes.plane);
                    renderer.mainShaders.viewportPass.setUniforms({ u_texture: renderer.getPrevStore().attachments[0].texture });
                    renderer.mainShaders.viewportPass.drawFromBuffers(6);
                }
                else {
                    renderer.usingStore = false;
                }
            }
        }

        drawCanvas(renderer, daveShade) {
            //The final blit!
            daveShade.renderToCanvas();
            renderer.mainShaders.viewportPass.setBuffers(coffeeEngine.shapes.plane);
            renderer.mainShaders.viewportPass.setUniforms({ u_texture: renderer.getPost().ATTACHMENTS[0].texture });
            renderer.mainShaders.viewportPass.drawFromBuffers(6);
        }
        
        constructor(renderer) {
            this.renderer = renderer;
            this.daveShade = renderer.daveShade;

            this.pipelineOrder.push(
                this.drawSky,
                this.drawScene,
                this.drawFinal,
                this.drawPost,
                this.drawCanvas
            );
        }
    }
})();