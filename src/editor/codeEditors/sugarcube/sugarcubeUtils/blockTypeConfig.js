(function() {
    sugarcube.BlockTypeConstructors = {
        hat: { next:true },
        command: { next:true, previous:true },
        terminal: { previous:true },

        reporter_any: { output: "ANY" },
        Field_ReporterAcceptance: { output: "Field_ReporterAcceptance" },

        reporter: { output: "NotBoolean" },
        boolean: { output: "Boolean" },
        array: { output: "Array" },
        object: { output: "Object" },
        reference: { output: "Reference" },

        duplicate: (block, workspace, manager, { id, opcode }) => {
            const blockData = {
                kind: "block",
                type: block.extensionID ? `${block.extensionID}_${block.of}` : `${id}_${block.of}`,
            };

            if (block.extraState) blockData.extraState = block.extraState;

            //Wierd block hack
            //I wish blockly preserved block inputs inside the actual block itself instead of having
            //half in the actual block, half in an outside definition
            if (manager.blockDefs[block.extensionID ? block.extensionID : id][block.of].inputs) {
                blockData.inputs = manager.blockDefs[block.extensionID ? block.extensionID : id][block.of].inputs;
            }

            return blockData;
        },
        label: (block, workspace, manager) => {
            return {
                kind: "label",
                text: block.text,
            };
        },
        button: (block, workspace, manager, { id, opcode }) => {
            const blockData = {
                kind: "button",
                text: block.text,
                callbackKey: `${id}_${opcode}`,
            };

            //Register callback code for the button
            sugarcube.buttons[`${id}_${opcode}`] = () => {
                sugarcube.extensionInstances[id][opcode]();
            };

            //If we have a workspace register the callback
            if (workspace) {
                workspace.registerButtonCallback(`${id}_${opcode}`, sugarcube.buttons[`${id}_${opcode}`]);
            }

            return blockData;
        },
    }
})();