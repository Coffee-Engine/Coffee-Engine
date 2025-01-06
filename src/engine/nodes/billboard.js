(function () {
    class billboard extends coffeeEngine.getNode("Node3D") {
        #spritePath = "";

        set spritePath(value) {
            this.#spritePath = value;
            coffeeEngine.renderer.fileToTexture(value).then((texture) => {
                this.texture = texture.texture;
                this.textureWidth = texture.width;
                this.textureHeight = texture.height;
                this.updateMatrix();
            });
        }

        get spritePath() {
            return this.#spritePath;
        }

        shader = coffeeEngine.renderer.mainShaders.unlit;

        #modulatedColorArr = [1, 1, 1, 1];
        #modulatedColor = "#ffffffff";

        set modulatedColor(value) {
            this.#modulatedColor = value;

            const split = coffeeEngine.ColorMath.HexToRGB(value);
            this.#modulatedColorArr = [split.r / 255, split.g / 255, split.b / 255, split.a / 255];
        }

        get modulatedColor() {
            return this.#modulatedColor;
        }

        draw() {
            super.draw();

            if (this.texture) {
                this.shader.setBuffersRaw(coffeeEngine.shapes.plane);

                this.shader.uniforms.u_model.value = this.matrix.rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x).webGLValue();
                this.shader.uniforms.u_texture.value = this.texture;
                if (this.shader.uniforms.u_colorMod) this.shader.uniforms.u_colorMod.value = this.#modulatedColorArr;

                this.shader.drawFromBuffers(6);
            }
        }

        getProperties() {
            return [
                { name: "name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "scale", type: coffeeEngine.PropertyTypes.VEC3 }, 
                "---", 
                { name: "spritePath", type: coffeeEngine.PropertyTypes.FILE, fileType: "png,jpeg,jpg,webp,bmp,gif,svg" },
                { name: "modulatedColor", type: coffeeEngine.PropertyTypes.COLOR4, smallRange: true },
                "---",
                {name: "script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js"}
            ];
        }
    }

    coffeeEngine.registerNode(billboard, "billboard", "Node3D");
})();
