(function () {
    class sprite extends coffeeEngine.getNode("Node2D") {
        update(deltaTime) {
            super.update(deltaTime);
        }

        draw() {
            super.draw();

            coffeeEngine.renderer.mainShaders.unlit.setBuffers(coffeeEngine.shapes.plane);
            coffeeEngine.renderer.mainShaders.unlit.drawFromBuffers(6);
        }
    };

    coffeeEngine.registerNode(sprite, "Sprite", "Node2D");
})();
