(function() {
    coffeeEngine.renderer.createFramebuffers = (renderer, daveshadeInstance) => {
        //Add our draw buffer
        renderer.drawBuffer = daveshadeInstance.createFramebuffer(renderer.canvas.width * renderer.drawBufferSizeMul, renderer.canvas.height * renderer.drawBufferSizeMul, [
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

        //Yeah
        renderer.postBuffer = 0;
        renderer.post0 = daveshadeInstance.createFramebuffer(renderer.canvas.width, renderer.canvas.height, [
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT
        ]);

        renderer.post1 = daveshadeInstance.createFramebuffer(renderer.canvas.width, renderer.canvas.height, [
            DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT
        ]);

        //Yippie!
        renderer.swapPost = () => {
            //Swap our post buffers
            renderer.postBuffer++;
            renderer.postBuffer = renderer.postBuffer % 2;

            renderer[`post${renderer.postBuffer}`].use();
            renderer.daveshade.clear(renderer.daveshade.GL.COLOR_BUFFER_BIT);
        }

        renderer.getPost = () => {
            return renderer[`post${renderer.postBuffer}`];
        }

        renderer.getPrevPost = () => {
            return renderer[`post${(renderer.postBuffer + 1) % 2}`];            
        }

        renderer.resize = (width, height) => {
            renderer.drawBuffer.resize(width * renderer.drawBufferSizeMul, height * renderer.drawBufferSizeMul);
            renderer.post0.resize(width, height);
            renderer.post1.resize(width, height);
        }
    }
})();