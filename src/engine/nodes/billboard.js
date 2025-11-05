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

        draw(renderer, daveShade, camera, drawID) {
            super.draw(renderer, daveShade, camera, drawID);

            if (this.texture && this.#shader) {
                const translatedWorld = this.mixedMatrix.getTranslation();

                //Move matrix to be at the entity's position;
                let modelMat = coffeeEngine.matrix4.identity().translate(translatedWorld.x, translatedWorld.y, translatedWorld.z);
                
                //Rotate it
                if (this.omnidirectional) modelMat = modelMat.rotationY(-camera.rotationEuler.x).rotationX(-camera.rotationEuler.y);
                else modelMat = modelMat.rotationY(-camera.rotationEuler.x);
                
                //Then finally scale it.
                modelMat = modelMat.scale(this.scale.x, this.scale.y, -1)
                        .scale(this.textureWidth * this.scaleMultiplier, this.textureHeight * this.scaleMultiplier, 1)
                        .webGLValue();
                
                this.#shader.setUniforms({
                    u_model: modelMat,
                    u_texture: this.texture.TEXTURE,
                    u_colorMod: this.#modulatedColorArr,
                    u_objectID: drawID,
                    ...camera.getShaderData()
                });

                this.#shader.setBuffers(coffeeEngine.shapes.plane);

                this.texture.setFiltering(daveShade.FILTERING[this.filtering]);

                daveShade.cullFace();
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

        sortValue(camera, secondPass) {
            if (secondPass) {
                return this.position.sub(camera.position).length();
            }

            const transformed = camera.unflattenedTransform.multiplyVector({
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
