(function () {
    class node extends coffeeEngine.getNode("Node3D") {

        update(deltaTime) {
            super.update(deltaTime);
            if (this.collision) this.collision.matrix = this.mixedMatrix;
        }

        isColliding(collidee) {
            if (this.collision) return this.collision.solve(collidee);
            return;
        }
    }

    coffeeEngine.registerNode(node, "Collision3D", "Node3D");
})();