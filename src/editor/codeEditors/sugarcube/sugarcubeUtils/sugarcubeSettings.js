const sugarcube = {};
sugarcube.blockStyles = {};
sugarcube.extensions = {};
sugarcube.workspace = {};
sugarcube.toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "search",
            name: "Search",
            contents: [],
        },
    ],
};
sugarcube.menus = {};

sugarcube.constantOverrides = {};

sugarcube.blocklyTheme = {
    blockStyles: {},
    fontStyle: {
        family: "helvetica",
        weight: 500,
        size: 12,
    },
    componentStyles: {
        workspaceBackgroundColour: "#1e1e1e",

        toolboxBackgroundColour: "#333",
        toolboxForegroundColour: "#fff",

        flyoutBackgroundColour: "#252526",
        flyoutForegroundColour: "#ccc",
        flyoutOpacity: 0.5,

        scrollbarColour: "#797979",
        scrollbarOpacity: 0.4,

        insertionMarkerColour: "#fff",
        insertionMarkerOpacity: 0.3,

        cursorColour: "#d0d0d0",

        unseenBackground: "#1e1e1e",
    },
    startHats: true,
};

sugarcube.refreshTheme = () => {
    sugarcube.workspace.setTheme(Blockly.Theme.defineTheme("sugarcube", sugarcube.blocklyTheme));
    sugarcube.minimapWorkspace.setTheme(Blockly.Theme.defineTheme("sugarcube", sugarcube.blocklyTheme));

    sugarcube.minimapWorkspace.svgBackground_.style.fill = sugarcube.blocklyTheme.componentStyles.unseenBackground;
    sugarcube.minimapWorkspace.scrollbar.setVisible(false);
    sugarcube.minimapWorkspace.injectionDiv.parentElement.style.transition = "opacity 500ms";
};
