(function() {
    //Our audioObject, big helper object basically
    coffeeEngine.audio.audioObject = class {
        startTime = 0;
        pauseTime = 0;
        paused = false;
        naturallyEnded = false;

        events = {
            started: [],
            paused: [],
            ended: [],
        }

        //Get the current timing
        get currentTime() {
            if (this.paused) return this.pauseTime - this.startTime;
            return this.context.currentTime - this.startTime;
        }

        constructor(decodedAudio) {
            this.context = coffeeEngine.audio.context;
            this.decoded = decodedAudio;

            //Attach our end event listener
            const self = this;
            this.endEvent = () => {
                //Handle pausing vs ending
                if (self.paused) self.sendEvent("paused", {});

                //Ending
                self.sendEvent("ended", { natural: self.naturallyEnded });
            };
        }

        createBuffer() {
            if (this.bufferSource) {
                this.stop();
                this.bufferSource.removeEventListener("ended", this.endEvent);
            }

            this.bufferSource = this.context.createBufferSource();
            this.bufferSource.buffer = this.decoded;
            this.bufferSource.connect(this.context.destination);
            this.bufferSource.addEventListener("ended", this.endEvent);
        }

        start() {
            //get timings correct
            this.startTime = this.context.currentTime;

            this.createBuffer();

            //Set pausing to be appropriate
            this.paused = false;
            this.naturallyEnded = true;
            this.sendEvent("started", {});
            this.bufferSource.start();
        }

        resume() {
            //get timings correct
            const start = (this.pauseTime - this.startTime);
            if (this.paused) this.startTime = this.context.currentTime - (this.pauseTime - this.startTime);
            else this.startTime = this.context.currentTime;

            this.createBuffer();

            //Set pausing to be appropriate
            this.paused = false;
            this.naturallyEnded = true;
            this.sendEvent("started", {});
            this.bufferSource.start(0, start);
        }

        pause() {
            //Check to make sure we aren't paused
            if (this.paused) return;

            this.pauseTime = this.context.currentTime;
            this.paused = true;
            this.naturallyEnded = false;
            this.bufferSource.stop();
        }

        stop() {
            this.paused = false;
            this.naturallyEnded = false;
            this.bufferSource.stop();
        }

        //event listeners
        addEventListener(event, func) { 
            if (this.events[event]) {
                //Make sure the event doesn't exist
                if (!this.hasEventListener[event,func]) return;

                this.events[event].push(func);
            }           
        }

        hasEventListener(event, func) {
            //Find if it exists
            if (this.events[event]) {
                return this.events[event].includes(func);
            }
            return false;
        }

        removeEventListener(event, func) {
            if (this.events[event]) {
                //Make sure the event exists
                if (!this.hasEventListener[event,func]) return;

                //Target and remove
                const index = this.events[event].indexOf(func);
                this.events[event].splice(index,1);
            }
        }

        sendEvent(event, data) {
            if (this.events[event]) {
                this.events[event].forEach(func => {
                    func(data);
                });
            }
        }
    };
})();