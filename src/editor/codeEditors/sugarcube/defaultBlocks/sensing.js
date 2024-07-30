(function () {
    class sensing {
        getInfo() {
            return {
                id: "sensing",
                name: "Sensing",
                color1: "#5CB1D6",
                color2: "#47A8D1",
                color3: "#2E8EB8",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3MC41IiBoZWlnaHQ9IjcwLjUiIHZpZXdCb3g9IjAsMCw3MC41LDcwLjUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDQuNzUwMDEsLTE0NC43NSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjQ4Ljc4MzIxLDE3OS44OTYxMWMyLjY0MTA4LDIuNDUwMDIgMi43OTU5Niw2LjU3NzE3IDAuMzQ1OTQsOS4yMTgyNGMtMi40NTAwMiwyLjY0MTA4IC02LjU3NzE3LDIuNzk1OTYgLTkuMjE4MjQsMC4zNDU5NGMtMi42NDEwOCwtMi40NTAwMiAtMi43OTU5NiwtNi41NzcxNyAtMC4zNDU5NCwtOS4yMTgyNGMyLjQ1MDAyLC0yLjY0MTA4IDYuNTc3MTcsLTIuNzk1OTYgOS4yMTgyNCwtMC4zNDU5NHoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTQuMzI4ODUsMTY4Ljc2OTg2bDEzLjA1MjA0LDEyLjEwNzg1bC0yNS4wOTcyNywyNy4wNTQzOWwtMTMuMDUyMDQsLTEyLjEwNzg1bDYuMzUwNjcsLTYuODQ1OWMwLjUwOTg0LDEuMDQzMzYgMS4yMTcsMi4wMTIxMiAyLjExOTM3LDIuODQ5MjFjMy45MjY5MywzLjY0Mjg1IDEwLjA2MzQzLDMuNDEyNTYgMTMuNzA2MjgsLTAuNTE0MzZjMy42NDI4NSwtMy45MjY5MyAzLjQxMjU2LC0xMC4wNjM0MyAtMC41MTQzNiwtMTMuNzA2MjhjLTAuOTAyMzcsLTAuODM3MDkgLTEuOTIxNCwtMS40Njk2NSAtMy4wMDAwNCwtMS44OTk4NnoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjUuODcyNzksMTg4LjkzNzZjMCwwIC0wLjUzMzU5LC03LjM4NjU0IDYuNDc4NDgsLTE1LjMwMjQ5YzcuNDI1NjYsLTguMzgyODcgMTQuODU4NTcsLTcuNjk4NDUgMTQuODU4NTcsLTcuNjk4NDUiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjEzLjA0ODE1LDE5Ny45MjE1NWMwLDAgLTMuNjEyNTQsLTE2Ljk2Nzk1IDEwLjEyNzY2LC0zMi43MTUyN2MxNC41NTA2MywtMTYuNjc2MTMgMzIuMDMxNTEsLTEyLjczMTU1IDMyLjAzMTUxLC0xMi43MzE1NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMDQuNzUwMDIsMjE1LjI1di03MC41aDcwLjV2NzAuNXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM1LjI0OTk4NTAwMDAwMDAxOjM1LjI1MDAwNDk5OTk5OTk5LS0+",
                blocks: [
                    {
                        opcode: "isKeyDown",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: "key [key] pressed?",
                        arguments: {
                            key: {
                                type: sugarcube.ArgumentType.STRING,
                                menu: "keys",
                            },
                        },
                    },
                ],
                menus: {
                    keys: {
                        items: sugarcube.commonKeys,
                        acceptReporters: true,
                    },
                },
            };
        }

        isKeyDown({ key }) {
            return sugarcube.cast.toBoolean(coffeeEngine.inputs.keys[key]);
        }
    }

    sugarcube.extensionManager.registerExtension(new sensing());
})();
