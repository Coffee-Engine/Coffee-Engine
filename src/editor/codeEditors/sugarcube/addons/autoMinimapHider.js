(function() {
    sugarcube.shouldMinimapBeVisible = () => {
        sugarcube.minimapWorkspace.injectionDiv.parentElement.style.opacity = "0%";
        sugarcube.minimapWorkspace.injectionDiv.parentElement.style.pointerEvents = "none";

        const workspaceWidth = sugarcube.workspace.getBlocksBoundingBox().getWidth();
        const workspaceHeight = sugarcube.workspace.getBlocksBoundingBox().getHeight();
        const workspaceSize = Math.sqrt(Math.pow(workspaceWidth,2) + Math.pow(workspaceHeight,2));

        const windowWidth = sugarcube.workspace.getWidth();

        if (workspaceSize > windowWidth) {
            sugarcube.minimapWorkspace.injectionDiv.parentElement.style.opacity = "100%";
            sugarcube.minimapWorkspace.injectionDiv.parentElement.style.pointerEvents = "auto";
        }
    }
})();