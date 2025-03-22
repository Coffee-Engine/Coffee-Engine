(function () {
    class node extends coffeeEngine.getNode("Node2D") {
        collisionGroup = "default";

        update(deltaTime) {
            super.update(deltaTime, true);
            //get my collisions
            this.outputAxis = [];
            this.detectCollisions(this.outputAxis);

            if (this.outputAxis.length > 0) {
                //Find outputs and push object out of trouble
                for (let outputID in this.outputAxis) {
                    const outputObject = this.outputAxis[outputID];
                    this.position.x += outputObject.pushVector.x * outputObject.pushLength;
                    this.position.y += outputObject.pushVector.y * outputObject.pushLength;
                }
            }

            this.mixedMatrix = this.parent.mixedMatrix.multiply(this.matrix);

            this.children.forEach(child => {
                child.update(deltaTime);
            });
        }
    }

    coffeeEngine.registerNode(node, "PhysicalNode2D", "Node2D");
})();