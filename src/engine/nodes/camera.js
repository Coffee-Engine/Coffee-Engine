(function () {
    const camera = coffeeEngine.matrix4.identity();

    coffeeEngine.classes.node3D = class extends coffeeEngine.classes.node {
        activeCamera = true;

        draw() {
            super.draw();
            // prettier-ignore
            if (this.activeCamera) coffeeEngine.renderer.mainShaders.unlit.uniforms.u_camera.value = camera.webGLValue();
        }
    };
})();
