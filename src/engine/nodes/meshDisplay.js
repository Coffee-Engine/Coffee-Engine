(function () {
    coffeeEngine.classes.node3D = class extends coffeeEngine.classes.node {
        mesh;

        draw() {
            super.draw();

            if (this.mesh && this.mesh instanceof coffeeEngine.resources.mesh) {
                coffeeEngine.renderer.mainShaders.unlit.setBuffers(this.mesh.data);
                coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.webGLValue();
                coffeeEngine.renderer.mainShaders.unlit.drawFromBuffers(this.mesh.pointCount);
            }
        }
    };
})();
