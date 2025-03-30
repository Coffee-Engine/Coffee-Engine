(function () {
    class sprite extends coffeeEngine.getNode("Node2D") {
        //Sprite stuff
        #spritePath = "";

        set spritePath(value) {
            this.#spritePath = value;
            coffeeEngine.renderer.fileToTexture(value).then((texture) => {
                this.texture = texture.texture;
                this.textureWidth = texture.width;
                this.textureHeight = texture.height;
                this.updateMatrix();
            }).catch(() => {
                this.texture = null;
            });
        }

        get spritePath() {
            return this.#spritePath;
        }

        //Shader stuff
        #shaderPath = "coffee:/unlit";
        #shader = coffeeEngine.renderer.mainShaders.unlit;

        set shader(value) {
            this.#shaderPath = value;
            coffeeEngine.renderer.fileToShader(value).then((shader) => {
                this.#shader = shader;
            }).catch(() => {
                this.#shader = null;
                this.#shaderPath = "";
            });
        }
        get shader() {
            return this.#shaderPath;
        }

        //Color modulation
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

        $scaleMultiplier = 1.0;
        set scaleMultiplier(value) {
            this.$scaleMultiplier = value;
            this.updateMatrix();
        }
        get scaleMultiplier() {
            return this.$scaleMultiplier;
        }

        updateMatrix() {
            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.translate(this.position.x, this.position.y, this.layer);
            this.matrix = this.matrix.rotationZ(this.rotation);
            this.matrix = this.matrix.scale(this.scale.x, this.scale.y, 1);
            this.matrix = this.matrix.scale(this.textureWidth * this.scaleMultiplier, this.textureHeight * this.scaleMultiplier, 1);
        }

        draw(drawID) {
            super.draw();

            if (this.texture && this.#shader) {
                this.#shader.uniforms.u_model.value = this.mixedMatrix.webGLValue();

                this.#shader.setBuffers(coffeeEngine.shapes.plane);

                if (this.#shader.uniforms.u_texture) this.#shader.uniforms.u_texture.value = this.texture;
                if (this.#shader.uniforms.u_colorMod) this.#shader.uniforms.u_colorMod.value = this.#modulatedColorArr;
                if (this.#shader.uniforms.u_objectID) this.#shader.uniforms.u_objectID.value = drawID;

                this.#shader.drawFromBuffers(6);
            }
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC2 }, 
                { name: "layer", translationKey: "engine.nodeProperties.Node2D.layer", type: coffeeEngine.PropertyTypes.INT }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.FLOAT, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC2 }, 
                "---", 
                { name: "spritePath", translationKey: "engine.nodeProperties.Sprite.spritePath", type: coffeeEngine.PropertyTypes.FILE, fileType: "png,jpeg,jpg,webp,bmp,gif,svg" }, 
                { name: "scaleMultiplier", translationKey: "engine.nodeProperties.Sprite.scaleMultiplier", type: coffeeEngine.PropertyTypes.FLOAT }, 
                "---", 
                { name: "modulatedColor", translationKey: "engine.nodeProperties.Node.modulatedColor", type: coffeeEngine.PropertyTypes.COLOR4 }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(sprite, "Sprite", "Node2D");
})();
