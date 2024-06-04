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
        menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny4xMzgxMyIgaGVpZ2h0PSI3Ny4xMzgxMyIgdmlld0JveD0iMCwwLDc3LjEzODEzLDc3LjEzODEzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjQzMDk1LC0xNDEuNDMwOTUpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIxNS42MDUwMSwxOTkuMDc2NjdsMTguMDAyNzcsLTQ3LjI1NzI3IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iOC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjI3LjQyMTMyLDE3MS42OTEzMmw3LjgwOTMyLC0yMS41MDAzOWMwLDAgNC45Nzg3NywzLjQwOTQ5IDguODIxOTIsNC44MDUzOWMzLjA2MjQsMS4xMTIzMiA5LjYyOTY0LDEuMTg2MjEgMTUuMDE0MzgsMi43NDY5NWM1LjUyNDIsMS42MDExNiA5LjgyODc4LDQuNjc1NDEgOS44Mjg3OCw0LjY3NTQxYzAsMCAtMi4yMTksMjAuMzg5MTcgLTcuODA5MzIsMjEuNTAwMzljLTEuNjMxNjMsMC4zMjQzMyAtNC4yMjIwMywtNC4wMTI3NSAtOS42NzM2NiwtNS41NzI1N2MtNS45NDg1MiwtMS43MDE5OCAtMTMuMjkyNTcsLTEuMDA3OTQgLTE2LjQ5MzkzLC0yLjE3MDc0Yy0zLjQ0Mjk4LC0xLjI1MDU1IC03LjQ5NzUsLTQuNDg0NDQgLTcuNDk3NSwtNC40ODQ0NHoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMDEuNDMwOTYsMjE4LjU2OTA5di03Ny4xMzgxM2g3Ny4xMzgxM3Y3Ny4xMzgxM3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM4LjU2OTA0NDk5OTk5OTk5OjM4LjU2OTA0NTAwMDAwMDAyLS0+",
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

    onStart() {
      return true;
    }
  }

  sugarcube.extensionManager.registerExtension(new events());
})();
