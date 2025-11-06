(function() {
    coffeeEngine.renderPipeline = class {
        cameraDrawQueue = [];
        postProcessOrder = [];

        renderer = null;

        addCameraToQueue(camera) { this.cameraDrawQueue.push(camera) }
        clearCameraQueue() { this.cameraDrawQueue = [] }

        pipelineOrder = [];

        lastRender = Date.now();
        renderID = `${this.lastRender}_invalid`;

        draw(scene) {
            scene.lightCount = 0;
            this.lastRender = Date.now();
            //We will assume the item is a function, and camera is a camera.
            for (let cameraID in this.cameraDrawQueue) {
                //So we can get now data for each position
                this.renderID = `${this.lastRender}_${cameraID}`;

                //Use camera
                const camera = this.cameraDrawQueue[cameraID];
                camera.use(true); 
                
                for (let item in this.pipelineOrder) {
                    this.pipelineOrder[item](this.renderer, this.daveShade, scene, camera);
                }
            }
        }

        drawSky(renderer, daveShade, scene, camera) {
            daveShade.clear(daveShade.CLEAR_TARGET.DEPTH);

            //Set our uniforms
            const skyShader = renderer.mainShaders.skyplane;
            const drawBuffer = renderer.drawBuffer;

            camera.apply(skyShader);

            skyShader.setBuffers(coffeeEngine.shapes.plane);
            skyShader.setUniforms({
                horizonColor: scene.horizonColor,
                skyColor: scene.skyColor,
                groundColor: scene.groundColor,
                centerColor: scene.centerColor,
                u_res: [drawBuffer.WIDTH, drawBuffer.HEIGHT]
            });

            skyShader.drawFromBuffers(6);
        }

        drawScene(renderer, daveShade, scene, camera) {
            daveShade.clear(daveShade.CLEAR_TARGET.DEPTH);
            
            //Sort nodes within the scene
            scene.drawList.sort((node1, node2) => {
                //Don't spend the extra time recomputing the value
                let node1Sort = node1.sortValue(camera, false);
                let node2Sort = node2.sortValue(camera, false);
                if (node1Sort < node2Sort) {
                    return -1;
                } else if (node1Sort > node2Sort) {
                    return 1;
                }
                //Dual pass sorting, just in case two are the same value
                else {
                    node1Sort = node1.sortValue(camera, true);
                    node2Sort = node2.sortValue(camera, true);

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
                node.draw(renderer, daveShade, camera, drawItem + 1);
            }
        }

        drawFinal(renderer, daveShade, scene, camera) {
            //Render it back to the main draw pass.
            daveShade.cullFace();
            renderer.swapPost();

            const {canvas, viewport, drawBufferSizeMul} = renderer;

            //If we are using antiAliasing resize the buffer to support it.
            if (viewport.antiAlias) {
                renderer.curPost.resize(canvas.width * drawBufferSizeMul, canvas.height * drawBufferSizeMul);
                renderer.curPost.use();
            }

            if (viewport.antiAlias) camera.resolution = [canvas.width * drawBufferSizeMul, canvas.height * drawBufferSizeMul];
            else camera.resolution = [canvas.width, canvas.height];
            
            const mainPass = renderer.mainShaders.mainPass;
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

                u_res: camera.resolution
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
                renderer.mainShaders.antiAliasPass.setUniforms({ u_texture: renderer.prevPost.ATTACHMENTS[0].texture, u_reductionAmount: renderer.drawBufferSizeMul });
                renderer.mainShaders.antiAliasPass.drawFromBuffers(6);

                renderer.prevPost.resize(renderer.canvas.width, renderer.canvas.height);
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
                const previous = renderer.prevPost.ATTACHMENTS[0].texture;
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
            const viewportPass = renderer.mainShaders.viewportPass;
            daveShade.renderToCanvas();
            viewportPass.setBuffers(coffeeEngine.shapes.plane);
            viewportPass.setUniforms({ 
                u_texture: renderer.curPost.ATTACHMENTS[0].texture,
                u_res: [renderer.canvas.width, renderer.canvas.height]
            });
            viewportPass.drawFromBuffers(6);
        }

        //Only meant for troubleshooting issues
        debugDraw(renderer, daveShade) {
            if (!renderer.engineTextures.sun) return;
            daveShade.renderToCanvas();
            daveShade.clear(daveShade.CLEAR_TARGET.DEPTH | daveShade.CLEAR_TARGET.COLOR);
            daveShade.TEXTURE_READING_SHADER.setBuffers(daveShade.TEXTURE_READING_QUAD);
            daveShade.TEXTURE_READING_SHADER.setUniforms({
                u_texture: renderer.drawBuffer.ATTACHMENTS[1].texture
            });

            daveShade.TEXTURE_READING_SHADER.drawFromBuffers(6);
        }

        moveToBuffer(buffer) {
            return () => { buffer.use(); }
        }

        moveToCanvas() {
            return (_renderer, daveShade) => { daveShade.renderToCanvas(); }
        }

        setUniforms(camera, shader, exUni) {
            //Make sure we don't set or retrieve data that isn't needed.
            if (shader.lastRender == this.renderID) {
                shader.setUniforms(exUni);
            }
            else {
                shader.setUniforms({
                    ...camera.getShaderData(),
                    ...exUni
                })

                shader.lastRender = this.renderID;
            }
        }
        
        constructor(renderer) {
            this.renderer = renderer;
            this.daveShade = renderer.daveShade;

            this.pipelineOrder.push(
                this.moveToBuffer(renderer.drawBuffer),
                this.drawSky,
                this.drawScene,
                this.drawFinal,
                this.drawPost,
                this.drawCanvas,
                //this.debugDraw
            );
        }
    }

    coffeeEngine.renderPipeline.prototype.CameraData = class {
        #matrix = coffeeEngine.matrix4.identity();
        #webglMatrix = coffeeEngine.matrix4.identity().webGLValue();
        #projection = coffeeEngine.matrix4.projection(90, 1, 0.01, 1000);
        #webglProjection = coffeeEngine.matrix4.projection(90, 1, 0.01, 1000).webGLValue();

        position = new coffeeEngine.vector3(0,0,0);
        rotationEuler = new coffeeEngine.vector3(0,0,0);
        wFactor = [1, 1, 0.05];
        aspectRatio = 1;
        postProcessing = [];
        resolution = [480, 360];

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
            const audioListener = coffeeEngine.audio.context.listener;
            const matrixRotationData = this.#matrix.getRotation();

            //Positional non matrix (E,G billboard, audio)
            coffeeEngine.renderer.currentCamera = this;

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

            //Finally set our post processing
            coffeeEngine.renderer.pipeline.postProcessOrder = [...this.postProcessing];
        }

        apply(shader) {
            //Make sure we supply a shader.
            if (!(shader instanceof DaveShade.shader)) return;
            shader.setUniforms(this.getShaderData());
        }

        getShaderData() { return {
            u_camera: this.#webglMatrix,
            u_projection: this.#webglProjection,
            u_res: this.resolution,
            u_aspectRatio: this.aspectRatio,
            u_wFactor: this.wFactor,
        }}
    }
})();