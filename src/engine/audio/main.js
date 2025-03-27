(function() {
    coffeeEngine.audio = {
        context: new AudioContext({ latencyHint:"interactive" }),
        storage: {},
        playingTracks: {},

        //Conversion
        fromProjectFile: (src) => {
            return new Promise((resolve, reject) => {
                //If the mesh exists in RAM, load it
                if (coffeeEngine.audio.storage[src]) {
                    resolve(coffeeEngine.audio.storage[src]);
                    return;
                }

                const fileReader = new FileReader();

                //Load the audio
                project
                    .getFile(src)
                    .then((file) => {
                        //when loaded decode and store
                        fileReader.onload = () => {
                            const decoded = coffeeEngine.audio.context.decodeAudioData(fileReader.result);
                            coffeeEngine.audio.storage[src] = decoded;
                            resolve(coffeeEngine.audio.storage[src]);
                        }

                        fileReader.onerror = () => {
                            reject("Audio file not valid?");
                        }

                        fileReader.readAsArrayBuffer(file);
                    })
            });
        },

        __createPannerNodeAt(x, y, z) {
            const pannerNode = new PannerNode(coffeeEngine.audio.context);
            pannerNode.positionX.value = x;
            pannerNode.positionY.value = y;
            pannerNode.positionZ.value = z;

            return pannerNode;
        },
        
        //Play functions
        playDecoded: (decodedAudio, ID) => {
            const audioObject = new coffeeEngine.audio.audioObject(decodedAudio);

            audioObject.COFFEE_ID = ID;
            if (audioObject.COFFEE_ID) coffeeEngine.audio.playingTracks[ID] = audioObject;
            audioObject.discard = () => {
                if (audioObject.COFFEE_ID) {
                    delete audioObject.audio.playingTracks[ID];
                }
            }

            audioObject.start();

            return audioObject;
        },

        //Some other ones
        playFromProjectFile: (src, ID) => {
            //Get our audio first
            return new Promise((resolve, reject) => {
                coffeeEngine.audio.fromProjectFile(src).then((audio) => {
                    resolve(coffeeEngine.audio.playDecoded(audio, ID));
                });
            });
        },

        playFromFileSpatial: (src, ID, position, range) => {
            coffeeEngine.audio.playFromProjectFile(src, ID).then((audioObject) => {
                range = range || 10000;

                const panner = coffeeEngine.audio.__createPannerNodeAt(position.x, position.y, position.z);
                panner.maxDistance = range;

                audioObject.addAudioEffect(panner, "coffee-panner");
            });
        }
    }
})();