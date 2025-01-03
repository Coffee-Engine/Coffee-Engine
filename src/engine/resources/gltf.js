(function () {
    coffeeEngine.mesh.settings.glb = {
        useBytes:true
    };

    const GLTypes = {
        5123:[coffeeEngine.byteReader.Read2Bytes,2],
        5126:[coffeeEngine.byteReader.ReadFloat32,4],
    };

    const getAttributeData = (name,attributes,accessors,bufferViews,standard,BINPartition,defaultSize,defaultIsStepSize) => {
        let returner = [];
        //We are going to get every standard item
        if (attributes[name] !== undefined) {
            const accessor = accessors[attributes[name]];
            const bufferView = bufferViews[accessor.bufferView];
            const type = GLTypes[accessor.componentType];
            const stepSize = defaultIsStepSize ? defaultSize : (bufferView.byteLength / (defaultSize * type[1]));

            //Loop through the bytes of the positions
            for (let byteID = bufferView.byteOffset; byteID < (bufferView.byteOffset + bufferView.byteLength); byteID+=stepSize) {
                //Coordinites
                for (let x = 0; x < defaultSize; x++) {
                    returner.push(type[0](BINPartition,byteID + (x*type[1]),false));
                }
            }
        }
        else returner = (new Array(standard.count*defaultSize)).fill(0);

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
        const readMesh = (mesh) => {
            console.log(mesh);
            mesh.primitives.forEach(primitive => {
                const primitiveGeo = {}
                const attributes = primitive.attributes;
                const standardID = attributes.POSITION || attributes.NORMAL || attributes.TEXCOORD_0;
                const standard = accessors[standardID];

                primitiveGeo.a_position = getAttributeData("POSITION",attributes,accessors,bufferViews,standard,BINPartition,3);
                primitiveGeo.a_texCoord = getAttributeData("TEXCOORD_0",attributes,accessors,bufferViews,standard,BINPartition,2);
                primitiveGeo.a_normal = getAttributeData("NORMAL",attributes,accessors,bufferViews,standard,BINPartition,3);
                primitiveGeo.a_color = getAttributeData("COLOR_n",attributes,accessors,bufferViews,standard,BINPartition,4);
                
                const indicies = getAttributeData("indices",primitive,accessors,bufferViews,standard,BINPartition,1,true);
                console.log(indicies);
            })
        }

        //Find our mesh
        currentScene.nodes.forEach(nodeID => {
            const node = JSONPartition.nodes[nodeID];
            if (node.mesh !== undefined) {
                //If we are a mesh parse our primitives
                readMesh(JSONPartition.meshes[node.mesh]);
            }
        });

        //Flatten em
        //const dataLength = data.length - 1;
        //data[dataLength].a_position = new Float32Array(data[dataLength].a_position.flat(4));
        //data[dataLength].a_texCoord = new Float32Array(data[dataLength].a_texCoord.flat(4));
        //data[dataLength].a_normal = new Float32Array(data[dataLength].a_normal.flat(4));
        //data[dataLength].a_color = new Float32Array(data[dataLength].a_color.flat(4));
    };
})();
