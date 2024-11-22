(function () {
    class node extends coffeeEngine.getNode("Node") {
        position = new coffeeEngine.vector2(0, 0);
        scale = new coffeeEngine.vector2(1, 1);

        #layer = 1;
        set layer(value) {
            //Make layer 1 the minimum
            this.#layer = value >= 1 ? value : 1;
        }
        get layer() {
            return this.#layer;
        }
        rotation = 0;
        matrix = coffeeEngine.matrix4.identity();

        update(deltaTime) {
            super.update(deltaTime);
        }

        draw() {
            super.draw();

            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.scale(this.scale.x, this.scale.y, 1);
            this.matrix = this.matrix.translate(this.position.x, this.position.y, this.layer);
            this.matrix = this.matrix.rotationZ(this.rotation);

            coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.webGLValue();
        }

        getProperties() { 
            return [
                {name: "name", type: coffeeEngine.PropertyTypes.NAME},
                "---",
                {name: "position", type: coffeeEngine.PropertyTypes.VEC2},
                {name: "layer", type: coffeeEngine.PropertyTypes.INT},
                {name: "rotation", type: coffeeEngine.PropertyTypes.FLOAT},
                {name: "scale", type: coffeeEngine.PropertyTypes.VEC2},
            ] 
        };
    }

    coffeeEngine.registerNode(node, "Node2D", "Node");
})();
