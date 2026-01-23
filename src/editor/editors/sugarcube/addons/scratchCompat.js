//Thin compatibility layer for scratch extensions. Most will probably not work. Api's like cloudlink most likely will though
window.Scratch = {
    isCoffeeEngine: true,
    vm: {
        runtime: coffeeEngine.runtime,
        renderer: coffeeEngine.renderer,
        extensionManager: {
            isExtensionLoaded: (id) => {
                return sugarcube.extensionManager.hasExtension(id);
            },
        },
    },
    translate: (string) => {
        return editor.language[`ext_${string}`] || string;
    },
    extensions: {
        register: (cls) => {
            sugarcube.extensionManager.registerExtension(cls);
        },
        unsandboxed: true,
    },
    TargetType: {},
    BlockType: sugarcube.BlockType,
    ArgumentType: sugarcube.ArgumentType,

    //The can list
    canDownload: () => { return new Promise((resolve) => { resolve(true) })},
    canEmbed: () => { return new Promise((resolve) => { resolve(true) })},
    canFetch: () => { return new Promise((resolve) => { resolve(true) })},
    canGeolocate: () => { return new Promise((resolve) => { resolve(true) })},
    canNotify: () => { return new Promise((resolve) => { resolve(true) })},
    canOpenWindow: () => { return new Promise((resolve) => { resolve(true) })},
    canReadClipboard: () => { return new Promise((resolve) => { resolve(true) })},
    canRecordAudio: () => { return new Promise((resolve) => { resolve(true) })},
    canRecordVideo: () => { return new Promise((resolve) => { resolve(true) })},
    canRedirect: () => { return new Promise((resolve) => { resolve(true) })},
    canScreenshotCamera: () => { return new Promise((resolve) => { resolve(true) })},
    canUnsandbox: () => { return new Promise((resolve) => { resolve(true) })},

    fetch: (url, param) => { return fetch(url, param) }
    //I need to implement download
};
Scratch.translate.setup = () => {};
