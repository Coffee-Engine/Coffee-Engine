(function () {
  class objects {
    getInfo() {
      return {
        id: "objects",
        name: "Objects",
        color1: "#8672FF",
        color2: "#855CD6",
        color3: "#774DCB",
        showColor: true,
        menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2MC4zNTYwNSIgaGVpZ2h0PSI1Ni40MTM1OSIgdmlld0JveD0iMCwwLDYwLjM1NjA1LDU2LjQxMzU5Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA5LjgyMTk4LC0xNTEuNzkzMikiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNi41IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjMwLjA3NzgsMTYzLjQ2ODk0YzAsLTEuNzQ1NTEgMCwtMy45ODI2NCAwLC01LjEwNjUxYzAsLTEuMjU1MjUgMC44Mzk5NSwtMy4zMTkyMyAxLjcxMzg0LC0zLjMxOTIzYzIuMjM4NDksMCAxMi4xOTY1NCwwIDE2LjMyNjUzLDBjMS4xMTQwNSwwIDEuODA0MDQsMS4xODYxMiAxLjgwNDA0LDIuNjgwOTJjMCwxLjg4MTQ4IDAsNC4yNTIgMCw1LjM2MTg0YzAsMS4xNzY5MSAtMC41MDg5OCwyLjgwODU4IC0xLjYyMzY0LDIuODA4NThjLTQuMjA3NjYsMCAtMTQuNjU1NzEsMCAtMTYuNzc3NTQsMGMtMC43NTE2NSwwIC0xLjQ0MzIzLC0xLjA2MzAxIC0xLjQ0MzIzLC0yLjQyNTZ6IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzAuMDc3OCwyMDIuNTMxMmMwLC0xLjc0NTUxIDAsLTMuOTgyNjQgMCwtNS4xMDY1MWMwLC0xLjI1NTI1IDAuODM5OTYsLTMuMzE5MjMgMS43MTM4NCwtMy4zMTkyM2MyLjIzODQ5LDAgMTIuMTk2NTQsMCAxNi4zMjY1MywwYzEuMTE0MDUsMCAxLjgwNDA0LDEuMTg2MTIgMS44MDQwNCwyLjY4MDkyYzAsMS44ODE0OCAwLDQuMjUxOTkgMCw1LjM2MTgzYzAsMS4xNzY5MiAtMC41MDg5OCwyLjgwODU4IC0xLjYyMzY0LDIuODA4NThjLTQuMjA3NjYsMCAtMTQuNjU1NzEsMCAtMTYuNzc3NTQsMGMtMC43NTE2NSwwIC0xLjQ0MzIzLC0xLjA2MyAtMS40NDMyMywtMi40MjU1OXoiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIyMS43NzE4LDE5OS4zNjU3NGMwLDAgLTMuNzI1OTMsMCAtNC45NzEzMywwYy0wLjY2MTQxLDAgLTEuOTMzMjksLTAuOTI4MjcgLTEuOTMzMjksLTIuNDkzMzRjMCwtMS45NjE0MyAtMS43OTUyLC01LjA4OTI3IC0xLjc5NTIsLTguNDc3MzRjMCwtMi42NjUyNyAzLjQ1MjMxLC01LjU4MTgzIDMuNDUyMzEsLTguNDc3MzRjMCwtMy4xMzE0NiAtMy4zMTQyMiwtNi4yMzgzIC0zLjMxNDIyLC04Ljk3NjAxYzAsLTMuOTE5MSAxLjY1NzExLC03LjA4MTc2IDEuNjU3MTEsLTguNDc3MzRjMCwtMS40NzU1NCAxLjEzOTQ3LC0yLjgyNTc4IDEuOTMzMjksLTIuODI1NzhjMS4yNzI5NSwwIDQuOTcxMzMsMCA0Ljk3MTMzLDAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNTguMjI4MiwxNTkuNjM4NmMwLDAgMy42OTgzNywwIDQuOTcxMzMsMGMwLjc5MzgyLDAgMS45MzMzLDEuMzUwMjQgMS45MzMzLDIuODI1NzhjMCwxLjM5NTU5IDEuNjU3MTEsNC41NTgyNCAxLjY1NzExLDguNDc3MzRjMCwyLjczNzcxIC0zLjMxNDIyLDUuODQ0NTUgLTMuMzE0MjIsOC45NzYwMWMwLDIuODk1NTEgMy40NTIzMSw1LjgxMjA3IDMuNDUyMzEsOC40NzczNGMwLDMuMzg4MDcgLTEuNzk1Miw2LjUxNTkxIC0xLjc5NTIsOC40NzczNGMwLDEuNTY1MDcgLTEuMjcxODgsMi40OTMzNCAtMS45MzMzLDIuNDkzMzRjLTEuMjQ1NCwwIC00Ljk3MTMzLDAgLTQuOTcxMzMsMCIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMzAuMDc3ODEsMTgzLjAwMDA3YzAsLTEuNzQ1NTEgMCwtMy45ODI2NCAwLC01LjEwNjUxYzAsLTEuMjU1MjUgMC44Mzk5NSwtMy4zMTkyMyAxLjcxMzgzLC0zLjMxOTIzYzIuMjM4NSwwIDEyLjE5NjU1LDAgMTYuMzI2NTMsMGMxLjExNDA2LDAgMS44MDQwMywxLjE4NjEyIDEuODA0MDMsMi42ODA5MmMwLDEuODgxNDggMCw0LjI1MTk5IDAsNS4zNjE4M2MwLDEuMTc2OTIgLTAuNTA4OTgsMi44MDg1OCAtMS42MjM2NCwyLjgwODU4Yy00LjIwNzY2LDAgLTE0LjY1NTcyLDAgLTE2Ljc3NzU0LDBjLTAuNzUxNjQsMCAtMS40NDMyMywtMS4wNjMgLTEuNDQzMjMsLTIuNDI1NTl6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjMwLjE3ODAxNTAwODI5MDE3NDoyOC4yMDY3OTY4ODIyNjgyOTMtLT4=",
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
