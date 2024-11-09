sugarcube.serialize = () => {
    return {
        code: Blockly.serialization.workspaces.save(sugarcube.workspace),
        variables: sugarcube.variables.storage,
        customBlocks: sugarcube.customBlocks.storage,
    };
};

sugarcube.deserialize = (serialized) => {
    if (!serialized) return;
    if (serialized.variables) sugarcube.variables.storage = serialized.variables;
    else sugarcube.variables.storage = {};

    if (serialized.customBlocks) sugarcube.customBlocks.storage = serialized.customBlocks;
    else sugarcube.customBlocks.storage = {};

    //Fallbacks!
    Blockly.serialization.workspaces.load(serialized.code || { blocks: { languageVersion: 0, blocks: [] } }, sugarcube.workspace);
};
