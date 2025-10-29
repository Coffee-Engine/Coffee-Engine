/*
                         %@@@@@@@@@@@@@@@+               
                       @@@@##@@@@@@@####@@@              
                     #@@##@@@@@@@@@@@@@@@+               
                     @@##@@=                             
       @@@@@@@@@@@@@@@###@#                              
    @@@@@@@@@@@@@@@@#####@%                              
  -@@@@@@@        @@@@###@@                              
 :@@#@@.            @@%###@@@@                           
 @@#%@               @@#####@@@@@@                       
#@##@@                @###@@@###@@@@@@                   
@@##@:                @@##@-@@@@@@##@@@@@                
@%##@                 @@##@     @@@@@##@@@.              
@@##@                 @@##@+       #@@@##@@              
@@##@=                @@##@          @@###@@             
 @##@@                @##@@           @###@@             
 @@##@%              @@#@@=           @###@@             
  @@#@@@            @@##@           =@@##@@              
   @@@#@@@@     -@@@@###@@@@@@@@@@@@@@#@@@+              
     @@@@@@@@@@@@@@@@@@####%@@@@@@##@@@@@                
        @@@@@@@@@@@# @@@@@@@@@@@@@@@@@         

--===--  Written by : ObviousAlexC / Pinksheep2917  --===--
*/

//Initilize the window object
window.DaveShade = {
    MODULES: [],
    INDICE_IDENTIFIER: "__INDICIES__",
    VERSION: "3.1",
};

//Module Creation
// prettier-ignore
DaveShade.module = class {
    COMPILE_STATUS = {
        SUCCESS: 1,
        FAILURE: 0
    }

    //Regex items
    REGEX = {
        ATTRIBUTE: /attribute.*;/g,
    }

    //Things we might want
    CANVAS = null;
    SHADERS = [];
    BUFFERS = [];
    FRAMEBUFFERS = [];
    ATTRIBUTE_BINDINGS = {};
    POINT_COUNT = 0;

    //Enums set at start time
    RENDER_TYPE = {};
    SETTERS = {};
    SIDE = {};
    FILTERING = {};
    RENDERBUFFER_TYPE = {};
    CUBEMAP_ORDER = [];
    CLEAR_TARGET = {};
    DEPTH_FUNC = {};

    get SUPPORTED() { return true; }
    get PRIORITY() { return 1; }
    get TYPE() { return "GENERIC"; };

    //Private variable for the buffer incrementing system
    _BUFFER_ID = 0;

    createShader(VERTEX, FRAGMENT) { console.error(`"createShader" not defined in module ${this.TYPE}!`) }
    disposeShader(SHADER) { console.error(`"disposeShader" not defined in module ${this.TYPE}!`) }
    useProgram(PROGRAM) { console.error(`"useProgram" not defined in module ${this.TYPE}!`) }
    setUniform(SHADER, UNIFORM, VALUE, NO_SET_PROGRAM) {}

    useZBuffer(FUNC) { console.error(`"useZBuffer" not defined in module ${this.TYPE}!`) }
    cullFace(SIDE) { console.error(`"cullFace" not defined in module ${this.TYPE}!`) }

    renderToCanvas() { console.error(`"renderToCanvas" not defined in module ${this.TYPE}!`) }
    createFramebuffer(WIDTH, HEIGHT, ATTACHMENTS) { console.error(`"createFramebuffer" not defined in module ${this.TYPE}!`) }
    useFramebuffer(FRAMEBUFFER) { console.error(`"createFramebuffer" not defined in module ${this.TYPE}!`) }
    disposeFramebuffer(FRAMEBUFFER) { console.error(`"disposeFramebuffer" not defined in module ${this.TYPE}!`) }
    resizeFramebuffer(FRAMEBUFFER, WIDTH, HEIGHT) { console.error(`"disposeFramebuffer" not defined in module ${this.TYPE}!`) }

    createTexture(DATA, WIDTH, HEIGHT) { console.error(`"createTexture" not defined in module ${this.TYPE}!`) }
    createTextureCube() { console.error(`"createTextureCube" not defined in module ${this.TYPE}!`) }
    createTexture3D() { console.error(`"createTexture3D" not defined in module ${this.TYPE}!`) }

    buffersFromJSON(ATTRIBUTE_JSON) { console.error(`"buffersFromJSON" not defined in module ${this.TYPE}!`) }
    changeBufferData(BUFFER, NEW_DATA, IS_INDICES) { console.error(`"changeBufferData" not defined in module ${this.TYPE}!`) }
    disposeBuffer(BUFFER) { console.error(`"disposeBuffer" not defined in module ${this.TYPE}!`) };

    setBuffer(SHADER, BUFFER_NAME, BUFFER_OBJECT) { console.error(`"setBuffer" not defined in module ${this.TYPE}!`) }
    setBufferRaw(SHADER, BUFFER_NAME, RAW_DATA) { console.error(`"setBufferRaw" not defined in module ${this.TYPE}!`) }

    drawFromBuffers(SHADER, POINT_COUNT, RENDER_TYPE) {}

    dispose() { delete this; }

    viewport(X, Y, WIDTH, HEIGHT) { console.error(`"viewport" not defined in module ${this.TYPE}!`) }
    resize(WIDTH, HEIGHT) { console.error(`"resize" not defined in module ${this.TYPE}!`) }
    clear(TARGET) { console.error(`"clear" not defined in module ${this.TYPE}!`) }

    setup(CANVAS, SETTINGS) { console.warn(`${this.TYPE} doesn't have a "setup" function. Does it exist?`) }
    setupTextureReader(CANVAS, SETTINGS) { console.warn(`${this.TYPE} doesn't have a "setupTextureReader" function. Does it exist?`) }
    readTexture(TEXTURE, X, Y, W, H) {}

    async shaderFromURL(VERTEX, FRAGMENT) {
        if (VERTEX && FRAGMENT) {
            const fetchedVertex = await fetch(VERTEX).then(result => result.text());
            const fetchedFragment = await fetch(FRAGMENT).then(result => result.text());
            return this.createShader(fetchedVertex, fetchedFragment);
        }

        //For single file shaders
        const fetched = await fetch(VERTEX).then(result => result.text());
        return this.createShader(fetched);
    }

    constructor(CANVAS, SETTINGS) {
        //Remove ourselves if canvas doesn't exist
        if (!CANVAS) {
            this.dispose();
            return;
        }

        SETTINGS = SETTINGS || {};
        this.CANVAS = CANVAS;

        //These are seperated for cleanliness
        this.setup(CANVAS, SETTINGS);
        this.setupTextureReader(CANVAS, SETTINGS);
    }
};

//Define data holding classes
DaveShade.shader = class {
    VERTEX = {};
    FRAGMENT = {};
    PROGRAM = null;
    PARENT_MODULE = null;
    USING_INDICES = null;

    UNIFORM_INDICIES = [];
    ACTIVE_UNIFORMS = {};
    UNIFORMS = {};

    ATTRIBUTE_INDICIES = {};
    ATTRIBUTES = {};

    TEXTURE_COUNT = 0;

    //Just compatibility
    get uniforms() {
        return this.UNIFORMS;
    }

    use() {
        this.PARENT_MODULE.useProgram(this.PROGRAM);
    }

    setUniforms(UNIFORM_JSON) {
        //Make sure we are using the program, to my knowledge this is needed for GL-likes
        this.PARENT_MODULE.useProgram(this.PROGRAM);

        //Loop through keys
        for (let key in UNIFORM_JSON) {
            if (!this.uniforms[key]) continue;

            this.PARENT_MODULE.setUniform(this, key, UNIFORM_JSON[key], true);
        }

        //Return this so that we can easily use it again.
        return UNIFORM_JSON;
    }

    setUniform(UNIFORM, VALUE) {
        this.PARENT_MODULE.useProgram(this.PROGRAM);
        this.PARENT_MODULE.setUniform(this, UNIFORM, VALUE, true);
    }

    setBuffers(BUFFER_OBJECT) {
        //Just in-case
        if (!(BUFFER_OBJECT instanceof DaveShade.attributeSet)) {
            this.setBufferRaw(BUFFER_OBJECT);
            return;
        }

        for (let key in BUFFER_OBJECT.ATTRIBUTES) {
            if (!this.ATTRIBUTES[key]) continue;

            this.PARENT_MODULE.setBuffer(this, key, BUFFER_OBJECT.ATTRIBUTES[key]);
        }
    }

    setBufferRaw(RAW_DATA) {
        for (let key in RAW_DATA) {
            if (!this.ATTRIBUTES[key]) continue;

            this.PARENT_MODULE.setBufferRaw(this, key, RAW_DATA[key]);
        }
    }

    drawFromBuffers(POINT_COUNT, RENDER_TYPE) {
        this.PARENT_MODULE.drawFromBuffers(this, POINT_COUNT, RENDER_TYPE);
    }
};

DaveShade.attributeSet = class {
    //Simple one-liner.
    ATTRIBUTES = {};
    PARENT_MODULE = null;

    dispose() {
        for (const key in this.ATTRIBUTES) {
            this.PARENT_MODULE.disposeBuffer(this.ATTRIBUTES[key]);
        }
    }

    setData(NEW_DATA) {
        for (let key in this.ATTRIBUTES) {
            if (NEW_DATA[key]) {
                this.PARENT_MODULE.changeBufferData(this.ATTRIBUTES[key], NEW_DATA[key]);
            }
        }
    }
};

DaveShade.framebuffer = class {
    ATTACHMENTS = [];
    DRAW_BUFFERS = [];

    WIDTH = 0;
    HEIGHT = 0;

    COLOR_ATTACHMENTS = 0;
    PARENT_MODULE = null;

    use() {
        this.PARENT_MODULE.useFramebuffer(this);
    }
    dispose() {
        this.PARENT_MODULE.disposeFramebuffer(this);
    }
    resize(WIDTH, HEIGHT) {
        this.PARENT_MODULE.resizeFramebuffer(this, WIDTH, HEIGHT);
    }

    constructor(FBO) {
        this.FBO = FBO;
    }
};

//Texture class, with compatibility things
DaveShade.texture = class {
    TEXTURE = null;
    get texture() { return this.TEXTURE; }

    TYPE = "TEXTURE2D";

    WIDTH = 0;
    get width() { return this.WIDTH; }

    HEIGHT = 0;
    get height() { return this.HEIGHT; }

    DEPTH = 0;
    get depth() { return this.DEPTH; }

    PARENT_MODULE = null;

    setFiltering(NEW_FILTER, MINIMIZE) {
        this.PARENT_MODULE.setFiltering(this, NEW_FILTER, MINIMIZE);
    }
};

//Now for the base webGL module
DaveShade.webGLModule = class extends DaveShade.module {
    GL_VERSION = 2;
    IN_CANVAS = true;

    // prettier-ignore
    get SUPPORTED() { return (window.WebGLRenderingContext !== undefined); }
    // prettier-ignore
    get PRIORITY() { return 10; }
    // prettier-ignore
    get TYPE() { return "WEBGL";}

    _poachShaderUniforms(SHADER) {
        //* Grab the uniforms
        SHADER.UNIFORM_INDICIES = [ ...Array(this.GL.getProgramParameter(SHADER.PROGRAM, this.GL.ACTIVE_UNIFORMS)).keys() ];
        SHADER.ACTIVE_UNIFORMS = this.GL.getActiveUniforms(SHADER.PROGRAM, SHADER.UNIFORM_INDICIES, this.GL.UNIFORM_TYPE);
        SHADER.TEXTURE_COUNT = 0;

        //* use the program while we assign stuff
        this.GL.useProgram(SHADER.PROGRAM);

        //* Loop through the uniforms
        for (let id = 0; id < SHADER.ACTIVE_UNIFORMS.length; id++) {
            const uniformInfo = this.GL.getActiveUniform(SHADER.PROGRAM, id);
            const uniformName = uniformInfo.name.split("[")[0];
            const isArray = uniformInfo.name.includes("[");

            //For when "this" becomes invalid, AKA through the console
            const module = this;

            //differentiate arrays and
            if (isArray) {
                const arrayLength = uniformInfo.size;
                SHADER.UNIFORMS[uniformName] = [];

                for (let index = 0; index < arrayLength; index++) {
                    const location = this.GL.getUniformLocation(SHADER.PROGRAM, `${uniformName}[${index}]`);

                    SHADER.UNIFORMS[uniformName].push({
                        location: location,
                        type: uniformInfo.type,
                        isArray: isArray,
                        _value: null,

                        set value(value) {
                            module.setUniform(SHADER, `${uniformName}[${index}]`, value);
                        },
                        get value() {
                            return SHADER.UNIFORMS[`${uniformName}[${index}]`]["_value"];
                        },
                    });

                    SHADER.UNIFORMS[`${uniformName}[${index}]`] = {
                        location: location,
                        type: uniformInfo.type,
                        isArray: isArray,
                        _value: null,

                        set value(value) {
                            module.setUniform(SHADER, uniformName, value);
                        },
                        get value() {
                            return SHADER.UNIFORMS[uniformName]["_value"];
                        },
                    };
                }
            } else {
                const location = this.GL.getUniformLocation(SHADER.PROGRAM, uniformName);

                SHADER.UNIFORMS[uniformName] = {
                    location: location,
                    type: uniformInfo.type,
                    isArray: isArray,
                    _value: null,

                    set value(value) {
                        module.setUniform(SHADER, uniformName, value);
                    },
                    get value() {
                        return SHADER.UNIFORMS[uniformName]["_value"];
                    },
                };
            }

            if (uniformInfo.type == 35678) {
                SHADER.UNIFORMS[uniformName].SAMPLER_ID = SHADER.TEXTURE_COUNT;
                SHADER.TEXTURE_COUNT += 1;
            }
        }
    }

    _poachShaderAttributes(SHADER) {
        //* Grab the attributes
        SHADER.ATTRIBUTE_INDICIES = [ ...Array(this.GL.getProgramParameter(SHADER.PROGRAM, this.GL.ACTIVE_ATTRIBUTES)).keys() ];

        //* Loop through the attributes
        SHADER.ATTRIBUTE_INDICIES.forEach((attributeID) => {
            //* Lets split the attribute definition
            const attributeDef = this.GL.getActiveAttrib(SHADER.PROGRAM, attributeID);

            //? could probably conglomerate better?
            SHADER.ATTRIBUTES[attributeDef.name] = {
                type: attributeDef.type,
            };

            //* Attribute Stuff
            SHADER.ATTRIBUTES[attributeDef.name].location = this.GL.getAttribLocation(SHADER.PROGRAM, attributeDef.name);
            this.GL.enableVertexAttribArray(SHADER.ATTRIBUTES[attributeDef.name].location);

            //* Create the buffer
            SHADER.ATTRIBUTES[attributeDef.name].buffer = this.GL.createBuffer();
            this.GL.bindBuffer(this.GL.ARRAY_BUFFER, SHADER.ATTRIBUTES[attributeDef.name].buffer);
            this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(65536), this.GL.STATIC_DRAW);

            //* Assign values dependant on types
            switch (SHADER.ATTRIBUTES[attributeDef.name].type) {
                case this.GL.FLOAT:
                    SHADER.ATTRIBUTES[attributeDef.name].divisions = 1;
                    break;

                case this.GL.FLOAT_VEC2:
                    SHADER.ATTRIBUTES[attributeDef.name].divisions = 2;
                    break;

                case this.GL.FLOAT_VEC3:
                    SHADER.ATTRIBUTES[attributeDef.name].divisions = 3;
                    break;

                case this.GL.FLOAT_VEC4:
                    SHADER.ATTRIBUTES[attributeDef.name].divisions = 4;
                    break;

                default:
                    SHADER.ATTRIBUTES[attributeDef.name].divisions = 1;
                    break;
            }

            const location = SHADER.ATTRIBUTES[attributeDef.name].location;
            const divisions = SHADER.ATTRIBUTES[attributeDef.name].divisions;

            //* The setter legacy (DS2)
            SHADER.ATTRIBUTES[attributeDef.name].setRaw = (newValue) => {
                this.oldAttributes[location] = 0;
                this.GL.bindBuffer(this.GL.ARRAY_BUFFER, SHADER.ATTRIBUTES[attributeDef.name].buffer);
                this.GL.bufferData(this.GL.ARRAY_BUFFER, newValue, this.GL.STATIC_DRAW);
                this.GL.vertexAttribPointer(location, divisions, this.GL.FLOAT, false, 0, 0);
            };

            //* The setter
            SHADER.ATTRIBUTES[attributeDef.name].set = (newValue) => {
                if (this.oldAttributes[location] == newValue.bufferID) return;
                this.oldAttributes[location] = newValue.bufferID;
                this.GL.bindBuffer(this.GL.ARRAY_BUFFER, newValue);
                this.GL.vertexAttribPointer(location, divisions, this.GL.FLOAT, false, 0, 0);
            };

            this.GL.vertexAttribPointer(location, divisions, this.GL.FLOAT, false, 0, 0);
        });
    }

    createShader(VERTEX, FRAGMENT) {
        if (!VERTEX && !FRAGMENT) {
            console.error("Missing VERTEX and FRAGMENT when making shader.");
            return;
        }

        //Decompose if we where only given the first argument
        if (!FRAGMENT) {
            const vertexFunction = DaveShade.findFunctionInGLSL(VERTEX, "vertex");
            const fragmentFunction = DaveShade.findFunctionInGLSL(VERTEX, "fragment");

            if (!vertexFunction || !fragmentFunction) return { status: this.COMPILE_STATUS.FAILURE };

            //Clean vertex stuff from fragment
            FRAGMENT = VERTEX.replace(vertexFunction, "")
                .replace(this.REGEX.ATTRIBUTE, "")
                .replace(fragmentFunction.split("(")[0], "void main");
            
            //Clean fragment stuff from vertex
            VERTEX = VERTEX.replace(fragmentFunction, "").replace(vertexFunction.split("(")[0],
                "void main");
        }

        //Create our shader and add it to the list
        const createdShader = new DaveShade.shader();

        //* Compile the vertex shader
        createdShader.VERTEX.shader = this.GL.createShader(this.GL.VERTEX_SHADER);
        createdShader.VERTEX.src = VERTEX;

        //Set shader source first
        this.GL.shaderSource(createdShader.VERTEX.shader, VERTEX);
        this.GL.compileShader(createdShader.VERTEX.shader);

        //? could potentially be better?
        if (!this.GL.getShaderParameter(createdShader.VERTEX.shader, this.GL.COMPILE_STATUS)) {
            console.error(`shader not compiled!\nclearing memory\nCompile Log\n***\n${this.GL.getShaderInfoLog(createdShader.VERTEX.shader)}\n***`);
            this.disposeShader(createdShader);
            return {
                status: this.COMPILE_STATUS.FAILURE,
            };
        }

        //* Compile the fragment shader
        createdShader.FRAGMENT.shader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
        createdShader.FRAGMENT.src = FRAGMENT;

        //Set shader source first
        this.GL.shaderSource(createdShader.FRAGMENT.shader, FRAGMENT);
        this.GL.compileShader(createdShader.FRAGMENT.shader);

        //? could potentially be better?
        if (!this.GL.getShaderParameter(createdShader.FRAGMENT.shader, this.GL.COMPILE_STATUS)) {
            console.error(`shader not compiled!\nclearing memory\nCompile Log\n***\n${this.GL.getShaderInfoLog(createdShader.FRAGMENT.shader)}\n***`);
            this.disposeShader(createdShader);
            return {
                status: this.COMPILE_STATUS.FAILURE,
            };
        }

        //* Get in the oven frank
        createdShader.PROGRAM = this.GL.createProgram();

        this.GL.attachShader(createdShader.PROGRAM, createdShader.VERTEX.shader);
        this.GL.attachShader(createdShader.PROGRAM, createdShader.FRAGMENT.shader);

        this.GL.linkProgram(createdShader.PROGRAM);

        //? could potentially be better?
        if (!this.GL.getProgramParameter(createdShader.PROGRAM, this.GL.LINK_STATUS)) {
            console.error(`shader not compiled!\nerror in program linking!\nclearing memory\nlink log\n***\n${gl.getProgramInfoLog(createdShader.PROGRAM)}\n***`);
            this.disposeShader(createdShader);
            return {
                status: this.COMPILE_STATUS.FAILURE,
            };
        }

        //Set and find stuff we need before finally returning the created shader
        createdShader.PARENT_MODULE = this;
        this._poachShaderUniforms(createdShader);
        this._poachShaderAttributes(createdShader);
        this.SHADERS.push(createdShader);
        return createdShader;
    }

    disposeShader(SHADER) {
        //*Remove the shader from the list
        if (this.SHADERS.includes(SHADER)) {
            this.SHADERS.splice(this.SHADERS.indexOf(SHADER), 1);
        }

        //*Delete the program and shaders
        if (SHADER.PROGRAM) {
            this.GL.deleteProgram(SHADER.PROGRAM);
        }
        if (SHADER.VERTEX.shader) {
            this.GL.deleteShader(SHADER.VERTEX.shader);
        }
        if (SHADER.FRAGMENT.shader) {
            this.GL.deleteShader(SHADER.FRAGMENT.shader);
        }
    }

    // prettier-ignore
    useProgram(PROGRAM) { this.GL.useProgram(PROGRAM); }

    setUniform(SHADER, UNIFORM, VALUE, NO_SET_PROGRAM) {
        const uniformInfo = SHADER.UNIFORMS[UNIFORM];
        if (Array.isArray(uniformInfo)) {
            //Loop through values
            for (let item in VALUE) {
                if (!uniformInfo[item]) break;

                uniformInfo[item].value = item;
            }

            return;
        }

        if (!NO_SET_PROGRAM) this.useProgram(SHADER.PROGRAM);

        uniformInfo["_value"] = VALUE;
        this.SETTERS[uniformInfo.type](uniformInfo.location, VALUE, uniformInfo);
    }

    useZBuffer(FUNC) {
        //Classic "BOOL"
        switch (typeof FUNC) {
            case "boolean":
                if (FUNC) this.GL.enable(this.GL.DEPTH_TEST);
                else this.GL.disable(this.GL.DEPTH_TEST);

                this.GL.depthFunc(FUNC ? this.GL.LEQUAL : this.GL.NEVER);
                break;

            case "number":
                if (FUNC == this.DEPTH_FUNC.NEVER)
                    this.GL.disable(this.GL.DEPTH_TEST);
                else this.GL.enable(this.GL.DEPTH_TEST);
                this.GL.depthFunc(FUNC);
                break;

            default:
                break;
        }
    }

    cullFace(SIDE) {
        if (typeof SIDE == "undefined") {
            this.GL.disable(this.GL.CULL_FACE);
            return;
        }
        
        if (typeof SIDE != "number") return;

        if (SIDE == 0) {
            this.GL.disable(this.GL.CULL_FACE);
        } else {
            this.GL.enable(this.GL.CULL_FACE);
            this.GL.cullFace(SIDE);
        }
    }

    renderToCanvas() {
        this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, null);
        if (this.GL_VERSION > 1) this.GL.drawBuffers([this.GL.BACK]);
        this.GL.viewport(0, 0, this.CANVAS.width, this.CANVAS.height);

        //Update in canvas status
        this.IN_CANVAS = true;
    }

    createFramebuffer(WIDTH, HEIGHT, ATTACHMENTS) {
        //Create and bind the framebuffer
        const framebuffer = new DaveShade.framebuffer(this.GL.createFramebuffer());
        this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, framebuffer.FBO);

        //Set some wanted values
        framebuffer.WIDTH = WIDTH;
        framebuffer.HEIGHT = HEIGHT;
        framebuffer.PARENT_MODULE = this;

        //Add the attachements
        for (let attID in ATTACHMENTS) {
            framebuffer.ATTACHMENTS.push(ATTACHMENTS[attID](framebuffer));
        }

        for (let drawBufferID = 0; drawBufferID < framebuffer.COLOR_ATTACHMENTS; drawBufferID++) {
            //framebuffer.drawBuffers.push(this.GL.NONE);
            framebuffer.DRAW_BUFFERS.push(this.DRAWBUFFER_MANAGER
                    ? this.DRAWBUFFER_MANAGER[`COLOR_ATTACHMENT${drawBufferID}`]
                    : this.GL[`COLOR_ATTACHMENT${drawBufferID}`]);
        }

        //Push it, use it, return it
        this.FRAMEBUFFERS.push(framebuffer);
        this.useFramebuffer(framebuffer);
        return framebuffer;
    }

    _quickColorBuffer(INTERNAL_FORMAT, FORMAT, TYPE) {
        return (FRAMEBUFFER) => {
            //Make sure our next buffer is even possible!
            if (this.GL_VERSION == 1 && !this.DRAWBUFFER_MANAGER && FRAMEBUFFER.COLOR_ATTACHMENTS > 0 ) {
                console.error("Cannot have multiple draw buffers! There will be graphical glitches!");
                return { resize: () => {} };
            }

            //define our info
            const renderBufferInfo = {
                texture: this.GL.createTexture(), resize: (width, height) => {
                    renderBufferInfo.width = width;
                    renderBufferInfo.height = height;
                    this.GL.bindTexture(this.GL.TEXTURE_2D, renderBufferInfo.texture);
                    this.GL.texImage2D(this.GL.TEXTURE_2D, 0, INTERNAL_FORMAT, width, height, 0, FORMAT, TYPE, null);
                },
                dispose: () => {
                    this.GL.deleteTexture(renderBufferInfo.texture);
                },
            };

            //Size up the render buffer's texture
            renderBufferInfo.resize(FRAMEBUFFER.width, FRAMEBUFFER.height);
            this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MIN_FILTER, this.GL.NEAREST);
            this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MAG_FILTER, this.GL.NEAREST);

            //Get our color attachment
            const attachedBuffer = this.DRAWBUFFER_MANAGER
                ? this.DRAWBUFFER_MANAGER[`COLOR_ATTACHMENT${FRAMEBUFFER.COLOR_ATTACHMENTS}`]
                : this.GL[`COLOR_ATTACHMENT${FRAMEBUFFER.COLOR_ATTACHMENTS}`];
            
            this.GL.framebufferTexture2D(this.GL.FRAMEBUFFER, attachedBuffer, this.GL.TEXTURE_2D, renderBufferInfo.texture, 0);

            //Increment color attachments
            FRAMEBUFFER.COLOR_ATTACHMENTS++;

            return renderBufferInfo;
        };
    }

    useFramebuffer(FRAMEBUFFER) {
        this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, FRAMEBUFFER.FBO);
        //Make sure to use our attachments
        if (this.GL_VERSION > 1) this.GL.drawBuffers(FRAMEBUFFER.DRAW_BUFFERS);
        this.GL.viewport(0, 0, FRAMEBUFFER.WIDTH, FRAMEBUFFER.HEIGHT);

        //Update in canvas status
        this.IN_CANVAS = false;
    }

    disposeFramebuffer(FRAMEBUFFER) {
        FRAMEBUFFER.ATTACHMENTS.forEach((ATTACHMENT) => {
            ATTACHMENT.dispose();
        });

        this.GL.deleteFramebuffer(FRAMEBUFFER.FBO);

        if (this.FRAMEBUFFERS.includes(FRAMEBUFFER)) {
            this.FRAMEBUFFERS.splice(this.FRAMEBUFFERS.indexOf(FRAMEBUFFER), 1);
        }
    }

    resizeFramebuffer(FRAMEBUFFER, WIDTH, HEIGHT) {
        FRAMEBUFFER.ATTACHMENTS.forEach((ATTACHMENT) => { ATTACHMENT.resize(WIDTH, HEIGHT); });

        FRAMEBUFFER.WIDTH = WIDTH;
        FRAMEBUFFER.HEIGHT = HEIGHT;
    }

    createTexture(DATA, WIDTH, HEIGHT) {
        const texture = this.GL.createTexture();
        this.GL.bindTexture(this.GL.TEXTURE_2D, texture);

        if (DATA instanceof Image) {
            this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, DATA);

            this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_WRAP_S, this.GL.CLAMP_TO_EDGE);
            this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_WRAP_T, this.GL.CLAMP_TO_EDGE);
            this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MIN_FILTER, this.GL.LINEAR);

            WIDTH = DATA.width;
            HEIGHT = DATA.height;
        } else {
            this.GL.texImage2D(this.GL.TEXTURE_2D, 0, this.GL.RGBA, WIDTH, HEIGHT, 0, this.GL.RGBA, this.GL.UNSIGNED_BYTE, DATA);

            this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_WRAP_S, this.GL.CLAMP_TO_EDGE);
            this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_WRAP_T, this.GL.CLAMP_TO_EDGE);
            this.GL.texParameteri(this.GL.TEXTURE_2D, this.GL.TEXTURE_MIN_FILTER, this.GL.LINEAR);
        }

        //Create our texture object
        const returnedTextureOBJ = new DaveShade.texture();

        //Settings
        returnedTextureOBJ.TYPE = "TEXTURE2D";
        returnedTextureOBJ.GL_IDENTIFIER = this.GL.TEXTURE_2D;
        returnedTextureOBJ.TEXTURE = texture;
        returnedTextureOBJ.PARENT_MODULE = this;
        returnedTextureOBJ.WIDTH = WIDTH;
        returnedTextureOBJ.HEIGHT = HEIGHT;

        return returnedTextureOBJ;
    }

    createTextureCube(TEXTURES, WIDTH, HEIGHT) {
        if (!Array.isArray(TEXTURES)) return;
        if (TEXTURES.length != 6) return;

        //Create our cubemap
        const texture = this.GL.createTexture();
        this.GL.bindTexture(this.GL.TEXTURE_CUBE_MAP, texture);

        const sizes = [];

        //Loop through our cubemap
        for (let texID in TEXTURES) {
            const data = TEXTURES[texID];
            const target = daveShadeInstance.cubemapOrder[texID];

            //Parse our textures
            if (data instanceof Image) {
                this.GL.texImage2D(target, 0, this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE, data);
                sizes.push({ WIDTH: data.width, HEIGHT: data.height });
            } else {
                this.GL.texImage2D(target, 0, this.GL.RGBA, WIDTH, HEIGHT, 0, this.GL.RGBA, this.GL.UNSIGNED_BYTE, data);
                sizes.push({ WIDTH: WIDTH, HEIGHT: HEIGHT });
            }
        }

        this.GL.texParameteri(this.GL.TEXTURE_CUBE_MAP, this.GL.TEXTURE_WRAP_S, this.GL.CLAMP_TO_EDGE);
        this.GL.texParameteri(this.GL.TEXTURE_CUBE_MAP, this.GL.TEXTURE_WRAP_T, this.GL.CLAMP_TO_EDGE);
        this.GL.texParameteri(this.GL.TEXTURE_CUBE_MAP, this.GL.TEXTURE_MIN_FILTER, this.GL.LINEAR);

        //Create our texture object
        const returnedTextureOBJ = new DaveShade.texture();

        //Settings
        returnedTextureOBJ.TYPE = "CUBEMAP";
        returnedTextureOBJ.GL_IDENTIFIER = this.GL.TEXTURE_CUBE_MAP;
        returnedTextureOBJ.TEXTURE = texture;
        returnedTextureOBJ.SIZES = sizes;
        returnedTextureOBJ.PARENT_MODULE = this;

        return returnedTextureOBJ;
    }

    createTexture3D(DATA, WIDTH, HEIGHT, DEPTH) {
        if (!this.GL_VERSION > 1) return;

        const texture = this.GL.createTexture();
        this.GL.bindTexture(this.GL.TEXTURE_3D, texture);

        //Set our data, if we are using an image make sure the image gets the data
        if (DATA instanceof Image) {
            //Use size or split the data in half
            WIDTH = WIDTH || DATA.height / 2;

            //Set our stuff to be appropriate
            HEIGHT = WIDTH;
            DEPTH = DATA.height / WIDTH;
            WIDTH = DATA.width;

            this.GL.texImage3D(this.GL.TEXTURE_3D, 0, this.GL.RGBA, WIDTH, HEIGHT, DEPTH, 0, this.GL.RGBA, this.GL.UNSIGNED_BYTE, DATA);
        }
        else this.GL.texImage3D(this.GL.TEXTURE_3D, 0, this.GL.RGBA, WIDTH, HEIGHT, DEPTH, 0, this.GL.RGBA, this.GL.UNSIGNED_BYTE, DATA);

        this.GL.texParameteri(this.GL.TEXTURE_3D, this.GL.TEXTURE_WRAP_S, this.GL.CLAMP_TO_EDGE);
        this.GL.texParameteri(this.GL.TEXTURE_3D, this.GL.TEXTURE_WRAP_T, this.GL.CLAMP_TO_EDGE);
        this.GL.texParameteri(this.GL.TEXTURE_3D, this.GL.TEXTURE_WRAP_R, this.GL.CLAMP_TO_EDGE);
        this.GL.texParameteri(this.GL.TEXTURE_3D, this.GL.TEXTURE_MIN_FILTER, this.GL.LINEAR);

        //Create our texture object
        const returnedTextureOBJ = new DaveShade.texture();

        //Settings
        returnedTextureOBJ.TYPE = "TEXTURE3D";
        returnedTextureOBJ.GL_IDENTIFIER = this.GL.TEXTURE_3D;
        returnedTextureOBJ.TEXTURE = texture;
        returnedTextureOBJ.SIZES = sizes;
        returnedTextureOBJ.PARENT_MODULE = this;
        returnedTextureOBJ.WIDTH = WIDTH;
        returnedTextureOBJ.HEIGHT = HEIGHT;
        returnedTextureOBJ.DEPTH = DEPTH;

        return returnedTextureOBJ;
    }

    setFiltering(TEXTURE, NEW_FILTER, MINIMIZE) {
        MINIMIZE = MINIMIZE || false;

        this.GL.bindTexture(TEXTURE.GL_IDENTIFIER, TEXTURE.TEXTURE);

        if (MINIMIZE) this.GL.texParameteri(TEXTURE.GL_IDENTIFIER, this.GL.TEXTURE_MIN_FILTER, NEW_FILTER);
        else this.GL.texParameteri(TEXTURE.GL_IDENTIFIER, this.GL.TEXTURE_MAG_FILTER, NEW_FILTER);
    }

    buffersFromJSON(ATTRIBUTE_JSON) {
        //Check initial typing before continuing, ensures compatibility with every old, and new DS3 version.
        const inputType = typeof ATTRIBUTE_JSON;
        if (!(inputType == "string" || inputType == "object")) {
            console.error(`"buffersFromJSON" detected neither a string, nor an object!\nINPUT\n***\n${ATTRIBUTE_JSON}\n***`);
            return;
        }

        //If we are trying to input a string parse it.
        if (inputType == "string") {
            //Try conversion
            try { ATTRIBUTE_JSON = JSON.parse(ATTRIBUTE_JSON); } 
            catch (error) {
                console.error(`"buffersFromJSON" JSON input is not valid!\nINPUT\n***\n${ATTRIBUTE_JSON}\n***\nERROR\n***${error}\n***`);
                return;
            }
        }

        //Create the attribute set
        const returned = new DaveShade.attributeSet();
        returned.PARENT_MODULE = this;

        //Loop through the keys converting each one
        for (const key in ATTRIBUTE_JSON) {
            //Increment our ID
            this._BUFFER_ID++;

            let element = ATTRIBUTE_JSON[key];
            const buffer = this.GL.createBuffer();
            buffer.bufferID = this._BUFFER_ID;

            //If we have indicies use indicies
            if (key == DaveShade.INDICE_IDENTIFIER) {
                //Convert if we just have a base array
                if (Array.isArray(element)) element = new Int32Array(element.flat(4));

                this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, buffer);
                this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, element, this.GL.STATIC_DRAW);
            } else {
                //Convert if we just have a base array
                if (Array.isArray(element)) element = new Float32Array(element.flat(4));

                this.GL.bindBuffer(this.GL.ARRAY_BUFFER, buffer);
                this.GL.bufferData(this.GL.ARRAY_BUFFER, element, this.GL.STATIC_DRAW);
            }

            //Set the key in the buffer
            returned.ATTRIBUTES[key] = buffer;
        }

        this.BUFFERS.push(returned);
        return returned;
    }

    changeBufferData(BUFFER, NEW_DATA, IS_INDICES) {
        if (IS_INDICES) {
            //Convert if we just have a base array
            if (Array.isArray(NEW_DATA)) NEW_DATA = new Int32Array(NEW_DATA.flat(4));

            this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, BUFFER);
            this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, NEW_DATA, this.GL.STATIC_DRAW);
        }
        else {
            //Convert if we just have a base array
            if (Array.isArray(NEW_DATA)) NEW_DATA = new Float32Array(NEW_DATA.flat(4));

            this.GL.bindBuffer(this.GL.ARRAY_BUFFER, BUFFER);
            this.GL.bufferData(this.GL.ARRAY_BUFFER, NEW_DATA, this.GL.STATIC_DRAW);
        }
    }

    // prettier-ignore
    disposeBuffer(BUFFER) { this.GL.deleteBuffer(BUFFER); }

    setBuffer(SHADER, BUFFER_NAME, BUFFER_OBJECT) {
        //Grab relevant info
        const attributeInfo = SHADER.ATTRIBUTES[BUFFER_NAME];

        //Update info if needed
        if (this.ATTRIBUTE_BINDINGS[attributeInfo.location] == BUFFER_OBJECT.bufferID) return;
        this.ATTRIBUTE_BINDINGS[attributeInfo.location] =BUFFER_OBJECT.bufferID;
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, BUFFER_OBJECT);
        this.GL.vertexAttribPointer(attributeInfo.location, attributeInfo.divisions, this.GL.FLOAT, false, 0, 0);
    }

    setBufferRaw(SHADER, BUFFER_NAME, RAW_DATA) {
        //Grab relevant info
        const attributeInfo = SHADER.ATTRIBUTES[BUFFER_NAME];

        this.ATTRIBUTE_BINDINGS[attributeInfo.location] = 0;
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, attributeInfo.buffer);
        this.GL.bufferData(this.GL.ARRAY_BUFFER, RAW_DATA, this.GL.STATIC_DRAW);
        this.GL.vertexAttribPointer(attributeInfo.location, attributeInfo.divisions, this.GL.FLOAT, false, 0, 0);
    }

    drawFromBuffers(SHADER, POINT_COUNT, RENDER_TYPE) {
        //Make sure we are using the shader
        SHADER.use();

        //Draw using indicies if we are using indicies
        if (!this.USING_INDICIES) this.GL.drawArrays(RENDER_TYPE || this.GL.TRIANGLES, 0, POINT_COUNT);
        else this.GL.drawElements(RENDER_TYPE || this.GL.TRIANGLES, POINT_COUNT, this.GL.UNSIGNED_INT, 0);

        //Increment drawn tri count
        this.POINT_COUNT += POINT_COUNT;
    }

    resize(WIDTH, HEIGHT) {
        this.CANVAS.width = WIDTH;
        this.CANVAS.height = HEIGHT;

        if (this.IN_CANVAS) {
            this.viewport(0, 0, WIDTH, HEIGHT);
        }
    }

    // prettier-ignore
    viewport(X, Y, WIDTH, HEIGHT) { this.GL.viewport(X, Y, WIDTH, HEIGHT); }

    clear(TARGET) {
        if (typeof TARGET != "number") return;

        this.TRI_COUNT = 0;
        this.GL.clear(TARGET);
    }

    // prettier-ignore
    setup(CANVAS, SETTINGS) {
        //Try webGL2 creation first
        this.GL = CANVAS.getContext("webgl2", SETTINGS);
        this.VOA_MANAGER = this.GL;

        //If we fail try webGL1
        if (!this.GL) {
            this.GL = CANVAS.getContext("webgl", SETTINGS);
            this.GL_VERSION = 1;
            
            //Webgl doesn't have native support for VOAs or Multipass Rendering so we add the addon for VOAs, and extra Draw Buffers
            this.VOA_MANAGER = this.GL.getExtension("OES_vertex_array_object");
            this.DRAWBUFFER_MANAGER = this.GL.getExtension("WEBGL_draw_buffers");
        } 
        //Else we add our extensions
        else {
            this.GL_VERSION = 2;
            this.COLORBUFFER_FLOAT = this.GL.getExtension("EXT_color_buffer_float");
            this.FLOAT_BLEND = this.GL.getExtension("EXT_float_blend");
        }

        //Now we set up our variables
        //First clear targets
        this.CLEAR_TARGET.COLOR = this.GL.COLOR_BUFFER_BIT;
        this.CLEAR_TARGET.DEPTH = this.GL.DEPTH_BUFFER_BIT;
        this.CLEAR_TARGET.STENCIL = this.GL.STENCIL_BUFFER_BIT;

        //Face sides
        this.SIDE.FRONT = this.GL.FRONT;
        this.SIDE.BACK = this.GL.BACK;
        this.SIDE.BOTH = this.GL.FRONT_AND_BACK;
        this.SIDE.NEITHER = 0;

        //Depth Functions
        this.DEPTH_FUNC.NEVER = this.GL.NEVER;
        this.DEPTH_FUNC.NOTEQUAL = this.GL.NOTEQUAL;
        this.DEPTH_FUNC.LESS = this.GL.LESS;
        this.DEPTH_FUNC.LEQUAL = this.GL.LEQUAL;
        this.DEPTH_FUNC.EQUAL = this.GL.EQUAL;
        this.DEPTH_FUNC.GEQUAL = this.GL.GEQUAL;
        this.DEPTH_FUNC.GREATER = this.GL.GREATER;
        this.DEPTH_FUNC.ALWAYS = this.GL.ALWAYS;

        //Setters
        
        //We clamp the boolean
        this.SETTERS[this.GL.BOOL] = (LOCATION, VALUE) => { this.GL.uniform1ui(LOCATION, Math.max(Math.min(1, Math.floor(VALUE)), 0)); }

        //Make sure integers are rounded
        this.SETTERS[this.GL.INT] = (LOCATION, VALUE) => { this.GL.uniform1i(LOCATION, Math.floor(VALUE)); }
        this.SETTERS[this.GL.UNSIGNED_INT] = (LOCATION, VALUE) => { this.GL.uniform1ui(LOCATION, Math.floor(VALUE)); }

        //Then the float likes
        this.SETTERS[this.GL.FLOAT] = (LOCATION, VALUE) => { this.GL.uniform1f(LOCATION, VALUE); }
        this.SETTERS[this.GL.FLOAT_VEC2] = (LOCATION, VALUE) => { this.GL.uniform2fv(LOCATION, VALUE); }
        this.SETTERS[this.GL.FLOAT_VEC3] = (LOCATION, VALUE) => { this.GL.uniform3fv(LOCATION, VALUE); }
        this.SETTERS[this.GL.FLOAT_VEC4] = (LOCATION, VALUE) => { this.GL.uniform4fv(LOCATION, VALUE); }
        
        this.SETTERS[this.GL.FLOAT_MAT2] = (LOCATION, VALUE) => { this.GL.uniformMatrix2fv(LOCATION, false, VALUE); }
        this.SETTERS[this.GL.FLOAT_MAT3] = (LOCATION, VALUE) => { this.GL.uniformMatrix3fv(LOCATION, false, VALUE); }
        this.SETTERS[this.GL.FLOAT_MAT4] = (LOCATION, VALUE) => { this.GL.uniformMatrix4fv(LOCATION, false, VALUE); }

        //Finally the textures, these ones are a little more complicated
        this.SETTERS[this.GL.SAMPLER_2D] = (LOCATION, VALUE, UNIFORM_INFO) => {
            this.GL.activeTexture(this.GL[`TEXTURE${UNIFORM_INFO.SAMPLER_ID}`]);
            this.GL.bindTexture(this.GL.TEXTURE_2D, VALUE);
            this.GL.uniform1i(LOCATION, UNIFORM_INFO.SAMPLER_ID);
        }

        this.SETTERS[this.GL.SAMPLER_CUBE] = (LOCATION, VALUE, UNIFORM_INFO) => {
            this.GL.activeTexture(this.GL[`TEXTURE${UNIFORM_INFO.SAMPLER_ID}`]);
            this.GL.bindTexture(this.GL.TEXTURE_CUBE_MAP, VALUE);
            this.GL.uniform1i(LOCATION, UNIFORM_INFO.SAMPLER_ID);
        }

        this.SETTERS[this.GL.SAMPLER_3D] = (LOCATION, VALUE, UNIFORM_INFO) => {
            this.GL.activeTexture(this.GL[`TEXTURE${UNIFORM_INFO.SAMPLER_ID}`]);
            this.GL.bindTexture(this.GL.TEXTURE_3D, VALUE);
            this.GL.uniform1i(LOCATION, UNIFORM_INFO.SAMPLER_ID);
        }

        //Render types
        this.RENDER_TYPE.POINTS = this.GL.POINTS;
        this.RENDER_TYPE.LINE_STRIP = this.GL.LINE_STRIP;
        this.RENDER_TYPE.LINE_LOOP = this.GL.LINE_LOOP;
        this.RENDER_TYPE.LINES = this.GL.LINES;
        this.RENDER_TYPE.TRIANGLE_STRIP = this.GL.TRIANGLE_STRIP;
        this.RENDER_TYPE.TRIANGLE_FAN = this.GL.TRIANGLE_FAN;
        this.RENDER_TYPE.TRIANGLES = this.GL.TRIANGLES;

        //Renderbuffer types
        this.RENDERBUFFER_TYPE.TEXTURE_RGB = this._quickColorBuffer(this.GL.RGB, this.GL.RGB, this.GL.UNSIGNED_BYTE);
        this.RENDERBUFFER_TYPE.TEXTURE_RGBA = this._quickColorBuffer(this.GL.RGBA, this.GL.RGBA, this.GL.UNSIGNED_BYTE);
        if (this.GL_VERSION > 1) {
            this.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT = this._quickColorBuffer(this.GL.RGBA16F, this.GL.RGBA, this.GL.FLOAT);
            this.RENDERBUFFER_TYPE.TEXTURE_R = this._quickColorBuffer(this.GL.R8, this.GL.RED, this.GL.UNSIGNED_BYTE);
            this.RENDERBUFFER_TYPE.TEXTURE_R_FLOAT = this._quickColorBuffer(this.GL.R16F, this.GL.RED, this.GL.FLOAT);
        }
        
        //This one is a wee bit more complex
        this.RENDERBUFFER_TYPE.DEPTH = (FRAMEBUFFER) => {
            //define our info
            const renderBufferInfo = {
                renderBuffer: this.GL.createRenderbuffer(),
                resize: (width, height) => {
                    renderBufferInfo.width = width;
                    renderBufferInfo.height = height;
                    this.GL.bindRenderbuffer(this.GL.RENDERBUFFER, renderBufferInfo.renderBuffer);
                    this.GL.renderbufferStorage(this.GL.RENDERBUFFER, this.GL.DEPTH_COMPONENT16, width, height);
                },
                dispose: () => {
                    this.GL.deleteRenderbuffer(renderBufferInfo.renderBuffer);
                },
            };

            //Resize and attach our buffer
            renderBufferInfo.resize(FRAMEBUFFER.width, FRAMEBUFFER.height);
            this.GL.framebufferRenderbuffer(this.GL.FRAMEBUFFER, this.GL.DEPTH_ATTACHMENT, this.GL.RENDERBUFFER, renderBufferInfo.renderBuffer);

            return renderBufferInfo;
        };

        //Then lets get that cubemap order
        this.CUBEMAP_ORDER = [
            this.GL.TEXTURE_CUBE_MAP_POSITIVE_X,
            this.GL.TEXTURE_CUBE_MAP_POSITIVE_Y,
            this.GL.TEXTURE_CUBE_MAP_POSITIVE_Z,
            this.GL.TEXTURE_CUBE_MAP_NEGATIVE_X,
            this.GL.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            this.GL.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ]

        //Filtering modes
        this.FILTERING.LINEAR = this.GL.LINEAR;
        this.FILTERING.NEAREST = this.GL.NEAREST;
    }

    setupTextureReader(CANVAS, SETTINGS) {
        //? create stuff required to render these temporary textures
        this.TEXTURE_READING_SHADER = this.createShader(
            `precision highp float;
        attribute vec4 a_position;
        attribute vec2 a_texcoord;

        varying vec2 v_texCoord;
        
        void main() {
            gl_Position = a_position;
            v_texCoord = a_texcoord;
        }
        `,
            `precision highp float;
        varying vec2 v_texCoord;

        uniform sampler2D u_texture;
        
        void main() {
            gl_FragColor = texture2D(u_texture, v_texCoord);
        }
        `);

        //? Create the data for the quad
        this.TEXTURE_READING_QUAD = this.buffersFromJSON({
            a_position: new Float32Array([
                1, -1, 0, 1,
                -1, -1, 0, 1,
                1, 1, 0, 1,

                -1, -1, 0, 1,
                -1, 1, 0, 1,
                1, 1, 0, 1
            ]),
            a_texcoord: new Float32Array([
                1, 0,
                0, 0,
                1, 1,

                0, 0,
                0, 1,
                1, 1
            ]),
        });

        this.TEXTURE_READING_BUFFER = this.createFramebuffer(1, 1, [ this.RENDERBUFFER_TYPE.TEXTURE_RGBA ]);

        //? Make sure we are rendering to the canvas!!!
        this.renderToCanvas();
    }

    readTexture(TEXTURE, X, Y, W, H) {
        //Make sure width >= 1
        if (typeof W != "number" || !W) W = 1;
        else W = Math.max(1, W);

        //Make sure height >= 1
        if (typeof H != "number" || !H) H = 1;
        else H = Math.max(1, H);

        //Resize the texture
        this.TEXTURE_READING_BUFFER.resize(TEXTURE.WIDTH, TEXTURE.HEIGHT);
        this.TEXTURE_READING_BUFFER.use();

        //Clear and draw
        this.GL.clear(this.GL.COLOR_BUFFER_BIT);
        this.TEXTURE_READING_SHADER.setUniform("u_texture", TEXTURE.TEXTURE);
        this.TEXTURE_READING_SHADER.setBuffers(this.TEXTURE_READING_QUAD);
        this.TEXTURE_READING_SHADER.drawFromBuffers(6);

        //Then finally get the data
        let output = new Uint8Array(4 * W * H);
        this.GL.readPixels(X, Y, W, H, this.GL.RGBA, this.GL.UNSIGNED_BYTE, output);
        //scale it back down to hopefully save ram
        this.TEXTURE_READING_BUFFER.resize(1, 1);

        return Array.from(output);
    }
};

DaveShade.MODULES.push(DaveShade.webGLModule);

//Finally we are back where we started.
DaveShade.createInstance = (CANVAS, SETTINGS, WANTED_MODULE) => {
    //Try to find the wanted module
    if (WANTED_MODULE) {
        //Search the array to find one
        const found = DaveShade.MODULES.find((module) => module.prototype.TYPE == WANTED_MODULE);

        //If found do a quick check to make sure it is supported
        if (found) {
            if (found.prototype.SUPPORTED) return new found(CANVAS, SETTINGS);
            else
                console.warn(`Module "${WANTED_MODULE}" is not supported! Searching for a supported one.`);
        }
        //If not found continue with a search
        else
            console.warn(`Module "${WANTED_MODULE}" not found! Doing a search.`);
    }

    let bestModule = null;
    let highestPriority = 0;

    //Search for the highest priority module with support
    for (let moduleID in DaveShade.MODULES) {
        const module = DaveShade.MODULES[moduleID];
        if (module.prototype.SUPPORTED) {
            let modulePriority = module.prototype.PRIORITY;
            if (modulePriority > highestPriority) {
                highestPriority = modulePriority;
                bestModule = module;
            }
        }
    }

    //Finally if found create it
    if (bestModule) {
        return new bestModule(CANVAS, SETTINGS);
    }

    console.error("No module is supported!");
};

//A GLSL helper function
DaveShade.findFunctionInGLSL = (glsl, func, type) => {
    type = type || "void";
    func = func || "func";

    //Match out the function
    const matches = glsl.match(RegExp(`(${type})(\\s*)(${func})`));
    if (matches && matches.length > 0) {
        let matcher = matches[0];
        let inFunction = 0;
        let funcCode = "";
        const charIndex = glsl.indexOf(matcher);

        //Loop through every character until we get out of the function
        for (let index = charIndex; index < glsl.length; index++) {
            let char = glsl.charAt(index);
            funcCode += char;

            if (char == "{") {
                inFunction++;
            } else if (char == "}") {
                inFunction--;
                if (inFunction == 0) {
                    //Return our code if we get out of our function
                    return funcCode;
                }
            }
        }
    }

    //Return a blank if we don't have any function
    return "";
};
