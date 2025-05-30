(function () {
    //appearently debugger is a thing in JS???
    class ext_debugger {
        getInfo() {
            return {
                id: "debugging",
                name: editor.language["sugarcube.debugging"],
                color1: "#29beb8",
                color2: "#44c1bd",
                color3: "#3aa8a4",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3MC41IiBoZWlnaHQ9IjcwLjUiIHZpZXdCb3g9IjAsMCw3MC41LDcwLjUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDQuNzUsLTE0NC43NSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjYxLjkyNDA5LDE3Mi4wOTc1OGw0LjA5MjY5LDQuMDkyNjlsLTkuNDc3ODIsOS40Nzc4MmwtNC4yNzg1LC00LjI3ODVsMS45NTM2NSwtMS45NTM2NWMwLDAgLTcuNjMyOTksLTcuNzc2NTkgLTExLjI3Mjg2LC0xMS40MTY0NmMtMy4zNzY5NywtMy4zNzY5NyAtMTAuMzM5NDQsLTkuMTkwNjEgLTEwLjMzOTQ0LC05LjE5MDYxYzAsMCAxMy4xODc5NCwwLjU1MDg1IDE2LjI5ODk4LDMuNjYxODljMy4xNTg5LDMuMTU4OSAxMS4yMDEwNSwxMS40ODgyNiAxMS4yMDEwNSwxMS40ODgyNnoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMTUuNTU0NTMsMTkyLjQxNjY4YzEuMDM5MjEsLTAuMjQ0MDggMy43MjUxMSwwLjc0MjY0IDQuNTQ0OSwtMC4wNzcxNWM0LjI2OTI4LC00LjI2OTI4IDIzLjEyMDEyLC0yMy4yNjM3MyAyMy4xMjAxMiwtMjMuMjYzNzNsNC41MjM1LDQuNTIzNWwtMjcuNTcxODMsMjcuNTcxODNjMCwwIC00Ljg3NTU1LC00Ljg3NTU1IC01Ljk4OTE0LC01Ljk4OTE0Yy0wLjYyOTU2LC0wLjYyOTU2IDAuMzQ3MiwtMi41MjQ1MSAxLjM3MjQ0LC0yLjc2NTMyeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjYuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjA0Ljc1MDAxLDIxNS4yNXYtNzAuNWg3MC41djcwLjV6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozNS4yNDk5OTUwMDAwMDAwMTozNS4yNTAwMDQ5OTk5OTk5OS0tPg==",
                blocks: [
                    {
                        opcode: "log",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.debugging.block.log"],
                        arguments: {
                            ITEM: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: editor.language["sugarcube.debugging.block.log.defaultValue"],
                            },
                        },
                    },
                    {
                        opcode: "warn",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.debugging.block.warn"],
                        arguments: {
                            ITEM: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: editor.language["sugarcube.debugging.block.warn.defaultValue"],
                            },
                        },
                    },
                    {
                        opcode: "error",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.debugging.block.error"],
                        arguments: {
                            ITEM: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: editor.language["sugarcube.debugging.block.error.defaultValue"],
                            },
                        },
                    },
                ],
            };
        }

        log(args) {
            console.log(args.ITEM);
        }

        warn(args) {
            console.warn(args.ITEM);
        }

        error(args) {
            console.error(args.ITEM);
        }
    }

    sugarcube.extensionManager.registerExtension(new ext_debugger());
})();
