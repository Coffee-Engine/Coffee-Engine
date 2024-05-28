const sugarcube = {};
sugarcube.blockStyles = {};
sugarcube.extensions = {};
sugarcube.workspace = {};
sugarcube.toolbox = {
  kind: "categoryToolbox",
  contents: [],
};
sugarcube.menus = {};

sugarcube.blocklyTheme = {
  blockStyles: {},
  fontStyle: {
    family: "helvetica",
    weight: 500,
    size: 12,
  },
  componentStyles: {
    workspaceBackgroundColour: "#1e1e1e",
    toolboxBackgroundColour: "blackBackground",
    toolboxForegroundColour: "#fff",
    flyoutBackgroundColour: "#252526",
    flyoutForegroundColour: "#ccc",
    flyoutOpacity: 0.5,
    scrollbarColour: "#797979",
    insertionMarkerColour: "#fff",
    insertionMarkerOpacity: 0.3,
    scrollbarOpacity: 0.4,
    cursorColour: "#d0d0d0",
    blackBackground: "#333",
  },
  startHats: true,
};

sugarcube.refreshTheme = () => {
  sugarcube.workspace.setTheme(Blockly.Theme.defineTheme("sugarcube", sugarcube.blocklyTheme));
};
