(function () {
    class billboard extends coffeeEngine.getNode("Node3D") {
        //Sprite stuff
        #spritePath = "";
        filtering = "NEAREST"

        set spritePath(value) {
            this.#spritePath = value;
            coffeeEngine.renderer.fileToTexture(value).then((texture) => {
                this.texture = texture;
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

        //Billboard settings
        omnidirectional = false;
        scaleMultiplier = 1.0;

        updateMatrix() {
            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.translate(this.position.x, this.position.y, this.position.z);
        }

        draw(drawID) {
            super.draw();

            if (this.texture && this.#shader) {
                const translatedWorld = this.mixedMatrix.getTranslation();
                this.#shader.setBuffers(coffeeEngine.shapes.plane);

                //Rotate and scale our billboard depending on MULTIPLE variables
                if (this.omnidirectional)
                    this.#shader.uniforms.u_model.value = coffeeEngine.matrix4
                        .identity()
                        .translate(translatedWorld.x, translatedWorld.y, translatedWorld.z)
                        .rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x)
                        .rotationX(-coffeeEngine.renderer.cameraData.cameraRotationEul.y)
                        .scale(this.scale.x, this.scale.y, -1)
                        .scale(this.textureWidth * this.scaleMultiplier, this.textureHeight * this.scaleMultiplier, 1)
                        .webGLValue();
                else
                    this.#shader.uniforms.u_model.value = coffeeEngine.matrix4
                        .identity()
                        .translate(translatedWorld.x, translatedWorld.y, translatedWorld.z)
                        .rotationY(-coffeeEngine.renderer.cameraData.cameraRotationEul.x)
                        .scale(this.scale.x, this.scale.y, -1)
                        .scale(this.textureWidth * this.scaleMultiplier, this.textureHeight * this.scaleMultiplier, 1)
                        .webGLValue();

                this.texture.setFiltering(DaveShade.filtering[this.filtering]);
                if (this.#shader.uniforms.u_texture) this.#shader.uniforms.u_texture.value = this.texture.texture;
                if (this.#shader.uniforms.u_colorMod) this.#shader.uniforms.u_colorMod.value = this.#modulatedColorArr;
                if (this.#shader.uniforms.u_objectID) this.#shader.uniforms.u_objectID.value = drawID;

                coffeeEngine.renderer.daveshade.cullFace();
                this.#shader.drawFromBuffers(6);
            }
        }

        getProperties() {
            let baseShaders = {};
            Object.keys(coffeeEngine.renderer.mainShaders).map((key) => {
                baseShaders[`${key}.glsl`] = key;
                return key;
            });

            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC3 }, 
                "---", 
                { name: "spritePath", translationKey: "engine.nodeProperties.Sprite.spritePath", type: coffeeEngine.PropertyTypes.FILE, fileType: "png,jpeg,jpg,webp,bmp,gif,svg" }, 
                { name: "omnidirectional", translationKey: "engine.nodeProperties.Billboard.omnidirectional", type: coffeeEngine.PropertyTypes.BOOLEAN }, 
                { name: "scaleMultiplier", translationKey: "engine.nodeProperties.Sprite.scaleMultiplier", type: coffeeEngine.PropertyTypes.FLOAT }, 
                "---", 
                { name: "modulatedColor", translationKey: "engine.nodeProperties.Node.modulatedColor", type: coffeeEngine.PropertyTypes.COLOR4 }, 
                { name: "filtering", translationKey: "engine.nodeProperties.Sprite.filtering", type: coffeeEngine.PropertyTypes.DROPDOWN, items: [
                    { text: editor.language["engine.nodeProperties.Sprite.filtering.nearest"], value: "NEAREST"},
                    { text: editor.language["engine.nodeProperties.Sprite.filtering.linear"], value: "LINEAR"},
                ]},
                { name: "shader", translationKey: "engine.fileProperties.Shader.shader", type: coffeeEngine.PropertyTypes.FILE, fileType: "glsl", systemRoot: { "/____NAMESPACE__IDENTIFIER____/": true, "coffee:": baseShaders, "project:": project.fileSystem } },
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }

        sortValue(secondPass) {
            if (secondPass) {
                return this.position.sub(coffeeEngine.renderer.cameraData.position).length();
            }

            const transformed = coffeeEngine.renderer.cameraData.unflattenedTransform.multiplyVector({
                x: this.position.x,
                y: this.position.y,
                z: this.position.z,
                w: 1,
            });

            return transformed.z;
        }
    }

    coffeeEngine.registerNode(billboard, "Billboard", "Node3D");
})();
