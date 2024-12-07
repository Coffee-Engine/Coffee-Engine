(function () {
    class node extends coffeeEngine.getNode("Node") {
        position = new coffeeEngine.vector3(0, 0, 0);
        rotation = new coffeeEngine.vector3(0, 0, 0);
        scale = new coffeeEngine.vector3(1, 1, 1);
        matrix = coffeeEngine.matrix4.identity();

        updateMatrix() {
            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.translate(this.position.x, this.position.y, this.position.z);
            this.matrix = this.matrix.rotationZ(this.rotation.z);
            this.matrix = this.matrix.rotationX(this.rotation.x);
            this.matrix = this.matrix.rotationY(this.rotation.y);
            this.matrix = this.matrix.scale(this.scale.x, this.scale.y, this.scale.z);
        }

        constructor() {
            super();
            this.position.setter = () => {
                this.updateMatrix();
            };
            this.rotation.setter = () => {
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
                { name: "name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "scale", type: coffeeEngine.PropertyTypes.VEC3 },
                "---",
                {name: "script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js"}
            ];
        }

        //Oh yeah mr krabs
        sortValue() {
            return this.position.add(coffeeEngine.renderer.cameraData.position).length();
        }
    }

    coffeeEngine.registerNode(node, "Node3D", "Node");
})();
