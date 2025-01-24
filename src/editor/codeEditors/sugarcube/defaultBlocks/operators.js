(function () {
    class operators {
        getInfo() {
            return {
                id: "operators",
                name: editor.language["sugarcube.operators"],
                color1: "#59C059",
                color2: "#48AB48",
                color3: "#389438",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3MC41IiBoZWlnaHQ9IjcwLjUiIHZpZXdCb3g9IjAsMCw3MC41LDcwLjUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDQuNzUwMDMsLTE0NC43NSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjIwLjk5NTE5LDE5OS42Mjc3NWMwLDAgMi4zOTk5Niw1LjM0MjMgNy41NTY4NSw1LjQ3OTg5YzYuNTQ4NTIsMC4xNzQ3MyA3LjAwNzU2LC0zLjIxNzUyIDcuMDA3NTYsLTYuODczNjhjMCwtMTAuMjQ0ODggMCwtMzAuNDYxNjEgMCwtMzYuMDk0M2MwLC0yLjg1NjY1IDIuNDg0MzUsLTcuMjUzNzcgNy41NTAxNiwtNy4yNTM3N2M0LjY0MDkzLDAgOC41MTIxMyw1LjQ2ODgzIDguNTEyMTMsNS40Njg4MyIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDYuNDQ0MzEsMTczLjc2MDEzYzAsMCAtNy41MDA0MywxLjQ1MTA5IC0xMC43NzIxNiwxLjAzNDQ4Yy0zLjM3NDQyLC0wLjQyOTY4IC05LjE3NTc4LC0zLjU3NDU0IC05LjE3NTc4LC0zLjU3NDU0IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMDQuNzUwMDQsMjE1LjI1di03MC41aDcwLjV2NzAuNXoiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNDQuMjM4OTcsMTkwLjMxMjkyaDE0Ljc2NTg1IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI1MS42MjE4OSwxOTcuNjk1ODV2LTE0Ljc2NTg1IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzUuMjQ5OTY1OjM1LjI1MDAwNDk5OTk5OTk5LS0+",
                blocks: [
                    {
                        opcode: "add",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.add"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    {
                        opcode: "sub",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.sub"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    {
                        opcode: "mul",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.mul"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    {
                        opcode: "div",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.div"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    {
                        opcode: "pow",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.pow"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    {
                        opcode: "root",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.root"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 2,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "inverse",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.inverse"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "randomNumber",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.randomNumber"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "notEqual",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: editor.language["sugarcube.operators.block.notEqual"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "0",
                            },
                            B: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "50",
                            },
                        },
                    },
                    {
                        opcode: "lessThan",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: editor.language["sugarcube.operators.block.lessThan"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        },
                    },
                    {
                        opcode: "lessThanEqualTo",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: editor.language["sugarcube.operators.block.lessThanEqualTo"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        },
                    },
                    {
                        opcode: "equalTo",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: editor.language["sugarcube.operators.block.equalTo"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "0",
                            },
                            B: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "50",
                            },
                        },
                    },
                    {
                        opcode: "moreThan",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: editor.language["sugarcube.operators.block.moreThan"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        },
                    },
                    {
                        opcode: "moreThanEqualTo",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: editor.language["sugarcube.operators.block.moreThanEqualTo"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "modulo",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.modulo"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    {
                        opcode: "round",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.round"],
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                    {
                        opcode: "arithmatic",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.operators.block.arithmatic"],
                        arguments: {
                            A: {
                                menu: "operations",
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                        },
                    },
                ],
                menus: {
                    operations: {
                        items: [
                            { text: editor.language["sugarcube.operators.menu.operations.abs"], value: "abs" },
                            { text: editor.language["sugarcube.operators.menu.operations.floor"], value: "floor" },
                            { text: editor.language["sugarcube.operators.menu.operations.ceiling"], value: "ceil" },
                            { text: editor.language["sugarcube.operators.menu.operations.sqrt"], value: "sqrt" },
                            { text: editor.language["sugarcube.operators.menu.operations.sin"], value: "sin" },
                            { text: editor.language["sugarcube.operators.menu.operations.cos"], value: "cos" },
                            { text: editor.language["sugarcube.operators.menu.operations.tan"], value: "tan" },
                            { text: editor.language["sugarcube.operators.menu.operations.asin"], value: "asin" },
                            { text: editor.language["sugarcube.operators.menu.operations.acos"], value: "acos" },
                            { text: editor.language["sugarcube.operators.menu.operations.atan"], value: "atan" },
                            { text: editor.language["sugarcube.operators.menu.operations.ln"], value: "log" },
                            { text: editor.language["sugarcube.operators.menu.operations.log"], value: "log10" },
                            { text: editor.language["sugarcube.operators.menu.operations.ePOW"], value: "ePOW" },
                            { text: editor.language["sugarcube.operators.menu.operations.tenPOW"], value: "tenPOW" },
                        ],
                    },
                },
            };
        }

        add({ A, B }) {
            return sugarcube.cast.toNumber(A) + sugarcube.cast.toNumber(B);
        }

        sub({ A, B }) {
            return sugarcube.cast.toNumber(A) - sugarcube.cast.toNumber(B);
        }

        mul({ A, B }) {
            return sugarcube.cast.toNumber(A) * sugarcube.cast.toNumber(B);
        }

        div({ A, B }) {
            return sugarcube.cast.toNumber(A) / B;
        }

        pow({ A, B }) {
            return Math.pow(sugarcube.cast.toNumber(A), sugarcube.cast.toNumber(B));
        }

        root({ A, B }) {
            return Math.pow(sugarcube.cast.toNumber(B), 1 / sugarcube.cast.toNumber(A));
        }

        randomNumber({ A, B }) {
            A = sugarcube.cast.toNumber(A);
            B = sugarcube.cast.toNumber(B);
            return A + Math.random() * (B - A);
        }

        notEqual({ A, B }) {
            return A != B;
        }

        lessThan({ A, B }) {
            return sugarcube.cast.toNumber(A) < sugarcube.cast.toNumber(B);
        }

        lessThanEqualTo({ A, B }) {
            return sugarcube.cast.toNumber(A) <= sugarcube.cast.toNumber(B);
        }

        equalTo({ A, B }) {
            return A == B;
        }

        moreThan({ A, B }) {
            return sugarcube.cast.toNumber(A) > sugarcube.cast.toNumber(B);
        }

        moreThanEqualTo({ A, B }) {
            return sugarcube.cast.toNumber(A) >= sugarcube.cast.toNumber(B);
        }

        modulo({ A, B }) {
            return sugarcube.cast.toNumber(A) % sugarcube.cast.toNumber(B);
        }

        round({ A }) {
            return Math.round(sugarcube.cast.toNumber(A));
        }

        inverse({ A }) {
            return -sugarcube.cast.toNumber(A);
        }

        arithmatic({ A, B }) {
            switch (A) {
                case "ePOW":
                    return Math.pow(Math.E, sugarcube.cast.toNumber(B));

                case "tenPOW":
                    return Math.pow(10, sugarcube.cast.toNumber(B));

                default:
                    return Math[A](sugarcube.cast.toNumber(B));
            }
        }
    }

    sugarcube.extensionManager.registerExtension(new operators());
})();
