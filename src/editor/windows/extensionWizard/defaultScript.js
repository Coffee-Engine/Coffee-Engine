(function() {
    editor.extensionTemplates = {
        Node: () => {
            return `class node extends coffeeEngine.getNode("Node") 
{
    ready() {}
    update(deltaTime) {}
    draw(drawID) {}
}

coffeeEngine.extensionRemovalListener(EXT_ID, () => {
    //${editor.language["editor.window.extensionWizard.cleanupComment"]}
    coffeeEngine.deregisterNode("MyNode");
});

coffeeEngine.registerNode(node, "MyNode", "Node");`
        },

        EngineScript: (extensionID, loadedText) => {
            return `//${editor.language["editor.window.extensionWizard.engineText"]}
console.log("${loadedText}");

coffeeEngine.extensionRemovalListener(EXT_ID, () => {
    //${editor.language["editor.window.extensionWizard.cleanupComment"]}
});`;
        },

        EditorScript: (extensionID, loadedText) => {
            return `//${editor.language["editor.window.extensionWizard.editorText"]}
console.log("${loadedText}")

coffeeEngine.extensionRemovalListener(EXT_ID, () => {
    //${editor.language["editor.window.extensionWizard.cleanupComment"]}
});`;
        },

        SugarcubeBlocks: (sanitizedID, name) => {
            return `class myExtension {
    getInfo() {
        return {
                id: "${sanitizedID}",
                name: "${name}",
                blocks: [
                    {
                        opcode: "myOpcode",
                        type: sugarcube.BlockType.COMMAND,
                        text: "${editor.language["editor.window.extensionWizard.defaultBlock"]}"
                    }
                ],
                menus: {},
                fields: {},
                mutators: {},
                contextMenus: {}
        }
    }

    myOpcode(args, util) {
        console.log(coffeeEngine.timer);
    }
}

coffeeEngine.extensionRemovalListener(EXT_ID, () => {
    //${editor.language["editor.window.extensionWizard.cleanupComment"]}
    if (sugarcube.extensionManager.hasExtension("${sanitizedID}")) sugarcube.extensionManager.removeExtension("${sanitizedID}");
});
    
sugarcube.extensionManager.registerExtension(new myExtension());`;
        },

        Window: () => {
            return `// ${editor.language["editor.window.extensionWizard.defaultWindow"]}
class window extends editor.windows.base {
    init(Content) {}
    dispose() {}
    resized() {}
    merged(origin) {}
}

coffeeEngine.extensionRemovalListener(EXT_ID, () => {
    //${editor.language["editor.window.extensionWizard.cleanupComment"]}
    editor.windows.__Serialization.deregister("MyWindow");
});

editor.windows.__Serialization.register(window, "MyWindow");`;
        }
    }
})();