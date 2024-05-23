(function() {

    const icons = {
        turnLeft:"data:image/png;base64,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",
        turnRight:"data:image/png;base64,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"
    };

    class motion {
        getInfo() {
            return {
                id:"motion",
                name:"Motion",
                color1:"#4c97ff",
                color2:"#3373cc",
                color3:"#4280d7",
                blocks: [
                    {
                        opcode: "movesteps",
                        type: sugarcube.BlockType.COMMAND,
                        text: "move [steps] steps",
                        arguments: {
                            "steps":{
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    {
                        opcode: "turnright",
                        type: sugarcube.BlockType.COMMAND,
                        text: "turn [icon] [degrees] degrees on the [axis] axis",
                        arguments: {
                            "icon":{
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: icons.turnRight
                            },
                            "degrees":{
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            "axis":{
                                menu: "direction"
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "gotoxyz",
                        type: sugarcube.BlockType.COMMAND,
                        text: "go to x:[x] y:[y] z:[z]",
                        arguments: {
                            "x":{
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            "y":{
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            "z":{
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                ],
                menus: {
                    direction: {
                        items:[
                            "yaw",
                            "pitch",
                            "roll"
                        ]
                    }
                }
            }
        }
    }

    sugarcube.extensionManager.registerExtension(new motion());
})()