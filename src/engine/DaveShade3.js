/*
                         %@@@@@@@@@@@@@@@+               
                       @@@@##@@@@@@@####@@@              
                     #@@##@@@@@@@@@@@@@@@@               
                     @@##@@=            +.               
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

const DaveShade = {};
(function () {
    //Compile status enum
    DaveShade.COMPILE_STATUS = {
        SUCCESS: 1,
        FAILURE: 0,
    };

    DaveShade.REGEX = {
        ATTRIBUTE: /attribute.*;/g,
    };

    DaveShade.setters = {
        //?Float
        5126: (gl, location, value) => {
            gl.uniform1fv(location, value);
        },
        //?Vec2
        35664: (gl, location, value) => {
            gl.uniform2fv(location, value);
        },
        //?Vec3
        35665: (gl, location, value) => {
            gl.uniform3fv(location, value);
        },
        //?Vec4
        35666: (gl, location, value) => {
            gl.uniform4fv(location, value);
        },

        //?Mat2
        35674: (gl, location, value) => {
            gl.uniformMatrix2fv(location, false, value);
        },

        //?Mat3
        35675: (gl, location, value) => {
            gl.uniformMatrix3fv(location, false, value);
        },

        //?Mat4
        35676: (gl, location, value) => {
            gl.uniformMatrix4fv(location, false, value);
        },

        //?Sampler2D
        35678: (gl, location, value, uniformInfo) => {
            gl.activeTexture(gl[`TEXTURE${uniformInfo.samplerID}`]);
            gl.bindTexture(gl.TEXTURE_2D, value);
            gl.uniform1i(location, uniformInfo.samplerID);
        },

        //?SamplerCube
        35679: (gl, location, value) => {
            gl.uniform1iv(location, value);
        },
    };

    DaveShade.createInstance = (CANVAS) => {
        const daveShadeInstance = {
            CANVAS: CANVAS,
        };

        daveShadeInstance.GL = CANVAS.getContext("webgl2");
        daveShadeInstance.GL_TYPE = "webgl2";
        if (!daveShadeInstance.GL) {
            daveShadeInstance.GL = CANVAS.getContext("webgl");
            daveShadeInstance.GL_TYPE = "webgl";
        }
        const GL = daveShadeInstance.GL;

        daveShadeInstance.decomposeShader = (shaderCode) => {
            return {
                status: DaveShade.COMPILE_STATUS.FAILURE,
            };
        };

        //?Could potentially be better? Maybe less if statement hell.
        daveShadeInstance.clearMemory = (shader) => {
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
                daveShadeInstance.clearMemory(shader);
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
                daveShadeInstance.clearMemory(shader);
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
                daveShadeInstance.clearMemory(shader);
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

                const location = GL.getUniformLocation(shader.program, uniformName);

                shader.uniforms[uniformName] = {
                    location: location,
                    type: uniformInfo.type,
                    isArray: uniformInfo.name.includes("["),
                    "#value": null,

                    set value(value) {
                        shader.uniforms[uniformName]["#value"] = value;
                        DaveShade.setters[uniformInfo.type](GL, location, value, uniformInfo);
                    },
                    get value() {
                        return shader.uniforms[uniformName]["#value"];
                    },
                };

                if (uniformInfo.type == 35678) {
                    shader.uniforms[uniformName].samplerID = shader.textureCount;
                    shader.textureCount += 1;
                }
            }

            //* Grab the attributes
            shader.attributeIndicies = [...Array(GL.getProgramParameter(shader.program, GL.ACTIVE_ATTRIBUTES)).keys()];
            shader.attributes = {};

            //* Loop through the attributes
            shader.attributeIndicies.forEach((attributeID) => {
                //* Lets split the attribute definition
                const attributeDef = GL.getActiveAttrib(shader.program,attributeID);

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

                //* The setter
                shader.attributes[attributeDef.name].set = (newValue) => {
                    GL.bindBuffer(GL.ARRAY_BUFFER, shader.attributes[attributeDef.name].buffer);
                    GL.bufferData(GL.ARRAY_BUFFER, newValue, GL.STATIC_DRAW);
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

            //* The buffer setter! the Big ONE!
            shader.setBuffers = (attributeJSON) => {
                //* Attribute keys. Whoopee
                const attributeKeys = Object.keys(attributeJSON);

                //? Loop through the keys
                for (let keyID = 0; keyID < attributeKeys.length; keyID++) {
                    const key = attributeKeys[keyID];

                    //* if it exists set the attribute
                    if (shader.attributes[key]) {
                        shader.attributes[key].set(attributeJSON[key]);
                    }
                }
            };

            shader.drawFromBuffers = (triAmount) => {
                GL.viewport(0, 0, GL.canvas.width, GL.canvas.height);
                GL.useProgram(shader.program);
                GL.drawArrays(GL.TRIANGLES, 0, triAmount);
            };

            return shader;
        };

        return daveShadeInstance;
    };
})();
