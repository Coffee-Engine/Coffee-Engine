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
    coffeeEngine.deregisterNode("MyNode");
});

coffeeEngine.registerNode(node, "MyNode", "Node");`
        },

        EngineScript: (extensionID, loadedText) => {
            return `//${editor.language["editor.window.extensionWizard.engineText"]}\nconsole.log("${loadedText}")`;
        },

        EditorScript: (extensionID, loadedText) => {
            return `//${editor.language["editor.window.extensionWizard.editorText"]}\nconsole.log("${loadedText}")`;
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
    if (sugarcube.extensionManager.hasExtension("${sanitizedID}")) sugarcube.extensionManager.removeExtension("${sanitizedID}");
});
    
sugarcube.extensionManager.registerExtension(myExtension)`;
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
    editor.windows.__Serialization.deregister("MyWindow");
});

editor.windows.__Serialization.register(window, "MyWindow");`;
        }
    }
})();