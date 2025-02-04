(function () {
    class objects {
        getInfo() {
            return {
                id: "scene",
                name: editor.language["sugarcube.scene"],
                color1: "#FF4C4C",
                color2: "#E64444",
                color3: "#C73A3A",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3MC41IiBoZWlnaHQ9IjcwLjUiIHZpZXdCb3g9IjAsMCw3MC41LDcwLjUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDQuNzUwMDEsLTE0NC43NSkiPjxnIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTIwNC43NTAwMiwyMTUuMjV2LTcwLjVoNzAuNXY3MC41eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIxNy43OTk5OCwxNTguNDYxNzFjMCwwIDAsLTEuOTQwNDkgMCwtMi45MDQyMWMwLC0wLjk1NTExIDEuMzM2NzIsLTIuODUyNTQgMi40NDEzMSwtMi44NTI1NGMxLjQ4MzM0LDAgNS40ODMwOCwwIDguMiwwYzEuNTU2NTYsMCAyLjY5MjA2LDIuMDY1ODQgMi42OTIwNiwzLjA1MjU0YzAsMC45Mjg3IDAsMi43MDQyMSAwLDIuNzA0MjF6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjE3Ljc5OTk3LDIwNC4zNTc0OWMwLC0xLjA0ODQ5IDAsLTIuODE5MjEgMCwtMi44MTkyMWgxMy4zMzMzN2MwLDAgMCwyLjAzNzQ0IDAsMy4wMTkyMWMwLDAuOTM0ODUgLTEuMTQ1OSwyLjczNzU1IC0yLjY5MjA0LDIuNzM3NTVjLTIuNDUwOTYsMCAtNS45MDc3LDAgLTcuNCwwYy0xLjM3OTI0LDAgLTMuMjQxMzIsLTIuMTMxNzcgLTMuMjQxMzIsLTIuOTM3NTV6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjE0Ljg4MzMzLDE5NS45NTc0OWMwLC04LjIwMzIyIDAsLTI4LjgwNTEyIDAsLTMyLjhjMCwtMS4zMTU0IDAuOTgxODksLTIuNDkwODMgMS45NTc5NiwtMi40OTA4M2MyLjg5MzcsMCAxNy4yMDg3MSwwIDE3LjIwODcxLDB2MzguNjY2NjdjMCwwIC0xMy4yMjc5NywwIC0xNi40MDg3MSwwYy0xLjMwNDAyLDAgLTIuNzU3OTYsLTEuMjg1MyAtMi43NTc5NiwtMy4zNzU4M3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzUuMzgzMzMsMTk5LjMzMzMzdi0zOC40NjY2N2MwLDAgMTAuNTQwMjIsMC44MjE5OCAxNS41NDA1OCwtMC4xNTM0M2M0LjkwOTA3LC0wLjk1NzYgMTQuMTkyNzgsLTUuODQ2NTcgMTQuMTkyNzgsLTUuODQ2NTd2MzguMTY2NjdjMCwwIC04LjcyMjc0LDUuMTMyOTUgLTEzLjUwODQ1LDYuMTQ2OTdjLTUuMTA0NzksMS4wODE2MiAtMTYuMjI0OTEsMC4xNTMwMyAtMTYuMjI0OTEsMC4xNTMwM3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzYuNjIzMTksMTY4LjM0NzAzYzAsMCAxMC4wNjY3NiwwLjY3NzYgMTQuNzIwMDIsLTAuMDg2ODZjNC42Nzk5MiwtMC43Njg4NCAxMy4yNzk5OCwtNC41MTMxNCAxMy4yNzk5OCwtNC41MTMxNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMzYuNjg2MzQsMTkxLjMyMjM0YzAsMCAxMC4wODEzMiwwLjQwNjkzIDE0LjcxMjM3LC0wLjQ4MjI2YzQuNjU3NTgsLTAuODk0MjkgMTMuMTUzOTUsLTQuODY4MjYgMTMuMTUzOTUsLTQuODY4MjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQ0LjAyMzE5LDE5My41NDcwM2wwLjIsNS4yIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI1NC4wMjMxOSwxOTIuMTQ3MDNsMC42LDQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjU1LjAyMzE5LDE2Ny41NDcwM2wtMC42LC02IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI0My4yMjMxOSwxNjcuMTQ3MDN2LTQuNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMzUuNDIzMTksMTY4LjU0NzAzaC0xOS40IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIxNi4yMjMxOSwxOTAuMzQ3MDNoMTUuOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMjQuMjIzMTksMTkyLjM0NzAzdjUuMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMjQuNjIzMTksMTY4LjM0NzAzdi02LjYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozNS4yNDk5ODUwMDAwMDAwMTozNS4yNTAwMDQ5OTk5OTk5OS0tPg==",
                blocks: [
                    {
                        opcode: "loadScene",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.scene.block.loadScene"],
                        arguments: {
                            scene: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType: "Scene",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "getParent",
                        type: sugarcube.BlockType.OBJECT,
                        text: editor.language["sugarcube.scene.block.getParent"],
                    },
                    {
                        opcode: "getMyself",
                        type: sugarcube.BlockType.OBJECT,
                        text: editor.language["sugarcube.scene.block.getMyself"],
                    },
                    {
                        opcode: "getRoot",
                        type: sugarcube.BlockType.OBJECT,
                        text: editor.language["sugarcube.scene.block.getRoot"],
                    },
                    "---",
                    {
                        opcode: "getName",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.scene.block.getName"],
                        arguments: {
                            object: {
                                type: sugarcube.ArgumentType.OBJECT,
                            },
                        },
                    },
                    {
                        opcode: "getChildren",
                        type: sugarcube.BlockType.ARRAY,
                        text: editor.language["sugarcube.scene.block.getChildren"],
                        arguments: {
                            object: {
                                type: sugarcube.ArgumentType.OBJECT,
                            },
                        },
                    },
                    {
                        opcode: "getParentOf",
                        type: sugarcube.BlockType.OBJECT,
                        text: editor.language["sugarcube.scene.block.getParentOf"],
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
                        text: editor.language["sugarcube.scene.block.setVariable"],
                        arguments: {
                            variable: {
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
                        text: editor.language["sugarcube.scene.block.getVariable"],
                        arguments: {
                            variable: {
                                type: sugarcube.ArgumentType.STRING,
                                defaultValue: "variable",
                            },
                            object: {
                                type: sugarcube.ArgumentType.OBJECT,
                            },
                        },
                    },
                ],
                fields: {
                    Scene: {
                        acceptReporters: true,
                        editor: "file_Editor",

                        initilize: "file_Init",
                    },
                },
            };
        }

        file_Init(field) {
            field.createBorderRect_();
            field.createTextElement_();
        }

        file_Editor(field) {
            //Its like some sort of loading. :trol:
            const newLoadal = new editor.windows.modalFileExplorer(400, 400);

            newLoadal.__moveToTop();

            newLoadal.acceptTypes = "scene";

            const bounding = field.borderRect_.getBoundingClientRect();
            newLoadal.x = bounding.x + bounding.width / 2;
            newLoadal.y = bounding.y + bounding.height;
            newLoadal.onFileSelected = (path) => {
                field.value = path;
            };
        }

        loadScene({ scene }) {
            coffeeEngine.runtime.currentScene.openScene(scene);
        }
    }

    sugarcube.extensionManager.registerExtension(new objects());
})();
