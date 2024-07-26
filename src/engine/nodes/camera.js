(function() {
    const camera = coffeeEngine.matrix4.identity();

    coffeeEngine.classes.node3D = class extends coffeeEngine.classes.node {
        activeCamera = true;

        update(deltaTime) {
            super.update(deltaTime);
        }

        draw() {
            super.draw();
            if (this.activeCamera) coffeeEngine.renderer.mainShaders.unlit.uniforms.u_camera.value = camera.webGLValue();
        }
    }
})();