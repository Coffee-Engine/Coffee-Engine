//Thin compatibility layer for scratch extensions. Most will probably not work. Api's like cloudlink most likely will though
const Scratch = {
    isCoffeeEngine:true,
    vm: {
        runtime: coffeeEngine.runtime,
        renderer: coffeeEngine.renderer,
        extensionManager: {
            isExtensionLoaded:(id) => {return sugarcube.extensionManager.hasExtension(id)}
        }
    },
    translate: (string) => {
        return string;
    },
    extensions:{
        register:(cls) => {sugarcube.extensionManager.registerExtension(cls)},
        unsandboxed:true,
    },
    TargetType: {},
    BlockType:sugarcube.BlockType,
    ArgumentType:sugarcube.ArgumentType,
}
Scratch.translate.setup = () => {};