(function() {
    coffeeEngine.classes.node3D = class extends coffeeEngine.classes.node {
        update(deltaTime) {
            super.update(deltaTime);
            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.translate(this.position.x,this.position.y,this.position.z);
            
            this.matrix = this.matrix.rotationZ(this.rotation.z);
            this.matrix = this.matrix.rotationX(this.rotation.x);
            this.matrix = this.matrix.rotationY(this.rotation.y);
        }

        draw() {
            super.draw();
            coffeeEngine.renderer.mainShaders.unlit.setBuffers(demoPlane);
            coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.webGLValue();
            coffeeEngine.renderer.mainShaders.unlit.drawFromBuffers(3);
        }
    }
})();