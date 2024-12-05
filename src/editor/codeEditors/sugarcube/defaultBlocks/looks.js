(function () {
    class looks {
        getInfo() {
            return {
                id: "looks",
                name: editor.language["sugarcube.looks"],
                color1: "#9966ff",
                color2: "#855cd6",
                color3: "#774dcb",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny4xMzgxMyIgaGVpZ2h0PSI3Ny4xMzgxMyIgdmlld0JveD0iMCwwLDc3LjEzODEzLDc3LjEzODEzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAxLjQzMDk5LC0xNDEuNDMwOTkpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIwMS40MzEsMjE4LjU2OTEzdi03Ny4xMzgxM2g3Ny4xMzgxM3Y3Ny4xMzgxM3oiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIvPjxnIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiI+PHBhdGggZD0iTTIzMi4zMTc4NSwyMTMuMDU0NzJjMCwwIC0yLjkwMzgyLC0xMi45MTg5MiAtNy4wODM5NSwtMTcuMDk5MDhjLTQuNDM5ODYsLTQuNDM5ODYgLTE4LjgyMzExLC04LjgwNzk4IC0xOC44MjMxMSwtOC44MDc5OGMwLDAgMTQuMTM3OTIsLTMuMTM3NzMgMTguNTYzNzgsLTcuNTYzNTdjNC4xOTc3NCwtNC4xOTc3NCA3LjM0MzI4LC0xOC4zNDM0OCA3LjM0MzI4LC0xOC4zNDM0OGMwLDAgMS45OTQyOSwxNC40NzIxMSA2LjI2MzE4LDE4Ljc0MTAxYzQuMzY0NjUsNC4zNjQ2NSAxOS42NDM4Nyw3LjE2NjA0IDE5LjY0Mzg3LDcuMTY2MDRjMCwwIC0xNS4wNTA5OSw0LjcwNzUxIC0xOS40OTI3NCw5LjE0OTI5Yy00LjE3NzcyLDQuMTc3NzIgLTYuNDE0MzEsMTYuNzU3NzcgLTYuNDE0MzEsMTYuNzU3Nzd6Ii8+PHBhdGggZD0iTTIyNS45MDM1MywxOTYuMjk2OThjLTQuNDQxNzUsLTQuNDQxNzUgLTE5LjQ5Mjc0LC05LjE0OTI5IC0xOS40OTI3NCwtOS4xNDkyOWMwLDAgMTUuMjc5MjIsLTIuODAxMzkgMTkuNjQzODcsLTcuMTY2MDRjNC4yNjg5LC00LjI2ODkgNi4yNjMxOSwtMTguNzQxMDEgNi4yNjMxOSwtMTguNzQxMDFjMCwwIDMuMTQ1NTIsMTQuMTQ1NzIgNy4zNDMyNywxOC4zNDM0NmM0LjQyNTg0LDQuNDI1ODQgMTguNTYzNzYsNy41NjM1NyAxOC41NjM3Niw3LjU2MzU3YzAsMCAtMTQuMzgzMjEsNC4zNjgxMSAtMTguODIzMDgsOC44MDhjLTQuMTgwMTYsNC4xODAxNiAtNy4wODM5NSwxNy4wOTkwNSAtNy4wODM5NSwxNy4wOTkwNWMwLDAgLTIuMjM2NiwtMTIuNTgwMDQgLTYuNDE0MzIsLTE2Ljc1Nzc3eiIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iLz48cGF0aCBkPSJNMjM4LjczMjE3LDE3Ny45OTgzN2M0LjQ0MTc1LDQuNDQxNzUgMTkuNDkyNzQsOS4xNDkyOSAxOS40OTI3NCw5LjE0OTI5YzAsMCAtMTUuMjc5MjIsMi44MDE0IC0xOS42NDM4Nyw3LjE2NjA1Yy00LjI2ODksNC4yNjg5IC02LjI2MzE4LDE4Ljc0MTAxIC02LjI2MzE4LDE4Ljc0MTAxYzAsMCAtMy4xNDU1MywtMTQuMTQ1NzIgLTcuMzQzMjgsLTE4LjM0MzQ2Yy00LjQyNTg0LC00LjQyNTg0IC0xOC41NjM3OCwtNy41NjM1NyAtMTguNTYzNzgsLTcuNTYzNTdjMCwwIDE0LjM4MzIxLC00LjM2ODA5IDE4LjgyMzA3LC04LjgwNzk5YzQuMTgwMTYsLTQuMTgwMTYgNy4wODM5OCwtMTcuMDk5MDYgNy4wODM5OCwtMTcuMDk5MDZjMCwwIDIuMjM2NTksMTIuNTgwMDQgNi40MTQzMSwxNi43NTc3N3oiIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2luZGV4JnF1b3Q7Om51bGx9Ii8+PHBhdGggZD0iTTIzMi4zMTc4NSwxNjEuMjQwNjNjMCwwIDIuOTAzODIsMTIuOTE4OTMgNy4wODM5OCwxNy4wOTkwNmM0LjQzOTg2LDQuNDM5ODYgMTguODIzMDcsOC44MDc5OSAxOC44MjMwNyw4LjgwNzk5YzAsMCAtMTQuMTM3OTEsMy4xMzc3MyAtMTguNTYzNzUsNy41NjM1N2MtNC4xOTc3NCw0LjE5Nzc3IC03LjM0MzI4LDE4LjM0MzQ2IC03LjM0MzI4LDE4LjM0MzQ2YzAsMCAtMS45OTQyOSwtMTQuNDcyMTEgLTYuMjYzMTksLTE4Ljc0MTAxYy00LjM2NDY1LC00LjM2NDY1IC0xOS42NDM4NywtNy4xNjYwNSAtMTkuNjQzODcsLTcuMTY2MDVjMCwwIDE1LjA1MDk5LC00LjcwNzU0IDE5LjQ5Mjc0LC05LjE0OTI5YzQuMTc3NzIsLTQuMTc3NzIgNi40MTQzMiwtMTYuNzU3NzcgNi40MTQzMiwtMTYuNzU3Nzd6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIvPjwvZz48cGF0aCBkPSJNMjA0Ljc1MDAyLDIxNS4yNXYtNzAuNWg3MC41djcwLjV6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiLz48ZyBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0yNTguMjI0OTEsMTc3LjY3Mzg4YzAsMCAtMS43MjIxMiwtNy42NjE2MyAtNC4yMDExNywtMTAuMTQwNjljLTIuNjMzMDgsLTIuNjMzMDggLTExLjE2MzEzLC01LjIyMzYxIC0xMS4xNjMxMywtNS4yMjM2MWMwLDAgOC4zODQ1NiwtMS44NjA4NSAxMS4wMDkzNCwtNC40ODU2MWMyLjQ4OTQ5LC0yLjQ4OTQ5IDQuMzU0OTcsLTEwLjg3ODY5IDQuMzU0OTcsLTEwLjg3ODY5YzAsMCAxLjE4MjcyLDguNTgyNzYgMy43MTQ0MSwxMS4xMTQ0NGMyLjU4ODQ4LDIuNTg4NDggMTEuNjQ5ODksNC4yNDk4NSAxMS42NDk4OSw0LjI0OTg1YzAsMCAtOC45MjYwNiwyLjc5MTgxIC0xMS41NjAyNiw1LjQyNjAzYy0yLjQ3NzYyLDIuNDc3NjIgLTMuODA0MDMsOS45MzgyNyAtMy44MDQwMyw5LjkzODI3eiIvPjxwYXRoIGQ9Ik0yNTQuNDIwODcsMTY3LjczNTYzYy0yLjYzNDIsLTIuNjM0MiAtMTEuNTYwMjYsLTUuNDI2MDMgLTExLjU2MDI2LC01LjQyNjAzYzAsMCA5LjA2MTQxLC0xLjY2MTM4IDExLjY0OTg5LC00LjI0OTg1YzIuNTMxNjksLTIuNTMxNjkgMy43MTQ0MiwtMTEuMTE0NDQgMy43MTQ0MiwtMTEuMTE0NDRjMCwwIDEuODY1NDcsOC4zODkxOSA0LjM1NDk2LDEwLjg3ODY4YzIuNjI0NzcsMi42MjQ3NyAxMS4wMDkzMyw0LjQ4NTYxIDExLjAwOTMzLDQuNDg1NjFjMCwwIC04LjUzMDAzLDIuNTkwNTMgLTExLjE2MzEyLDUuMjIzNjNjLTIuNDc5MDYsMi40NzkwNiAtNC4yMDExNywxMC4xNDA2NyAtNC4yMDExNywxMC4xNDA2N2MwLDAgLTEuMzI2NDIsLTcuNDYwNjUgLTMuODA0MDQsLTkuOTM4Mjd6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIvPjxwYXRoIGQ9Ik0yNjIuMDI4OTUsMTU2Ljg4MzU1YzIuNjM0MiwyLjYzNDIgMTEuNTYwMjYsNS40MjYwMyAxMS41NjAyNiw1LjQyNjAzYzAsMCAtOS4wNjE0MSwxLjY2MTM4IC0xMS42NDk4OSw0LjI0OTg2Yy0yLjUzMTY5LDIuNTMxNjkgLTMuNzE0NDEsMTEuMTE0NDQgLTMuNzE0NDEsMTEuMTE0NDRjMCwwIC0xLjg2NTQ3LC04LjM4OTE5IC00LjM1NDk2LC0xMC44Nzg2OGMtMi42MjQ3NywtMi42MjQ3NyAtMTEuMDA5MzQsLTQuNDg1NjEgLTExLjAwOTM0LC00LjQ4NTYxYzAsMCA4LjUzMDAzLC0yLjU5MDUyIDExLjE2MzExLC01LjIyMzYyYzIuNDc5MDYsLTIuNDc5MDYgNC4yMDExOSwtMTAuMTQwNjggNC4yMDExOSwtMTAuMTQwNjhjMCwwIDEuMzI2NDIsNy40NjA2NiAzLjgwNDAzLDkuOTM4Mjd6IiBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpbmRleCZxdW90OzpudWxsfSIvPjxwYXRoIGQ9Ik0yNTguMjI0OTEsMTQ2Ljk0NTI5YzAsMCAxLjcyMjEyLDcuNjYxNjMgNC4yMDExOSwxMC4xNDA2OGMyLjYzMzA4LDIuNjMzMDggMTEuMTYzMTEsNS4yMjM2MiAxMS4xNjMxMSw1LjIyMzYyYzAsMCAtOC4zODQ1NSwxLjg2MDg1IC0xMS4wMDkzMiw0LjQ4NTYxYy0yLjQ4OTQ5LDIuNDg5NTEgLTQuMzU0OTYsMTAuODc4NjggLTQuMzU0OTYsMTAuODc4NjhjMCwwIC0xLjE4MjczLC04LjU4Mjc2IC0zLjcxNDQyLC0xMS4xMTQ0NGMtMi41ODg0OCwtMi41ODg0OCAtMTEuNjQ5ODksLTQuMjQ5ODYgLTExLjY0OTg5LC00LjI0OTg2YzAsMCA4LjkyNjA2LC0yLjc5MTgzIDExLjU2MDI2LC01LjQyNjAzYzIuNDc3NjIsLTIuNDc3NjIgMy44MDQwNCwtOS45MzgyNyAzLjgwNDA0LC05LjkzODI3eiIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iLz48L2c+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzguNTY5MDA1MDAwMDAwMDA0OjM4LjU2OTAwNTAwMDAwMDAwNC0tPg==",
                blocks: [
                    {
                        //Shhhhhhhh
                        opcode: "color",
                        type: sugarcube.BlockType.REPORTER,
                        text: "[color]",
                        arguments: {
                            color: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType: "Color",
                                defaultValue: "#0000ff",
                            },
                        },
                        hideFromPalette: true,
                    },
                    {
                        opcode: "setSprite",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.looks.block.setSprite"],
                        filter: ["Sprite"],
                        arguments: {
                            image: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType:"Image"
                            }
                        }
                    },
                    {
                        opcode: "setTint",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.looks.block.setTint"],
                        filter: ["Sprite"],
                        arguments: {
                            tint: {
                                type: sugarcube.ArgumentType.COLOR,
                                defaultValue:"#0000ff",
                            }
                        }
                    }
                ],
                fields: {
                    Color: {
                        acceptReporters: false,
                        wholeBlockIsField: true,

                        //Our custom editor
                        editor: "color_Editor",
                        sizeOverride: [32, 32],

                        //Stuff
                        initilize: "color_Init",
                        render: "color_Render",
                    },
                    Image: {
                        acceptReporters: true,
                        editor:"file_Editor",

                        initilize: "file_Init",
                    }
                },
            };
        }

        setSprite({ image }, util) {
            //Hope to god its an image
            util.target.spritePath = image;
        }

        color_Init(field) {
            field.createBorderRect_();
        }

        color_Editor(field) {
            const bounding = field.borderRect_.getBoundingClientRect();
            editor.colorPicker.create(bounding.x + bounding.width / 2, bounding.y + bounding.height / 2, {
                color: field.value,
                callback: (color) => {
                    field.value = color;
                },
            });
        }

        color_Render(value, B, field) {
            field.borderRect_.style.fill = "#00000000";
            field.sourceBlock_.svgGroup_.firstChild.style.fill = value || "#0000ff";
            field.borderRect_.setAttribute("width", 52);
            field.borderRect_.setAttribute("x", -10);
            field.borderRect_.setAttribute("y", -4);
            field.borderRect_.setAttribute("height", 40);
            field.borderRect_.setAttribute("rx", 20);
            field.borderRect_.setAttribute("ry", 20);
        }

        file_Init(field) {
            field.createBorderRect_();
            field.createTextElement_();
        }

        file_Editor(field) {
            //Its like some sort of loading. :trol:
            const newLoadal = new editor.windows.modalFileExplorer(400, 400);

            newLoadal.__moveToTop();

            //Note that gifs will not be animated, they do come as non animated too. Like PNGs
            newLoadal.acceptTypes = "png,jpeg,jpg,webp,bmp,gif,svg";

            const bounding = field.borderRect_.getBoundingClientRect();
            newLoadal.x = bounding.x + bounding.width / 2;
            newLoadal.y = bounding.y + bounding.height;
            newLoadal.onFileSelected = (path) => {
                field.value = path;
            };
        }
    }

    sugarcube.extensionManager.registerExtension(new looks());
})();
