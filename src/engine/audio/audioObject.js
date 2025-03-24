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
            this.bufferSource = this.context.createBufferSource();
            this.bufferSource.buffer = decodedAudio;
            this.bufferSource.connect(this.context.destination);

            //Attach our end event listener
            const self = this;
            this.bufferSource.addEventListener("ended", () => {
                //Handle pausing vs ending
                if (self.paused) self.sendEvent("paused", {});

                //Ending
                self.sendEvent("ended", { natural: self.naturallyEnded });
            });
        }

        start() {
            //get timings correct
            if (this.paused) this.startTime = this.context.currentTime - (this.pauseTime - this.startTime);
            else this.startTime = this.context.currentTime;

            //Set pausing to be appropriate
            this.paused = false;
            this.naturallyEnded = true;
            self.sendEvent("started", {});
            this.bufferSource.start();
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