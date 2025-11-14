(function () {
    class controls {
        getInfo() {
            return {
                id: "controls",
                name: editor.language["sugarcube.controls"],
                color1: "#ffab19",
                color2: "#ec9c13",
                color3: "#cf8b17",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny4xMzgxMyIgaGVpZ2h0PSI3Ny4xMzgxMyIgdmlld0JveD0iMCwwLDc3LjEzODEzLDc3LjEzODEzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjQzMDk3LC0xNDEuNDMwOTcpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTI1OC45NDAxMSwyMDIuODU3MzhjMCwwIC01Ljg1NDQzLDAgLTcuOTIwMjMsMGMtMS4zMjc2NCwwIC0zLjI3MTMzLC0xLjQ3MTk3IC0zLjI3MTMzLC0zLjA5OTMxYzAsLTQuNjk4NjQgMCwtMjguOTUwNjkgMCwtMzguOTk5NTJjMCwtMi44NTY2MiAxLjc2MzA2LC0zLjYxNTg0IDMuMDEzMDUsLTMuNjE1ODRjMi4wNTk0LDAgOC4xNzg1MSwwIDguMTc4NTEsMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI4LjUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIzMi4wNjkxNywxNzIuMTA2NmwxMy4wMTAzOCw3LjUwNTk5IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iOC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjAxLjQzMDk4LDIxOC41NjkxMXYtNzcuMTM4MTNoNzcuMTM4MTN2NzcuMTM4MTN6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjIzLjc3MTg2LDE3NC43NDgyNGMtMy45NDYzMSwwIC03LjE0NTQzLC0zLjE5OTEyIC03LjE0NTQzLC03LjE0NTQzYzAsLTMuOTQ2MzEgMy4xOTkxMiwtNy4xNDU0MyA3LjE0NTQzLC03LjE0NTQzYzMuOTQ2MzEsMCA3LjE0NTQzLDMuMTk5MTIgNy4xNDU0Myw3LjE0NTQzYzAsMy45NDYzMSAtMy4xOTkxMiw3LjE0NTQzIC03LjE0NTQzLDcuMTQ1NDN6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjI3LjA5MzA3LDE5MS4yNjQ3NmwxOC44NTQwOCwtMTAuODc3MzUiIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2luZGV4JnF1b3Q7Om51bGx9IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iOC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjI5LjE1OTI3LDE5Mi4zOTcxOWMwLDIuNDk2MjIgLTIuMDIzNTksNC41MTk4MSAtNC41MTk4MSw0LjUxOTgxYy0yLjQ5NjIyLDAgLTQuNTE5ODEsLTIuMDIzNTkgLTQuNTE5ODEsLTQuNTE5ODFjMCwtMi40OTYyMiAyLjAyMzU5LC00LjUxOTgxIDQuNTE5ODEsLTQuNTE5ODFjMi40OTYyMiwwIDQuNTE5ODEsMi4wMjM1OSA0LjUxOTgxLDQuNTE5ODF6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjguNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozOC41NjkwMjUwMDAwMDAwMTozOC41NjkwMjUwMDAwMDAwMS0tPg==",
                blocks: [
                    {
                        opcode: "wait",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.wait"],
                        arguments: {
                            seconds: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "ifStatement",
                        compileFunc: "ifStatement",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.ifStatement"],
                        arguments: {
                            condition: {
                                type: sugarcube.ArgumentType.BOOLEAN,
                            },
                            dummy: {
                                type: sugarcube.ArgumentType.DUMMY,
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                        },
                    },
                    {
                        opcode: "ifElse_Statement",
                        compileFunc: "ifElse_Statement",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.ifElse_Statement"],
                        arguments: {
                            condition: {
                                type: sugarcube.ArgumentType.BOOLEAN,
                            },
                            dummy: {
                                type: sugarcube.ArgumentType.DUMMY,
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                            dummy2: {
                                type: sugarcube.ArgumentType.DUMMY,
                            },
                            statement2: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "switch_Statement",
                        compileFunc: "switch_Statement",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.switch_Statement"],
                        arguments: {
                            condition: {
                                type: sugarcube.ArgumentType.STRING,
                            },
                            image: {
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyOS4zNTk2MyIgaGVpZ2h0PSIyOS4zNTk2MyIgdmlld0JveD0iMCwwLDI5LjM1OTYzLDI5LjM1OTYzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI1LjMyMDE5LC0xNjUuMzIwMTgpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMjUuMzIwMTksMTk0LjY3OTgxdi0yOS4zNTk2M2gyOS4zNTk2M3YyOS4zNTk2M3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTIzNi41NDE4OCwxNjYuMzM5ODFjMC41ODEyNCwwIDEuMTYyNzQsMi45MDkwMyAxLjYzNDA3LDYuNTk2NjhjMi45MzUxNiwwLjkxMDg0IDQuNzU0NDQsMC4xOTU1NCA2LjgxODQ0LDAuMTk1NTRsLTAuMDAwMDEsLTAuMDAwMDFjMC41NDIwOSwwIC0wLjYwNCwtNS45MTQ2MyAwLjEyODQ0LC01Ljg5Nzk2YzMuOTE2MTQsMC4wODkwOSA2Ljk2ODc1LDguMDczNTkgNi45Njg3NSw4LjU2ODk1YzAsMC4wMTA1MSAtMC4wMDIwOCwwLjAyMTI4IC0wLjAwNjE3LDAuMDMyMjljMC4wMDQwOSwwLjAxMDkzIDAuMDA2MTcsMC4wMjE2NiAwLjAwNjE3LDAuMDMyMThjMCwwLjQ5NTM2IC0zLjA1MjYsOC40Nzk4NiAtNi45Njg3NSw4LjU2ODk1Yy0wLjczMjQ1LDAuMDE2NjYgMC40MTM2NSwtNS44OTc5NiAtMC4xMjg0NCwtNS44OTc5NmMtMS4xNTUxMSwwIC0zLjY5NTQyLDAuMzEzNTggLTYuMjMwODIsLTAuMDIwNjZjMC4yNzkzLDMuMjMxOTUgMC40NDkzMSw2LjMwMzk5IDAuNDQ5MzEsOC4wNDUxN2MwLDAuNTQyMDkgNS45MTQ2MywtMC42MDQgNS44OTc5NiwwLjEyODQ0Yy0wLjA4OTA5LDMuOTE2MTQgLTguMDczNTksNi45Njg3NSAtOC41Njg5NSw2Ljk2ODc1Yy0wLjAxMDUxLDAgLTAuMDIxMjgsLTAuMDAyMDggLTAuMDMyMjksLTAuMDA2MTdjLTAuMDEwOTMsMC4wMDQwOSAtMC4wMjE2NiwwLjAwNjE3IC0wLjAzMjE4LDAuMDA2MTdjLTAuNDk1MzYsMCAtOC40Nzk4NiwtMy4wNTI2IC04LjU2ODk1LC02Ljk2ODc1Yy0wLjAxNjY2LC0wLjczMjQ1IDUuODk3OTYsMC40MTM2NSA1Ljg5Nzk2LC0wLjEyODQ0YzAsLTQuODgxNDQgMS4zMzYxNywtMjAuMjIzMTcgMi42NzA5OSwtMjAuMjIzMTdjMC4wMTA4MywwIDAuMDIxNTcsMC4wMDA2OSAwLjAzMjIzLDAuMDAyMDZjMC4wMTA2NywtMC4wMDEzNyAwLjAyMTQxLC0wLjAwMjA2IDAuMDMyMjQsLTAuMDAyMDZ6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4yOTAyIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC43NSIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE0LjY3OTgxNDg1OTU1MTA3MjoxNC42Nzk4MjQ4NTk1NTA5OS0tPg=="
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                                nextStatement: "branch"
                            },
                            dummy: {
                                type: sugarcube.ArgumentType.DUMMY,
                                nextStatement: "branch"
                            },
                            default: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                        },
                    },
                    {
                        opcode: "branch_Statement",
                        compileFunc: "branch_Statement",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.branch_Statement"],
                        previousStatement:"branch",
                        nextStatement:"branch",
                        arguments: {
                            condition: {
                                type: sugarcube.ArgumentType.STRING,
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "repeat",
                        compileFunc: "repeat",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.repeat"],
                        alignment: "right",
                        arguments: {
                            num: {
                                type: sugarcube.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            dummy: {
                                type: sugarcube.ArgumentType.DUMMY,
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                            image: {
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyOS4zNTk2MyIgaGVpZ2h0PSIyOS4zNTk2MyIgdmlld0JveD0iMCwwLDI5LjM1OTYzLDI5LjM1OTYzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI1LjMyMDIsLTE2NS4zMjAyKSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjQwLjA3ODYsMTc2LjQ3MzAxYzAsLTAuNTQyMDkgLTUuOTE0NjMsMC42MDQgLTUuODk3OTYsLTAuMTI4NDRjMC4wODkwOSwtMy45MTYxNCA4LjA3MzU5LC02Ljk2ODc1IDguNTY4OTUsLTYuOTY4NzVjMC4wMTA1MSwwIDAuMDIxMjgsMC4wMDIwOCAwLjAzMjI5LDAuMDA2MTdjMC4wMTA5MywtMC4wMDQwOSAwLjAyMTY2LC0wLjAwNjE3IDAuMDMyMTgsLTAuMDA2MTdjMC40OTUzNiwwIDguNDc5ODYsMy4wNTI2IDguNTY4OTUsNi45Njg3NWMwLjAxNjY2LDAuNzMyNDUgLTUuODk3OTYsLTAuNDEzNjUgLTUuODk3OTYsMC4xMjg0NGMwLDIuMjM2MjIgMS4xNzUyNSw5LjY2NDAxIC0zLjQ0OTgyLDEyLjE5NzA5Yy01Ljc4Nzk4LDMuNDkxODcgLTEzLjQ0ODk0LC0yLjUwODcxIC0xMy4wNzM3NCwtMi43NzA5N2MwLjQ0MTA2LC0wLjI5NzE5IDYuNDY2MDcsMi41NjM1OCA5LjkzMzQ1LC0wLjI0NTk5YzIuMjg5NjMsLTQuNDI1NTcgMS4xODM2NiwtNi42MTM2NiAxLjE4MzY2LC05LjE4MDEzeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMjkwMiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNzUiLz48cGF0aCBkPSJNMjI1LjMyMDIxLDE5NC42Nzk4M3YtMjkuMzU5NjNoMjkuMzU5NjN2MjkuMzU5NjN6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE0LjY3OTc5NTAwMDAwMDAxMzoxNC42Nzk4MDQ5OTk5OTk5ODgtLT4="
                            }
                        },
                    },
                    {
                        opcode: "foreach",
                        compileFunc: "foreach",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.foreach"],
                        alignment: "right",
                        arguments: {
                            array: {
                                type: sugarcube.ArgumentType.ARRAY,
                            },
                            dummy: {
                                type: sugarcube.ArgumentType.DUMMY,
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                            image: {
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyOS4zNTk2MyIgaGVpZ2h0PSIyOS4zNTk2MyIgdmlld0JveD0iMCwwLDI5LjM1OTYzLDI5LjM1OTYzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI1LjMyMDIsLTE2NS4zMjAyKSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjQwLjA3ODYsMTc2LjQ3MzAxYzAsLTAuNTQyMDkgLTUuOTE0NjMsMC42MDQgLTUuODk3OTYsLTAuMTI4NDRjMC4wODkwOSwtMy45MTYxNCA4LjA3MzU5LC02Ljk2ODc1IDguNTY4OTUsLTYuOTY4NzVjMC4wMTA1MSwwIDAuMDIxMjgsMC4wMDIwOCAwLjAzMjI5LDAuMDA2MTdjMC4wMTA5MywtMC4wMDQwOSAwLjAyMTY2LC0wLjAwNjE3IDAuMDMyMTgsLTAuMDA2MTdjMC40OTUzNiwwIDguNDc5ODYsMy4wNTI2IDguNTY4OTUsNi45Njg3NWMwLjAxNjY2LDAuNzMyNDUgLTUuODk3OTYsLTAuNDEzNjUgLTUuODk3OTYsMC4xMjg0NGMwLDIuMjM2MjIgMS4xNzUyNSw5LjY2NDAxIC0zLjQ0OTgyLDEyLjE5NzA5Yy01Ljc4Nzk4LDMuNDkxODcgLTEzLjQ0ODk0LC0yLjUwODcxIC0xMy4wNzM3NCwtMi43NzA5N2MwLjQ0MTA2LC0wLjI5NzE5IDYuNDY2MDcsMi41NjM1OCA5LjkzMzQ1LC0wLjI0NTk5YzIuMjg5NjMsLTQuNDI1NTcgMS4xODM2NiwtNi42MTM2NiAxLjE4MzY2LC05LjE4MDEzeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMjkwMiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNzUiLz48cGF0aCBkPSJNMjI1LjMyMDIxLDE5NC42Nzk4M3YtMjkuMzU5NjNoMjkuMzU5NjN2MjkuMzU5NjN6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE0LjY3OTc5NTAwMDAwMDAxMzoxNC42Nzk4MDQ5OTk5OTk5ODgtLT4="
                            }
                        },
                    },
                    {
                        opcode: "repeatUNT",
                        compileFunc: "repeatUNT",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.repeatUNT"],
                        alignment: "right",
                        arguments: {
                            condition: {
                                type: sugarcube.ArgumentType.BOOLEAN,
                            },
                            dummy: {
                                type: sugarcube.ArgumentType.DUMMY,
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                            image: {
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyOS4zNTk2MyIgaGVpZ2h0PSIyOS4zNTk2MyIgdmlld0JveD0iMCwwLDI5LjM1OTYzLDI5LjM1OTYzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI1LjMyMDIsLTE2NS4zMjAyKSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjQwLjA3ODYsMTc2LjQ3MzAxYzAsLTAuNTQyMDkgLTUuOTE0NjMsMC42MDQgLTUuODk3OTYsLTAuMTI4NDRjMC4wODkwOSwtMy45MTYxNCA4LjA3MzU5LC02Ljk2ODc1IDguNTY4OTUsLTYuOTY4NzVjMC4wMTA1MSwwIDAuMDIxMjgsMC4wMDIwOCAwLjAzMjI5LDAuMDA2MTdjMC4wMTA5MywtMC4wMDQwOSAwLjAyMTY2LC0wLjAwNjE3IDAuMDMyMTgsLTAuMDA2MTdjMC40OTUzNiwwIDguNDc5ODYsMy4wNTI2IDguNTY4OTUsNi45Njg3NWMwLjAxNjY2LDAuNzMyNDUgLTUuODk3OTYsLTAuNDEzNjUgLTUuODk3OTYsMC4xMjg0NGMwLDIuMjM2MjIgMS4xNzUyNSw5LjY2NDAxIC0zLjQ0OTgyLDEyLjE5NzA5Yy01Ljc4Nzk4LDMuNDkxODcgLTEzLjQ0ODk0LC0yLjUwODcxIC0xMy4wNzM3NCwtMi43NzA5N2MwLjQ0MTA2LC0wLjI5NzE5IDYuNDY2MDcsMi41NjM1OCA5LjkzMzQ1LC0wLjI0NTk5YzIuMjg5NjMsLTQuNDI1NTcgMS4xODM2NiwtNi42MTM2NiAxLjE4MzY2LC05LjE4MDEzeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMjkwMiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNzUiLz48cGF0aCBkPSJNMjI1LjMyMDIxLDE5NC42Nzk4M3YtMjkuMzU5NjNoMjkuMzU5NjN2MjkuMzU5NjN6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE0LjY3OTc5NTAwMDAwMDAxMzoxNC42Nzk4MDQ5OTk5OTk5ODgtLT4="
                            }
                        },
                    },
                    {
                        opcode: "while",
                        compileFunc: "while",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.while"],
                        alignment: "right",
                        arguments: {
                            condition: {
                                type: sugarcube.ArgumentType.BOOLEAN,
                            },
                            dummy: {
                                type: sugarcube.ArgumentType.DUMMY,
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                            image: {
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyOS4zNTk2MyIgaGVpZ2h0PSIyOS4zNTk2MyIgdmlld0JveD0iMCwwLDI5LjM1OTYzLDI5LjM1OTYzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI1LjMyMDIsLTE2NS4zMjAyKSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjQwLjA3ODYsMTc2LjQ3MzAxYzAsLTAuNTQyMDkgLTUuOTE0NjMsMC42MDQgLTUuODk3OTYsLTAuMTI4NDRjMC4wODkwOSwtMy45MTYxNCA4LjA3MzU5LC02Ljk2ODc1IDguNTY4OTUsLTYuOTY4NzVjMC4wMTA1MSwwIDAuMDIxMjgsMC4wMDIwOCAwLjAzMjI5LDAuMDA2MTdjMC4wMTA5MywtMC4wMDQwOSAwLjAyMTY2LC0wLjAwNjE3IDAuMDMyMTgsLTAuMDA2MTdjMC40OTUzNiwwIDguNDc5ODYsMy4wNTI2IDguNTY4OTUsNi45Njg3NWMwLjAxNjY2LDAuNzMyNDUgLTUuODk3OTYsLTAuNDEzNjUgLTUuODk3OTYsMC4xMjg0NGMwLDIuMjM2MjIgMS4xNzUyNSw5LjY2NDAxIC0zLjQ0OTgyLDEyLjE5NzA5Yy01Ljc4Nzk4LDMuNDkxODcgLTEzLjQ0ODk0LC0yLjUwODcxIC0xMy4wNzM3NCwtMi43NzA5N2MwLjQ0MTA2LC0wLjI5NzE5IDYuNDY2MDcsMi41NjM1OCA5LjkzMzQ1LC0wLjI0NTk5YzIuMjg5NjMsLTQuNDI1NTcgMS4xODM2NiwtNi42MTM2NiAxLjE4MzY2LC05LjE4MDEzeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMjkwMiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNzUiLz48cGF0aCBkPSJNMjI1LjMyMDIxLDE5NC42Nzk4M3YtMjkuMzU5NjNoMjkuMzU5NjN2MjkuMzU5NjN6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE0LjY3OTc5NTAwMDAwMDAxMzoxNC42Nzk4MDQ5OTk5OTk5ODgtLT4="
                            }
                        },
                    },
                    "---",
                    //Further notice is now
                    {
                        opcode: "continue",
                        compileFunc: "continue",
                        type: sugarcube.BlockType.TERMINAL,
                        text: editor.language["sugarcube.controls.block.continue"],
                        arguments: {
                            image: {
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyOS4zNTk2MyIgaGVpZ2h0PSIyOS4zNTk2MyIgdmlld0JveD0iMCwwLDI5LjM1OTYzLDI5LjM1OTYzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI1LjMyMDE5LC0xNjUuMzIwMTkpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yNDAuMDMyMjMsMTY2LjMzOTgyYzEuMzM0ODEsMCAyLjY3MDk5LDE1LjM0MTczIDIuNjcwOTksMjAuMjIzMTdjMCwwLjU0MjA5IDUuOTE0NjMsLTAuNjA0IDUuODk3OTYsMC4xMjg0NGMtMC4wODkwOSwzLjkxNjE0IC04LjA3MzU5LDYuOTY4NzUgLTguNTY4OTUsNi45Njg3NWMtMC4wMTA1MSwwIC0wLjAyMTI4LC0wLjAwMjA4IC0wLjAzMjI5LC0wLjAwNjE3Yy0wLjAxMDkzLDAuMDA0MDkgLTAuMDIxNjYsMC4wMDYxNyAtMC4wMzIxOCwwLjAwNjE3Yy0wLjQ5NTM2LDAgLTguNDc5ODYsLTMuMDUyNiAtOC41Njg5NSwtNi45Njg3NWMtMC4wMTY2NiwtMC43MzI0NSA1Ljg5Nzk2LDAuNDEzNjUgNS44OTc5NiwtMC4xMjg0NGMwLC00Ljg4MTQ0IDEuMzM2MTcsLTIwLjIyMzE3IDIuNjcwOTksLTIwLjIyMzE3YzAuMDEwODMsMCAwLjAyMTU3LDAuMDAwNjkgMC4wMzIyMywwLjAwMjA2YzAuMDEwNjcsLTAuMDAxMzcgMC4wMjE0MSwtMC4wMDIwNiAwLjAzMjI0LC0wLjAwMjA2eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMjkwMiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNzUiLz48cGF0aCBkPSJNMjI1LjMyMDE5LDE5NC42Nzk4MXYtMjkuMzU5NjNoMjkuMzU5NjN2MjkuMzU5NjN6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE0LjY3OTgxNDg1OTU1MTA3MjoxNC42Nzk4MTQ4NTk1NTA5ODctLT4="
                            }
                        }
                    },
                    {
                        opcode: "break",
                        compileFunc: "break",
                        type: sugarcube.BlockType.TERMINAL,
                        text: editor.language["sugarcube.controls.block.break"],
                        arguments: {
                            image: {
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMC4wNDcyMSIgaGVpZ2h0PSIzMC4wNDcyMSIgdmlld0JveD0iMCwwLDMwLjA0NzIxLDMwLjA0NzIxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI0Ljk3NjQsLTE2NC45NzY0KSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjQyLjUwMzk3LDE4Ni40NTM5OGMtMC4wMTY1MiwwLjIyMzYxIDAuOTk3NDEsMC4yMzM3MyAyLjE4NzE3LDAuMjIwMzJjLTAuNjk4OTksMC41NjE1MSAtMS40MDcxOSwxLjExMDMyIC0yLjE2MjE5LDEuNTk0NDNjLTAuMzgwODcsMC4yNDQyMSAtMC44NjE5MSwwLjk4MTk1IC0xLjE4MzgsMC42NjQwMWMtMC40MjA5OCwtMC40MTU4MSAtMC44MTU1NSwtMS4wODU1MiAtMS4zMDg4MywtMS41NDE0MmMtMC43MzMxMSwtMC44MzY3MiAtNC42ODIyNiwtMC45NzM2IC01LjA2MzcyLDAuNjM3NTJjLTAuMTYyMiwwLjY4NTA0IDEuOTk3ODQsMS4yOTcyMyAxLjM2NzA1LDEuNjA5NzljLTAuNTgwNjUsMC4yODc3MSAtMS4zMDYwMiwwLjU5MSAtMi4wMjU0NiwwLjg2MTA3Yy0xLjcwOTQ2LC0xLjMzNTY3IC0zLjE4MTkyLC0zLjAxNTU1IC0zLjA5MzM4LC00Ljc1MDQxYzAuMDM3MzQsLTAuNzMxNjkgNS44NTE0NiwwLjg0NzAyIDUuODkxNCwwLjMwNjQxYzAuMTEzODQsLTEuNTQxMTEgMC40Mzg0NSwtNC4xMTc3OSAwLjg3MTIsLTYuOTE2ODJjMC4xMjc2MywwLjExMzE1IDAuMjQ1MDEsMC4xODcwOSAwLjM0NTY3LDAuMjA1N2MwLjk0NTE5LDAuMTc0NzQgMS4yODU0MSwtMS4wNzQzIDEuODA0MzgsLTEuNDc5NDhjMC4wNDk1MywtMC4wMzg2NyAwLjM4MTcxLDEuMDQ4OTggMC40MDM1MiwxLjEwODM0YzAuMTM3MiwwLjM3MzQ5IDAuNzEzOTIsMS43Njg2MiAxLjE3NDE2LDEuNzg5MzZjMC4xMDM0NywwLjAwNDY2IDAuNTU5MzcsLTAuMzYxOCAwLjk0OTg1LC0wLjY5MjI3YzAuMDA2MDksMi42MDE0MyAtMC4wNTEwOCw0Ljk0OTM2IC0wLjE1NzAyLDYuMzgzNDd6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4yOTAyIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC43NSIvPjxwYXRoIGQ9Ik0yNDguNzc0NzIsMTg2LjcwMTcxYzAuMjk0MDUsMy45MDYxIC03LjM1MzkxLDcuNzI0NCAtNy44NDY5LDcuNzcyODFjLTAuMDEwNDYsMC4wMDEwMyAtMC4wMjEzOCwwLjAwMDAxIC0wLjAzMjc0LC0wLjAwMjk4Yy0wLjAxMDQ4LDAuMDA1MTQgLTAuMDIwOTUsMC4wMDgyNiAtMC4wMzE0MiwwLjAwOTI5Yy0wLjIzMjYsMC4wMjI4NCAtMi4xOTA3NywtMC40Njc2OCAtNC4yNDM5NSwtMS40MDA2NWMwLjc3ODM0LC0wLjQ2MTI1IDEuNDk1NzUsLTAuOTU0ODQgMS42MzI1LC0xLjI4MjY4YzAuMzgwNzIsLTAuOTEyNzggLTAuMTc4NDYsLTEuMTg1MzkgLTAuNzQxMDIsLTEuNjAzNDJjLTAuMTA3MTksLTAuMDc5NjUgLTAuMzIxODcsLTAuMjAwNiAtMC40OTkwMywtMC4yNzE0NmMwLjY4ODE2LC0wLjI0OTc5IDIuNDcwMTgsLTEuMjEwNTYgMi45OTkwMywtMC42MzQ4OWMwLjQwMzk4LDAuMjY0MTUgMS41Mzc1LDEuMzg2MjggMS45Mjg1NSwxLjQ3NDk5YzEuMzczOTUsMC4zMTE2NiAzLjUwNTE2LC0yLjQ0NDkyIDQuODAxOTEsLTQuMDcxMWMxLjA5OTUzLC0wLjE4NTEzIDIuMDExMzksLTAuMjc4MTEgMi4wMzMwOCwwLjAxMDExeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMjkwMiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNzUiLz48cGF0aCBkPSJNMjM5Ljc4MjUyLDE2NS41MTg1NWMwLjg3NTgsLTAuMDM2MDcgMi4wMjQ0NCw2LjUzODAzIDIuNzY2OCwxMi40Mzc0N2MtMC4wMTQ2LDAuMDE0MDUgLTAuMDI5MiwwLjAyODE0IC0wLjA0MzgxLDAuMDQyMjVjLTAuMjI2OTYsMC4yNDY2OCAtMC40NDY5OSwxLjE0NTE5IC0wLjU2NTQyLDAuODMxNjFjLTAuMzExNzIsLTAuODI1MzQgLTEuMjU1MzksLTIuNjM3ODYgLTIuMjg0NzgsLTIuNDMzMTRjLTAuNjcyNCwwLjEzMzczIC0wLjY4NDE4LDIuMDM0NTEgLTEuMjQzNTcsMS42MzgxN2MtMC4xMjA0LC0wLjA4NTMxIC0wLjI1ODcxLC0wLjIxOTM3IC0wLjQwNjQ4LC0wLjM4MjM3YzAuMjY2MzQsLTUuODA5NTEgMC44NjExMywtMTIuMDk2MjUgMS43MTI4NSwtMTIuMTMxMzNjMC4wMTA4MiwtMC4wMDA0NSAwLjAyMTU4LC0wLjAwMDIgMC4wMzIyOSwwLjAwMDczYzAuMDEwNiwtMC4wMDE4MSAwLjAyMTMxLC0wLjAwMjk0IDAuMDMyMTMsLTAuMDAzMzh6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4yOTAyIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC43NSIvPjxwYXRoIGQ9Ik0yMjQuOTc2NCwxOTUuMDIzNnYtMzAuMDQ3MjFoMzAuMDQ3MjF2MzAuMDQ3MjF6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE1LjAyMzYwNDU3NTE2NTEzNzoxNS4wMjM2MDQ1NzUxNjUxMzctLT4="
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "doAs",
                        compileFunc: "doAs",
                        type: sugarcube.BlockType.CONDITIONAL,
                        text: editor.language["sugarcube.controls.block.doAs"],
                        alignment: "right",
                        arguments: {
                            image: {
                                type: sugarcube.ArgumentType.IMAGE,
                                dataURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyOS4zNTk2MyIgaGVpZ2h0PSIyOS4zNTk2MyIgdmlld0JveD0iMCwwLDI5LjM1OTYzLDI5LjM1OTYzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI1LjMyMDE4LC0xNjUuMzIwMTgpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yNDIuNzAzMjIsMTg2LjU2M2MwLDAuNTQyMDkgNS45MTQ2MywtMC42MDQgNS44OTc5NiwwLjEyODQ0Yy0wLjA4OTA5LDMuOTE2MTQgLTguMDczNTksNi45Njg3NSAtOC41Njg5NSw2Ljk2ODc1Yy0wLjAxMDUxLDAgLTAuMDIxMjgsLTAuMDAyMDggLTAuMDMyMjksLTAuMDA2MTdjLTAuMDEwOTMsMC4wMDQwOSAtMC4wMjE2NiwwLjAwNjE3IC0wLjAzMjE4LDAuMDA2MTdjLTAuNDk1MzYsMCAtOC40Nzk4NiwtMy4wNTI2IC04LjU2ODk1LC02Ljk2ODc1Yy0wLjAxNjY2LC0wLjczMjQ1IDUuODk3OTYsMC40MTM2NSA1Ljg5Nzk2LC0wLjEyODQ0YzAsLTAuNTE2MTEgMC4wMTQ5NCwtMS4xNDkxNCAwLjA0MzIzLC0xLjg2ODYxYzAuNDk1MSwtMC4xODIwOSAxLjE5NjIyLC0xLjI2NTMgMi43MzU4NSwtMS4yMDg1OWMxLjExMDIsMC4wNDA4OSAyLjI3NTEsMC44MDI4OSAyLjU3MTQ5LDAuOTAxNzNjMC4wMzY0NywwLjg0Njk3IDAuMDU1ODgsMS41ODcxOCAwLjA1NTg4LDIuMTc1NDd6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4yOTAyIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC43NSIvPjxwYXRoIGQ9Ik0yNDAuMDMyMjMsMTY2LjMzOTgyYzAuNzA3NzMsMCAxLjQxNTg0LDQuMzEyODggMS45MjQ5Nyw5LjA5Mjc4YzAsMCAtMi43MTMzOSwwLjIwMTI0IC0zLjkwNjg5LC0wLjA3MDU1YzAuNTA4NTcsLTQuNzUxNyAxLjIxMzIsLTkuMDIyMjMgMS45MTc0NSwtOS4wMjIyM2MwLjAxMDgzLDAgMC4wMjE1NywwLjAwMDY5IDAuMDMyMjMsMC4wMDIwNmMwLjAxMDY3LC0wLjAwMTM3IDAuMDIxNDEsLTAuMDAyMDYgMC4wMzIyNCwtMC4wMDIwNnoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjI5MDIiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjc1Ii8+PHBhdGggZD0iTTIyNS4zMjAxOSwxOTQuNjc5ODJ2LTI5LjM1OTYzaDI5LjM1OTYzdjI5LjM1OTYzeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjQxLjg1NDIyLDE3Ni43NzQ2OGMxLjUyNzksMC4wMzAwNSAxLjUzMzA0LDAuMjk5NDEgMi4xMTI5NSwwLjU3NjI2YzEuMzIyMDMsMC42MzExNCAzLjE0NzY2LDIuODk4NDggNC42Nzg2NywzLjI2NTQ3YzAuMjY3MDUsMC4wNjQwMiAxLjA5ODExLC0wLjE2NDEgMS40MjgyNCwtMC42NDgzNGMwLjA5NjkzLC0wLjE0MjE4IDAuMzEzNDksLTAuMzA2NDQgMC4zMTMyNywtMC40NzY3MWMtMC4wMDAyLC0wLjE1NzIgLTAuMDg4OTUsLTAuMzA1NzcgLTAuMTQ4NjQsLTAuMzc4NDVjMC4xNTg4OCwwLjAxNjU3IDAuNjc4MzksLTAuMTcxOCAxLjAxOTU0LDAuMTYwMzdjMC41MDgwOSwwLjQ5NDcyIDAuMTY5MDIsMS4xODY2OCAwLjE1MDI4LDEuMzc2NDZjLTAuMDk2NzQsMC45Nzk1OCAtMS41NTQ4NSwxLjgzMzQgLTEuODc4OTYsMi4wMDYxMWMtMS4zMzMwOSwwLjcxMDM2IC01LjA0ODYsMC42NTMwNiAtNi41MTEzOSwwLjM4Nzk0Yy0yLjk4NzAzLC0wLjU0MTM5IC0yLjY4MjM4LC0xLjI3NDg3IC0yLjk0NzYsLTEuMjc0ODdjLTAuMDIzMjcsMCAtMC4wNDY5OCwtMC4wMzgyNyAtMC4wNzA1NiwtMC4xMDc2NmMtMC4wMjM1OCwwLjA2OTM5IC0wLjA0NzI5LDAuMTA3NjYgLTAuMDcwNTYsMC4xMDc2NnYwYy0wLjI2NTIyLDAgMC4wMzk0NCwwLjczMzQ4IC0yLjk0NzYsMS4yNzQ4N2MtMS40NjI3OSwwLjI2NTEzIC01LjE3ODMxLDAuMzIyNDMgLTYuNTExMzksLTAuMzg3OTRjLTAuMzI0MTIsLTAuMTcyNzEgLTEuNzgyMjMsLTEuMDI2NTMgLTEuODc4OTYsLTIuMDA2MTFjLTAuMDE4NzQsLTAuMTg5NzggLTAuMzU3ODEsLTAuODgxNzMgMC4xNTAyOCwtMS4zNzY0NmMwLjM0MTE1LC0wLjMzMjE4IDAuODYwNjUsLTAuMTQzOCAxLjAxOTUzLC0wLjE2MDM3Yy0wLjA1OTcsMC4wNzI2OCAtMC4xNDg0NCwwLjIyMTI1IC0wLjE0ODY0LDAuMzc4NDVjLTAuMDAwMjIsMC4xNzAyNyAwLjIxNjM0LDAuMzM0NTMgMC4zMTMyNywwLjQ3NjcxYzAuMzMwMTMsMC40ODQyNCAxLjE2MTE4LDAuNzEyMzUgMS40MjgyNCwwLjY0ODM0YzEuNTMxMDEsLTAuMzY2OTkgMy4zNTY2NCwtMi42MzQzMyA0LjY3ODY3LC0zLjI2NTQ3YzAuNTc5OTEsLTAuMjc2ODUgMC41ODUwNSwtMC41NDYyMSAyLjExMjk1LC0wLjU3NjI2YzEuNDUzMzksLTAuMDI4NTggMS41NjYyMSwwLjQ3MjA4IDEuODU0MjIsMC41ODQ0NGMwLjI4OCwtMC4xMTIzNyAwLjQwMDgyLC0wLjYxMzAyIDEuODU0MjIsLTAuNTg0NDR6TTI1MC4yMzg3LDE3OS4xMTI5MWMtMC4wMjE5NCwtMC4wMDIyOSAtMC4wMzcsLTAuMDA4NDggLTAuMDQzNzcsLTAuMDIwNDljLTAuMDI0NTUsLTAuMDQzNTQgMC4wMDI3NSwtMC4wMjk0NSAwLjA0Mzc3LDAuMDIwNDl6TTIyOS43NjEzMSwxNzkuMTEyOTFjMC4wNDEwMSwtMC4wNDk5NCAwLjA2ODMyLC0wLjA2NDAzIDAuMDQzNzcsLTAuMDIwNDljLTAuMDA2NzcsMC4wMTIwMSAtMC4wMjE4MywwLjAxODIgLTAuMDQzNzcsMC4wMjA0OXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjI5MDIiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwLjc1Ii8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MTQuNjc5ODE0OTk5OTk5OTk6MTQuNjc5ODE0OTk5OTk5OTktLT4="
                            },
                            dummy: {
                                type: sugarcube.ArgumentType.DUMMY,
                            },
                            statement: {
                                type: sugarcube.ArgumentType.STATEMENT,
                            },
                            target: {
                                type: sugarcube.ArgumentType.OBJECT,
                            }
                        },
                    },
                    {
                        opcode: "call",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.controls.block.call"],
                        arguments: {
                            reference: {
                                type: sugarcube.ArgumentType.REFERENCE,
                            },
                        },
                    },
                ],
            };
        }

        wait({ seconds }) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, sugarcube.cast.toNumber(seconds) * 1000);
            });
        }

        //! Beyond this point is compiled blocks beware!
        ifStatement(block, generator, manager) {
            return `if (${generator.valueToCode(block, "condition", 0) || false}) {
    ${generator.statementToCode(block, "statement")}
}\n${manager.nextBlockToCode(block, generator)}`
        }

        ifElse_Statement(block, generator, manager) {
            return `if (${generator.valueToCode(block, "condition", 0) || false}) {
    ${generator.statementToCode(block, "statement")}
}
else {
    ${generator.statementToCode(block, "statement2")}
}\n${manager.nextBlockToCode(block, generator)}`
        }

        switch_Statement(block, generator, manager) {
            return `switch (${generator.valueToCode(block, "condition", 0)}) {
    ${generator.statementToCode(block, "statement")}

    default: {
        ${generator.statementToCode(block, "default")}
    }
}\n${manager.nextBlockToCode(block, generator)}`;
        }

        branch_Statement(block, generator, manager) {
            
            return `case (${generator.valueToCode(block, "condition", 0)}): {
    ${generator.statementToCode(block, "statement")}
    break;
}\n${manager.nextBlockToCode(block, generator)}`;
        }

        repeat(block, generator, manager) {
            return `{
    let num = ${generator.valueToCode(block, "num", 0)};
    for (let index = 0; index < num; index++) {
        ${generator.statementToCode(block, "statement")}
    }
}\n${manager.nextBlockToCode(block, generator)}`;
        }

        foreach(block, generator, manager) {
            return `{
    let val = ${generator.valueToCode(block, "array", 0) || "[]"};
    if (Array.isArray(val)) {
        for (let ArrayKey in val) {
            ${generator.statementToCode(block, "statement")}
        }
    }
}\n${manager.nextBlockToCode(block, generator)}`;
        }

        repeatUNT(block, generator, manager) {
            return `while (!(${generator.valueToCode(block, "condition", 0) || false})) {
    ${generator.statementToCode(block, "statement")}
}\n${manager.nextBlockToCode(block, generator)}`;
        }

        while(block, generator, manager) {
            return `while (${generator.valueToCode(block, "condition", 0) || false}) {
    ${generator.statementToCode(block, "statement")}
}\n${manager.nextBlockToCode(block, generator)}`;
        }

        continue() {
            return `\ncontinue;\n`;
        }

        break() {
            return `\nbreak;\n`
        }

        doAs(block, generator, manager) {
            return `{
                const __doAsTarget__ = ${generator.valueToCode(block, "target", 0) || null};
                ${generator.statementToCode(block, "statement").replaceAll("this.target", "__doAsTarget__")}
            }\n${manager.nextBlockToCode(block, generator)}`;
        }

        call(args) {
            args.reference();
        }
    }

    sugarcube.extensionManager.registerExtension(new controls());
})();
