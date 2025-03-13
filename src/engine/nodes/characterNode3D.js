(function () {
    class node extends coffeeEngine.getNode("Node3D") {
        collisionGroup = "default";

        update(deltaTime) {
            super.update(deltaTime, true);
            //get my collisions
            const output = [];
            this.detectCollisions(output);

            if (output.length > 0) {
                //Find outputs and push object out of trouble
                for (let outputID in output) {
                    const outputObject = output[outputID];
                    this.position.x += outputObject.pushVector.x * outputObject.pushLength;
                    this.position.y += outputObject.pushVector.y * outputObject.pushLength;
                    this.position.z += outputObject.pushVector.z * outputObject.pushLength;
                }
            }

            this.mixedMatrix = this.parent.mixedMatrix.multiply(this.matrix);

            this.children.forEach(child => {
                child.update(deltaTime);
            });
        }
    }

    coffeeEngine.registerNode(node, "CharacterNode3D", "Node3D");
})();