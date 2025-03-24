(function() {
    //Our audioObject, big helper object basically
    coffeeEngine.audio.audioObject = class {
        startTime = 0;
        pauseTime = 0;
        paused = false;

        //Get the current timing
        get currentTime() {
            if (this.paused) return this.pauseTime - this.startTime;
            return this.context.currentTime - this.startTime;
        }

        constructor(decodedAudio) {
            this.context = coffeeEngine.audio.context
            this.bufferSource = this.context.createBufferSource();
            this.bufferSource.buffer = decodedAudio;
            this.bufferSource.connect(this.context.destination);
        }

        start() {
            //get timings correct
            if (this.paused) this.startTime = this.context.currentTime - (this.pauseTime - this.startTime);
            else this.startTime = this.context.currentTime;

            //Set pausing to be appropriate
            this.paused = false;
            this.bufferSource.start();
        }

        pause() {
            //Check to make sure we aren't paused
            if (this.paused) return;

            this.pauseTime = this.context.currentTime;
            this.paused = true;
            this.bufferSource.stop();
        }

        stop() {
            this.paused = false;
            this.bufferSource.stop();
        }
    };
})();