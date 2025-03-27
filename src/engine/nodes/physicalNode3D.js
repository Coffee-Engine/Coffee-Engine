(function () {
    class node extends coffeeEngine.getNode("Node3D") {
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
                    const pushVector = this.mixedMatrix.inverse().getRotation().multiplyVector(outputObject.pushVector).mul(outputObject.pushLength);
                    this.position = this.position.add(pushVector);
                }
            }

            this.mixedMatrix = this.parent.mixedMatrix.multiply(this.matrix);

            this.children.forEach(child => {
                child.update(deltaTime);
            });
        }
    }

    coffeeEngine.registerNode(node, "PhysicalNode3D", "Node3D");
})();