(function () {
  class sounds {
    getInfo() {
      return {
        id: "sounds",
        name: "Sounds",
        color1: "#cf63cf",
        color2: "#c94fc9",
        color3: "#bd42bd",
        showColor: true,
        menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny4xMzgxMyIgaGVpZ2h0PSI3Ny4xMzgxMyIgdmlld0JveD0iMCwwLDc3LjEzODEzLDc3LjEzODEzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjQzMDk3LC0xNDEuNDMwOTcpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIwMS40MzA5OCwyMTguNTY5MTF2LTc3LjEzODEzaDc3LjEzODEzdjc3LjEzODEzeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PGcgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ij48cGF0aCBkPSJNMjE1LjExNDA3LDE5Mi4wNzI3MWMtMS4wMTQ0NCwtNC4wODI1MyAtMi4zODgxOCwtOS42MTEwNCAtMi45NTMyMywtMTEuODg1MDhjLTAuNDg5OTcsLTEuOTcxODYgMS42ODEyNiwtNS43MTY2MSAzLjE0NjA1LC02LjM1ODk1YzEuNTU4ODcsLTAuNjgzNTkgNC44MjY3OCwtMi4xMTY2NCA0LjgyNjc4LC0yLjExNjY0bDUuOTk2OSwyNC4xMzQxMmMwLDAgLTMuMzcwMzUsMC4zNjgwNyAtNS4wMjUwOSwwLjU0ODc5Yy0xLjYxNTE2LDAuMTc2MzkgLTUuMzA3ODksLTEuNTcxNDYgLTUuOTkxNDEsLTQuMzIyMjN6Ii8+PHBhdGggZD0iTTIyNS45OTUzLDE5NS44Nzk3N2wtNS45OTY5LC0yNC4xMzQxMmMwLDAgNi43MDc3MSwtOS41OTg4MSA4Ljg3NjE2LC0xMi43MDE4OGMxLjI1NDI1LC0xLjc5NDg0IDMuMzU3ODQsLTIuNjg2OTkgMy43NjM5NywtMS4wNTI1NGMxLjMzNjAxLDUuMzc2NjggOC41OTYzOSwzNC41OTU1NyA4LjU5NjM5LDM0LjU5NTU3eiIvPjxwYXRoIGQ9Ik0yMzUuMDAzNTgsMTY3LjUwOTI2YzAsMCA3LjI2MDM4LDI5LjIxODkgOC41OTYzOSwzNC41OTU1N2MwLjQwNjEzLDEuNjM0NDYgLTEuODcwMzcsMS44MzA2OCAtMy44MTg4NSwwLjgzMTY2Yy0zLjM2ODY5LC0xLjcyNzE5IC0xMy43ODkxMiwtNy4wNjk5NSAtMTMuNzg5MTIsLTcuMDY5OTVsLTUuOTk2OSwtMjQuMTM0MTJ6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIvPjwvZz48cGF0aCBkPSJNMjQxLjAzNTM5LDE2OC40MjgyNGw5Ljg1NDEsLTE2LjM3MDQ1IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI0Mi45Mzg3MywxNzguODIxMTRsMjAuMDQxNTMsLTQuOTc5OTciIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQ2LjEzNTA1LDE4OC45NTE0NWwxNi4zNzA0NCw5Ljg1NDExIiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNjIuOTgwMjYsMTczLjg0MTE4bC0yMC4wNDE1Myw0Ljk3OTk3IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM4LjU2OTAyNTAwMDAwMDAxOjM4LjU2OTAyNTAwMDAwMDAxLS0+",
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

  sugarcube.extensionManager.registerExtension(new sounds());
})();
