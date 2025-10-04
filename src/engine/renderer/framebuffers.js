(function() {
    coffeeEngine.renderer.createFramebuffers = (renderer, daveshadeInstance) => {
        //Add our draw buffer
        renderer.drawBuffer = daveshadeInstance.createFramebuffer(renderer.canvas.width * renderer.drawBufferSizeMul, renderer.canvas.height * renderer.drawBufferSizeMul, [
            //Colors
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA,
            //Material Attributes
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT,
            //Emission
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT,
            //Position
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT,
            //Normal
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT,
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA,
            daveshadeInstance.RENDERBUFFER_TYPE.DEPTH,
        ]);

        //Yeah
        renderer.postBuffer = 0;
        renderer.usingStore = false;

        //Our buffers
        renderer.post0 = daveshadeInstance.createFramebuffer(renderer.canvas.width, renderer.canvas.height, [
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT
        ]);

        renderer.post1 = daveshadeInstance.createFramebuffer(renderer.canvas.width, renderer.canvas.height, [
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT
        ]);

        renderer.storeBuffer = daveshadeInstance.createFramebuffer(renderer.canvas.width, renderer.canvas.height, [
            daveshadeInstance.RENDERBUFFER_TYPE.TEXTURE_RGBA_FLOAT
        ]);

        //Yippie!
        renderer.swapPost = () => {
            //Swap our post buffers
            renderer.postBuffer++;
            renderer.postBuffer = renderer.postBuffer % 2;
            renderer.usingStore = false;

            renderer[`post${renderer.postBuffer}`].use();
            daveshadeInstance.clear(daveshadeInstance.CLEAR_TARGET.COLOR);
        }

        //Our store buffer
        renderer.swapStore = () => {
            renderer.usingStore = !renderer.usingStore;
            if (!renderer.usingStore) renderer[`post${renderer.postBuffer}`].use();
            else renderer.storeBuffer.use();
            daveshadeInstance.clear(daveshadeInstance.CLEAR_TARGET.COLOR);
        }

        renderer.getPrevStore = () => {
            if (!renderer.usingStore) return renderer.storeBuffer;
            return renderer[`post${renderer.postBuffer}`];
        }

        renderer.getPost = (forcePost) => {
            if (renderer.usingStore && !forcePost) renderer.storeBuffer;
            return renderer[`post${renderer.postBuffer}`];
        }

        renderer.getPrevPost = () => {
            return renderer[`post${(renderer.postBuffer + 1) % 2}`];            
        }

        renderer.resize = (width, height) => {
            //Prevent older devices from dying
            if (width * renderer.drawBufferSizeMul > 2560 || height * renderer.drawBufferSizeMul > 1440) renderer.drawBufferSizeMul = 1;
            else if (width * 2 <= 2560 || height * 2 <= 1440) renderer.drawBufferSizeMul = 2;

            renderer.drawBuffer.resize(width * renderer.drawBufferSizeMul, height * renderer.drawBufferSizeMul);
            renderer.post0.resize(width, height);
            renderer.post1.resize(width, height);
            renderer.storeBuffer.resize(width, height);
        }
    }
})();