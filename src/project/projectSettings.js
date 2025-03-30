project.settingDefinitions = {
    scene: [
        {type: "file", target: coffeeEngine.runtime, key: "defaultScene", fileType: "scene", defaultValue: "scenes/default.scene"}
    ],
    collision: [],
    viewport: [
        //Silly little thingy
        {type: "dropdown", target: coffeeEngine.renderer.viewport, key: "viewportType", items:[
            {text: editor.language["engine.projectSettings.viewportType.screen"], value: "screen"},
            {text: editor.language["engine.projectSettings.viewportType.fixed"], value: "fixed"},
            {text: editor.language["engine.projectSettings.viewportType.strech"], value: "stretch"},
        ], defaultValue: "screen"}
    ]
}