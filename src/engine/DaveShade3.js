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

window.DaveShade = {};
(function () {
    //Compile status enum
    DaveShade.COMPILE_STATUS = {
        SUCCESS: 1,
        FAILURE: 0,
    };

    DaveShade.IndiceIdent = "__INDICIES__";

    DaveShade.REGEX = {
        ATTRIBUTE: /attribute.*;/g,
    };

    DaveShade.setters = {
        //?Boolean
        35670: (GL, location, value) => {
            GL.uniform1ui(location, Math.floor(value));
        },

        //?Int
        5124: (GL, location, value) => {
            GL.uniform1i(location, Math.floor(value));
        },

        //?Unsigned Int
        5125: (GL, location, value) => {
            GL.uniform1ui(location, Math.floor(value));
        },

        //?Float
        5126: (GL, location, value) => {
            GL.uniform1f(location, value);
        },
        //?Vec2
        35664: (GL, location, value) => {
            GL.uniform2fv(location, value);
        },
        //?Vec3
        35665: (GL, location, value) => {
            GL.uniform3fv(location, value);
        },
        //?Vec4
        35666: (GL, location, value) => {
            GL.uniform4fv(location, value);
        },

        //?Mat2
        35674: (GL, location, value) => {
            GL.uniformMatrix2fv(location, false, value);
        },

        //?Mat3
        35675: (GL, location, value) => {
            GL.uniformMatrix3fv(location, false, value);
        },

        //?Mat4
        35676: (GL, location, value) => {
            GL.uniformMatrix4fv(location, false, value);
        },

        //?Sampler2D
        35678: (GL, location, value, uniformInfo) => {
            GL.activeTexture(GL[`TEXTURE${uniformInfo.samplerID}`]);
            GL.bindTexture(GL.TEXTURE_2D, value);
            GL.uniform1i(location, uniformInfo.samplerID);
        },

        //?SamplerCube
        35680: (GL, location, value) => {
            GL.activeTexture(GL[`TEXTURE${uniformInfo.samplerID}`]);
            GL.bindTexture(GL.TEXTURE_CUBE_MAP, value);
            GL.uniform1i(location, uniformInfo.samplerID);
        },

        //?Sampler3D
        35679: (GL, location, value) => {
            GL.activeTexture(GL[`TEXTURE${uniformInfo.samplerID}`]);
            GL.bindTexture(GL.TEXTURE_3D, value);
            GL.uniform1i(location, uniformInfo.samplerID);
        },
    };

    DaveShade.renderTypes = {
        LINES: 1,
        TRIANGLES: 4,
    };

    DaveShade.side = {
        FRONT:0,
        BACK:1
    }

    DaveShade.EZAttachColorBuffer = (GL, framebufferInfo, dsInfo, renderBufferInfo) => {
        //Size up the render buffer's texture
        renderBufferInfo.resize(framebufferInfo.width, framebufferInfo.height);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST);

        //Get our color attachment
        const attachedBuffer = dsInfo.DRAWBUFFER_MANAGER ? dsInfo.DRAWBUFFER_MANAGER[`COLOR_ATTACHMENT${framebufferInfo.colorAttachments}`] : GL[`COLOR_ATTACHMENT${framebufferInfo.colorAttachments}`];
        GL.framebufferTexture2D(GL.FRAMEBUFFER, attachedBuffer, GL.TEXTURE_2D, renderBufferInfo.texture, 0);
        framebufferInfo.colorAttachments += 1;
    };

    DaveShade.RENDERBUFFER_TYPES = {
        TEXTURE_RGB: (GL, framebufferInfo, dsInfo) => {
            //Make sure our next buffer is even possible!
            if (dsInfo.GL_TYPE != "webgl2" && !dsInfo.DRAWBUFFER_MANAGER && framebufferInfo.colorAttachments > 0) {
                console.error("Cannot have multiple draw buffers! There will be graphical glitches!");
                return { resize: () => {} };
            }
            //define our info
            const renderBufferInfo = {
                texture: GL.createTexture(),
                resize: (width, height) => {
                    renderBufferInfo.width = width;
                    renderBufferInfo.height = height;
                    GL.bindTexture(GL.TEXTURE_2D, renderBufferInfo.texture);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, width, height, 0, GL.RGB, GL.UNSIGNED_BYTE, null);
                },
                dispose: () => {
                    GL.deleteTexture(renderBufferInfo.texture);
                },
            };

            //Attach the buffer
            DaveShade.EZAttachColorBuffer(GL, framebufferInfo, dsInfo, renderBufferInfo);

            return renderBufferInfo;
        },

        TEXTURE_RGBA: (GL, framebufferInfo, dsInfo) => {
            //Make sure our next buffer is even possible!
            if (dsInfo.GL_TYPE != "webgl2" && !dsInfo.DRAWBUFFER_MANAGER && framebufferInfo.colorAttachments > 0) {
                console.error("Cannot have multiple draw buffers! There will be graphical glitches!");
                return { resize: () => {} };
            }

            //define our info
            const renderBufferInfo = {
                texture: GL.createTexture(),
                resize: (width, height) => {
                    renderBufferInfo.width = width;
                    renderBufferInfo.height = height;
                    GL.bindTexture(GL.TEXTURE_2D, renderBufferInfo.texture);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, width, height, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
                },
                dispose: () => {
                    GL.deleteTexture(renderBufferInfo.texture);
                },
            };

            //Attach the buffer
            DaveShade.EZAttachColorBuffer(GL, framebufferInfo, dsInfo, renderBufferInfo);

            return renderBufferInfo;
        },

        TEXTURE_RGBA_FLOAT: (GL, framebufferInfo, dsInfo) => {
            //Make sure we are in webGL2
            if (dsInfo.GL_TYPE != "webgl2") return DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA(GL, framebufferInfo, dsInfo);

            //define our info
            const renderBufferInfo = {
                texture: GL.createTexture(),
                resize: (width, height) => {
                    renderBufferInfo.width = width;
                    renderBufferInfo.height = height;
                    GL.bindTexture(GL.TEXTURE_2D, renderBufferInfo.texture);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA16F, width, height, 0, GL.RGBA, GL.FLOAT, null);
                },
                dispose: () => {
                    GL.deleteTexture(renderBufferInfo.texture);
                },
            };

            //Attach the buffer
            DaveShade.EZAttachColorBuffer(GL, framebufferInfo, dsInfo, renderBufferInfo);

            return renderBufferInfo;
        },

        TEXTURE_R: (GL, framebufferInfo, dsInfo) => {
            //Make sure we are in webGL2
            if (dsInfo.GL_TYPE != "webgl2") return DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGB(GL, framebufferInfo, dsInfo);

            //define our info
            const renderBufferInfo = {
                texture: GL.createTexture(),
                resize: (width, height) => {
                    renderBufferInfo.width = width;
                    renderBufferInfo.height = height;
                    GL.bindTexture(GL.TEXTURE_2D, renderBufferInfo.texture);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.R8, width, height, 0, GL.RED, GL.UNSIGNED_BYTE, null);
                },
                dispose: () => {
                    GL.deleteTexture(renderBufferInfo.texture);
                },
            };

            //Attach the buffer
            DaveShade.EZAttachColorBuffer(GL, framebufferInfo, dsInfo, renderBufferInfo);

            return renderBufferInfo;
        },

        TEXTURE_R_FLOAT: (GL, framebufferInfo, dsInfo) => {
            //Make sure we are in webGL2
            if (dsInfo.GL_TYPE != "webgl2") return DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGB(GL, framebufferInfo, dsInfo);

            //define our info
            const renderBufferInfo = {
                texture: GL.createTexture(),
                resize: (width, height) => {
                    renderBufferInfo.width = width;
                    renderBufferInfo.height = height;
                    GL.bindTexture(GL.TEXTURE_2D, renderBufferInfo.texture);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.R16F, width, height, 0, GL.RED, GL.FLOAT, null);
                },
                dispose: () => {
                    GL.deleteTexture(renderBufferInfo.texture);
                },
            };

            //Attach the buffer
            DaveShade.EZAttachColorBuffer(GL, framebufferInfo, dsInfo, renderBufferInfo);

            return renderBufferInfo;
        },

        DEPTH: (GL, framebufferInfo, dsInfo) => {
            //Make sure we are in webGL2
            let attachedData = [GL.R32F, GL.RED, GL.FLOAT];
            if (dsInfo.GL_TYPE != "webgl2") attachedData = [GL.RGB, GL.RGB, GL.UNSIGNED_BYTE];

            //define our info
            const renderBufferInfo = {
                renderBuffer: GL.createRenderbuffer(),
                resize: (width, height) => {
                    renderBufferInfo.width = width;
                    renderBufferInfo.height = height;
                    GL.bindRenderbuffer(GL.RENDERBUFFER, renderBufferInfo.renderBuffer);
                    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, width, height);
                },
                dispose: () => {
                    GL.deleteRenderbuffer(renderBufferInfo.renderBuffer);
                },
            };

            //Resize and attach our buffer
            renderBufferInfo.resize(framebufferInfo.width, framebufferInfo.height);
            GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, renderBufferInfo.renderBuffer);

            return renderBufferInfo;
        },
    };

    DaveShade.createInstance = (CANVAS, SETTINGS) => {
        const daveShadeInstance = {
            CANVAS: CANVAS,
            SHADERS: [],
            FRAMEBUFFERS: [],
            oldAttributes: {}
        };

        if (SETTINGS.blendFunc) {
            daveShadeInstance.blendFunc = SETTINGS.blendFunc;
        }

        daveShadeInstance.GL = CANVAS.getContext("webgl2", SETTINGS);
        daveShadeInstance.GL_TYPE = "webgl2";
        daveShadeInstance.VOA_MANAGER = daveShadeInstance.GL;
        if (!daveShadeInstance.GL) {
            daveShadeInstance.GL = CANVAS.getContext("webgl", SETTINGS);
            daveShadeInstance.GL_TYPE = "webgl";
            //Webgl doesn't have native support for VOAs or Multipass Rendering so we add the addon for VOAs, and extra Draw Buffers
            daveShadeInstance.VOA_MANAGER = daveShadeInstance.GL.getExtension("OES_vertex_array_object");
            daveShadeInstance.DRAWBUFFER_MANAGER = daveShadeInstance.GL.getExtension("WEBGL_draw_buffers");
        } else {
            daveShadeInstance.COLORBUFFER_FLOAT = daveShadeInstance.GL.getExtension("EXT_color_buffer_float");
            daveShadeInstance.FLOAT_BLEND = daveShadeInstance.GL.getExtension("EXT_float_blend");
        }
        const GL = daveShadeInstance.GL;

        if (daveShadeInstance.blendFunc) {
            GL.enable(GL.BLEND);
            GL.blendEquation(GL[daveShadeInstance.blendFunc[0]]);
            GL.blendFunc(GL[daveShadeInstance.blendFunc[1]], GL[daveShadeInstance.blendFunc[2]]);
            GL.pixelStorei(GL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        }

        //*When we need to split the shader into 2 parts due to it being in a single file. good for keeping storage sizes down
        daveShadeInstance.decomposeShader = (shaderCode) => {
            return {
                status: DaveShade.COMPILE_STATUS.FAILURE,
            };
        };

        //?Could potentially be better? Maybe less if statement hell.
        daveShadeInstance.clearShaderFromMemory = (shader) => {
            //*Remove the shader from the list
            if (daveShadeInstance.SHADERS.includes(shader)) {
                daveShadeInstance.SHADERS.splice(daveShadeInstance.SHADERS.indexOf(shader), 1);
            }

            //*Delete the program and shaders
            if (shader.program) {
                GL.deleteProgram(shader.program);
            }
            if (shader.vertex) {
                GL.deleteShader(shader.vertex.shader);
            }
            if (shader.fragment) {
                GL.deleteShader(shader.fragment.shader);
            }
        };

        daveShadeInstance.createShader = (vertex, fragment) => {
            //? If we have a single code shader then decompose it.
            let compileStatus = true;
            if (vertex && !fragment) return daveShadeInstance.decomposeShader(vertex);

            const shader = {};

            //* Compile the vertex shader
            shader.vertex = {
                shader: GL.createShader(GL.VERTEX_SHADER),
                src: vertex,
            };
            GL.shaderSource(shader.vertex.shader, vertex);
            GL.compileShader(shader.vertex.shader);

            //? could potentially be better?
            compileStatus = GL.getShaderParameter(shader.vertex.shader, GL.COMPILE_STATUS);
            if (!compileStatus) {
                console.error(`shader not compiled!\nclearing memory\nCompile Log\n***\n${GL.getShaderInfoLog(shader.vertex.shader)}\n***`);
                daveShadeInstance.clearShaderFromMemory(shader);
                return {
                    status: DaveShade.COMPILE_STATUS.FAILURE,
                };
            }

            //* Compile the fragment shader
            shader.fragment = {
                shader: GL.createShader(GL.FRAGMENT_SHADER),
                src: fragment,
            };
            GL.shaderSource(shader.fragment.shader, fragment);
            GL.compileShader(shader.fragment.shader);

            //? could potentially be better?
            compileStatus = GL.getShaderParameter(shader.vertex.shader, GL.COMPILE_STATUS);
            if (!compileStatus) {
                console.error(`shader not compiled!\nclearing memory\nCompile Log\n***\n${GL.getShaderInfoLog(shader.vertex.shader)}\n***`);
                daveShadeInstance.clearShaderFromMemory(shader);
                return {
                    status: DaveShade.COMPILE_STATUS.FAILURE,
                };
            }

            compileStatus = GL.getShaderInfoLog(shader.vertex.shader);
            if (compileStatus.length > 0) {
                console.error(`shader not compiled!\nclearing memory\nCompile Log\n***\n${compileStatus}\n***`);
                daveShadeInstance.clearShaderFromMemory(shader);
                return {
                    status: DaveShade.COMPILE_STATUS.FAILURE,
                };
            }

            compileStatus = GL.getShaderInfoLog(shader.fragment.shader);
            if (compileStatus.length > 0) {
                console.error(`shader not compiled!\nclearing memory\nCompile Log\n***\n${compileStatus}\n***`);
                daveShadeInstance.clearShaderFromMemory(shader);
                return {
                    status: DaveShade.COMPILE_STATUS.FAILURE,
                };
            }

            //* Get in the oven frank
            shader.program = GL.createProgram();

            GL.attachShader(shader.program, shader.vertex.shader);
            GL.attachShader(shader.program, shader.fragment.shader);

            GL.linkProgram(shader.program);

            //? could potentially be better?
            compileStatus = GL.getShaderParameter(shader.vertex.shader, GL.COMPILE_STATUS);
            if (!compileStatus) {
                console.error(`shader not compiled!\nerror in program creation!\nclearing memory\nCompile Log\n***\n${GL.getShaderInfoLog(shader.vertex.shader)}\n***`);
                daveShadeInstance.clearShaderFromMemory(shader);
                return {
                    status: DaveShade.COMPILE_STATUS.FAILURE,
                };
            }

            //* Set the compile status
            shader.status = DaveShade.COMPILE_STATUS.SUCCESS;

            //* Grab the uniforms
            shader.uniformIndicies = [...Array(GL.getProgramParameter(shader.program, GL.ACTIVE_UNIFORMS)).keys()];
            shader.activeUniformIDs = GL.getActiveUniforms(shader.program, shader.uniformIndicies, GL.UNIFORM_TYPE);
            shader.uniforms = {};
            shader.textureCount = 0;

            //* use the program while we assign stuff
            GL.useProgram(shader.program);

            //* Loop through the uniforms
            for (let id = 0; id < shader.activeUniformIDs.length; id++) {
                const uniformInfo = GL.getActiveUniform(shader.program, id);
                const uniformName = uniformInfo.name.split("[")[0];
                const isArray = uniformInfo.name.includes("[");

                //differentiate arrays and
                if (isArray) {
                    const arrayLength = uniformInfo.size;
                    shader.uniforms[uniformName] = [];

                    for (let index = 0; index < arrayLength; index++) {
                        const location = GL.getUniformLocation(shader.program, `${uniformName}[${index}]`);

                        shader.uniforms[uniformName].push({
                            location: location,
                            type: uniformInfo.type,
                            isArray: isArray,
                            "#value": null,

                            set value(value) {
                                GL.useProgram(shader.program);
                                shader.uniforms[uniformName]["#value"] = value;
                                DaveShade.setters[uniformInfo.type](GL, location, value, uniformInfo);
                            },
                            get value() {
                                return shader.uniforms[uniformName]["#value"];
                            },
                        });
                    }
                } else {
                    const location = GL.getUniformLocation(shader.program, uniformName);

                    shader.uniforms[uniformName] = {
                        location: location,
                        type: uniformInfo.type,
                        isArray: isArray,
                        "#value": null,

                        set value(value) {
                            GL.useProgram(shader.program);
                            shader.uniforms[uniformName]["#value"] = value;
                            DaveShade.setters[uniformInfo.type](GL, location, value, uniformInfo);
                        },
                        get value() {
                            return shader.uniforms[uniformName]["#value"];
                        },
                    };
                }

                if (uniformInfo.type == 35678) {
                    uniformInfo.samplerID = shader.textureCount;
                    shader.textureCount += 1;
                }
            }

            //* Grab the attributes
            shader.attributeIndicies = [...Array(GL.getProgramParameter(shader.program, GL.ACTIVE_ATTRIBUTES)).keys()];
            shader.attributes = {};

            //* Loop through the attributes
            shader.attributeIndicies.forEach((attributeID) => {
                //* Lets split the attribute definition
                const attributeDef = GL.getActiveAttrib(shader.program, attributeID);

                //? could probably conglomerate better?
                shader.attributes[attributeDef.name] = {
                    type: attributeDef.type,
                };

                //* Attribute Stuff
                shader.attributes[attributeDef.name].location = GL.getAttribLocation(shader.program, attributeDef.name);
                GL.enableVertexAttribArray(shader.attributes[attributeDef.name].location);

                //* Create the buffer
                shader.attributes[attributeDef.name].buffer = GL.createBuffer();
                GL.bindBuffer(GL.ARRAY_BUFFER, shader.attributes[attributeDef.name].buffer);
                GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(65536), GL.STATIC_DRAW);

                //* The setter legacy (DS2)
                shader.attributes[attributeDef.name].setRaw = (newValue) => {
                    daveShadeInstance.oldAttributes[attributeDef.name] = 0;
                    GL.bindBuffer(GL.ARRAY_BUFFER, shader.attributes[attributeDef.name].buffer);
                    GL.bufferData(GL.ARRAY_BUFFER, newValue, GL.STATIC_DRAW);
                    GL.vertexAttribPointer(shader.attributes[attributeDef.name].location, shader.attributes[attributeDef.name].divisions, GL.FLOAT, false, 0, 0);
                };

                //* The setter
                shader.attributes[attributeDef.name].set = (newValue) => {
                    if (daveShadeInstance.oldAttributes[attributeDef.name] == newValue.bufferID) return;
                    daveShadeInstance.oldAttributes[attributeDef.name] = newValue.bufferID;
                    GL.bindBuffer(GL.ARRAY_BUFFER, newValue);
                    GL.vertexAttribPointer(shader.attributes[attributeDef.name].location, shader.attributes[attributeDef.name].divisions, GL.FLOAT, false, 0, 0);
                };

                //* Assign values dependant on types
                switch (shader.attributes[attributeDef.name].type) {
                    case 5126:
                        shader.attributes[attributeDef.name].divisions = 1;
                        break;

                    case 35664:
                        shader.attributes[attributeDef.name].divisions = 2;
                        break;

                    case 35665:
                        shader.attributes[attributeDef.name].divisions = 3;
                        break;

                    case 35666:
                        shader.attributes[attributeDef.name].divisions = 4;
                        break;

                    default:
                        shader.attributes[attributeDef.name].divisions = 1;
                        break;
                }

                GL.vertexAttribPointer(shader.attributes[attributeDef.name].location, shader.attributes[attributeDef.name].divisions, GL.FLOAT, false, 0, 0);
            });

            //* The buffer setter! the Legacy ONE!
            shader.setBuffersRaw = (attributeJSON) => {
                //? Loop through the keys
                shader.usingIndices = false;
                for (let key in attributeJSON) {
                    //* if it exists set the attribute
                    if (key == DaveShade.IndiceIdent) {
                        //Do nothing
                        continue;
                    }
                    if (shader.attributes[key]) {
                        shader.attributes[key].setRaw(attributeJSON[key]);
                    }
                }
            };

            //* The buffer setter! the Big ONE!
            shader.setBuffers = (attributeJSON) => {
                //? Loop through the keys
                shader.usingIndices = false;
                for (let key in attributeJSON) {
                    //* if it exists set the attribute
                    if (key == DaveShade.IndiceIdent) {
                        const newValue = attributeJSON[key];
                        shader.usingIndices = true;

                        //Make sure we don't already have the indice bound
                        if (daveShadeInstance.oldAttributes[DaveShade.IndiceIdent] == newValue.bufferID) return;
                        daveShadeInstance.oldAttributes[DaveShade.IndiceIdent] = newValue.bufferID;
                        GL.bindBuffer(GL.ARRAY_BUFFER, newValue);
                    }
                    else if (shader.attributes[key]) {
                        shader.attributes[key].set(attributeJSON[key]);
                    }
                }
            };

            shader.drawFromBuffers = (triAmount, renderMode) => {
                GL.useProgram(shader.program);

                //Draw using indicies if we are using indicies
                if (!shader.usingIndices) GL.drawArrays(renderMode || GL.TRIANGLES, 0, triAmount);
                else GL.drawElements(renderMode || GL.TRIANGLES, triAmount, GL.UNSIGNED_INT, 0);

                //Increment drawn tri count
                daveShadeInstance.triCount += triAmount;
            };

            shader.dispose = () => {
                daveShadeInstance.clearShaderFromMemory(shader);
            };

            //*Add it to the list of shaders to dispose of when the instance no longer exists.
            daveShadeInstance.SHADERS.push(shader);

            return shader;
        };

        daveShadeInstance.useZBuffer = (use) => {
            daveShadeInstance.GL.enable(daveShadeInstance.GL.DEPTH_TEST);
            daveShadeInstance.GL.depthFunc(use ? daveShadeInstance.GL.LEQUAL : daveShadeInstance.GL.NEVER);
        };

        daveShadeInstance.cullFace = (face) => {
            switch (face) {
                case DaveShade.side.BACK:
                    GL.enable(GL.CULL_FACE);
                    GL.cullFace(GL.BACK);                    
                    break;

                case DaveShade.side.FRONT:
                    GL.enable(GL.CULL_FACE);
                    GL.cullFace(GL.FRONT);
                    break;
            
                default:
                    GL.disable(GL.CULL_FACE);
                    break;
            }
        }

        //For going back to canvas rendering
        daveShadeInstance.renderToCanvas = () => {
            GL.bindFramebuffer(GL.FRAMEBUFFER, null);
            if (daveShadeInstance.GL_TYPE == "webgl2") GL.drawBuffers([GL.BACK]);
            GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);
        };

        daveShadeInstance.createTexture = (data, width, height) => {
            const texture = daveShadeInstance.GL.createTexture();
            daveShadeInstance.GL.bindTexture(daveShadeInstance.GL.TEXTURE_2D, texture);

            if (data instanceof Image) {
                daveShadeInstance.GL.texImage2D(daveShadeInstance.GL.TEXTURE_2D, 0, daveShadeInstance.GL.RGBA, daveShadeInstance.GL.RGBA, daveShadeInstance.GL.UNSIGNED_BYTE, data);

                daveShadeInstance.GL.texParameteri(daveShadeInstance.GL.TEXTURE_2D, daveShadeInstance.GL.TEXTURE_WRAP_S, daveShadeInstance.GL.CLAMP_TO_EDGE);
                daveShadeInstance.GL.texParameteri(daveShadeInstance.GL.TEXTURE_2D, daveShadeInstance.GL.TEXTURE_WRAP_T, daveShadeInstance.GL.CLAMP_TO_EDGE);
                daveShadeInstance.GL.texParameteri(daveShadeInstance.GL.TEXTURE_2D, daveShadeInstance.GL.TEXTURE_MIN_FILTER, daveShadeInstance.GL.LINEAR);

                width = data.width;
                height = data.height;
            } else {
                daveShadeInstance.GL.texImage2D(daveShadeInstance.GL.TEXTURE_2D, 0, daveShadeInstance.GL.RGBA, width, height, 0, daveShadeInstance.GL.RGBA, daveShadeInstance.GL.UNSIGNED_BYTE, data);
            }

            return { texture: texture, width: width, height: height };
        };

        //Framebuffer stuff
        daveShadeInstance.createFramebuffer = (width, height, attachments) => {
            const framebuffer = {
                buffer: GL.createFramebuffer(),
                attachments: [],
                drawBuffers: [],
                width: width,
                height: height,
                colorAttachments: 0,
            };

            //Our frame buffer binding stuff
            GL.bindFramebuffer(GL.FRAMEBUFFER, framebuffer.buffer);
            framebuffer.use = () => {
                GL.bindFramebuffer(GL.FRAMEBUFFER, framebuffer.buffer);
                //Make sure to use our attachments
                if (daveShadeInstance.GL_TYPE == "webgl2") GL.drawBuffers(framebuffer.drawBuffers);
                GL.viewport(0, 0, framebuffer.width, framebuffer.height);
            };

            //Easy removal
            framebuffer.dispose = () => {
                framebuffer.attachments.forEach((attachement) => {
                    attachement.dispose();
                });
                GL.deleteFramebuffer(framebuffer.buffer);

                if (daveShadeInstance.FRAMEBUFFERS.includes(shader)) {
                    daveShadeInstance.FRAMEBUFFERS.splice(daveShadeInstance.FRAMEBUFFERS.indexOf(framebuffer), 1);
                }
            };

            //Easy resizing
            framebuffer.resize = (width, height) => {
                framebuffer.attachments.forEach((attachement) => {
                    attachement.resize(width, height);
                });

                framebuffer.width = width;
                framebuffer.height = height;
            };

            //Add the attachements
            for (let attID in attachments) {
                framebuffer.attachments.push(attachments[attID](GL, framebuffer, daveShadeInstance));
            }

            for (let drawBufferID = 0; drawBufferID < framebuffer.colorAttachments; drawBufferID++) {
                //framebuffer.drawBuffers.push(GL.NONE);
                framebuffer.drawBuffers.push(daveShadeInstance.DRAWBUFFER_MANAGER ? daveShadeInstance.DRAWBUFFER_MANAGER[`COLOR_ATTACHMENT${drawBufferID}`] : GL[`COLOR_ATTACHMENT${drawBufferID}`]);
            }

            //Then add and finalize the creation
            daveShadeInstance.FRAMEBUFFERS.push(framebuffer);
            GL.bindFramebuffer(GL.FRAMEBUFFER, framebuffer.buffer);
            return framebuffer;
        };

        daveShadeInstance.dispose = () => {
            daveShadeInstance.SHADERS.forEach((shader) => {
                daveShadeInstance.clearShaderFromMemory(shader);
            });

            delete daveShadeInstance.GL;
            if (daveShadeInstance.CANVAS.parentElement) {
                daveShadeInstance.CANVAS.parentElement.removeChild(daveShadeInstance.CANVAS);
            }
            delete daveShadeInstance.CANVAS;
        };

        daveShadeInstance.clear = (bufferBits) => {
            daveShadeInstance.triCount = 0;
            daveShadeInstance.GL.clear(bufferBits);
        };

        daveShadeInstance.bufferID = 0;
        daveShadeInstance.buffersFromJSON = (attributeJSON) => {
            const returned = {};
            for (const key in attributeJSON) {
                //Increment our ID
                daveShadeInstance.bufferID++;

                const element = attributeJSON[key];
                const buffer = daveShadeInstance.GL.createBuffer();
                buffer.bufferID = daveShadeInstance.bufferID;

                //If we have indicies use indicies
                if (key == DaveShade.IndiceIdent) {
                    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
                    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, element, GL.STATIC_DRAW);
                }
                else {
                    GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
                    GL.bufferData(GL.ARRAY_BUFFER, element, GL.STATIC_DRAW);
                }

                returned[key] = buffer;
            }

            return returned;
        };

        //* Our texture reader
        daveShadeInstance.textureReadingBuffer = daveShadeInstance.createFramebuffer(1,1,[DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA]);

        //? create stuff required to render these temporary textures
        daveShadeInstance.textureReadingShader = daveShadeInstance.createShader(`precision highp float;
        attribute vec4 a_position;
        attribute vec2 a_texCoord;

        varying vec2 v_texCoord;
        
        void main() {
            gl_Position = a_position;
            v_texCoord = a_texCoord;
        }
        `,`precision highp float;
        varying vec2 v_texCoord;

        uniform sampler2D u_texture;
        
        void main() {
            gl_FragColor = texture2D(u_texture, v_texCoord);
        }
        `);

        //? Create the data for the quad
        daveShadeInstance.textureReadingQuad = daveShadeInstance.buffersFromJSON({
            a_position: new Float32Array(
                [
                    -1,-1,0,1,
                    -1,1,0,1,
                    1,-1,0,1,
                    -1,1,0,1,
                    1,-1,0,1,
                    1,1,0,1,
                ]
            ),
            a_texCoord: new Float32Array(
                [
                    0,1,
                    0,0,
                    1,1,
                    0,0,
                    1,1,
                    1,0,
                ]
            )
        });
        
        //? the actual read function
        daveShadeInstance.readTexturePixel = (texture,x,y) => {
            //Resize the texture
            daveShadeInstance.textureReadingBuffer.resize(texture.width,texture.height);
            daveShadeInstance.textureReadingBuffer.use();
            
            //Clear and draw
            daveShadeInstance.GL.clear(daveShadeInstance.GL.COLOR_BUFFER_BIT);
            daveShadeInstance.textureReadingShader.uniforms.u_texture.value = texture.texture;
            daveShadeInstance.textureReadingShader.setBuffers(daveShadeInstance.textureReadingQuad);
            daveShadeInstance.textureReadingShader.drawFromBuffers(6);

            //Then finally get the data
            let output = new Uint8Array(4);
            daveShadeInstance.GL.readPixels(x,y,1,1,daveShadeInstance.GL.RGBA, daveShadeInstance.GL.UNSIGNED_BYTE, output);
            //scale it back down to hopefully save ram
            daveShadeInstance.textureReadingBuffer.resize(1,1);

            return Array.from(output);
        }

        return daveShadeInstance;
    };  

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
})();
