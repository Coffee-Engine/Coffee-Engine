(function () {
    class strings {
        getInfo() {
            return {
                id: "strings",
                name: "Strings",
                color1: "#419f86",
                color2: "#3d967e",
                color3: "#347f6b",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3MC41IiBoZWlnaHQ9IjcwLjUiIHZpZXdCb3g9IjAsMCw3MC41LDcwLjUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDQuNzUwMDQsLTE0NC43NSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjA0Ljc1MDA1LDIxNS4yNXYtNzAuNWg3MC41djcwLjV6IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjE0LjI5MjgyLDIwNS42MzUzYzAsMCAwLjA5MzgxLC01MS4zOTU3MSAxMS43MjU5OCwtNTEuNDcxNThjMTEuMDk4NjYsLTAuMDcyMzkgMTIuMDgxMyw1MS42NzI2MyAxMi4wODEzLDUxLjY3MjYzIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIzNS4xNjg2MSwxODIuNTcwMTVoLTE3Ljk0NDI5IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI2NS43MDcyNywxOTguNzQ3NjNjMCwwIC0xOS45Nzc4NiwyMy42ODA4NiAtMTkuNDc4NjksLTE5LjAzNTk5YzAuNTA1NCwtNDMuMjUwMzIgMTkuNDc4NjksLTE3LjI2NTIgMTkuNDc4NjksLTE3LjI2NTIiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI3IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozNS4yNDk5NTU6MzUuMjUwMDA0OTk5OTk5OTktLT4=",
                blocks: [
                    {
                        opcode: "length",
                        type: sugarcube.BlockType.REPORTER,
                        text: "length of [A]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                        },
                    },
                    {
                        opcode: "join",
                        type: sugarcube.BlockType.REPORTER,
                        text: "join [A] [B]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                            B: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "banana",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "reverse",
                        type: sugarcube.BlockType.REPORTER,
                        text: "reverse [A]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                        },
                    },
                    {
                        opcode: "repeat",
                        type: sugarcube.BlockType.REPORTER,
                        text: "repeat [A] [B] times",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "replace",
                        type: sugarcube.BlockType.REPORTER,
                        text: "replace [A] in [B] with [C]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                            B: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple banana",
                            },
                            C: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "pear",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "characterAt",
                        type: sugarcube.BlockType.REPORTER,
                        text: "letter [A] of [B]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            B: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                        },
                    },
                    {
                        opcode: "charactersBetween",
                        type: sugarcube.BlockType.REPORTER,
                        text: "letters [A] to [B] of [C]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                            B: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 3,
                            },
                            C: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                        },
                    },
                    {
                        opcode: "split",
                        type: sugarcube.BlockType.ARRAY,
                        text: "split [A] at every [B]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple,banana,pear",
                            },
                            B: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: ",",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "ifThen",
                        type: sugarcube.BlockType.REPORTER,
                        text: "if [A] then [B] else [C]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.BOOLEAN,
                            },
                            B: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                            C: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "banana",
                            },
                        },
                    },
                    {
                        opcode: "convertToCase",
                        type: sugarcube.BlockType.REPORTER,
                        text: "make [A] [B]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                            B: {
                                menu: "caseTypes",
                            },
                        },
                    },
                    {
                        opcode: "includes",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: "[A] contains [B]",
                        arguments: {
                            A: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "apple",
                            },
                            B: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "a",
                            },
                        },
                    },
                ],
                menus: {
                    caseTypes: {
                        items: ["uppercase", "lowercase", "title-case"],
                    },
                },
            };
        }

        length({ A }) {
            return sugarcube.cast.toString(A).length;
        }

        join({ A, B }) {
            return sugarcube.cast.toString(A) + sugarcube.cast.toString(B);
        }

        reverse({ A }) {
            return sugarcube.cast.toString(A).split("").reverse().join("");
        }

        repeat({ A, B }) {
            return sugarcube.cast.toString(A).repeat(sugarcube.cast.toNumber(B));
        }

        replace({ A, B, C }) {
            return sugarcube.cast.toString(B).replaceAll(sugarcube.cast.toString(A), sugarcube.cast.toString(C));
        }

        characterAt({ A, B }) {
            return sugarcube.cast.toString(B).charAt(sugarcube.cast.toNumber(A) - 1) || "";
        }

        charactersBetween({ A, B, C }) {
            return sugarcube.cast.toString(C).substring(sugarcube.cast.toNumber(A) - 1, sugarcube.cast.toNumber(B));
        }

        split({ A, B }) {
            return sugarcube.cast.toString(A).split(sugarcube.cast.toString(B));
        }

        ifThen({ A, B, C }) {
            return sugarcube.cast.toBoolean(A) ? sugarcube.cast.toString(B) : sugarcube.cast.toString(C);
        }

        convertToCase({ A, B }) {
            A = sugarcube.cast.toString(A);

            switch (B) {
                case "uppercase":
                    return A.toUpperCase();

                case "lowercase":
                    return A.toLowerCase();

                case "title-case":
                    return A.replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });

                default:
                    return A;
            }
        }

        includes({ A, B }) {
            return sugarcube.cast.toString(A).includes(sugarcube.cast.toString(B));
        }
    }

    sugarcube.extensionManager.registerExtension(new strings());
})();
