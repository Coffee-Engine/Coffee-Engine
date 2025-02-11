(function () {
    //Remove default comments
    const browserEvents = Blockly.browserEvents;

    //If anybody wants to redo the text attribute editing, BE MY GUEST!
    const icons = {
        paintBucket: {
            url: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMTguNjIzMTIiIGhlaWdodD0iMTE4LjYyMzEyIiB2aWV3Qm94PSIwLDAsMTE4LjYyMzEyLDExOC42MjMxMiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4MC42ODg0NCwtMTIwLjY4ODQ0KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMDYuODg1NDUsMTUzLjU2MzQ2bDQ1LjU3MjcyLDE4LjA5NTA1YzAsMCAtMTkuMjMyMjgsNDUuMzg0OTkgLTIyLjM3NzM3LDUyLjY4Nzk5Yy0xLjE3NDQ2LDIuNzI3MTQgLTYuNTg4MDUsNC4wMTczNSAtMTAuMTQ1NCwyLjY1MTEyYy01LjE5Nzk1LC0xLjk5NjMxIC0yMC4wODc4NCwtNy43MTQ5IC0yOS43NTg1NywtMTEuNDI5MDJjLTUuMTA3LC0xLjk2MTM4IC03LjAxNzUyLC03LjM3MjYgLTUuNDEwNzgsLTExLjA3MjMyYzQuMTMwMDYsLTkuNTEwMDEgMjIuMTE5NCwtNTAuOTMyODIgMjIuMTE5NCwtNTAuOTMyODJ6IiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjE2MTYiIHN0cm9rZS13aWR0aD0iOC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjIzLjk3NTIyLDE3OS4zNjU2NmwtMTcuNzU5OTYsLTQ2LjkxMzFsMTIuMDYzMzcsMy42ODYwM2w5LjcxNzcxLDI1LjEzMjAyIiBmaWxsPSJub25lIiBzdHJva2U9IiMxNjE2MTYiIHN0cm9rZS13aWR0aD0iOC41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjY4Ljc3NDc3LDE1Ny4yMjg4OWMzLjk0Nzg4LC0wLjY2NzQgMTIuNjcyOTksMC45MDI1NSAxOC41NDcxNSw0LjE0MTA0YzMuNTQ5NzMsMS45NTcgOC42MzA4NSw3LjY3OTk4IDguNDYyMzEsMTEuOTY3OTNjLTAuMTQzMzUsMy42NDcyOCAtNS4xMDQwMSw2LjA3MTAyIC03LjE0NjIxLDYuMjM1NzdjLTQuNjkxNzQsMC4zNzg0OSAtMTAuNDE4MjYsLTUuMjYwMzkgLTEzLjA2MDk5LC01LjczODE4Yy0zLjc3NDYzLC0wLjY4MjQ0IC02LjcyNDQ0LDAuMjQ3NzggLTEwLjQ3NzUyLDAuMzg1NWMtNy4zOTY5OSwwLjI3MTQ0IC0xMy42OTEwNSwtMC4zMDIwNyAtMjAuMjMwNDMsLTQuMDQ2MDZjLTEuNjYzNzMsLTEuMzUyMzggLTcuNTU3NDUsLTYuMzY5ODggLTcuNTU3NDUsLTYuMzY5ODhjMCwwIDIzLjYyNTA1LC01LjI1MTA4IDMxLjQ2MzE0LC02LjU3NjEzeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMTYxNjE2IiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIxNi42MDMxNiwxNzkuMzY1NjZjMCwtMy44ODY0MSAzLjE1MDU2LC03LjAzNjk2IDcuMDM2OTYsLTcuMDM2OTZjMy44ODY0MSwwIDcuMDM2OTYsMy4xNTA1NiA3LjAzNjk2LDcuMDM2OTZjMCwzLjg4NjQxIC0zLjE1MDU2LDcuMDM2OTYgLTcuMDM2OTYsNy4wMzY5NmMtMy44ODY0MSwwIC03LjAzNjk2LC0zLjE1MDU2IC03LjAzNjk2LC03LjAzNjk2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTYxNjE2IiBzdHJva2Utd2lkdGg9IjguNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjA2Ljg4NTQ1LDE1My41NjM0Nmw0NS41NzI3MiwxOC4wOTUwNWMwLDAgLTE5LjIzMjI4LDQ1LjM4NDk5IC0yMi4zNzczNyw1Mi42ODc5OWMtMS4xNzQ0NiwyLjcyNzE0IC02LjU4ODA1LDQuMDE3MzUgLTEwLjE0NTQsMi42NTExMmMtNS4xOTc5NSwtMS45OTYzMSAtMjAuMDg3ODQsLTcuNzE0OSAtMjkuNzU4NTcsLTExLjQyOTAyYy01LjEwNywtMS45NjEzOCAtNy4wMTc1MiwtNy4zNzI2IC01LjQxMDc4LC0xMS4wNzIzMmM0LjEzMDA2LC05LjUxMDAxIDIyLjExOTQsLTUwLjkzMjgyIDIyLjExOTQsLTUwLjkzMjgyeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMjMuOTc1MjIsMTc5LjM2NTY2bC0xNy43NTk5NiwtNDYuOTEzMWwxMi4wNjMzNywzLjY4NjAzbDkuNzE3NzEsMjUuMTMyMDIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjY4Ljc3NDc3LDE1Ny4yMjg4OWMzLjk0Nzg4LC0wLjY2NzQgMTIuNjcyOTksMC45MDI1NSAxOC41NDcxNSw0LjE0MTA0YzMuNTQ5NzMsMS45NTcgOC42MzA4NSw3LjY3OTk4IDguNDYyMzEsMTEuOTY3OTNjLTAuMTQzMzUsMy42NDcyOCAtNS4xMDQwMSw2LjA3MTAyIC03LjE0NjIxLDYuMjM1NzdjLTQuNjkxNzQsMC4zNzg0OSAtMTAuNDE4MjYsLTUuMjYwMzkgLTEzLjA2MDk5LC01LjczODE4Yy0zLjc3NDYzLC0wLjY4MjQ0IC02LjcyNDQ0LDAuMjQ3NzggLTEwLjQ3NzUyLDAuMzg1NWMtNy4zOTY5OSwwLjI3MTQ0IC0xMy42OTEwNSwtMC4zMDIwNyAtMjAuMjMwNDMsLTQuMDQ2MDZjLTEuNjYzNzMsLTEuMzUyMzggLTcuNTU3NDUsLTYuMzY5ODggLTcuNTU3NDUsLTYuMzY5ODhjMCwwIDIzLjYyNTA1LC01LjI1MTA4IDMxLjQ2MzE0LC02LjU3NjEzeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjE2LjYwMzE2LDE3OS4zNjU2NmMwLC0zLjg4NjQxIDMuMTUwNTYsLTcuMDM2OTYgNy4wMzY5NiwtNy4wMzY5NmMzLjg4NjQxLDAgNy4wMzY5NiwzLjE1MDU2IDcuMDM2OTYsNy4wMzY5NmMwLDMuODg2NDEgLTMuMTUwNTYsNy4wMzY5NiAtNy4wMzY5Niw3LjAzNjk2Yy0zLjg4NjQxLDAgLTcuMDM2OTYsLTMuMTUwNTYgLTcuMDM2OTYsLTcuMDM2OTZ6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMTgwLjY4ODQ0LDIzOS4zMTE1NnYtMTE4LjYyMzEyaDExOC42MjMxMnYxMTguNjIzMTJ6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjo1OS4zMTE1NTk1NTM0MTIxNzo1OS4zMTE1NTk1NTM0MTIxMS0tPg==",
            function: (textArea, comment) => {
                const bounds = textArea.getBoundingClientRect();
                editor.colorPicker.create(bounds.left, bounds.bottom, {
                    color: comment.color1,
                    hasExtensions: true,
                    callback: (color1, color2, color3) => {
                        comment.color1 = color1;
                        if (color2 && color3) {
                            comment.color2 = color2;
                            comment.color3 = color3;
                        } else {
                            const split = coffeeEngine.ColorMath.HexToRGB(color1);

                            //Brighten or darken the color depending on the needs
                            if (coffeeEngine.ColorMath.BrightestChannel(color1) < 128) {
                                comment.color2 = coffeeEngine.ColorMath.RGBtoHex({
                                    r: split.r * 1.1,
                                    g: split.g * 1.1,
                                    b: split.b * 1.1,
                                });

                                comment.color3 = coffeeEngine.ColorMath.RGBtoHex({
                                    r: split.r * 1.2,
                                    g: split.g * 1.2,
                                    b: split.b * 1.2,
                                });
                            } else {
                                comment.color2 = coffeeEngine.ColorMath.RGBtoHex({
                                    r: split.r * 0.9,
                                    g: split.g * 0.9,
                                    b: split.b * 0.9,
                                });

                                comment.color3 = coffeeEngine.ColorMath.RGBtoHex({
                                    r: split.r * 0.8,
                                    g: split.g * 0.8,
                                    b: split.b * 0.8,
                                });
                            }
                        }
                    },
                });
            },
            markdownOnly: false,
        },
        paintBucketText: {
            url: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMTguNjIzMTIiIGhlaWdodD0iMTE4LjYyMzEyIiB2aWV3Qm94PSIwLDAsMTE4LjYyMzEyLDExOC42MjMxMiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4MC42ODg0NCwtMTIwLjY4ODQ0KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMDYuODg1NDUsMTQ5LjA0MTM4bDQ1LjU3MjcyLDE4LjA5NTA1YzAsMCAtMTkuMjMyMjgsNDUuMzg0OTkgLTIyLjM3NzM3LDUyLjY4Nzk5Yy0xLjE3NDQ2LDIuNzI3MTQgLTYuNTg4MDUsNC4wMTczNSAtMTAuMTQ1NCwyLjY1MTEyYy01LjE5Nzk1LC0xLjk5NjMxIC0yMC4wODc4NCwtNy43MTQ5IC0yOS43NTg1NywtMTEuNDI5MDJjLTUuMTA3LC0xLjk2MTM4IC03LjAxNzUyLC03LjM3MjYgLTUuNDEwNzgsLTExLjA3MjMyYzQuMTMwMDYsLTkuNTEwMDEgMjIuMTE5NCwtNTAuOTMyODIgMjIuMTE5NCwtNTAuOTMyODJ6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iOSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIyMy45NzUyMiwxNzQuODQzNThsLTE3Ljc1OTk2LC00Ni45MTMxbDEyLjA2MzM3LDMuNjg2MDNsOS43MTc3MSwyNS4xMzIwMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNjguNzc0NzcsMTUyLjcwNjgxYzMuOTQ3ODgsLTAuNjY3NCAxMi42NzI5OSwwLjkwMjU1IDE4LjU0NzE1LDQuMTQxMDRjMy41NDk3MywxLjk1NyA4LjYzMDg1LDcuNjc5OTggOC40NjIzMSwxMS45Njc5M2MtMC4xNDMzNSwzLjY0NzI4IC01LjEwNDAxLDYuMDcxMDIgLTcuMTQ2MjEsNi4yMzU3N2MtNC42OTE3NCwwLjM3ODQ5IC0xMC40MTgyNiwtNS4yNjAzOSAtMTMuMDYwOTksLTUuNzM4MThjLTMuNzc0NjMsLTAuNjgyNDQgLTYuNzI0NDQsMC4yNDc3OCAtMTAuNDc3NTIsMC4zODU1Yy03LjM5Njk5LDAuMjcxNDQgLTEzLjY5MTA1LC0wLjMwMjA3IC0yMC4yMzA0MywtNC4wNDYwNmMtMS42NjM3MywtMS4zNTIzOCAtNy41NTc0NSwtNi4zNjk4OCAtNy41NTc0NSwtNi4zNjk4OGMwLDAgMjMuNjI1MDUsLTUuMjUxMDggMzEuNDYzMTQsLTYuNTc2MTN6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMy41IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMTYuNjAzMTYsMTc0Ljg0MzU4YzAsLTMuODg2NDEgMy4xNTA1NiwtNy4wMzY5NiA3LjAzNjk2LC03LjAzNjk2YzMuODg2NDEsMCA3LjAzNjk2LDMuMTUwNTYgNy4wMzY5Niw3LjAzNjk2YzAsMy44ODY0MSAtMy4xNTA1Niw3LjAzNjk2IC03LjAzNjk2LDcuMDM2OTZjLTMuODg2NDEsMCAtNy4wMzY5NiwtMy4xNTA1NiAtNy4wMzY5NiwtNy4wMzY5NnoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI5IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTIuMjk4NDUsMTkwLjM0NzQ1djkuNTg5NHYtMTEuMDk0ODRoMzQuODQwMDd2MTAuMDE5NTN2LTguNzI5MTYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI5IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjcwLjM2MzY5LDIzMi4wNjk1MmgtMTEuNzU3N2gyMy40OTc3MmgtMTEuOTU1MDl2LTQyLjM2NzI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iOSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIwNi44ODU0NSwxNDkuMDQxMzhsNDUuNTcyNzIsMTguMDk1MDVjMCwwIC0xOS4yMzIyOCw0NS4zODQ5OSAtMjIuMzc3MzcsNTIuNjg3OTljLTEuMTc0NDYsMi43MjcxNCAtNi41ODgwNSw0LjAxNzM1IC0xMC4xNDU0LDIuNjUxMTJjLTUuMTk3OTUsLTEuOTk2MzEgLTIwLjA4Nzg0LC03LjcxNDkgLTI5Ljc1ODU3LC0xMS40MjkwMmMtNS4xMDcsLTEuOTYxMzggLTcuMDE3NTIsLTcuMzcyNiAtNS40MTA3OCwtMTEuMDcyMzJjNC4xMzAwNiwtOS41MTAwMSAyMi4xMTk0LC01MC45MzI4MiAyMi4xMTk0LC01MC45MzI4MnoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjIzLjk3NTIyLDE3NC44NDM1OGwtMTcuNzU5OTYsLTQ2LjkxMzFsMTIuMDYzMzcsMy42ODYwM2w5LjcxNzcxLDI1LjEzMjAyIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI2OC43NzQ3NywxNTIuNzA2ODFjMy45NDc4OCwtMC42Njc0IDEyLjY3Mjk5LDAuOTAyNTUgMTguNTQ3MTUsNC4xNDEwNGMzLjU0OTczLDEuOTU3IDguNjMwODUsNy42Nzk5OCA4LjQ2MjMxLDExLjk2NzkzYy0wLjE0MzM1LDMuNjQ3MjggLTUuMTA0MDEsNi4wNzEwMiAtNy4xNDYyMSw2LjIzNTc3Yy00LjY5MTc0LDAuMzc4NDkgLTEwLjQxODI2LC01LjI2MDM5IC0xMy4wNjA5OSwtNS43MzgxOGMtMy43NzQ2MywtMC42ODI0NCAtNi43MjQ0NCwwLjI0Nzc4IC0xMC40Nzc1MiwwLjM4NTVjLTcuMzk2OTksMC4yNzE0NCAtMTMuNjkxMDUsLTAuMzAyMDcgLTIwLjIzMDQzLC00LjA0NjA2Yy0xLjY2MzczLC0xLjM1MjM4IC03LjU1NzQ1LC02LjM2OTg4IC03LjU1NzQ1LC02LjM2OTg4YzAsMCAyMy42MjUwNSwtNS4yNTEwOCAzMS40NjMxNCwtNi41NzYxM3oiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTIxNi42MDMxNiwxNzQuODQzNThjMCwtMy44ODY0MSAzLjE1MDU2LC03LjAzNjk2IDcuMDM2OTYsLTcuMDM2OTZjMy44ODY0MSwwIDcuMDM2OTYsMy4xNTA1NiA3LjAzNjk2LDcuMDM2OTZjMCwzLjg4NjQxIC0zLjE1MDU2LDcuMDM2OTYgLTcuMDM2OTYsNy4wMzY5NmMtMy44ODY0MSwwIC03LjAzNjk2LC0zLjE1MDU2IC03LjAzNjk2LC03LjAzNjk2eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTE4MC42ODg0NCwyMzkuMzExNTZ2LTExOC42MjMxMmgxMTguNjIzMTJ2MTE4LjYyMzEyeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI1Mi4yOTg0NSwxOTAuMzQ3NDV2Ny41MjcxOHYtOS4wMzI2MWgzNC44NDAwN3Y3Ljk1NzN2LTYuNjY2OTMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNzAuMzYzNjksMjMyLjA2OTUyaC0xMC4xMDc5MmgxOS43ODU3MmgtOS44OTI4N3YtNDIuMzY3MjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjU5LjMxMTU1OTk5OTk5OTk4Njo1OS4zMTE1Ni0tPg==",
            function: (textArea, comment) => {
                const bounds = textArea.getBoundingClientRect();
                if (comment.markdownMode) {

                }
                else {
                    editor.colorPicker.create(bounds.left, bounds.bottom, {
                        color: comment.color4,
                        hasExtensions: true,
                        callback: (color) => {
                            comment.color4 = color;
                        },
                    });
                }
            },
            markdownOnly: false,
        },
        fontSize: {
            url: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzNS43OTY4MSIgaGVpZ2h0PSIzNS43OTY4MSIgdmlld0JveD0iMCwwLDM1Ljc5NjgxLDM1Ljc5NjgxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIyLjEwMTU5LC0xNjIuMTAxNTgpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PGcgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjxwYXRoIGQ9Ik0yMjcuNDQyODEsMTY5LjA0NDM2djQuNTg3Nzl2LTUuMzY2OTNoMTguMDMxNTd2NC44MTA0di00LjE0MjU3IiBzdHJva2Utd2lkdGg9IjUiLz48cGF0aCBkPSJNMjM2Ljc5MjUyLDE5MC42Mzc3M2gtNi4zMzg3MWgxMi4zMTY0aC02LjA4OXYtMjEuOTI3MjgiIHN0cm9rZS13aWR0aD0iNSIvPjxwYXRoIGQ9Ik0yNDIuMzE3MDUsMTgwLjE3NDk3djEuOTkxNTF2LTMuMTM3MDdoMTAuMjQwMTV2Mi44MjEwMnYtMS44OTgwNyIgc3Ryb2tlLXdpZHRoPSIzIi8+PHBhdGggZD0iTTI0Ny42MjY3NSwxOTEuNzM0NzhoLTMuNTI0NTdoNi45MjI3MmgtMy40NjEzN3YtMTIuNDUyNTMiIHN0cm9rZS13aWR0aD0iMyIvPjwvZz48cGF0aCBkPSJNMjIyLjEwMTYsMTk3Ljg5ODR2LTM1Ljc5NjgxaDM1Ljc5NjgxdjM1Ljc5NjgxeiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PGcgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjxwYXRoIGQ9Ik0yMjcuNDQyODEsMTY5LjA0NDM2djMuODk1NzF2LTQuNjc0ODVoMTguMDMxNTd2NC4xMTgzMnYtMy40NTA0OSIgc3Ryb2tlLXdpZHRoPSIzLjUiLz48cGF0aCBkPSJNMjM2Ljc5MjUyLDE5MC42Mzc3M2gtNS4yMzEzOGgxMC4yNDAxNWgtNS4xMjAwOHYtMjEuOTI3MjgiIHN0cm9rZS13aWR0aD0iMy41Ii8+PHBhdGggZD0iTTI0Mi4zMTcwNSwxODAuMTc0OTd2MS40Mzc4NHYtMi41ODM0aDEwLjI0MDE1djIuMjY3MzV2LTEuMzQ0NCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTI0Ny42MjY3NSwxOTEuNzM0NzhoLTIuOTcwOWg1LjgxNTM5aC0yLjkwNzd2LTEyLjQ1MjUzIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MTcuODk4NDA0OTk5OTk5OTk3OjE3Ljg5ODQxNS0tPg==",
            function: (textArea) => {},
            markdownOnly: true,
        },
        fontBold: {
            url: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzNS43OTY4MSIgaGVpZ2h0PSIzNS43OTY4MSIgdmlld0JveD0iMCwwLDM1Ljc5NjgxLDM1Ljc5NjgxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIyLjEwMTYsLTE2Mi4xMDE1OSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjMwLjk4NDIyLDE2OS41OTI4OHY0Ljg2NDYzdi01LjY0Mzc3aDE4LjAzMTU3djUuNTAyNDl2LTQuODM0NjYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI5LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDAuMzMzOTMsMTkxLjE4NjI1aC02LjMzODcxaDEyLjQ1NDgyaC02LjIyNzQxdi0yMS45MjcyOCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjkuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIyMi4xMDE2LDE5Ny44OTg0di0zNS43OTY4MWgzNS43OTY4MXYzNS43OTY4MXoiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzAuOTg0MjIsMTY5LjU5Mjg4djMuODk1NzF2LTQuNjc0ODVoMTguMDMxNTd2NC4xMTgzMnYtMy40NTA0OSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDAuMzMzOTMsMTkxLjE4NjI1aC01LjIzMTM4aDEwLjI0MDE1aC01LjEyMDA4di0yMS45MjcyOCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE3Ljg5ODQwNDY1MjAwMjM3OjE3Ljg5ODQxNDY1MjAwMjQ1OC0tPg==",
            function: (textArea) => {},
            markdownOnly: true,
        },
        fontItallic: {
            url: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzNS43OTY4MSIgaGVpZ2h0PSIzNS43OTY4MSIgdmlld0JveD0iMCwwLDM1Ljc5NjgxLDM1Ljc5NjgxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIyLjEwMTYsLTE2Mi4xMDE1OSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48ZyBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiPjxwYXRoIGQ9Ik0yMzEuMDA1NjcsMTY5LjU5MjlsLTAuMDI1ODcsNS4xNDE0NmwwLjE4MTY0LC01LjkyMDZoMTguMDMxNTdsLTAuMDcwMzgsNS4zNjQwN2wtMC4wNjMxNCwtNC42OTYyNCIvPjxwYXRoIGQ9Ik0yMzYuMDM4MzksMTkxLjE4NjI3aC02LjMzODcxaDEyLjU5MzIzaC02LjM2NTgzbDQuMzgzNzUsLTIxLjkyNzI4Ii8+PC9nPjxwYXRoIGQ9Ik0yMjIuMTAxNjEsMTk3Ljg5ODQxdi0zNS43OTY4MWgzNS43OTY4MXYzNS43OTY4MXoiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxnIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIzLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTIzMS4wMDU2NywxNjkuNTkyOWwtMC4wMjU4NywzLjg5NTcxbDAuMTgxNjQsLTQuNjc0ODVoMTguMDMxNTdsLTAuMDcwMzgsNC4xMTgzMmwtMC4wNjMxNCwtMy40NTA0OSIvPjxwYXRoIGQ9Ik0yMzYuMDM4MzksMTkxLjE4NjI3aC01LjIzMTM4aDEwLjI0MDE1aC01LjEyMDA4bDQuMzgzNzUsLTIxLjkyNzI4Ii8+PC9nPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE3Ljg5ODM5NDk5OTk5OTk5NDoxNy44OTg0MDQ5OTk5OTk5OTctLT4=",
            function: (textArea) => {},
            markdownOnly: true,
        },
        fontStrike: {
            url: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzNS43OTY4MSIgaGVpZ2h0PSIzNS43OTY4MSIgdmlld0JveD0iMCwwLDM1Ljc5NjgxLDM1Ljc5NjgxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIyLjEwMTYxLC0xNjIuMTAxNjEpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIzMC45ODQyNCwxNjkuNTkyOXY1LjAwMzA0di01Ljc4MjE4aDE4LjAzMTU3djUuMjI1NjV2LTQuNTU3ODIiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI3LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDAuMzMzOTUsMTkxLjE4NjI3aC02LjQ3NzEzaDEyLjU5MzIzaC02LjIyNzQxdi0yMS45MjcyOCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjcuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI0Mi41NjE3MiwxODAuMDAwMDFoNy42OTk4NGgtMjAuMjQ2MjRoOC4wMjg2IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNy41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjIyLjEwMTYyLDE5Ny44OTg0MnYtMzUuNzk2ODFoMzUuNzk2ODF2MzUuNzk2ODF6IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjMwLjk4NDI0LDE2OS41OTI5djMuODk1NzF2LTQuNjc0ODVoMTguMDMxNTd2NC4xMTgzMnYtMy40NTA0OSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDAuMzMzOTUsMTkxLjE4NjI3aC01LjIzMTM4aDEwLjI0MDE1aC01LjEyMDA4di0yMS45MjcyOCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDIuNTYxNzIsMTgwLjAwMDAxaDYuNDU0MDloLTE4LjAzMTU3aDcuMDU5NjgiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoxNy44OTgzODQ5OTk5OTk5OToxNy44OTgzOTQ5OTk5OTk5NjUtLT4=",
            function: (textArea) => {},
            markdownOnly: true,
        },
        image: {
            url: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1MS44NjAwOSIgaGVpZ2h0PSI1MS44NjAwOSIgdmlld0JveD0iMCwwLDUxLjg2MDA5LDUxLjg2MDA5Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjE0LjA2OTk3LC0xNTQuMDY5OTcpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMjAuOTI0ODgsMTkzLjU1MzQydi0yNy4xMDY3OWgzOC4xNTAzdjI3LjEwNjc5eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjgiLz48cGF0aCBkPSJNMjI1LjY5MDcsMTk1LjA0NDAzYzAsMCAtMi40NTk2NywwLjQ0NzIxIC0yLjkwNjg5LC0yLjAxMjQ2Yy0wLjQ0NzIxLC0yLjQ1OTY3IDIuMDEyNDYsLTIuOTA2ODkgMi4wMTI0NiwtMi45MDY4OWMzLjQ4MDU4LC0wLjU1MjA0IDYuMDMxNzksLTMuMDAzODggOS40MTE1NCwtNC4xNjczNWMyLjg1MTE5LC0wLjk4MTUyIDUuMTEwMjYsLTAuMzEyNzcgNy44ODExNCwtMC44NDc2NGMxLjY4MzU4LC0wLjMyNDk4IDIuODkyNzEsLTEuNzAwOTIgNC40OTQ2OCwtMi4xODk4NGMxLjg5MjA0LC0wLjU3NzQ0IDYuNDA4MDksLTAuODc1MjggOC4zOTg2NSwtMC42MTMxN2MxLjM5Nzg4LDAuMTg0MDcgMy4wMjIzMywwLjIwNzAzIDQuMDcwNDgsMS4xNTAwN2MzLjI3MTc2LDIuOTQzNjYgMi4xMTQ0Nyw5LjM2ODcxIC0xLjIyNjc4LDExLjU2Njg3Yy0xLjA4NTIyLDAuNzEzOTUgLTUuMjc4MTksMC41NTk2IC02LjYwNDE5LDAuNTU5NmMtNS4yMjcxOCwtMC41MTY1MyAtMTAuNDUwMzUsLTAuNTQxODggLTE1LjY3NDMyLC0xLjAxMjE2bC0wLjAxMDcsLTAuMDA2MmwtMC4wMDA1MSwwLjAwNTExbC0yLjQ4MjM4LC0wLjI0ODI0Yy0wLjg3ODE2LC0wLjA3NzAxIC0xLjYyNjA5LC0wLjYwODA0IC0yLjAwNzY3LC0xLjM1Njk2Yy0xLjY1NTI5LDAuODY4OTMgLTMuMzI1NTgsMS42NzcyNCAtNS4zNTU1LDIuMDc5MjZ6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMi41Ii8+PHBhdGggZD0iTTIyNy4wMjAxOSwxNzUuNzY4MTFjMCwtMi43NjE0MiAyLjIzODU4LC01IDUsLTVjMi43NjE0MiwwIDUsMi4yMzg1OCA1LDVjMCwyLjc2MTQyIC0yLjIzODU4LDUgLTUsNWMtMi43NjE0MiwwIC01LC0yLjIzODU4IC01LC01eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjE0LjA2OTk4LDIwNS45MzAwN3YtNTEuODYwMDloNTEuODYwMDl2NTEuODYwMDl6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMjAuOTI0ODgsMTkzLjU1MzQydi0yNy4xMDY3OWgzOC4xNTAzdjI3LjEwNjc5eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjUiLz48cGF0aCBkPSJNMjI1LjY5MDcsMTk1LjA0NDAzYzAsMCAtMi40NTk2NywwLjQ0NzIxIC0yLjkwNjg5LC0yLjAxMjQ2Yy0wLjQ0NzIxLC0yLjQ1OTY3IDIuMDEyNDYsLTIuOTA2ODkgMi4wMTI0NiwtMi45MDY4OWMzLjQ4MDU4LC0wLjU1MjA0IDYuMDMxNzksLTMuMDAzODggOS40MTE1NCwtNC4xNjczNWMyLjg1MTE5LC0wLjk4MTUyIDUuMTEwMjYsLTAuMzEyNzcgNy44ODExNCwtMC44NDc2NGMxLjY4MzU4LC0wLjMyNDk4IDIuODkyNzEsLTEuNzAwOTIgNC40OTQ2OCwtMi4xODk4NGMxLjg5MjA0LC0wLjU3NzQ0IDYuNDA4MDksLTAuODc1MjggOC4zOTg2NSwtMC42MTMxN2MxLjM5Nzg4LDAuMTg0MDcgMy4wMjIzMywwLjIwNzAzIDQuMDcwNDgsMS4xNTAwN2MzLjI3MTc2LDIuOTQzNjYgMi4xMTQ0Nyw5LjM2ODcxIC0xLjIyNjc4LDExLjU2Njg3Yy0xLjA4NTIyLDAuNzEzOTUgLTUuMjc4MTksMC41NTk2IC02LjYwNDE5LDAuNTU5NmMtNS4yMjcxOCwtMC41MTY1MyAtMTAuNDUwMzUsLTAuNTQxODggLTE1LjY3NDMyLC0xLjAxMjE2bC0wLjAxMDcsLTAuMDA2MmwtMC4wMDA1MSwwLjAwNTExbC0yLjQ4MjM4LC0wLjI0ODI0Yy0wLjg3ODE2LC0wLjA3NzAxIC0xLjYyNjA5LC0wLjYwODA0IC0yLjAwNzY3LC0xLjM1Njk2Yy0xLjY1NTI5LDAuODY4OTMgLTMuMzI1NTgsMS42NzcyNCAtNS4zNTU1LDIuMDc5MjZ6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PHBhdGggZD0iTTIyNy4wMjAxOSwxNzUuNzY4MTFjMCwtMi43NjE0MiAyLjIzODU4LC01IDUsLTVjMi43NjE0MiwwIDUsMi4yMzg1OCA1LDVjMCwyLjc2MTQyIC0yLjIzODU4LDUgLTUsNWMtMi43NjE0MiwwIC01LC0yLjIzODU4IC01LC01eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjI1LjkzMDAyNToyNS45MzAwMjUtLT4=",
            function: (textArea) => {},
            markdownOnly: true,
        },
    };

    class daveComment {
        #x = 0;
        #y = 0;

        set x(value) {
            this.rect.setAttribute("x", value);
            this.bar.setAttribute("x", value);
            this.foreignObject.setAttribute("x", value);
            this.barForeignObject.setAttribute("x", value);
            this.#x = value;
        }
        set y(value) {
            this.rect.setAttribute("y", value);
            this.bar.setAttribute("y", value);
            this.foreignObject.setAttribute("y", value + 20);
            this.barForeignObject.setAttribute("y", value);
            this.#y = value;
        }

        get x() {
            return this.#x;
        }
        get y() {
            return this.#y;
        }

        #c1 = "#000000";
        #c2 = "#000000";
        #c3 = "#000000";
        #c4 = "#000000";

        set color1(value) {
            this.#c1 = value;
            this.rect.style.fill = value;
        }
        set color2(value) {
            this.#c2 = value;
            this.rect.style.stroke = value;
            this.bar.style.stroke = value;
        }
        set color3(value) {
            this.#c3 = value;
            this.bar.style.fill = value;
        }
        set color4(value) {
            this.#c4 = value;
            this.text.style.color = value;
        }

        get color1() {
            return this.#c1;
        }
        get color2() {
            return this.#c2;
        }
        get color3() {
            return this.#c3;
        }
        get color4() {
            return this.#c4;
        }

        #width = 0;
        #height = 0;

        set width(value) {
            if (value < 100) value = 100;
            this.rect.setAttribute("width", value);
            this.bar.setAttribute("width", value);
            this.foreignObject.setAttribute("width", value);
            this.barForeignObject.setAttribute("width", value);
            this.#width = value;
        }
        set height(value) {
            if (value < 20) value = 20;
            this.rect.setAttribute("height", value);
            this.foreignObject.setAttribute("height", value - 20);
            this.#height = value;
        }

        get width() {
            return this.#width;
        }
        get height() {
            return this.#height;
        }

        constructor(x, y) {
            this.group = sugarcube.createSVGEL("g");
            this.rect = sugarcube.createSVGEL("rect");
            this.bar = sugarcube.createSVGEL("rect");
            this.text = document.createElement("p");
            this.dragger = document.createElement("img");
            this.markdownMode = false;

            //Why two of these? Because it works. I could do one buuuuuutttt
            this.barForeignObject = sugarcube.createSVGEL("foreignObject");
            this.foreignObject = sugarcube.createSVGEL("foreignObject");

            //Dragger icon and stuff
            this.dragger.style.position = "absolute";
            this.dragger.style.top = "100%";
            this.dragger.style.left = "100%";
            this.dragger.style.width = "16px";
            this.dragger.style.height = "16px";
            this.dragger.style.transform = "translate(-100%,-100%)";
            this.dragger.draggable = "false";
            this.dragger.className = "genericNonSelect";
            this.dragger.ondragstart = () => {
                return false;
            };

            //Using a dataURI because the svg was a no show
            this.dragger.src = `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOC45OTEzMiIgaGVpZ2h0PSIxOC45OTEzMiIgdmlld0JveD0iMCwwLDE4Ljk5MTMyLDE4Ljk5MTMyIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjMwLjUwNDM0LC0xNzAuNTA0MzQpIj48ZyBmaWxsPSJub25lIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMzMuMjkxNjIsMTg2LjYzNzUybDEzLjM2OTUyLC0xMy4zNjk1MiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIzOC4wMTU4MywxODYuNzMybDguNjkyNTUsLTguNjkyNTQiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMzMuMjkxNjIsMTg2LjYzNzUybDEzLjM2OTUyLC0xMy4zNjk1MiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIzOC4wMTU4MywxODYuNzMybDguNjkyNTUsLTguNjkyNTQiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMzAuNTA0MzQsMTg5LjQ5NTY2di0xOC45OTEzMmgxOC45OTEzMnYxOC45OTEzMnoiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjkuNDk1NjU5OTk5OTk5OTg3OjkuNDk1NjU5OTk5OTk5OTg3LS0+`;

            //Style the text area
            this.text.contentEditable = true;

            this.text.style.width = "100%";
            this.text.style.height = "100%";
            this.text.style.margin = "0px";
            this.text.style.padding = "0px";
            this.text.style.top = "0px";
            this.text.style.left = "0px";
            this.text.style.position = "absolute";
            this.text.style.backgroundColor = "#00000000";
            this.text.style.color = "#000000";
            this.text.style.borderStyle = "none";
            this.text.style.borderWidth = "0px";
            this.text.placeholder = "comment here!";
            this.text.style.textWrap = "wrap";
            this.text.style.whiteSpaceCollapse = "preserve";

            //Resizing
            browserEvents.bind(this.dragger, "pointerdown", this, (event) => {
                event.stopImmediatePropagation();
                let desiredWidth = this.width;
                let desiredHeight = this.height;

                this.dragging = browserEvents.bind(document, "pointermove", this, (subEvent) => {
                    desiredWidth += subEvent.movementX / sugarcube.workspace.scale;
                    desiredHeight += subEvent.movementY / sugarcube.workspace.scale;

                    this.width = desiredWidth;
                    this.height = desiredHeight;
                });

                this.up = browserEvents.bind(document, "pointerup", this, () => {
                    if (this.dragging) {
                        browserEvents.unbind(this.dragging);
                        browserEvents.unbind(this.up);
                        this.dragging = null;
                        this.up = null;
                    }
                });
            });

            this.foreignObject.appendChild(this.text);
            this.foreignObject.appendChild(this.dragger);

            //Style the comment temporarily
            this.rect.setAttribute("rx", 2.5);
            this.rect.setAttribute("ry", 2.5);

            this.bar.setAttribute("rx", 2.5);
            this.bar.setAttribute("ry", 2.5);
            this.bar.setAttribute("height", 20);
            this.barForeignObject.setAttribute("height", 20);
            this.barForeignObject.style.setProperty("--markdownMode", "hidden");
            this.barForeignObject.style.setProperty("--markdownMul", "0");

            //Set the temporary width and height
            this.width = 100;
            this.height = 100;

            //Stroke stuff
            this.rect.style.strokeWidth = "2px";
            this.bar.style.strokeWidth = "2px";

            //The movement and stuff
            browserEvents.bind(this.barForeignObject, "pointerdown", this, (event) => {
                event.stopImmediatePropagation();
                sugarcube.moveWorkspaceElementToTop(this.group);
                this.dragging = browserEvents.bind(document, "pointermove", document, (event) => {
                    this.x += event.movementX / sugarcube.workspace.scale;
                    this.y += event.movementY / sugarcube.workspace.scale;
                });

                this.up = browserEvents.bind(document, "pointerup", document, () => {
                    if (this.dragging) {
                        browserEvents.unbind(this.dragging);
                        browserEvents.unbind(this.up);
                        this.dragging = null;
                        this.up = null;
                    }
                });
            });

            this.x = x;
            this.y = y;

            //Icons
            for (const iconKey in icons) {
                //Get our icon data and create the clickable thing
                const iconData = icons[iconKey];    
                const icon = document.createElement("img");
                icon.src = iconData.url;

                //Styling for the icon
                icon.style.height = "20px";
                icon.style.position = "relative";

                //Special behavior for the markdown boys
                icon.style.width = iconData.markdownOnly ? "calc(20px * var(--markdownMul))" : "20px";
                icon.style.marginRight = iconData.markdownOnly ? "calc(2px * var(--markdownMul))" : "2px";
                icon.style.visibility = iconData.markdownOnly ? "var(--markdownMode)" : "visible";
                icon.style.transition = iconData.markdownOnly ? "all 125ms" : "";

                //Its image and selection prevention
                icon.className = "genericNonSelect";
                icon.onselect = (event) => {
                    event.stopImmediatePropagation();
                    event.preventDefault();

                    return false;
                };
                this.barForeignObject.appendChild(icon);

                //Functionality
                browserEvents.bind(icon, "pointerdown", this, (event) => {
                    event.stopImmediatePropagation();
                    iconData.function(this.text, this);
                });
            }

            //Append our groups and color our default color
            this.group.appendChild(this.rect);
            this.group.appendChild(this.bar);
            this.group.appendChild(this.foreignObject);
            this.group.appendChild(this.barForeignObject);
            sugarcube.addElementToWorkspace(this.group);

            this.color1 = "#fef49c";
            this.color2 = "#bcA903";
            this.color3 = "#e4db8c";
            this.color4 = "#240b1c";
        }

        serialize() {
            return {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
                
                color1: this.color1,
                color2: this.color2,
                color3: this.color3,
                color4: this.color4,

                text: this.text.innerHTML,
            }
        }

        remove() {
            this.group.parentElement.removeChild(this.group);
            this.group = null;
            this.text = null;
            this.rect = null;
            this.bar = null;
        }
    }

    const commentCallback = (scope) => {
        //Setup our comment structure
        const comment = new daveComment(0, 0);

        //Attach the comment to a block
        if (scope.block) {
            comment.x = scope.block.relativeCoords.x - 125;
            comment.y = scope.block.relativeCoords.y;
            comment.color1 = scope.block.style.colourPrimary;
            comment.color2 = scope.block.style.colourSecondary;
            comment.color3 = scope.block.style.colourTertiary;
            comment.color4 = scope.block.style.colourQuaternary;
        } else if (scope.workspace) {
            comment.x = -scope.workspace.scrollX / scope.workspace.scale;
            comment.y = -scope.workspace.scrollY / scope.workspace.scale;
        }

        sugarcube.comments.push(comment);
    };

    const contextMenuBlock = {
        displayText: "Add Comment",
        id: "sugarcube_commentBlock",
        preconditionFn: () => {
            return "enabled";
        },
        callback: commentCallback,
        scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
    };
    const contextMenuWorkspace = {
        displayText: "Add Comment",
        id: "sugarcube_commentWorkspace",
        preconditionFn: () => {
            return "enabled";
        },
        callback: commentCallback,
        scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
    };

    Blockly.ContextMenuRegistry.registry.unregister("blockComment");
    Blockly.ContextMenuRegistry.registry.register(contextMenuBlock);
    Blockly.ContextMenuRegistry.registry.register(contextMenuWorkspace);

    sugarcube.commentClass = daveComment;
})();
