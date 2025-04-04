(function () {
    class node extends coffeeEngine.getNode("Node") {
        #position = new coffeeEngine.vector3(0, 0, 0);
        #rotation = new coffeeEngine.vector3(0, 0, 0);
        #scale = new coffeeEngine.vector3(1, 1, 1);

        //Setting position directly
        set position(value) {
            this.#position.x = value.x || 0;
            this.#position.y = value.y || 0;
            this.#position.z = value.z || 0;
        }
        get position() {
            return this.#position;
        }

        //Setting rotation directly
        set rotation(value) {
            this.#rotation.x = value.x || 0;
            this.#rotation.y = value.y || 0;
            this.#rotation.z = value.z || 0;
        }
        get rotation() {
            return this.#rotation;
        }

        //Setting scale directly
        set scale(value) {
            this.#scale.x = value.x || 0;
            this.#scale.y = value.y || 0;
            this.#scale.z = value.z || 0;
        }
        get scale() {
            return this.#scale;
        }

        updateMatrix() {
            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.translate(this.position.x, this.position.y, this.position.z);
            this.matrix = this.matrix.rotationY(this.rotation.y);
            this.matrix = this.matrix.rotationX(this.rotation.x);
            this.matrix = this.matrix.rotationZ(this.rotation.z);
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

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC3 }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }

        //Oh yeah mr krabs
        sortValue(drawID) {
            return this.position.sub(coffeeEngine.renderer.cameraData.position).length();
        }
    }

    coffeeEngine.registerNode(node, "Node3D", "Node");
})();
