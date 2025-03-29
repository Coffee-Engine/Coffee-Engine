(function () {
    class sounds {

        defaultAudioData = {
            maxDistance: 10000,
            gain: 0,
            playbackRate: 100,
        }

        getInfo() {
            return {
                id: "sounds",
                name: editor.language["sugarcube.sounds"],
                color1: "#cf63cf",
                color2: "#c94fc9",
                color3: "#bd42bd",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny4xMzgxMyIgaGVpZ2h0PSI3Ny4xMzgxMyIgdmlld0JveD0iMCwwLDc3LjEzODEzLDc3LjEzODEzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjQzMDk3LC0xNDEuNDMwOTcpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIwMS40MzA5OCwyMTguNTY5MTF2LTc3LjEzODEzaDc3LjEzODEzdjc3LjEzODEzeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PGcgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNMjE1LjExNDA3LDE5Mi4wNzI3MWMtMS4wMTQ0NCwtNC4wODI1MyAtMi4zODgxOCwtOS42MTEwNCAtMi45NTMyMywtMTEuODg1MDhjLTAuNDg5OTcsLTEuOTcxODYgMS42ODEyNiwtNS43MTY2MSAzLjE0NjA1LC02LjM1ODk1YzEuNTU4ODcsLTAuNjgzNTkgNC44MjY3OCwtMi4xMTY2NCA0LjgyNjc4LC0yLjExNjY0bDUuOTk2OSwyNC4xMzQxMmMwLDAgLTMuMzcwMzUsMC4zNjgwNyAtNS4wMjUwOSwwLjU0ODc5Yy0xLjYxNTE2LDAuMTc2MzkgLTUuMzA3ODksLTEuNTcxNDYgLTUuOTkxNDEsLTQuMzIyMjN6Ii8+PHBhdGggZD0iTTIyNS45OTUzLDE5NS44Nzk3N2wtNS45OTY5LC0yNC4xMzQxMmMwLDAgNi43MDc3MSwtOS41OTg4MSA4Ljg3NjE2LC0xMi43MDE4OGMxLjI1NDI1LC0xLjc5NDg0IDMuMzU3ODQsLTIuNjg2OTkgMy43NjM5NywtMS4wNTI1NGMxLjMzNjAxLDUuMzc2NjggOC41OTYzOSwzNC41OTU1NyA4LjU5NjM5LDM0LjU5NTU3eiIvPjxwYXRoIGQ9Ik0yMzUuMDAzNTgsMTY3LjUwOTI2YzAsMCA3LjI2MDM4LDI5LjIxODkgOC41OTYzOSwzNC41OTU1N2MwLjQwNjEzLDEuNjM0NDYgLTEuODcwMzcsMS44MzA2OCAtMy44MTg4NSwwLjgzMTY2Yy0zLjM2ODY5LC0xLjcyNzE5IC0xMy43ODkxMiwtNy4wNjk5NSAtMTMuNzg5MTIsLTcuMDY5OTVsLTUuOTk2OSwtMjQuMTM0MTJ6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIvPjwvZz48cGF0aCBkPSJNMjQxLjAzNTM5LDE2OC40MjgyNGw5Ljg1NDEsLTE2LjM3MDQ1IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI0Mi45Mzg3MywxNzguODIxMTRsMjAuMDQxNTMsLTQuOTc5OTciIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQ2LjEzNTA1LDE4OC45NTE0NWwxNi4zNzA0NCw5Ljg1NDExIiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNjIuOTgwMjYsMTczLjg0MTE4bC0yMC4wNDE1Myw0Ljk3OTk3IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM4LjU2OTAyNTAwMDAwMDAxOjM4LjU2OTAyNTAwMDAwMDAxLS0+",
                blocks: [
                    {
                        opcode: "playGlobal",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.sounds.block.playGlobal"],
                        arguments: {
                            sound: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType: "Audio",
                            }
                        }
                    },
                    {
                        opcode: "playAtXY",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.sounds.block.playAtXY"],
                        arguments: {
                            sound: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType: "Audio",
                            },
                            x: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            y: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        },
                        filter: ["Node2D"],
                    },
                    {
                        opcode: "playAtXYZ",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.sounds.block.playAtXYZ"],
                        arguments: {
                            sound: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType: "Audio",
                            },
                            x: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            y: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            z: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        },
                        filter: ["Node3D"],
                    },
                    "---",
                    {
                        opcode: "setProperty",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.sounds.block.setProperty"],
                        arguments: {
                            property: {
                                menu: "properties"
                            },
                            value: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                        }
                    },
                    {
                        opcode: "getProperty",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.sounds.block.getProperty"],
                        arguments: {
                            property: {
                                menu: "properties"
                            },
                        }
                    },
                    "---",
                    {
                        opcode: "loadSound",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.sounds.block.loadSound"],
                        arguments: {
                            sound: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType: "Audio",
                            }
                        }
                    },
                    {
                        opcode: "lastPlayedSound",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.sounds.block.lastPlayedSound"]
                    },
                    "---",
                    {
                        opcode: "setPropertyOn",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.sounds.block.setPropertyOn"],
                        arguments: {
                            property: {
                                menu: "properties"
                            },
                            sound: {
                                type: sugarcube.ArgumentType.HOLE,
                                shadow: "sounds_lastPlayedSound"
                            },
                            value: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 10
                            },
                        }
                    },
                    {
                        opcode: "pause",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.sounds.block.pause"],
                        arguments: {
                            sound: {
                                type: sugarcube.ArgumentType.HOLE,
                                shadow: "sounds_lastPlayedSound"
                            },
                        }
                    },
                    {
                        opcode: "resume",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.sounds.block.resume"],
                        arguments: {
                            sound: {
                                type: sugarcube.ArgumentType.HOLE,
                                shadow: "sounds_lastPlayedSound"
                            },
                        }
                    },
                    {
                        opcode: "currentTime",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.sounds.block.currentTime"],
                        arguments: {
                            sound: {
                                type: sugarcube.ArgumentType.HOLE,
                                shadow: "sounds_lastPlayedSound"
                            },
                        }
                    },
                    {
                        opcode: "isPaused",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: editor.language["sugarcube.sounds.block.isPaused"],
                        arguments: {
                            sound: {
                                type: sugarcube.ArgumentType.HOLE,
                                shadow: "sounds_lastPlayedSound"
                            },
                        }
                    },
                ],
                menus: {
                    properties: {
                        items: [
                            {text: "gain", value: "gain"},
                            {text: "range", value: "maxDistance"},
                            {text: "speed", value: "playbackRate"},
                        ],
                        acceptReporters: true
                    }
                },
                fields: {
                    Audio: {
                        acceptReporters: true,
                        editor: "audio_Editor",

                        initilize: "file_Init",
                    }
                },
            };
        }

        //Helpers
        __createPannerNodeAt(x, y, z, target) {
            const pannerNode = new PannerNode(coffeeEngine.audio.context);
            pannerNode.positionX.value = x;
            pannerNode.positionY.value = y;
            pannerNode.positionZ.value = z;

            if (target.AUDIO_DATA) pannerNode.maxDistance.value = target.AUDIO_DATA.maxDistance;

            return pannerNode;
        }

        __createGainNode(target) {
            const gainNode = new GainNode(coffeeEngine.audio.context);
            if (target.AUDIO_DATA) gainNode.gain.value = target.AUDIO_DATA.gain;
            
            return gainNode;
        }

        __simplePlayAudio(sound) {
            return new Promise((resolve, reject) => {
                //If we have an audio object
                if (sound instanceof coffeeEngine.audio.audioObject) {
                    this.lastSound = sound;
                    sound.play();
                    resolve(sound);
                    return;
                }
    
                //If not
                coffeeEngine.audio.playFromProjectFile(sound).then(audioObject => {
                    //Set last sound to be the right object
                    this.lastSound = audioObject;
                    resolve(audioObject);
                }).catch(() => {
                    reject();
                });
            })
        }

        //Sound players (Simple)
        playGlobal({ sound }, { target }) {
            this.__simplePlayAudio(sound).then((audioObject) => {
                if (target.AUDIO_DATA) audioObject.playbackRate = target.AUDIO_DATA.playbackRate / 100;
                //Remove panner
                if (!audioObject.hasAudioEffect("coffee-panner")) audioObject.removeAudioEffect("coffee-panner");

                //Add/Set Gain
                if (!audioObject.hasAudioEffect("coffee-gain")) audioObject.addAudioEffect(this.__createGainNode(target), "coffee-gain");
                else if (target.AUDIO_DATA) audioObject.getAudioEffect("coffee-gain").gain.value = target.AUDIO_DATA.gain;
            });
        }

        playAtXY({ sound, x, y}, { target }) {
            //Simple
            this.__simplePlayAudio(sound).then((audioObject) => {
                //Set our parameters
                if (target.AUDIO_DATA) audioObject.playbackRate = target.AUDIO_DATA.playbackRate / 100;
                //Configure our gain and panner
                if (!audioObject.hasAudioEffect("coffee-gain")) audioObject.addAudioEffect(this.__createGainNode(target), "coffee-gain");
                else if (target.AUDIO_DATA) audioObject.getAudioEffect("coffee-gain").gain.value = target.AUDIO_DATA.gain;

                if (!audioObject.hasAudioEffect("coffee-panner")) audioObject.addAudioEffect(this.__createPannerNodeAt(x, y, 0, target), "coffee-panner");
                else {
                    const effect = audioObject.getAudioEffect("coffee-panner")
                    effect.positionX.value = x;
                    effect.positionY.value = y;
                    effect.positionZ.value = 0;
                    if (target.AUDIO_DATA) effect.maxDistance.value = target.AUDIO_DATA.maxDistance;
                }
            });
        }

        playAtXYZ({ sound, x, y, z, distance }, { target }) {
            //Simple
            this.__simplePlayAudio(sound).then((audioObject) => {
                //Set our parameters
                if (target.AUDIO_DATA) audioObject.playbackRate = target.AUDIO_DATA.playbackRate / 100;

                //Configure our gain and panner
                if (!audioObject.hasAudioEffect("coffee-gain")) audioObject.addAudioEffect(this.__createGainNode(target), "coffee-gain");
                else if (target.AUDIO_DATA) audioObject.getAudioEffect("coffee-gain").gain.value = target.AUDIO_DATA.gain;

                if (!audioObject.hasAudioEffect("coffee-panner")) audioObject.addAudioEffect(this.__createPannerNodeAt(x, y, z, target), "coffee-panner");
                else {
                    const effect = audioObject.getAudioEffect("coffee-panner")
                    effect.positionX.value = x;
                    effect.positionY.value = y;
                    effect.positionZ.value = z;
                    if (target.AUDIO_DATA) effect.maxDistance.value = target.AUDIO_DATA.maxDistance;
                }
            });
        }

        //Our property blocks (Simple)
        setProperty({ property, value }, { target }) {
            //Set up audio data if we don't have it
            if (!target.AUDIO_DATA) target.AUDIO_DATA = {...this.defaultAudioData};
            if (target.AUDIO_DATA[property]) target.AUDIO_DATA[property] = sugarcube.cast.toNumber(value);
        }

        getProperty({ property }, {target}) {
            if (!target.AUDIO_DATA) target.AUDIO_DATA = {...this.defaultAudioData};
            if (target.AUDIO_DATA[property]) return sugarcube.cast.toNumber(target.AUDIO_DATA[property]);

            //Return 0 if property doesn't exist
            return 0;
        }

        //Sound loading
        loadSound({ sound }) {
            return new Promise((resolve) => {
                //If we have an audio object
                if (sound instanceof coffeeEngine.audio.audioObject) {
                    resolve(sound);
                    return;
                }

                //If not
                coffeeEngine.audio.fromProjectFile(sound).then(decoded => {
                    resolve(new coffeeEngine.audio.audioObject(decoded));
                }).catch(() => {
                    resolve();
                });
            });
        }

        //Get the last played sound
        lastPlayedSound() {
            return this.lastSound;
        }

        //For existing sounds
        setPropertyOn({ sound, property, value }, { target }) {
            //Check for audio data and cast our value
            if (!target.AUDIO_DATA) target.AUDIO_DATA = {...this.defaultAudioData};
            value = sugarcube.cast.toNumber(value);

            //Make sure sound exists
            if (!(sound instanceof coffeeEngine.audio.audioObject)) return;

            switch (property) {
                case "gain":
                    sound.getAudioEffect("coffee-gain").gain.value = value;
                    break;

                case "maxDistance":
                    sound.getAudioEffect("coffee-panner").maxDistance.value = Math.abs(value);
                    break;

                case "playbackRate":
                    sound.playbackRate = value / 100;
                    break;
            
                default:
                    break;
            }
        }

        pause({ sound }) {
            if (!(sound instanceof coffeeEngine.audio.audioObject)) return;
            sound.pause();
        }

        resume({ sound }) {
            if (!(sound instanceof coffeeEngine.audio.audioObject)) return;
            sound.resume();
        }

        currentTime({ sound }) {
            if (!(sound instanceof coffeeEngine.audio.audioObject)) return 0;
            return sugarcube.cast.toNumber(sound.currentTime);
        }

        isPaused({ sound }) {
            if (!(sound instanceof coffeeEngine.audio.audioObject)) return false;
            return sugarcube.cast.toBoolean(sound.paused);
        }

        //Our fields
        file_Init(field) {
            field.createBorderRect_();
            field.createTextElement_();
        }

        audio_Editor(field) {
            const newLoadal = new editor.windows.modalFileExplorer(400, 400);

            newLoadal.__moveToTop();

            const bounding = field.borderRect_.getBoundingClientRect();
            newLoadal.x = bounding.x + bounding.width / 2;
            newLoadal.y = bounding.y + bounding.height;
            newLoadal.onFileSelected = (path) => {
                field.value = path;
            };

            //Note that gifs will not be animated, they do come as non animated too. Like PNGs
            newLoadal.acceptTypes = "mp3,ogg,wav";
        }
    }

    sugarcube.extensionManager.registerExtension(new sounds());
})();
