(function () {
    //Just set up the renderer. Not much to do here.
    coffeeEngine.renderer.create = (canvas, antialias) => {
        const renderer = coffeeEngine.renderer;
        renderer.canvas = canvas;

        //Firefox's blending is wierd
        renderer.daveshade = DaveShade.createInstance(renderer.canvas, {
            preserveDrawingBuffer: true,
            alpha: true,
            premultipliedAlpha: true,
            blendFunc: ["FUNC_ADD", "ONE", "ONE_MINUS_SRC_ALPHA"],
            powerPreference: "high-performance",
            antialias: antialias == true,
        });
        const daveshadeInstance = renderer.daveshade;

        //Add our draw buffer
        renderer.drawBuffer = daveshadeInstance.createFramebuffer(renderer.canvas.width * 4, renderer.canvas.height * 4, [
            //Colors
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            //Material Attributes
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            //Emission
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            //Position
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            //Normal
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT,
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA,
            DaveShade.RENDERBUFFER_TYPES.DEPTH,
        ]);

        //We do use the ZBuffer
        daveshadeInstance.useZBuffer(true);

        //Create our camera data.
        renderer.cameraData = {
            position: new coffeeEngine.vector3(0, 0, 0),

            set transform(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_camera) shader.uniforms.u_camera.value = value;
                });

                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;

                    if (shader.uniforms.u_camera) shader.uniforms.u_camera.value = value;
                });
                renderer.cameraData.storedTransform = value;
            },
            get transform() {
                return renderer.cameraData.storedTransform;
            },
            set projection(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_projection) shader.uniforms.u_projection.value = value;
                });

                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;

                    if (shader.uniforms.u_projection) shader.uniforms.u_projection.value = value;
                });
                renderer.cameraData.storedProjection = value;
            },
            get projection() {
                return renderer.cameraData.storedProjection;
            },
            set res(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_res) shader.uniforms.u_res.value = value;
                });

                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;

                    if (shader.uniforms.u_res) shader.uniforms.u_res.value = value;
                });
                renderer.cameraData.storedRes = value;
            },
            get res() {
                return renderer.cameraData.storedRes;
            },
            set aspectRatio(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_aspectRatio) shader.uniforms.u_aspectRatio.value = value;
                });

                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;

                    if (shader.uniforms.u_aspectRatio) shader.uniforms.u_aspectRatio.value = value;
                });
                renderer.cameraData.storedAspect = value;
            },
            get aspectRatio() {
                return renderer.cameraData.storedAspect;
            },

            //Because orthographic projection wouldn't like me
            set wFactor(value) {
                Object.values(renderer.mainShaders).forEach((shader) => {
                    if (shader.uniforms.u_wFactor) shader.uniforms.u_wFactor.value = value;
                });

                Object.values(renderer.shaderStorage).forEach((shader) => {
                    if (!shader) return;
                    if (!shader.uniforms) return;

                    if (shader.uniforms.u_wFactor) shader.uniforms.u_wFactor.value = value;
                });
                renderer.cameraData.storedWFactor = value;
            },
            get wFactor() {
                return renderer.cameraData.storedWFactor;
            },

            storedTransform: coffeeEngine.matrix4.identity(),
            unflattenedTransform: coffeeEngine.matrix4.identity(),
            storedProjection: coffeeEngine.matrix4.identity(),
            storedRes: [480, 360],
            storedAspect: 1,
            storedWFactor: [1, 1],
            cameraRotationEul: new coffeeEngine.vector3(0, 0, 0),
        };

        //Our shader compiler
        renderer.shaderHintRegex = /^.*\/\/\s*\?HINT:.*$/gm;
        renderer.shaderUniformRegex = /\s[\w\d\[\]_]*\s*;/g;
        renderer.extractionRegex = /(?:\/\/\s*\?HINT:)(.*)/g;
        renderer.cleanupRegex = /\/\/\s*\?HINT:/g;
        renderer.compilePBRshader = (shaderCode) => {
            //Find hints in shader code
            const hintLines = shaderCode.match(renderer.shaderHintRegex);
            
            //Compile our shader
            const vertex = DaveShade.findFunctionInGLSL(shaderCode, "vertex");
            const frag = DaveShade.findFunctionInGLSL(shaderCode, "fragment");
            const uniforms = shaderCode.replace(vertex, "").replace(frag, "");

            const compiledVert = coffeeEngine.renderer.mainShaders.basis.vertex.src.replace("//SHADER DEFINED UNIFORMS", uniforms).replace("void vertex() {}", vertex || "void vertex() {}");
            const compiledFrag = coffeeEngine.renderer.mainShaders.basis.fragment.src.replace("//SHADER DEFINED UNIFORMS", uniforms).replace("void fragment() {}", frag || "void fragment() {}");

            const compiledShader = daveshadeInstance.createShader(compiledVert, compiledFrag);

            if (!compiledShader) return;

            //Now use the hints
            for (let hintLineID in hintLines) {
                let hint = hintLines[hintLineID].trim();

                if (hint.startsWith("uniform")) {
                    //Get our uniform's name
                    const hintUniform = hint.match(renderer.shaderUniformRegex)[0].trim().replace(";","").split("[")[0];
                    
                    if (compiledShader.uniforms[hintUniform]) {
                        //Clean up our hints
                        compiledShader.uniforms[hintUniform].hints = hint.match(renderer.extractionRegex)[0].replace(renderer.cleanupRegex, "").trim().split(" ");
                    }
                }
            }

            return compiledShader;
        };

        renderer.textureStorage = {};
        renderer.shaderStorage = {};
        renderer.materialStorage = {};

        renderer.createBaseShaders(daveshadeInstance)
        renderer.initilizeDefaultShaders(renderer);
        renderer.initilizeFileConversions();
        renderer.initilizeMaterials();
        renderer.initilizeShapes();
        renderer.initilizeDebugSprites(renderer);

        renderer.drawBuffer.resize(renderer.canvas.width * 4, renderer.canvas.height * 4);
        renderer.canvas.addEventListener("resize", () => {});

        return renderer;
    };

    coffeeEngine.renderer.resizeToProject = () => {
        const renderer = coffeeEngine.renderer;
        if (!(renderer.canvas && renderer.drawBuffer)) return;

        const resolution = coffeeEngine.renderer.viewport.resolution;
        renderer.canvas.style.position = "absolute";

        switch (coffeeEngine.renderer.viewport.viewportType) {
            case "fixed":
                renderer.canvas.width = resolution[0];
                renderer.canvas.height = resolution[1];

                //Style it
                renderer.canvas.style.aspectRatio = `${resolution[0]}/${resolution[1]}`;
                renderer.canvas.style.width = "auto";
                renderer.canvas.style.height = "100%";
                renderer.canvas.style.left = "50%";
                renderer.canvas.style.top = "0px";
                renderer.canvas.style.transform = "translate(-50%, 0%)";
                break;

            case "stretch":
                renderer.canvas.width = resolution[0];
                renderer.canvas.height = resolution[1];

                //Style it
                renderer.canvas.style.aspectRatio = `0`;
                renderer.canvas.style.width = "100%";
                renderer.canvas.style.height = "100%";
                renderer.canvas.style.left = "0px";
                renderer.canvas.style.top = "0px";
                renderer.canvas.style.transform = "translate(0%, 0%)";
                break;

            //We need some special math for this
            case "integer": {
                renderer.canvas.width = resolution[0];
                renderer.canvas.height = resolution[1];

                //Style it
                renderer.canvas.style.aspectRatio = `${resolution[0]}/${resolution[1]}`;
                renderer.canvas.style.width = "auto";
                renderer.canvas.style.height = `${resolution[1] * Math.max(1, Math.floor(window.innerHeight / resolution[1]))}px`;
                renderer.canvas.style.left = "50%";
                renderer.canvas.style.top = "50%";
                renderer.canvas.style.transform = "translate(-50%, -50%)";
                break;
            }
        
            default:
                renderer.canvas.width = window.innerWidth;
                renderer.canvas.height = window.innerHeight;

                //Style it
                renderer.canvas.style.aspectRatio = `auto`;
                renderer.canvas.style.width = "100%";
                renderer.canvas.style.height = "100%";
                renderer.canvas.style.left = "0px";
                renderer.canvas.style.top = "0px";
                renderer.canvas.style.transform = "translate(0%, 0%)";
                break;
        }

        renderer.drawBuffer.resize(renderer.canvas.width * 4,renderer.canvas.height * 4);
    }

    coffeeEngine.renderer.dispose = () => {
        if (!coffeeEngine.renderer.canvas) return;
        coffeeEngine.renderer.canvas.parentElement.removeChild(coffeeEngine.renderer.canvas);
        coffeeEngine.renderer.daveshadeInstance.dispose();
    };
})();
