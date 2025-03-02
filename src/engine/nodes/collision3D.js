(function () {
    class node extends coffeeEngine.getNode("Node3D") {
        isColliding(collidee) {
            return;
        }
    }

    coffeeEngine.registerNode(node, "Collision3D", "Node3D");
})();