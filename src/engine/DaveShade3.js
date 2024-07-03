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

----  DAVE SHADE 3.0 IS A OBVIOUS STUDIOS LIBRARY  ----
       Written by : ObviousAlexC / Pinksheep2917
*/

const DaveShade = {};
(function() {
    //Compile status enum
    DaveShade.COMPILE_STATUS = {
        SUCCESS:0,
        FAILURE:0,
    }

    DaveShade.setters = {
        //?Float
        5126: (gl,location,value) => {
            gl.uniform1fv(location, value);
        },
        //?Vec2
        35664: (gl,location,value) => {
            gl.uniform2fv(location, value);
        },
        //?Vec3
        35665: (gl,location,value) => {
            gl.uniform3fv(location, value);
        },
        //?Vec4
        35666: (gl,location,value) => {
            gl.uniform4fv(location, value);
        },

        //?Mat2
        35674: (gl,location,value) => {
            gl.uniformMatrix2fv(location,false,value);
        },
        
        //?Mat3
        35674: (gl,location,value) => {
            gl.uniformMatrix3fv(location,false,value);
        },

        //?Mat4
        35674: (gl,location,value) => {
            gl.uniformMatrix4fv(location,false,value);
        },

    }

    DaveShade.createInstance = (CANVAS) => {
        const daveShadeInstance = {
            CANVAS:CANVAS
        }

        daveShadeInstance.GL = CANVAS.getContext("webgl2");
        daveShadeInstance.GL_TYPE = "webgl2";
        if (!daveShadeInstance.GL) {
            daveShadeInstance.GL = CANVAS.getContext("webgl");
            daveShadeInstance.GL_TYPE = "webgl";
        }
        const GL = daveShadeInstance.GL;

        daveShadeInstance.decomposeShader = (shaderCode) => {
            return {
                status:DaveShade.COMPILE_STATUS.FAILURE
            }
        }

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
        }

        daveShadeInstance.createShader = (vertex,fragment) => {
            //? If we have a single code shader then decompose it.
            let compileStatus = true;
            if (vertex && !fragment) return daveShadeInstance.decomposeShader(vertex);

            const shader = {};

            //* Compile the vertex shader
            shader.vertex = {
                shader:GL.createShader(GL.VERTEX_SHADER),
                src:vertex
            }
            GL.shaderSource(shader.vertex.shader,vertex);
            GL.compileShader(shader.vertex.shader);

            //? could potentially be better?
            compileStatus = GL.getShaderParameter(shader.vertex.shader, GL.COMPILE_STATUS);
            if (!compileStatus) {
                console.error(`shader not compiled!\nclearing memory\nCompile Log\n***\n${GL.getShaderInfoLog(shader.vertex.shader)}\n***`);
                daveShadeInstance.clearMemory(shader);
                return {
                    status:DaveShade.COMPILE_STATUS.FAILURE
                }
            }

            //* Compile the fragment shader
            shader.fragment = {
                shader:GL.createShader(GL.FRAGMENT_SHADER),
                src:fragment
            }
            GL.shaderSource(shader.fragment.shader,fragment);
            GL.compileShader(shader.fragment.shader);

            //? could potentially be better?
            compileStatus = GL.getShaderParameter(shader.vertex.shader, GL.COMPILE_STATUS);
            if (!compileStatus) {
                console.error(`shader not compiled!\nclearing memory\nCompile Log\n***\n${GL.getShaderInfoLog(shader.vertex.shader)}\n***`);
                daveShadeInstance.clearMemory(shader);
                return {
                    status:DaveShade.COMPILE_STATUS.FAILURE
                }
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
                    status:DaveShade.COMPILE_STATUS.FAILURE
                }
            }

            //* Set the compile status
            shader.status = DaveShade.COMPILE_STATUS.SUCCESS;

            //* Grab the uniforms
            shader.uniformIndicies = [...Array(GL.getProgramParameter(shader.program, GL.ACTIVE_UNIFORMS)).keys()];
            console.log(shader)
            shader.activeUniformIDs = GL.getActiveUniforms(shader.program, shader.uniformIndicies, GL.UNIFORM_TYPE);
            shader.uniforms = {};
            for (let id = 0; id < shader.activeUniformIDs.length; id++) {
                const uniformInfo = GL.getActiveUniform(shader.program,id);
                const location = GL.getUniformLocation(shader.program,uniformInfo.name);

                shader.uniforms[uniformInfo.name] = {
                    location: location,
                    type:uniformInfo.type,
                    "#value":null,

                    set value(value) {
                        shader.uniforms[uniformInfo.name]["#value"] = value;
                        DaveShade.setters[uniformInfo.type](GL,location,value);
                    },
                    get value() {
                        return shader.uniforms[uniformInfo.name]["#value"];
                    }
                };

                console.log(uniformInfo);
            }

            return shader;
        }

        return daveShadeInstance;
    }
})();