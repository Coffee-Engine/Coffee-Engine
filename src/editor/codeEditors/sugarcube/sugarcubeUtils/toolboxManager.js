sugarcube.refreshTheme = () => {
    sugarcube.workspace.setTheme(Blockly.Theme.defineTheme("sugarcube", sugarcube.blocklyTheme));
    //sugarcube.minimapWorkspace.setTheme(Blockly.Theme.defineTheme("sugarcube", sugarcube.blocklyTheme));

    //sugarcube.minimapWorkspace.svgBackground_.style.fill = sugarcube.blocklyTheme.componentStyles.unseenBackground;
    //sugarcube.minimapWorkspace.scrollbar.setVisible(false);
    //sugarcube.minimapWorkspace.injectionDiv.parentElement.style.transition = "opacity 500ms";
};

sugarcube.easyColourBlock = (block, color, hat) => {
    hat = hat || "cap";
    //Define the colours
    const convertedColors = sugarcube.blockColorFunction(color, color, color, null, null);

    //Apply the colours
    const style = {
        colourPrimary: convertedColors[0],
        colourSecondary: convertedColors[1],
        colourTertiary: convertedColors[2],
        colourQuaternary: convertedColors[3],
        colourQuinary: convertedColors[4],
        useBlackWhiteFields: convertedColors[5],
        colourIdentifier: convertedColors[6] || convertedColors[0],
        useEverywhere: convertedColors[7],
        hat: hat,
    };

    block.setStyle(style);
    block.pathObject.setStyle(style);
    if (!convertedColors[7]) block.setColour(color);
};

sugarcube.setToolboxBasedOnFilter = (filter) => {
    //Loop through all categories filtering
    sugarcube.currentFilter = filter;
    sugarcube.filtered.contents = []//JSON.parse(JSON.stringify(sugarcube.toolbox.contents));
    for (let index = 0; index < sugarcube.toolbox.contents.length; index++) {
        let category = JSON.parse(JSON.stringify(sugarcube.toolbox.contents[index]));

        let blocksInCategory = 0;
        for (let blockID = 0; blockID < category.contents.length; blockID++) {
            const block = category.contents[blockID];

            //Check our filter and up our block count if valid
            if (block.filter) {
                if (!block.filter.some((element) => filter.includes(element))) {
                    category.contents.splice(blockID, 1);
                    blockID--;
                } else {
                    if (block.kind != "label") blocksInCategory++;
                }
            }
            //if we don't add the ticker up
            else {
                if (block.kind != "label") blocksInCategory++;
            }
        }
        //If we don't have any blocks don't show the category
        //if (blocksInCategory > 0 || sugarcube.extensionManager.updateFunctions[category.id || "noCAT"] || category.kind == "search") sugarcube.filtered.contents.push(category);
        if (blocksInCategory > 0 || sugarcube.extensionManager.updateFunctions[category.id || "noCAT"] || category.kind == "search") sugarcube.filtered.contents.push(category);
    }
};
