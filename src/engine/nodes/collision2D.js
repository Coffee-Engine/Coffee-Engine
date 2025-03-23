(function () {
    class node extends coffeeEngine.getNode("Node2D") {
        collisionGroup = "default";

        update(deltaTime, noChildren) {
            super.update(deltaTime, noChildren);
            if (this.collision) this.collision.matrix = this.mixedMatrix;
        }

        //Stop self collisions, and make sure we have a collider
        isColliding(collidee) {
            if (collidee == this || (!collidee instanceof node)) return;
            //Make sure we are in a compatible collision grouping
            if (!coffeeEngine.collisionGroup[collidee.collisionGroup][this.collisionGroup]) return;
            if (this.collision && collidee.collision) {
                const result = this.collision.solve(collidee.collision);
                if (result.successful) return result;
            };
            return;
        }

        detectCollisions(collisionList) {
            this.mixedMatrix = this.parent.mixedMatrix.multiply(this.matrix);
            this.collision.matrix = this.mixedMatrix;
            coffeeEngine.runtime.currentScene.isColliding(this, collisionList);

            return collisionList.length > 0;
        }
    }

    coffeeEngine.registerNode(node, "Collision2D", "Node2D");
})();