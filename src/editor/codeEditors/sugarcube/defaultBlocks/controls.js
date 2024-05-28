(function() {

    class controls {
        getInfo() {
            return {
                id:"controls",
                name:"Controls",
                color1:"#ffab19",
                color2:"#ec9c13",
                color3:"#cf8b17",
                blocks: [
                    {
                        opcode: "onStart",
                        type: sugarcube.BlockType.HAT,
                        text: "on game start",
                    },
                    {
                        opcode: "whenKeyPressed",
                        type: sugarcube.BlockType.HAT,
                        text: "when [key] key pressed",
                        arguments: {
                            "key":{
                                menu: "keys"
                            },
                        }
                    },
                    {
                        opcode: "whenClicked",
                        type: sugarcube.BlockType.HAT,
                        text: "when I'm clicked",
                    },
                    "---",
                    {
                        opcode: "broadcastRecieve",
                        type: sugarcube.BlockType.HAT,
                        text: "when I recieve [message]",
                        arguments: {
                            "message":{
                                menu: "messages"
                            },
                        }
                    },
                    {
                        opcode: "broadcastSend",
                        type: sugarcube.BlockType.COMMAND,
                        text: "broadcast [message]",
                        arguments: {
                            "message":{
                                menu: "messages"
                            },
                        }
                    },
                ],
                menus: {
                    keys: {
                        items:sugarcube.commonKeys
                    },
                    messages: {
                        items:"__getMessages"
                    }
                }
            }
        }

        //Just for a menu
        __getMessages() {
            return sugarcube.broadcasts.concat([{text:"New message",value:"____SUGARCUBE__CREATE__BROADCAST____"}]);
        }
    }

    sugarcube.extensionManager.registerExtension(new controls());
})()