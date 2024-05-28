(function () {
  class events {
    getInfo() {
      return {
        id: "events",
        name: "Events",
        color1: "#ffbf00",
        color2: "#e6ac00",
        color3: "#cc9900",
        showColor:true,
        menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny4xMzgxMyIgaGVpZ2h0PSI3Ny4xMzgxMyIgdmlld0JveD0iMCwwLDc3LjEzODEzLDc3LjEzODEzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjQzMDkzLC0xNDEuNDMwOTQpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIxNS42MDQ5OSwxOTkuMDc2NjZsMTguMDAyNzcsLTQ3LjI1NzI3IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjI3LjQyMTMsMTcxLjY5MTMxbDcuODA5MzIsLTIxLjUwMDM5YzAsMCA0Ljk3ODc3LDMuNDA5NDkgOC44MjE5Miw0LjgwNTM5YzMuMDYyNCwxLjExMjMyIDkuNjI5NjQsMS4xODYyMSAxNS4wMTQzOCwyLjc0Njk1YzUuNTI0MiwxLjYwMTE2IDkuODI4NzgsNC42NzU0MSA5LjgyODc4LDQuNjc1NDFjMCwwIC0yLjIxOSwyMC4zODkxNyAtNy44MDkzMiwyMS41MDAzOWMtMS42MzE2MywwLjMyNDMzIC00LjIyMjAzLC00LjAxMjc1IC05LjY3MzY2LC01LjU3MjU3Yy01Ljk0ODUyLC0xLjcwMTk4IC0xMy4yOTI1NywtMS4wMDc5NCAtMTYuNDkzOTMsLTIuMTcwNzRjLTMuNDQyOTgsLTEuMjUwNTUgLTcuNDk3NSwtNC40ODQ0NCAtNy40OTc1LC00LjQ4NDQ0eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjAxLjQzMDk0LDIxOC41NjkwOHYtNzcuMTM4MTNoNzcuMTM4MTN2NzcuMTM4MTN6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozOC41NjkwNjQ5OTk5OTk5OTU6MzguNTY5MDU0OTk5OTk5OTktLT4=",
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
              key: {
                menu: "keys",
              },
            },
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
              message: {
                menu: "messages",
              },
            },
          },
          {
            opcode: "broadcastSend",
            type: sugarcube.BlockType.COMMAND,
            text: "broadcast [message]",
            arguments: {
              message: {
                menu: "messages",
              },
            },
          },
        ],
        menus: {
          keys: {
            items: sugarcube.commonKeys,
          },
          messages: {
            items: "__getMessages",
          },
          messages: {
            acceptReporters: true,
            items: "__getMessages",
          },
        },
      };
    }

    //Just for a menu
    __getMessages() {
      return sugarcube.broadcasts.concat(["New message"]);
    }
  }

  sugarcube.extensionManager.registerExtension(new events());
})();
