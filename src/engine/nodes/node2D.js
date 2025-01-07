(function () {
    class node extends coffeeEngine.getNode("Node") {
        position = new coffeeEngine.vector2(0, 0);
        scale = new coffeeEngine.vector2(1, 1);

        #layer = 1;
        set layer(value) {
            //Make layer 1 the minimum
            this.#layer = value >= 1 ? value : 1;
            this.updateMatrix();
        }
        get layer() {
            return this.#layer;
        }
        #rotation = 0;
        set rotation(value) {
            this.#rotation = value;
            this.updateMatrix();
        }
        get rotation() {
            return this.#rotation;
        }

        matrix = coffeeEngine.matrix4.identity();

        updateMatrix() {
            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.translate(this.position.x, this.position.y, this.layer);
            this.matrix = this.matrix.rotationZ(this.rotation);
            this.matrix = this.matrix.scale(this.scale.x, this.scale.y, 1);
        }

        constructor() {
            super();
            this.position.setter = () => {
                this.updateMatrix();
            };
            this.scale.setter = () => {
                this.updateMatrix();
            };
            
            this.updateMatrix();
        }

        update(deltaTime) {
            super.update(deltaTime);
        }

        draw() {
            super.draw();
        }

        getProperties() {
            return [
                { name: "name", translationKey:"engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey:"engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC2 }, 
                { name: "layer", translationKey:"engine.nodeProperties.Node2D.layer", type: coffeeEngine.PropertyTypes.INT }, 
                { name: "rotation", translationKey:"engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.FLOAT }, 
                { name: "scale", translationKey:"engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC2 },
                "---",
                {name: "script", translationKey:"engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js"}
            ];
        }

        sortValue() {
            return this.position.y;
        }
    }

    coffeeEngine.registerNode(node, "Node2D", "Node");
})();
