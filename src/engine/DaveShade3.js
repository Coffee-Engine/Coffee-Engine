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

    DaveShade.createInstance = (canvas) => {
        const GL = canvas.getContext("webgl2") || canvas.getContext("webgl");

        const daveShadeInstance = {
            CANVAS:CANVAS,
            GL:GL
        }

        daveShadeInstance.decomposeShader = (shaderCode) => {
        
        }

        //?Could potentially be better? Maybe less if statement hell.
        daveShadeInstance.clearMemory = (shader) => {
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
                console.error(`shader not compiled! clearing memory\nCompile Log\n***\n${GL.getShaderInfoLog(shader.vertex.shader)}\n***`);
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
                console.error(`shader not compiled! clearing memory\nCompile Log\n***\n${GL.getShaderInfoLog(shader.vertex.shader)}\n***`);
                daveShadeInstance.clearMemory(shader);
                return {
                    status:DaveShade.COMPILE_STATUS.FAILURE
                }
            }

            //* Get in the oven frank
            shader.program = GL.createProgram();

            GL.attachShader(shader.program, shader.vertex.shader);
            GL.attachShader(shader.program, shader.fragment.shader);
        }

        return daveShadeInstance;
    }
})();