(function () {
    class objects {
        getInfo() {
            return {
                id: "scene",
                name: "Scene",
                color1: "#FF4C4C",
                color2: "#E64444",
                color3: "#C73A3A",
                showColor: true,
                blocks: [
                    {
                        opcode: "getParent",
                        type: sugarcube.BlockType.OBJECT,
                        text: "my parent",
                    },
                    {
                        opcode: "getMyself",
                        type: sugarcube.BlockType.OBJECT,
                        text: "myself",
                    },
                    "---",
                    {
                        opcode: "getName",
                        type: sugarcube.BlockType.REPORTER,
                        text: "name of [object]",
                        arguments: {
                            object: {
                                type: sugarcube.ArgumentType.OBJECT,
                            },
                        },
                    },
                    {
                        opcode: "getChildren",
                        type: sugarcube.BlockType.ARRAY,
                        text: "children of [object]",
                        arguments: {
                            object: {
                                type: sugarcube.ArgumentType.OBJECT,
                            },
                        },
                    },
                    {
                        opcode: "getParentOf",
                        type: sugarcube.BlockType.OBJECT,
                        text: "parent of [object]",
                        arguments: {
                            object: {
                                type: sugarcube.ArgumentType.OBJECT,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "setVariable",
                        type: sugarcube.BlockType.COMMAND,
                        text: "set variable [var] of [object] to [value]",
                        arguments: {
                            var: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "variable",
                            },
                            object: {
                                type: sugarcube.ArgumentType.OBJECT,
                            },
                            value: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "0",
                            },
                        },
                    },
                    {
                        opcode: "getVariable",
                        type: sugarcube.BlockType.REPORTER,
                        text: "variable [var] of [object]",
                        arguments: {
                            var: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "variable",
                            },
                            object: {
                                type: sugarcube.ArgumentType.OBJECT,
                            },
                        },
                    },
                ],
            };
        }
    }

    sugarcube.extensionManager.registerExtension(new objects());
})();
