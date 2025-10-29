(function () {
    //Uniforms provided by the engine for the engine.
    coffeeEngine.renderer.engineUniforms = [
        //Transformations
        "u_model", 
        "u_projection", 
        "u_camera", 
        "u_wFactor", 
        "u_aspectRatio", 
        
        //Other stuff
        "u_colorMod", 
        "u_res", 
        "u_objectID", 
        "u_time", 
        
        //Post processing
        "u_initial", 
        "u_screen", 
        "u_renderPass"
    ];
    
    //Just set up the renderer. Not much to do here.
    coffeeEngine.rendererClass = class {
        daveShade = null;
        canvas = null;
        drawBufferSizeMul = 1;
        currentCamera = null;

        mainShaders = {};

        textureStorage = {};
        shaderStorage = {};
        materialStorage = {};

        shaderHintRegex = /^.*\/\/\s*\?HINT:.*$/gm;
        shaderUniformRegex = /\s[\w\d\[\]_]*\s*;/g;
        extractionRegex = /(?:\/\/\s*\?HINT:)(.*)/g;
        cleanupRegex = /\/\/\s*\?HINT:/g;

        ready = false;
        
        constructor(canvas, antialias) {
            this.canvas = canvas;
            this.daveShade = DaveShade.createInstance(canvas, {
                preserveDrawingBuffer: true,
                alpha: true,
                premultipliedAlpha: true,
                blendFunc: ["FUNC_ADD", "ONE", "ONE_MINUS_SRC_ALPHA"],
                powerPreference: "high-performance",
                antialias: antialias == true,
            });

            this.daveShade.useZBuffer(true);

            const renderer = this;
            new Promise(async () => {
                renderer.createBaseShaders()
                renderer.initilizeDefaultShaders(renderer);
                renderer.initilizeFileConversions();
                renderer.initilizeMaterials();
                renderer.initilizeShapes();
                renderer.initilizeDebugSprites(renderer);
                renderer.createFramebuffers(renderer, daveshadeInstance);
            }).then(() => {
                renderer.ready = true;
            });
        }

        async createBaseShaders() {
            this.POSTPROCESS_BASE_VERTEX = `#version 300 es
                precision highp float;

                in vec4 a_position;

                void main()
                {    
                    //Transform my stuff!
                    gl_Position = a_position;
                }
            `;
            //Our base shaders
            this.mainShaders = {
                basis: await this.daveShade.shaderFromURL("engine/renderer/shaders/basis.vert", "engine/renderer/shaders/basis.frag"),
                skyplane: await this.daveShade.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/sky.frag"),
                mainPass: await this.daveShade.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/mainPass.frag"),
                postBasis: await this.daveShade.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/post.frag"),
                antiAliasPass: await this.daveShade.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/antiAlias.frag"),
                viewportPass: await this.daveShade.shaderFromURL("engine/renderer/shaders/basePass.vert", "engine/renderer/shaders/basePass.frag"),
            };
        }

        compilePBRshader(shaderCode) {
            if (this.ready) {
                //Find hints in shader code
                const hintLines = shaderCode.match(renderer.shaderHintRegex);
                
                //Compile our shader
                const vertex = DaveShade.findFunctionInGLSL(shaderCode, "vertex");
                const frag = DaveShade.findFunctionInGLSL(shaderCode, "fragment");
                const uniforms = shaderCode.replace(vertex, "").replace(frag, "");

                //Detect if post
                let shader = this.mainShaders.basis;
                let passes = 1;
                if (shaderCode.match(/\w*#define\s*is_post;/)) {
                    shader = coffeeEngine.renderer.mainShaders.postBasis;

                    //Grab our passes if we have a defined amount
                    const renderPasses = shaderCode.match(/\w*#define\s*passCount\s*\d*\s*;/); 
                    if (renderPasses) {
                        //Get our passes
                        passes = Number(renderPasses[0].replaceAll(/\D/g, ""));
                        if (isNaN(passes)) passes = 1;
                        passes = Math.floor(Math.max(1, passes));
                    } 
                }

                const compiledVert = shader.VERTEX.src.replace("//SHADER DEFINED UNIFORMS", `#define is_vertex;\n${uniforms}`).replace("void vertex() {}", vertex || "void vertex() {}");
                const compiledFrag = shader.FRAGMENT.src.replace("//SHADER DEFINED UNIFORMS", `#define is_fragment;\n${uniforms}`).replace("void fragment() {}", frag || "void fragment() {}");

                const compiledShader = daveshadeInstance.createShader(compiledVert, compiledFrag);

                if (!compiledShader) return;

                //Set our passes variable
                compiledShader.passes = passes;

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
            }
        };
    }
    coffeeEngine.renderer.create = async (canvas, antialias) => {
        const renderer = coffeeEngine.renderer;
        renderer.canvas = canvas;
        renderer.drawBufferSizeMul = 1;

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

        //We do use the ZBuffer
        daveshadeInstance.useZBuffer(true);

        renderer.currentCamera = null;

        //Our shader compiler
        renderer.

        //Just hit it with the good old double wammy!
        renderer.resize(renderer.canvas.width, renderer.canvas.height);

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

        renderer.resize(renderer.canvas.width,renderer.canvas.height);
    }

    coffeeEngine.renderer.dispose = () => {
        if (!coffeeEngine.renderer.canvas) return;
        coffeeEngine.renderer.canvas.parentElement.removeChild(coffeeEngine.renderer.canvas);
        coffeeEngine.renderer.daveshadeInstance.dispose();
    };
})();
