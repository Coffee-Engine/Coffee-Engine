(function () {
  class operators {
    getInfo() {
      return {
        id: "operators",
        name: "Operators",
        color1: "#59C059",
        color2: "#48AB48",
        color3: "#389438",
        showColor: true,
        menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3MC41IiBoZWlnaHQ9IjcwLjUiIHZpZXdCb3g9IjAsMCw3MC41LDcwLjUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDQuNzUwMDMsLTE0NC43NSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjIwLjk5NTE5LDE5OS42Mjc3NWMwLDAgMi4zOTk5Niw1LjM0MjMgNy41NTY4NSw1LjQ3OTg5YzYuNTQ4NTIsMC4xNzQ3MyA3LjAwNzU2LC0zLjIxNzUyIDcuMDA3NTYsLTYuODczNjhjMCwtMTAuMjQ0ODggMCwtMzAuNDYxNjEgMCwtMzYuMDk0M2MwLC0yLjg1NjY1IDIuNDg0MzUsLTcuMjUzNzcgNy41NTAxNiwtNy4yNTM3N2M0LjY0MDkzLDAgOC41MTIxMyw1LjQ2ODgzIDguNTEyMTMsNS40Njg4MyIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDYuNDQ0MzEsMTczLjc2MDEzYzAsMCAtNy41MDA0MywxLjQ1MTA5IC0xMC43NzIxNiwxLjAzNDQ4Yy0zLjM3NDQyLC0wLjQyOTY4IC05LjE3NTc4LC0zLjU3NDU0IC05LjE3NTc4LC0zLjU3NDU0IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMDQuNzUwMDQsMjE1LjI1di03MC41aDcwLjV2NzAuNXoiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNDQuMjM4OTcsMTkwLjMxMjkyaDE0Ljc2NTg1IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI1MS42MjE4OSwxOTcuNjk1ODV2LTE0Ljc2NTg1IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzUuMjQ5OTY1OjM1LjI1MDAwNDk5OTk5OTk5LS0+",
        blocks: [
          {
            opcode: "ifStatement",
            type: sugarcube.BlockType.CONDITIONAL,
            text: "if [condition] then [dummy] [statement]",
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
        ],
      };
    }
  }

  sugarcube.extensionManager.registerExtension(new operators());
})();
