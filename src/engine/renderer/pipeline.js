(function() {
    const renderer = coffeeEngine.renderer;
    renderer.pipeline = {
        cameraDrawQueue: [],
        postProcessOrder: [],
        
        addCameraToQueue: (camera) => { renderer.pipeline.cameraDrawQueue.push(camera); },

        clearCameraQueue: () => { renderer.pipeline.cameraDrawQueue = []; },

        draw: (scene) => {
            //If we have no cameras add a backup
            if (renderer.pipeline.cameraDrawQueue.length == 0) {
                renderer.pipeline.BackupCamera.aspectRatio = renderer.canvas.width / renderer.canvas.height;
                renderer.pipeline.addCameraToQueue(renderer.pipeline.BackupCamera);
            }

            //now render
            renderer.pipeline.cameraDrawQueue[0].use(true);

            const GL = renderer.daveshade.GL;
            const {width, height} = renderer.drawBuffer;

            //Clear the main renderers depth, and reset the sun
            renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT);
            scene.sunDirection = [0, 0, 0];
            scene.lightCount = 0;

            //Use our draw buffer
            renderer.drawBuffer.use();

            //Clear the depth each time and draw the sky/scene
            renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT | GL.COLOR_BUFFER_BIT);
            renderer.pipeline.drawSky(scene, width, height);
            renderer.daveshade.clear(GL.DEPTH_BUFFER_BIT);
            renderer.pipeline.drawScene(scene);

            //Render it back to the main draw pass.
            renderer.daveshade.cullFace();
            renderer.swapPost();

            renderer.pipeline.drawFinal(scene, renderer.mainShaders.mainPass);

            //If we are in the editor make sure we use the camera once more to account for things
            if (coffeeEngine.isEditor) renderer.pipeline.cameraDrawQueue[0].use(true);

            renderer.pipeline.postProcess(scene);

            //The final blit!
            renderer.daveshade.renderToCanvas();
            renderer.mainShaders.viewportPass.setBuffers(coffeeEngine.shapes.plane);
            renderer.mainShaders.viewportPass.setUniforms({ u_texture: renderer.getPost().attachments[0].texture });
            renderer.mainShaders.viewportPass.drawFromBuffers(6);
        },

        drawSky: (scene, width, height) => {
            renderer.cameraData.res = [width, height];

            //Set our uniforms
            const skyShader = renderer.mainShaders.skyplane;
            skyShader.setBuffers(coffeeEngine.shapes.plane);
            skyShader.setUniforms({
                horizonColor: scene.horizonColor,
                skyColor: scene.skyColor,
                groundColor: scene.groundColor,
                centerColor: scene.centerColor,
            })

            skyShader.drawFromBuffers(6);
        },

        drawScene: (scene) => {
            //Sort em
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
        },

        drawFinal: (scene, mainPass) => {
            if (renderer.viewport.antiAlias) {
                renderer.getPost().resize(renderer.canvas.width * renderer.drawBufferSizeMul, renderer.canvas.height * renderer.drawBufferSizeMul);
                renderer.getPost().use();
            }

            if (renderer.viewport.antiAlias) renderer.cameraData.res = [renderer.canvas.width * renderer.drawBufferSizeMul, renderer.canvas.height * renderer.drawBufferSizeMul];
            else renderer.cameraData.res = [renderer.canvas.width, renderer.canvas.height];
            
            const drawBuffer =  renderer.drawBuffer.attachments;
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
                u_cameraPosition: renderer.cameraData.position.webGLValue(),
            });

            //Draw main pass!
            mainPass.drawFromBuffers(6);

            if (renderer.viewport.antiAlias) renderer.cameraData.res = [renderer.canvas.width, renderer.canvas.height];
        },

        postProcess: (scene) => {
            //For some sillies!
            const drawBuffer =  renderer.drawBuffer.attachments;

            //Do our AA pass first
            if (renderer.viewport.antiAlias) {
                renderer.swapPost();
                renderer.mainShaders.antiAliasPass.setBuffers(coffeeEngine.shapes.plane);
                renderer.mainShaders.antiAliasPass.setUniforms({ u_texture: renderer.getPrevPost().attachments[0].texture, u_reductionAmount: renderer.drawBufferSizeMul });
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
                u_cameraPosition: renderer.cameraData.position.webGLValue(),

                u_time: coffeeEngine.timer,
            }

            //Do our post processing
            for (let shaderID in renderer.pipeline.postProcessOrder) {
                if (!renderer.pipeline.postProcessOrder[shaderID]) return;
                
                renderer.swapPost();
                
                //Our previous
                const previous = renderer.getPrevPost().attachments[0].texture;
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
    }
})();