(function() {
    class variables {
        getInfo() {
            return {
                id: "variables",
                name: "Variables",
                color1: "#8672FF",
                color2: "#855CD6",
                color3: "#774DCB",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1Mi45NTczIiBoZWlnaHQ9IjUwLjYzMTQ4IiB2aWV3Qm94PSIwLDAsNTIuOTU3Myw1MC42MzE0OCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIxNC40NjgwNiwtMTU0LjY4NDI2KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIzMi4yMzk3NywxNjYuNjU5NjdjMCwwIDMuNjQ5OTgsOS4wNTMwNyA2LjE3MzE0LDEzLjQxNTc1YzIuNjE3LDQuNTI0OTQgOS4yNTc2MywxMy4yNjQ5MSA5LjI1NzYzLDEzLjI2NDkxIi8+PHBhdGggZD0iTTIyOC40MTcyNCwxOTEuMjEzYzAsMCA0LjE0NDk4LC02Ljg3OTE4IDguMzQ1MTIsLTEwLjk2MTA0YzMuMjM5NTEsLTMuMTQ4MjkgMTQuNzMwNzIsLTExLjQ2NDk1IDE0LjczMDcyLC0xMS40NjQ5NSIvPjxwYXRoIGQ9Ik0yMjcuNTU2NiwxNTguMDE2ODFjMCwwIC03LjIwMTY3LC0yLjM3MTY1IC05LjgzODUzLDE4LjMwOTE1Yy0zLjA4Njg1LDI0LjIxMDAxIDcuNTExNDIsMjUuNzM5NzggNy41MTE0MiwyNS43Mzk3OCIvPjxwYXRoIGQ9Ik0yNTYuODQ2NjUsMTU4LjAyNTE5YzAsMCA3LjQ1MjMyLC0xLjM5NzAzIDcuMzI3MTYsMTkuNDUwODJjLTAuMTQ2NTIsMjQuNDA1NTcgLTEwLjg1NDAzLDI0LjUxODMyIC0xMC44NTQwMywyNC41MTgzMiIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoyNS41MzE5MzU5MDY4OTc1NjoyNS4zMTU3NDA2NDMwNzMxLS0+",
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
                        type:sugarcube.ArgumentType.OBJECT
                      }
                    }
                  },
                  {
                    opcode: "getChildren",
                    type: sugarcube.BlockType.ARRAY,
                    text: "children of [object]",
                    arguments: {
                      object: {
                        type:sugarcube.ArgumentType.OBJECT
                      }
                    }
                  },
                  "---",
                  {
                    opcode: "getVariable",
                    type: sugarcube.BlockType.REPORTER,
                    text: "variable [var] of [object]",
                    arguments: {
                      var: {
                        type:sugarcube.ArgumentType.STRING,
                        defaultValue:"variable"
                      },
                      object: {
                        type:sugarcube.ArgumentType.OBJECT
                      }
                    }
                  },
                ],
              };
        }
    }
})()