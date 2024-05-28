(function() {

    class events {
        getInfo() {
            return {
                id:"events",
                name:"Events",
                color1:"#ffbf00",
                color2:"#cc9900",
                color3:"#e6ac00",
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
            return sugarcube.broadcasts.concat(["New message"]);
        }
    }

    sugarcube.extensionManager.registerExtension(new events());
})()