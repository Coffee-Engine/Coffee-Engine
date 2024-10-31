(function () {
    class sprite extends coffeeEngine.getNode("Node2D") {
        update(deltaTime) {
            super.update(deltaTime);
        }

        draw() {
            super.draw();
            
        }
    };

    coffeeEngine.registerNode(sprite, "Sprite", "Node2D");
})();
