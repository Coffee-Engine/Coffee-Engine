(function () {
    class lists {
        getInfo() {
            return {
                id: "lists",
                name: editor.language["sugarcube.lists"],
                color1: "#FF661A",
                color2: "#F2590C",
                color3: "#E64D00",
                showColor: true,
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Mi42NzA1MSIgaGVpZ2h0PSI3Mi42NzA1MSIgdmlld0JveD0iMCwwLDcyLjY3MDUxLDcyLjY3MDUxIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAzLjY2NDc1LC0xNDMuNjY0NzUpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIxMC4xNzc1OSwxNjEuNDYxMzljMCwtMi43NjE0MiAyLjIzODU4LC01IDUsLTVjMi43NjE0MiwwIDUsMi4yMzg1OCA1LDVjMCwyLjc2MTQyIC0yLjIzODU4LDUgLTUsNWMtMi43NjE0MiwwIC01LC0yLjIzODU4IC01LC01eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjI3Ljk1MTcxLDE2MS40NjEzOWgzNy4zMjg3OSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjEwLjE3NzU5LDE4MC4wNTQxMWMwLC0yLjc2MTQzIDIuMjM4NTcsLTUgNSwtNWMyLjc2MTQzLDAgNSwyLjIzODU3IDUsNWMwLDIuNzYxNDMgLTIuMjM4NTcsNSAtNSw1Yy0yLjc2MTQzLDAgLTUsLTIuMjM4NTcgLTUsLTV6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMjcuOTUxNywxODAuMDU0MTFoMzcuMzI4NzkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIxMC4xNzc1OSwxOTguNTM4NjFjMCwtMi43NjE0MyAyLjIzODU3LC01IDUsLTVjMi43NjE0MywwIDUsMi4yMzg1NyA1LDVjMCwyLjc2MTQzIC0yLjIzODU3LDUgLTUsNWMtMi43NjE0MywwIC01LC0yLjIzODU3IC01LC01eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjI3Ljk1MTcxLDE5OC41Mzg2MWgzNy4zMjg4IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMDMuNjY0NzUsMjE2LjMzNTI1di03Mi42NzA1MWg3Mi42NzA1MXY3Mi42NzA1MXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM2LjMzNTI1MjY0NTE2MTM1OjM2LjMzNTI1MjY0NTE2MTIzLS0+",
                precompile: "precompile_func",
                updateBlocks: "dynamic_category_func",
                blocks: [
                    {
                        opcode: "openVariableMenu",
                        type: sugarcube.BlockType.BUTTON,
                        text: editor.language["sugarcube.lists.block.openVariableMenu"],
                    },
                    {
                        opcode: "getList",
                        type: sugarcube.BlockType.ARRAY,
                        text: "",
                        hideFromPalette: true,
                        mutator: "variable_Mutator",
                        compileFunc: "getList_compile",
                        contextMenu: "removeList",
                    },
                    {
                        opcode: "addItem",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.lists.block.addItem"],
                        hideFromPalette: true,
                        arguments: {
                            item: {
                                defaultValue: editor.language["sugarcube.lists.value.item"],
                                type: sugarcube.ArgumentType.STRING,
                            },
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "removeItem",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.lists.block.removeItem"],
                        hideFromPalette: true,
                        arguments: {
                            item: {
                                defaultValue: 1,
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "clearList",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.lists.block.clearList"],
                        hideFromPalette: true,
                        arguments: {
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "insertItem",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.lists.block.insertItem"],
                        hideFromPalette: true,
                        arguments: {
                            value: {
                                defaultValue: editor.language["sugarcube.lists.value.greeting"],
                                type: sugarcube.ArgumentType.STRING,
                            },
                            item: {
                                defaultValue: 1,
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "replaceItem",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.lists.block.replaceItem"],
                        hideFromPalette: true,
                        arguments: {
                            value: {
                                defaultValue: editor.language["sugarcube.lists.value.greeting"],
                                type: sugarcube.ArgumentType.STRING,
                            },
                            item: {
                                defaultValue: 1,
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "getItem",
                        type: sugarcube.BlockType.REPORTER_ANY,
                        text: editor.language["sugarcube.lists.block.getItem"],
                        hideFromPalette: true,
                        arguments: {
                            item: {
                                defaultValue: 1,
                                type: sugarcube.ArgumentType.NUMBER,
                            },
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "getItemNumber",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.lists.block.getItemNumber"],
                        hideFromPalette: true,
                        arguments: {
                            value: {
                                defaultValue: editor.language["sugarcube.lists.value.greeting"],
                                type: sugarcube.ArgumentType.STRING,
                            },
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "length",
                        type: sugarcube.BlockType.REPORTER,
                        text: editor.language["sugarcube.lists.block.length"],
                        hideFromPalette: true,
                        arguments: {
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "getItemContainment",
                        type: sugarcube.BlockType.BOOLEAN,
                        text: editor.language["sugarcube.lists.block.getItemContainment"],
                        hideFromPalette: true,
                        arguments: {
                            value: {
                                defaultValue: editor.language["sugarcube.lists.value.greeting"],
                                type: sugarcube.ArgumentType.STRING,
                            },
                            list: {
                                menu: "listMenu",
                            },
                        },
                    },
                    {
                        opcode: "substitute",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.variables.objectLike.substitute"],
                        hideFromPalette: true,
                        arguments: {
                            objectLike: {
                                type: sugarcube.ArgumentType.STRING,
                                menu: "localListMenu",
                            },
                            value: {
                                type: sugarcube.ArgumentType.ARRAY,
                            },
                        },
                    },
                    {
                        opcode: "originate",
                        type: sugarcube.BlockType.COMMAND,
                        text: editor.language["sugarcube.variables.objectLike.originate"],
                        hideFromPalette: true,
                        arguments: {
                            objectLike: {
                                type: sugarcube.ArgumentType.STRING,
                                menu: "localListMenu",
                            },
                        },
                    },
                ],
                menus: {
                    localListMenu: {
                        items: "getLists",
                    },
                    listMenu: {
                        items: "getListsAndGlobalLists",
                    },
                },
                mutators: {
                    variable_Mutator: {
                        serialize: "variable_Serialize",
                        deserialize: "variable_Deserialize",
                    },
                },
                contextMenus: {
                    removeList: {
                        text: editor.language["sugarcube.lists.contextMenu.removeList"],
                        opcode: "removeList",
                        eligibility: "notGlobal",
                        weight: 4,
                    },
                },
            };
        }

        getLists(advanced) {
            const variables = sugarcube.variables.getAll();
            const returned = [];
            variables.forEach((variable) => {
                let type = variable.type;
                if (type != "list") return;

                if (!advanced) returned.push(variable.name);
                else returned.push(variable);
            });

            return returned;
        }

        getListsAndGlobalLists(advanced) {
            const variables = sugarcube.variables.getAll();
            const returned = [];
            
            for (let variable in globals) {
                if (!Array.isArray(globals[variable])) continue;

                if (!advanced) returned.push({ text: variable, value: "​" + variable });
                else returned.push({ name: variable, global: true, type: "list", color: "#FF661A" });
            }

            variables.forEach((variable) => {
                let type = variable.type;
                if (type != "list") return;

                if (!advanced) returned.push(variable.name);
                else returned.push(variable);
            });

            return returned;
        }

        //Simple true false
        isGlobal(variable, callback) {
            if (variable.startsWith("​")) {
                const varName = variable.replace("​", "");
                if (callback) callback(varName, globals[varName]);
                return true;
            }
            return false;
        }

        notGlobal(variable) {
            return !variable.editedState.varData.global;
        }

        openVariableMenu() {
            const createdWindow = new editor.windows.variable(400, 300);
            createdWindow.__moveToTop();

            createdWindow.x = window.innerWidth / 2 - 200;
            createdWindow.y = window.innerHeight / 2 - 150;

            createdWindow.variableType = "list";
        }

        variable_Serialize(state, block) {
            return state;
        }

        variable_Deserialize(state, block) {
            if (state.varData) {
                //If public add icon
                if (state.varData.public || state.varData.global) {
                    //create Text
                    block.inputFromJson_({
                        type: "input_dummy",
                        name: `text`,
                    });
                    block.inputList[block.inputList.length - 1].appendField(
                        block.fieldFromJson_({
                            type: "field_image",
                            src: state.varData.global ? sugarcube.earthIcon : sugarcube.publicIcon,
                            width: 24,
                            height: 24,
                        })
                    );
                }

                //create Text
                block.inputFromJson_({
                    type: "input_dummy",
                    name: `text`,
                });
                block.inputList[block.inputList.length - 1].appendField(
                    block.fieldFromJson_({
                        type: "field_label",
                        text: state.varData.name,
                    })
                );
            }

            //set block color
            sugarcube.easyColourBlock(block, state.varData.color);

            return state;
        }

        dynamic_category_func() {
            const variables = this.getListsAndGlobalLists(true);
            const returned = [];
            let listExists = false;

            variables.forEach((variable) => {
                let type = variable.type;
                if (type != "list") return;

                listExists = true;

                returned.push({
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "getList",
                    extraState: {
                        varData: {
                            color: variable.color,
                            name: variable.name,
                            public: variable.public,
                            global: variable.global
                        },
                    },
                });
            });

            if (!listExists) return returned;

            returned.push(
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "addItem",
                },
                "---",
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "removeItem",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "clearList",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "insertItem",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "replaceItem",
                },
                "---",
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "getItem",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "getItemNumber",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "length",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "getItemContainment",
                },
                "---",
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "substitute",
                },
                {
                    type: sugarcube.BlockType.DUPLICATE,
                    of: "originate",
                }
            );

            return returned;
        }

        precompile_func() {
            let generated = "";
            this.getLists(true).forEach((list) => {
                if (list.public) generated += `@editor(array) "${list.name.replaceAll('"', '\\"')}";\n`;
                generated += `this["${list.name.replaceAll('"', '\\"')}"] = [];\n`;
            });

            return generated;
        }

        getList_compile(block, generator) {
            if (block.editedState.varData.global) return `globals["${block.editedState.varData.name.replaceAll('"', '\\"')}"]`;
            return `this["${block.editedState.varData.name.replaceAll('"', '\\"')}"]`;
        }

        addItem({ list, item }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
            this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});

            //MAKE SURE its a list
            if (!Array.isArray(targetList)) return;
            targetList.push(item);
        }

        removeItem({ list, item }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
            this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});

            //MAKE SURE its a list
            if (!Array.isArray(targetList)) return;
            item = Math.floor(item - 1);

            //Prevent OOB indeing
            if (item < 0 || item >= targetList.length) return;
            targetList.splice(item, 1);
        }

        clearList({ list }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
           this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});

            if (!Array.isArray(targetList)) return;
            targetList = [];
        }

        insertItem({ list, item, value }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
            this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});
            
            if (!Array.isArray(targetList)) return;
            item = Math.floor(item - 1);
            //OOB indexing works with array.splice how nice
            targetList.splice(item, 0, value);
        }

        replaceItem({ list, item, value }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
            this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});
            
            if (!Array.isArray(targetList)) return;

            item = Math.floor(item - 1);

            //Prevent OOB indeing
            if (item < 0 || item >= targetList.length) return;
            targetList[item] = value;
        }

        getItem({ list, item }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
            this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});
            
            if (!Array.isArray(targetList)) return;

            item = Math.floor(item - 1);

            //Prevent OOB indeing
            if (item < 0 || item >= targetList.length) return;
            return targetList[item];
        }

        getItemNumber({ list, value }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
            this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});
            
            if (!Array.isArray(targetList)) return 0;
            return targetList.indexOf(value) + 1;
        }

        length({ list }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
            this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});
            
            if (!Array.isArray(targetList)) return 0;
            return targetList.length;
        }

        getItemContainment({ list, value }, { self }) {
            //Make sure we target it right
            let targetList = self[list];
            this.isGlobal(list, (globalName, globalVal) => {targetList = globals[globalName]});
            
            if (!Array.isArray(targetList)) return false;
            return targetList.includes(value);
        }

        substitute({ objectLike, value }, { self }) {
            if (!Array.isArray(self[objectLike])) return;

            return (self[objectLike] = value);
        }

        originate({ objectLike }, { self }) {
            if (!Array.isArray(self[objectLike])) return;
            
            return (self[objectLike] = [...self[objectLike]]);
        }

        removeList(block) {
            const varName = block.editedState.varData.name;
            if (confirm(editor.language["sugarcube.variables.objectLike.deletionConfirmation"].replace("[variable]", varName))) {
                //remove it
                delete sugarcube.variables.storage[varName];

                //Make sure to remove and workspace blocks referencing it.
                Array.from(sugarcube.workspace.blockDB).forEach((blockData) => {
                    if (blockData[1].editedState) {
                        const editedState = blockData[1].editedState;
                        if (editedState.varData && editedState.varData.name == varName) blockData[1].dispose(true);
                    }
                });

                //Then update the extension category
                sugarcube.extensionManager.updateExtensionBlocks("lists");
            }
        }
    }

    sugarcube.extensionManager.registerExtension(new lists());
})();
