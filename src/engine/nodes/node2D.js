(function () {
    class node extends coffeeEngine.getNode("Node") {
        position = new coffeeEngine.vector2(0);
        #layer = 1;
        set layer(value) {
            //Make layer 1 the minimum
            this.#layer = (value >= 1) ? value : 1;
        }
        get layer() {
            return this.#layer;
        }
        rotation = 0;
        matrix = coffeeEngine.matrix4.identity();

        update(deltaTime) {
            super.update(deltaTime);
            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.translate(this.position.x, this.position.y, this.layer);

            this.matrix = this.matrix.rotationZ(this.rotation);
        }

        draw() {
            super.draw();
            coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.webGLValue();
        }
    };

    coffeeEngine.registerNode(node, "Node2D", "Node");
})();
