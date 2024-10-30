(function () {
    const camera = coffeeEngine.matrix4.identity();

    class cameraNode extends coffeeEngine.getNode("Node3D") {
        activeCamera = true;

        draw() {
            super.draw();
            // prettier-ignore
            if (this.activeCamera) coffeeEngine.renderer.cameraData.transform = camera.webGLValue();
        }
    };

    coffeeEngine.registerNode(cameraNode, "Camera", "Node3D");
})();
