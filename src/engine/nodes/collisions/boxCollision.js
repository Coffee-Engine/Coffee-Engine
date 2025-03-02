(function() {
    class node extends coffeeEngine.getNode("Collision3D") {
        collision = new coffeeEngine.SAT.OBB();
    }

    coffeeEngine.registerNode(node, "BoxCollision", "Collision3D");
})();