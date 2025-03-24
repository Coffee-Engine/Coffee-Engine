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

        playDecoded: (decodedAudio, ID) => {
            const audioObject = new coffeeEngine.audio.audioObject(decodedAudio);

            bufferSource.COFFEE_ID = ID;
            if (bufferSource.COFFEE_ID) coffeeEngine.audio.playingTracks[ID] = bufferSource;
            bufferSource.discard = () => {
                if (bufferSource.COFFEE_ID) {
                    delete coffeeEngine.audio.playingTracks[ID];
                }
            }

            return bufferSource;
        },
        playDecodedUntilDone: (decodedAudio, ID) => {
            const myTrack = coffeeEngine.audio.playDecoded(decodedAudio, ID);
        }
    }
})();