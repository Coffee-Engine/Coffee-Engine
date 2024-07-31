(function () {
    editor.windows.blockly = class extends editor.windows.base {
        init(container) {
            this.title = "Sugarcube";

            container.style.fontSize = "medium";

            sugarcube.workspace = Blockly.inject(container, {
                collapse: false,
                comments: true,
                toolbox: sugarcube.toolbox,
                theme: sugarcube.blocklyTheme,
                renderer: "sugarcube",
                grid: {
                    spacing: 40,
                    length: 3,
                    colour: "#484848",
                    snap: false,
                },
                zoom: {
                    controls: true,
                    wheel: false,
                    startScale: 0.8,
                    maxScale: 3,
                    minScale: 0.3,
                    scaleSpeed: 1.2,
                    pinch: true,
                },
                move: {
                    scrollbars: {
                        horizontal: true,
                        vertical: true,
                    },
                    drag: true,
                    wheel: true,
                },
                trashcan: false, // we don't want the recycling bin. Maybe it can be an option though?
                plugins: {
                    toolbox: sugarcube.ContinuousToolbox,
                    flyoutsVerticalToolbox: sugarcube.ContinuousFlyout,
                    metricsManager: sugarcube.ContinuousMetrics,
                },
            });

            sugarcube.minimap = new sugarcube.minimapStorage.PositionedMinimap(sugarcube.workspace);
            sugarcube.minimap.init();
            sugarcube.minimapWorkspace = sugarcube.minimap.minimapWorkspace;

            sugarcube.workspace.addChangeListener(Blockly.Events.disableOrphans);
            sugarcube.workspace.addChangeListener(sugarcube.shouldMinimapBeVisible);

            //Testing category for various block types and menus
            //Dunno why I called it testCat.js

            //Load our base categories
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/motion.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/looks.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/sounds.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/events.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/controls.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/sensing.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/operators.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/strings.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/objects.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/variables.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/lists.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/myBlocks.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/debugger.js");
            sugarcube.extensionManager.loadExtension("editor/codeEditors/sugarcube/defaultBlocks/files.js");
        }

        resized() {
            Blockly.svgResize(sugarcube.workspace);
        }

        dispose() {
            sugarcube.workspace.dispose();
        }
    };
})();
