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

        viewport = {
            resolution: [480, 360],
            type: "default"
        }

        postBuffer = 0;
        usingStore = false;

        //Also we pass in renderer, this is so folk can make their own resize modes through extensions.
        resizeModes = {
            fixed: (renderer, width, height) => {
                renderer.canvas.width = width;
                renderer.canvas.height = height;

                //Style it
                renderer.canvas.style.aspectRatio = `${width}/${height}`;
                renderer.canvas.style.width = "auto";
                renderer.canvas.style.height = "100%";
                renderer.canvas.style.left = "50%";
                renderer.canvas.style.top = "0px";
                renderer.canvas.style.transform = "translate(-50%, 0%)";
            },

            stretch: (renderer, width, height) => {
                renderer.canvas.width = width;
                renderer.canvas.height = height;

                //Style it
                renderer.canvas.style.aspectRatio = `0`;
                renderer.canvas.style.width = "100%";
                renderer.canvas.style.height = "100%";
                renderer.canvas.style.left = "0px";
                renderer.canvas.style.top = "0px";
                renderer.canvas.style.transform = "translate(0%, 0%)";
            },

            integer: (renderer, width, height) => {    
                renderer.canvas.width = width;
                renderer.canvas.height = height;

                //Style it
                renderer.canvas.style.aspectRatio = `${width}/${height}`;
                renderer.canvas.style.width = "auto";
                renderer.canvas.style.height = `${height * Math.max(1, Math.floor(window.innerHeight / height))}px`;
                renderer.canvas.style.left = "50%";
                renderer.canvas.style.top = "50%";
                renderer.canvas.style.transform = "translate(-50%, -50%)";
            },

            default: (renderer, width, height) => {
                renderer.canvas.width = width;
                renderer.canvas.height = height;

                //Style it
                renderer.canvas.style.aspectRatio = `auto`;
                renderer.canvas.style.width = "100%";
                renderer.canvas.style.height = "100%";
                renderer.canvas.style.left = "0px";
                renderer.canvas.style.top = "0px";
                renderer.canvas.style.transform = "translate(0%, 0%)";    
            }
        }

        //Ready is a private variable that should be unchangable outside of the main renderer object.
        #ready = false;
        get ready() {
            return this.ready;
        }
        
        constructor(canvas, onReady) {
            this.canvas = canvas;
            this.daveShade = DaveShade.createInstance(canvas, {
                preserveDrawingBuffer: true,
                alpha: true,
                premultipliedAlpha: true,
                blendFunc: ["FUNC_ADD", "ONE", "ONE_MINUS_SRC_ALPHA"],
                powerPreference: "high-performance",
                antialias: antialias == true,
            });

            //Setup our canvas
            this.daveShade.useZBuffer(true);
            this.resize(this.canvas.width, this.canvas.height);

            //Define the renderer because sometimes promises replace the "this" object
            const renderer = this;

            //Render setup;
            new Promise(async () => {
                renderer.createBaseShaders.call(renderer)
                renderer.createMaterialShaders.call(renderer);
                renderer.initilizeFileConversions.call(renderer);
                renderer.initilizeMaterials.call(renderer);
                renderer.initilizeShapes.call(renderer);
                renderer.initilizeDebugSprites.call(renderer);
                renderer.createFramebuffers.call(renderer);
            }).then(() => {
                //Set our ready status and call onReady.
                renderer.#ready = true;
                onReady(renderer);
            });
        }

        //? General use functions
        resize(width, height) {
            //Prevent older devices from dying
            if (width * this.drawBufferSizeMul > 2560 || height * this.drawBufferSizeMul > 1440) this.drawBufferSizeMul = 1;
            else if (width * 2 <= 2560 || height * 2 <= 1440) this.drawBufferSizeMul = 2;

            this.drawBuffer.resize(width * this.drawBufferSizeMul, height * this.drawBufferSizeMul);
            this.post0.resize(width, height);
            this.post1.resize(width, height);
            this.storeBuffer.resize(width, height);
        }

        dispose() {
            if (!this.canvas) return;
            this.canvas.parentElement.removeChild(this.canvas);
            this.daveShade.dispose();
        }

        resizeToProject() {
            //Make sure our canvas and drawbuffer exist;
            if (!(this.canvas && this.drawBuffer)) return;

            const resolution = this.viewport.resolution;
            this.canvas.style.position = "absolute";

            //Call our current type or the default one, with the current resolution.
            (this.resizeModes[this.viewport.type] || this.resizeModes.default)(this, resolution[0], resolution[1]);
        }

        
        //? Shaders
        //Previously compilePBRShader
        compileEngineShader(shaderCode) {
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
                shader = this.mainShaders.postBasis;

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

            const compiledShader = this.daveShade.createShader(compiledVert, compiledFrag);

            if (!compiledShader) return;

            //Set our passes variable
            compiledShader.passes = passes;

            //Now use the hints
            for (let hintLineID in hintLines) {
                let hint = hintLines[hintLineID].trim();

                if (hint.startsWith("uniform")) {
                    //Get our uniform's name
                    const hintUniform = hint.match(this.shaderUniformRegex)[0].trim().replace(";","").split("[")[0];
                    
                    if (compiledShader.uniforms[hintUniform]) {
                        //Clean up our hints
                        compiledShader.uniforms[hintUniform].hints = hint.match(this.extractionRegex)[0].replace(this.cleanupRegex, "").trim().split(" ");
                    }
                }
            }

            return compiledShader;
        }

        //? Framebuffers
        swapPost() {
            //Swap our post buffers
            this.postBuffer =  (this.postBuffer + 1) % 2;
            this.usingStore = false;
            this[`post${renderer.postBuffer}`].use();
            //this.daveShade.clear(this.daveShade.CLEAR_TARGET.COLOR);
        }

        swapStore = () => {
            this.usingStore = !this.usingStore;
            if (!this.usingStore) renderer[`post${this.postBuffer}`].use();
            else this.storeBuffer.use();
            //this.daveShade.clear(this.daveShade.CLEAR_TARGET.COLOR);
        }

        get prevStore() {
            if (!renderer.usingStore) return renderer.storeBuffer;
            return renderer[`post${renderer.postBuffer}`];
        }

        get prevPost() { return renderer[`post${(renderer.postBuffer + 1) % 2}`]; }

        get curPost() {
            if (renderer.usingStore && !forcePost) renderer.storeBuffer;
            return renderer[`post${renderer.postBuffer}`];
        }

        //? Setup functions
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

        async createMaterialShaders() {
            this.mainShaders = Object.assign(this.mainShaders, {
                unlit: this.compileEngineShader(await fetch("engine/renderer/shaders/material/unlit.glsl")),
                editorCircle: this.compileEngineShader(await fetch("engine/renderer/shaders/material/editorCircle.glsl")),
                editorShape: this.compileEngineShader(await fetch("engine/renderer/shaders/material/editorShape.glsl")),
                lit: this.compileEngineShader(await fetch("engine/renderer/shaders/material/lit.glsl")),
                unlitSolid: this.compileEngineShader(await fetch("engine/renderer/shaders/material/unlitSolid.glsl")),
                PBR: this.compileEngineShader(await fetch("engine/renderer/shaders/material/PBR.glsl")),
                bloom: this.compileEngineShader(await fetch("engine/renderer/shaders/material/bloom.glsl")),
            });
        }

        createFramebuffers = () => {
            //Add our draw buffer
            this.drawBuffer = this.daveShade.createFramebuffer(this.canvas.width * this.drawBufferSizeMul, this.canvas.height * this.drawBufferSizeMul, [
                //Colors
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA,
                //Material Attributes
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT,
                //Emission
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT,
                //Position
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT,
                //Normal
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT,
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA,
                this.daveShade.RENDERBUFFER_TYPE.DEPTH,
            ]);

            //Our buffers
            this.post0 = this.daveShade.createFramebuffer(this.canvas.width, this.canvas.height, [
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT
            ]);

            this.post1 = this.daveShade.createFramebuffer(this.canvas.width, this.canvas.height, [
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT
            ]);

            this.storeBuffer = this.daveShade.createFramebuffer(this.canvas.width, this.canvas.height, [
                this.daveShade.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT
            ]);
        }
    }

    //This is important, don't forget.
    coffeeEngine.createMainRenderer = () => {
        return new Promise((resolve) => {
            const canvas = document.createElement("canvas");
            new coffeeEngine.rendererClass(canvas, (renderer) => {
                coffeeEngine.renderer = renderer;
                resolve(renderer);
            });
        })
    }
})();
