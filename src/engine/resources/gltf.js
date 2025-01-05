(function () {
    coffeeEngine.mesh.settings.glb = {
        useBytes:true
    };

    const GLTypes = {
        5123:[coffeeEngine.byteReader.Read2Bytes,2],
        5126:[coffeeEngine.byteReader.ReadFloat32,4],
    };

    //I'm doing this because I'm tortured
    const getAttributeData = (name,attributes,accessors,bufferViews,standard,BINPartition,defaultSize) => {
        let returner = [];
        //We are going to get every standard item
        if (attributes[name] !== undefined) {
            const accessor = accessors[attributes[name]];
            const bufferView = bufferViews[accessor.bufferView];
            const type = GLTypes[accessor.componentType];
            const stepSize = (defaultSize * type[1]);

            //Loop through the bytes of the positions
            for (let byteID = bufferView.byteOffset; byteID < (bufferView.byteOffset + bufferView.byteLength); byteID+=stepSize) {
                //Coordinites
                if (defaultSize > 1) {
                    const conjoined = []
                    for (let x=0; x < defaultSize; x++) {
                        conjoined.push(type[0](BINPartition,byteID + (x*type[1]),false));
                    }
                    returner.push(conjoined);
                }
                else {
                    returner.push(type[0](BINPartition,byteID,false));
                }
            }
        }
        else {
            if (defaultSize > 1) returner = (new Array(standard.count)).fill(new Array(defaultSize).fill(1));
            else returner = (new Array(standard.count*defaultSize)).fill(1);
        }

        return returner;
    }

    coffeeEngine.mesh.parsers.glb = (contents, meshData) => {
        meshData.data = [];
        meshData.pointCount = [];
        const data = meshData.data;
        const pointCount = meshData.pointCount;

        //Convert it to a intArray
        contents = new Uint8Array(contents);
        
        //Make sure our first 4 bytes are glTF
        const magic = String.fromCharCode(contents[0],contents[1],contents[2],contents[3]);
        if (magic != "glTF") return;
        //?JSON
        const JSONChunkLength = coffeeEngine.byteReader.Read4Bytes(contents,12);
        //?BIN
        const BINChunkStart = JSONChunkLength + 20;
        const BINChunkLength = coffeeEngine.byteReader.Read4Bytes(contents,BINChunkStart);

        //Extract the JSON and BIN out of the main file
        const JSONPartition = JSON.parse(coffeeEngine.byteReader.ReadString(contents,20,JSONChunkLength));
        const BINPartition = coffeeEngine.byteReader.ReadBytesRaw(contents,BINChunkStart+8,BINChunkLength);

        //Stuff we globally need
        const currentScene = JSONPartition.scenes[JSONPartition.scene];
        const accessors = JSONPartition.accessors;
        const bufferViews = JSONPartition.bufferViews;

        //Mesh Reader
        const readMesh = (transform, mesh) => {
            mesh.primitives.forEach(primitive => {
                const primitiveGeo = {}
                const attributes = primitive.attributes;
                const standardID = attributes.POSITION || attributes.NORMAL || attributes.TEXCOORD_0;
                const standard = accessors[standardID];

                primitiveGeo.a_position = getAttributeData("POSITION",attributes,accessors,bufferViews,standard,BINPartition,3);
                primitiveGeo.a_texCoord = getAttributeData("TEXCOORD_0",attributes,accessors,bufferViews,standard,BINPartition,2);
                primitiveGeo.a_normal = getAttributeData("NORMAL",attributes,accessors,bufferViews,standard,BINPartition,3);
                primitiveGeo.a_color = getAttributeData("COLOR_n",attributes,accessors,bufferViews,standard,BINPartition,4);

                for (let id = 0; id < primitiveGeo.a_position.length; id++) {
                    const transformed = transform.multiplyVector({
                        x:primitiveGeo.a_position[id][0],
                        y:primitiveGeo.a_position[id][1],
                        z:primitiveGeo.a_position[id][2],
                        w:1
                    });

                    primitiveGeo.a_position[id][0] = transformed.x;
                    primitiveGeo.a_position[id][1] = transformed.y;
                    primitiveGeo.a_position[id][2] = transformed.z;
                }
                
                const indicies = getAttributeData("indices",primitive,accessors,bufferViews,standard,BINPartition,1);
                
                const constructedSubmesh = {
                    a_position:[],
                    a_texCoord:[],
                    a_normal:[],
                    a_color:[],
                };

                indicies.forEach(indice => {
                    constructedSubmesh.a_position.push(primitiveGeo.a_position[indice],1);
                    constructedSubmesh.a_texCoord.push(primitiveGeo.a_texCoord[indice]);
                    constructedSubmesh.a_normal.push(primitiveGeo.a_normal[indice]);
                    constructedSubmesh.a_color.push(primitiveGeo.a_color[indice]);
                });

                data.push(constructedSubmesh);
                pointCount.push(indicies.length);
                
                const dataLength = data.length - 1;
                data[dataLength].a_position = new Float32Array(data[dataLength].a_position.flat(4));
                data[dataLength].a_texCoord = new Float32Array(data[dataLength].a_texCoord.flat(4));
                data[dataLength].a_normal = new Float32Array(data[dataLength].a_normal.flat(4));
                data[dataLength].a_color = new Float32Array(data[dataLength].a_color.flat(4));
            });
        }

        //Find our mesh
        console.log(JSONPartition)
        const readNodes = (matrix,nodeArray) => {
            nodeArray.forEach(nodeID => {
                const node = JSONPartition.nodes[nodeID];

                let localMatrix = coffeeEngine.matrix4.identity();
                console.log(node);
                if (node.scale) localMatrix = localMatrix.scale(node.scale[0],node.scale[1],node.scale[2]);
                if (node.rotation) localMatrix = localMatrix.rotateQuaternion(node.rotation[0],node.rotation[1],node.rotation[2],node.rotation[3]);
                if (node.translation) localMatrix = localMatrix.translate(node.translation[0],node.translation[1],node.translation[2]);

                const multipliedMatrix = matrix.multiply(localMatrix);

                if (node.mesh !== undefined) {
                    //If we are a mesh parse our primitives
                    readMesh(multipliedMatrix,JSONPartition.meshes[node.mesh]);
                }

                if (node.children) {
                    readNodes(multipliedMatrix,node.children);
                }
            });
        }

        readNodes(coffeeEngine.matrix4.identity(),currentScene.nodes);
    };
})();
