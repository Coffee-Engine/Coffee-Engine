(function () {
    const fileReader = new FileReader();

    class files {
        getInfo() {
            return {
                id: "files",
                name: editor.language["sugarcube.files"],
                color1: "#fcb103",
                color2: "#db9a37",
                color3: "#db8937",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMDkuNDQ2NjkiIGhlaWdodD0iMTA5LjQ0NjY5IiB2aWV3Qm94PSIwLDAsMTA5LjQ0NjY5LDEwOS40NDY2OSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4NS4yNzY2NSwtMTI1LjI3NjY1KSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMzcuMTAxMjcsMTU5LjI2MjljMTIuNDI4NDMsMCA0MC40NzAzNiwwIDQ2LjE0MzkzLDBjMS45NjU4MywwIDIuNTU2MjEsMi42MTY2MSAxLjQ0MTMxLDUuMDgzNjJjLTIuOTgyOTMsNi42MDA1MyAtMTYuNDQ1NzQsMzYuMzkwNTggLTE2LjQ0NTc0LDM2LjM5MDU4aC00Mi40MTU5NCIgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aW5kZXgmcXVvdDs6bnVsbH0iIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSI2LjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOTYuNzgxODcsMTYyLjg1MjAyYzcuMzM3ODYsMCA1Mi4wOTE5MywwIDUyLjA5MTkzLDBsMTYuNjE2MjcsMzcuODg1MDhoLTUzLjcwMzc3YzAsMCAtMTMuNDYyODIsLTI3LjIxMjA3IC0xNi40NDU3NSwtMzMuMjQxNGMtMS4xMTQ5LC0yLjI1MzUyIC0wLjUyNDUxLC00LjY0MzY4IDEuNDQxMzIsLTQuNjQzNjh6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iNi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjEyLjMwMTQ4LDE5OS4wNzY4NWwtMTcuNTQ2NzcsLTM0LjM2MzcxbDU0LjEwMjU1LDAuMzY0MjdsMTUuMzkwNjQsMzUuNjU0NjV6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMTg1LjI3NjY1LDIzNC43MjMzNXYtMTA5LjQ0NjY5aDEwOS40NDY2OXYxMDkuNDQ2Njl6IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjo1NC43MjMzNDY4NDY5MjAyMTo1NC43MjMzNDY4NDY5MjAwNjYtLT4=",
                blocks: [
                    {
                        opcode: "setFile",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.files.block.setFile"],
                        arguments: {
                            file: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType: "File",
                            },
                            content: {
                                type: sugarcube.ArgumentType.STRING,
                            }
                        },
                    },
                    {
                        opcode: "getFile",
                        type: sugarcube.BlockType.REPORTER_ANY,
                        text: editor.language["sugarcube.files.block.getFile"],
                        arguments: {
                            file: {
                                type: sugarcube.ArgumentType.CUSTOM,
                                customType: "File",
                            },
                            type: {
                                menu:"type"
                            }
                        },
                    },
                ],
                menus: {
                    type: {
                        acceptReporters: true,
                        items: [
                            { value: "readAsText", text:editor.language["sugarcube.files.menu.asMenu.text"] },
                            { value: "JSON", text:editor.language["sugarcube.files.menu.asMenu.JSON"] },
                            { value: "readAsArrayBuffer", text:editor.language["sugarcube.files.menu.asMenu.byte"] },
                            { value: "readAsDataURL", text:editor.language["sugarcube.files.menu.asMenu.dataURL"] }
                        ]
                    }
                },
                fields: {
                    File: {
                        acceptReporters: true,
                        editor: "file_Editor",

                        initilize: "file_Init",
                    },
                },
            };
        }

        file_Init(field) {
            field.createBorderRect_();
            field.createTextElement_();
        }

        file_Editor(field) {
            //Its like some sort of loading. :trol:
            const newLoadal = new editor.windows.modalFileExplorer(400, 400);

            newLoadal.__moveToTop();

            const bounding = field.borderRect_.getBoundingClientRect();
            newLoadal.x = bounding.x + bounding.width / 2;
            newLoadal.y = bounding.y + bounding.height;
            newLoadal.onFileSelected = (path) => {
                field.value = path;
            };
        }

        async getFile({ file, type }) {
            return new Promise(async (resolve, reject) => {
                //Configure our onloads
                fileReader.onload = () => {
                    //If we are looking for a json or table parse it
                    if (type == "JSON") {
                        try {
                            resolve(JSON.parse(fileReader.result))
                        } catch (error) {
                            reject("File not valid JSON");
                        }
                    }
                    else {
                        resolve(fileReader.result);
                    }
                };
                fileReader.onerror = () => {reject("File is not valid");};

                //Read the file
                const fileObj = await project.getFile(file).catch(() => {reject("File does not exist");});

                //Then read it as our type
                if (type == "JSON") {
                    fileReader.readAsText(fileObj);
                }
                else {
                    fileReader[type](fileObj);
                }
            });
        }
    }

    sugarcube.extensionManager.registerExtension(new files());
})();
