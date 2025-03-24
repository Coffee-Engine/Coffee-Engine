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

            return audioObject;
        },

        //Simple, elegant
        playDecodedUntilDone: (decodedAudio, ID) => {
            const audioObject = coffeeEngine.audio.playDecoded(decodedAudio, ID);
            audioObject.addEventListener("ended", ({ natural }) => {
                if (natural) audioObject.discard();
            })
        }
    }
})();