window.sugarcube = {};
sugarcube.blockStyles = {};
sugarcube.extensions = {};
sugarcube.workspace = {};
sugarcube.contextMenuBlockCorrolations = {};
//Using a custom variable system to store more data.
//Blockly variables aren't inherently bad. Just limited.
sugarcube.variables = {
    storage:{},
    getAll:() => {
        return Object.values(sugarcube.variables.storage);
    },
    createVariable:(Name,Type,Color,DefaultValue) => {
        sugarcube.variables.storage[Name] = {
            name:Name,
            type:Type,
            color:Color,
            defaultValue:DefaultValue || "",
        }
    }
};

//For custom blocks
sugarcube.customBlocks = {
    fieldTypes:[],
    storage:{},
    blockFromDefinition:(jsonDef) => {
        const swagStyledBuisness = {};

        let conjugatedName = "";

        jsonDef.parameters.forEach(param => {
            delete param.element;

            if (!swagStyledBuisness[param.name]) swagStyledBuisness[param.name] = 0;

            swagStyledBuisness[param.name] += 1;

            param.id = `${param.type}_${param.name}_${swagStyledBuisness[param.name]}`;

            conjugatedName += param.id;
        });

        if (sugarcube.customBlocks.storage[conjugatedName]) {
            alert("This block exists");
            return;
        }

        sugarcube.customBlocks.storage[conjugatedName] = jsonDef;

        const myBlockDec = sugarcube.workspace.newBlock("myblocks_declaration");
        myBlockDec.initSvg();
        myBlockDec.render();
        myBlockDec.loadExtraState(jsonDef);
    },
    addCustomFieldToPrompt:(Name,Type,ImageURL,ExtraParameters) => {
        const newField = {
            Name:Name,
            Type:Type,
            Image:ImageURL,
            createFunction:ExtraParameters.createFunction,
            parseFunction:ExtraParameters.parseFunction,
            declaration:ExtraParameters.declaration,
        };

        sugarcube.customBlocks.fieldTypes.push(newField);
    }
}

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
    //sugarcube.minimapWorkspace.setTheme(Blockly.Theme.defineTheme("sugarcube", sugarcube.blocklyTheme));

    //sugarcube.minimapWorkspace.svgBackground_.style.fill = sugarcube.blocklyTheme.componentStyles.unseenBackground;
    //sugarcube.minimapWorkspace.scrollbar.setVisible(false);
    //sugarcube.minimapWorkspace.injectionDiv.parentElement.style.transition = "opacity 500ms";
};
