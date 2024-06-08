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
              },
              B: {
                type: sugarcube.ArgumentType.STRING,
              },
            },
          },
        ],
      };
    }

    length({A}) {
      return 
    }

    join({A, B}) {
      return 
    }
  }

  sugarcube.extensionManager.registerExtension(new strings());
})();
