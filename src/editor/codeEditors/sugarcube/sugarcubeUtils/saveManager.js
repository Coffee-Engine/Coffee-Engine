sugarcube.serialize = () => {
    return {
        code: Blockly.serialization.workspaces.save(sugarcube.workspace),
        variables: sugarcube.variables.storage,
        customBlocks: sugarcube.customBlocks.storage,
        inheritence: sugarcube.inheritence,
    };
};

sugarcube.deserialize = (serialized) => {
    if (!serialized) return;
    if (serialized.variables) sugarcube.variables.storage = serialized.variables;
    else sugarcube.variables.storage = {};

    if (serialized.customBlocks) sugarcube.customBlocks.storage = serialized.customBlocks;
    else sugarcube.customBlocks.storage = {};

    if (serialized.inheritence) sugarcube.inheritence = serialized.inheritence;
    else sugarcube.inheritence = "Node";

    //Fallbacks!
    sugarcube.setToolboxBasedOnFilter(sugarcube.inheritence);
    Blockly.serialization.workspaces.load(serialized.code || { blocks: { languageVersion: 0, blocks: [] } }, sugarcube.workspace);
    sugarcube.extensionManager.updateExtensionBlocks();
};
