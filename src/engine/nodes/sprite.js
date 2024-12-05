(function () {
    class sprite extends coffeeEngine.getNode("Node2D") {
        #spritePath = "";

        set spritePath(value) {
            this.#spritePath = value
            coffeeEngine.renderer.fileToTexture(value).then((texture) => {
                this.texture = texture.texture;
                this.textureWidth = texture.width;
                this.textureHeight = texture.height;
            });
        }

        get spritePath() {
            return this.#spritePath;
        }

        #modulatedColorArr = [1,1,1,1];
        #modulatedColor = "#ffffffff";

        set modulatedColor(value) {
            this.#modulatedColor = value;

            const split = coffeeEngine.ColorMath.HexToRGB(value);
            this.#modulatedColorArr = [split.r / 255, split.g / 255, split.b / 255, split.a / 255];
        }

        get modulatedColor() {
            return this.#modulatedColor;
        }

        shader = coffeeEngine.renderer.mainShaders.unlit;

        scaleMultiplier = 1.0;

        update(deltaTime) {
            super.update(deltaTime);
        }

        draw() {
            super.draw();

            if (this.texture) {
                //Sprite scaling
                this.matrix = this.matrix.scale(this.textureWidth * this.scaleMultiplier, this.textureHeight * this.scaleMultiplier, 1);
                coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.webGLValue();
    
                coffeeEngine.renderer.mainShaders.unlit.setBuffers(coffeeEngine.shapes.plane);
    
                if (this.texture && this.shader.uniforms.u_texture) this.shader.uniforms.u_texture.value = this.texture;
                if (this.shader.uniforms.u_colorMod) this.shader.uniforms.u_colorMod.value = this.#modulatedColorArr;
    
                coffeeEngine.renderer.mainShaders.unlit.drawFromBuffers(6);
            }
        }

        getProperties() { 
            return [
                {name: "name", type: coffeeEngine.PropertyTypes.NAME},
                "---",
                {name: "position", type: coffeeEngine.PropertyTypes.VEC2},
                {name: "layer", type: coffeeEngine.PropertyTypes.INT},
                {name: "rotation", type: coffeeEngine.PropertyTypes.FLOAT},
                {name: "scale", type: coffeeEngine.PropertyTypes.VEC2},
                "---",
                {name: "spritePath", type: coffeeEngine.PropertyTypes.FILE, fileType: "png,jpeg,jpg,webp,bmp,gif,svg"},
                {name: "modulatedColor", type: coffeeEngine.PropertyTypes.COLOR4, smallRange:true},
                {name: "scaleMultiplier", type: coffeeEngine.PropertyTypes.FLOAT},
            ] 
        };
    }

    coffeeEngine.registerNode(sprite, "Sprite", "Node2D");
})();
