(function() {
    class node extends coffeeEngine.getNode("Collision3D") {
        collision = new coffeeEngine.SAT.Sphere();
    }

    coffeeEngine.registerNode(node, "SphereCollision", "Collision3D");
})();