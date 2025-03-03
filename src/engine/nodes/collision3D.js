(function () {
    class node extends coffeeEngine.getNode("Node3D") {
        update(deltaTime) {
            super.update(deltaTime);
            if (this.collision) this.collision.matrix = this.mixedMatrix;
        }

        //Stop self collisions, and make sure we have a collider
        isColliding(collidee) {
            if (collidee == this || (!collidee instanceof node)) return;
            if (this.collision && collidee.collision) {
                const result = this.collision.solve(collidee.collision);
                if (result.successful) return result;
            };
            return;
        }
    }

    coffeeEngine.registerNode(node, "Collision3D", "Node3D");
})();