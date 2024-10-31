(function () {
    class sprite extends coffeeEngine.getNode("Node2D") {
        set spritePath(value) {
            coffeeEngine.renderer.fileToTexture(value).then(texture => {
                this.texture = texture;
            });
        }

        update(deltaTime) {
            super.update(deltaTime);
        }

        draw() {
            super.draw();

            coffeeEngine.renderer.mainShaders.unlit.setBuffers(coffeeEngine.shapes.plane);

            if (this.texture) coffeeEngine.renderer.mainShaders.unlit.uniforms.u_texture.value = this.texture;

            coffeeEngine.renderer.mainShaders.unlit.drawFromBuffers(6);
        }
    };

    coffeeEngine.registerNode(sprite, "Sprite", "Node2D");
})();
