(function() {
    project.settingDefinitions = {
        project: [
            {type: "file", target: coffeeEngine.runtime, key: "defaultScene", fileType: "scene", defaultValue: coffeeEngine.defaultScenePath},
            {type: "float", target: coffeeEngine.runtime, key: "targetFramerate", defaultValue: 60},
            {type: "boolean", target: coffeeEngine.runtime, key: "VSync", defaultValue: false},
            {type: "broadcasts", target: coffeeEngine, key: "broadcasts", defaultValue: []},
        ],
        collision: [
            {type: "collisionGroups", target: coffeeEngine, key: "collisionGroup", defaultValue: { default: { default: true } }},
        ],
        viewport: [
            //Silly little thingy
            {type: "dropdown", target: coffeeEngine.renderer.viewport, key: "viewportType", items:[
                {text: editor.language["engine.projectSettings.viewportType.screen"], value: "screen"},
                {text: editor.language["engine.projectSettings.viewportType.fixed"], value: "fixed"},
                {text: editor.language["engine.projectSettings.viewportType.strech"], value: "stretch"},
                {text: editor.language["engine.projectSettings.viewportType.integer"], value: "integer"},
            ], defaultValue: "screen"},

            {type: "vec2", target: coffeeEngine.renderer.viewport, key: "resolution", defaultValue: [480, 360], isArray: true},

            {type: "boolean", target: coffeeEngine.renderer.viewport, key: "antiAlias", defaultValue: true},
        ],
        extensions: [
            {type: "button", text: editor.language["engine.projectSettings.extensions.createExtension"], onclick: (button, event, { refreshSelection }) => {
                const extensionWizard = new editor.windows.extensionWizard(400,400);

                //position window
                extensionWizard.__moveToTop();
                extensionWizard.x = (window.innerWidth / 2) - 200;
                extensionWizard.y = (window.innerHeight / 2) - 200;

                //Refresh cugi page once finished
                extensionWizard.onFinish = () => {
                    refreshSelection();
                }
            }},
            {type: "extensions"},
        ]
    }
    
    //Serialization
    coffeeEngine.addEventListener("fileSystemUpdate", (event) => {
        if (event.type == "FINISH_LOADING") {
            //Load our project.json
            project.getFile("project.json").then((file) => {
                const fileReader = new FileReader();
                
                //Once read.
                fileReader.onload = () => {
                    //Get our parsed JSON
                    let parsed = JSON.parse(fileReader.result);
                    if (!parsed) parsed = {};
    
                    //Now load the settings
                    project.loadSettings(parsed.settings || {});
                    coffeeEngine.sendEvent("projectSettingsLoaded");
                };
    
                fileReader.readAsText(file);
            });
        }
    });
    
    //loading
    project.loadSettings = (settingsJSON) => {
        //Go through our categories
        for (let categoryKey in project.settingDefinitions) {
            const defCategory = project.settingDefinitions[categoryKey];
            const JSONCategory = settingsJSON[categoryKey] || {};

            //Go through the settings
            for (let settingID in defCategory) {
                //Get what we need.
                const setting = defCategory[settingID];
                const key = setting.key;
                
                //Set our target
                if (setting.target && key && setting.defaultValue) setting.target[key] = JSONCategory[key] || setting.defaultValue;
            }
        }
    };

    //Saving
    project.saveSettings = () => {
        //Create our ouput
        const output = {};

        for (let categoryKey in project.settingDefinitions) {
            //Get our category and create our object for that category
            const defCategory = project.settingDefinitions[categoryKey]
            output[categoryKey] = {};

            //Loop through options in the category
            for (let settingID in defCategory) {
                //Put our setting value into the output object
                const setting = defCategory[settingID];
                output[categoryKey][setting.key] = setting.target[setting.key];
            }
        }

        //Return our saved settings
        return output;
    }
})();