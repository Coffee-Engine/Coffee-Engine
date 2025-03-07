(function () {
    class node extends coffeeEngine.getNode("Node3D") {
        collisionGroup = "default";

        update(deltaTime) {
            super.update(deltaTime);
            if (this.collision) this.collision.matrix = this.mixedMatrix;
        }

        //Stop self collisions, and make sure we have a collider
        isColliding(collidee) {
            if (collidee == this || (!collidee instanceof node)) return;
            //Make sure we are in a compatible collision grouping
            if (!coffeeEngine.collisionGroups[collidee.collisionGroup][this.collisionGroup]) return;
            if (this.collision && collidee.collision) {
                const result = this.collision.solve(collidee.collision);
                if (result.successful) return result;
            };
            return;
        }

        detectCollisions(collisionList) {
            return coffeeEngine.runtime.currentScene.isColliding(this, collisionList);
        }
    }

    coffeeEngine.registerNode(node, "Collision3D", "Node3D");
})();