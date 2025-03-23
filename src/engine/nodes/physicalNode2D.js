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
                    const pushVector = this.mixedMatrix.getRotation().multiplyVector(outputObject.pushVector).mul(outputObject.pushLength);
                    this.position.x += pushVector.x;
                    this.position.y += pushVector.y;
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