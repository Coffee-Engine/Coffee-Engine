sugarcube.serialize = () => {
    //Serialize comments
    const serializedComments = [];
    sugarcube.comments.forEach(comment => {
        serializedComments.push(comment.serialize());
    });

    return {
        code: Blockly.serialization.workspaces.save(sugarcube.workspace),
        variables: sugarcube.variables.storage,
        customBlocks: sugarcube.customBlocks.storage,
        comments:serializedComments,
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

    
    //Remove old comments
    sugarcube.comments.forEach(comment => {
        comment.remove();
    });

    //Deserialize this script's comments
    sugarcube.comments = [];
    if (serialized.comments) {
        serialized.comments.forEach(comment => {
            const commentOBJ = new (sugarcube.commentClass)(comment.x, comment.y);
            commentOBJ.width = comment.width;
            commentOBJ.height = comment.height;
            commentOBJ.color1 = comment.color1;
            commentOBJ.color2 = comment.color2;
            commentOBJ.color3 = comment.color3;
            commentOBJ.color4 = comment.color4;
            commentOBJ.text.innerHTML = comment.text;
            sugarcube.comments.push(commentOBJ);
        });
    }


    //Fallbacks!
    sugarcube.setToolboxBasedOnFilter(sugarcube.inheritence);
    Blockly.serialization.workspaces.load(serialized.code || { blocks: { languageVersion: 0, blocks: [] } }, sugarcube.workspace);
    sugarcube.extensionManager.updateExtensionBlocks();
};
