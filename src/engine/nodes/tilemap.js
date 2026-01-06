(function () {
    class node extends coffeeEngine.getNode("Node2D") {
        //Allow for position and scale to be set directly
        #position = new coffeeEngine.vector2(0, 0);
        #scale = new coffeeEngine.vector2(1, 1);

        chunkSize = new coffeeEngine.vector2(16, 16);
        chunks = {};

        normal    = [0,0,1];
        tangent   = [0,1,0];
        bitangent = [1,0,0];

        //Builds chunks that are needed
        buildChunk(chunkPos) {
            const chunk = this.chunks[chunkPos];
            if (!chunk) return;

            if (chunk.mesh && chunk.mesh.dispose) chunk.mesh.dispose();

            let mesh = {
                a_position: [],
                a_texCoord: [],
                a_color: [],

                a_normal: [],
                a_tangent: [],
                a_bitangent: [],
            };

            for (let y = 0; y < this.chunkSize.y; y++) { for (let x = 0; x < this.chunkSize.x; x++) {
                let index = (y * this.chunkSize.x) + x;
                const tilePosition = [
                    chunkPos.x + x,
                    chunkPos.y + y,
                ]
                
                if (chunk.tiles[index] > 0) {
                    mesh.a_position.push(
                        tilePosition[0], tilePosition[1], 1, 1,
                        tilePosition[0] + 1, tilePosition[1], 1, 1,
                        tilePosition[0], tilePosition[1] + 1, 1, 1,

                        tilePosition[0] + 1, tilePosition[1] + 1, 1, 1,
                        tilePosition[0] + 1, tilePosition[1], 1, 1,
                        tilePosition[0], tilePosition[1] + 1, 1, 1
                    );

                    //TODO read atlas file and adjust UVs accordingly
                    mesh.a_texCoord.push(
                        0, 0,
                        1, 0,
                        0, 1,

                        1, 1,
                        1, 0,
                        0, 1
                    );

                    //? Potentially add a color attribute to tiles?
                    mesh.a_color.push(
                        1,1,1,1,
                        1,1,1,1,
                        1,1,1,1,

                        1,1,1,1,
                        1,1,1,1,
                        1,1,1,1
                    );

                    //* Even though it's 2D we pass normals through
                    mesh.a_normal.push(...this.normal,...this.normal,...this.normal,...this.normal,...this.normal,...this.normal);
                    mesh.a_tangent.push(...this.tangent,...this.tangent,...this.tangent,...this.tangent,...this.tangent,...this.tangent);
                    mesh.a_bitangent.push(...this.bitangent,...this.bitangent,...this.bitangent,...this.bitangent,...this.bitangent,...this.bitangent);
                }
            }};

            chunk.mesh = coffeeEngine.renderer.daveShade.buffersFromJSON(mesh);
        }

        constructor() {
            super();
            this.position.setter = () => {
                this.updateMatrix();
            };
            this.scale.setter = () => {
                this.updateMatrix();
            };

            this.updateMatrix();
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---", 
                { name: "sheetPath", translationKey: "engine.nodeProperties.Sprite.sheetPath", type: coffeeEngine.PropertyTypes.FILE, fileType: "png,jpeg,jpg,webp,bmp,gif,svg" }, 
                { name: "scaleDivider", translationKey: "engine.nodeProperties.Sprite.scaleDivider", type: coffeeEngine.PropertyTypes.FLOAT }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }

        sortValue() {
            return this.position.y;
        }
    }

    coffeeEngine.registerNode(node, "Tilemap", "Node2D");
})();
