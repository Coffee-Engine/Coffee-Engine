(function () {
    coffeeEngine.mesh = {
        class: class {
            data = {};
            pointCount = [];
        },

        //Returns stored
        finalizeAndParse: (data) => {
            for (const index in data) {
                //Look through each vertex in position
                const positions = data[index].a_position;
                const uvs = data[index].a_texCoord;
                const normals = data[index].a_normal;

                data[index].a_tangent = [];
                data[index].a_bitangent = [];

                //calculate tangent and bitangent
                let triangleUVID = 0;
                for (let trianglePointID=0; trianglePointID<positions.length; trianglePointID += 12) {
                     //get points from buffer
                     const point1 = [positions[trianglePointID], positions[trianglePointID+1], positions[trianglePointID+2]];
                     const point2 = [positions[trianglePointID+4], positions[trianglePointID+5], positions[trianglePointID+6]];
                     const point3 = [positions[trianglePointID+8], positions[trianglePointID+9], positions[trianglePointID+10]];

                     //get uvs from buffer
                     const uv1 = [uvs[triangleUVID], uvs[triangleUVID+1]];
                     const uv2 = [uvs[triangleUVID+2], uvs[triangleUVID+3]];
                     const uv3 = [uvs[triangleUVID+4], uvs[triangleUVID+5]];
                
                    //Calculate edges
                    const edge1 = [point2[0]-point1[0], point2[1]-point1[1], point2[2]-point1[2]];
                    const edge2 = [point3[0]-point1[0], point3[1]-point1[1], point3[2]-point1[2]];

                    //Then delta UVs
                    const deltaUV1 = [uv2[0] - uv1[0], uv2[1] - uv1[1]];
                    const deltaUV2 = [uv3[0] - uv1[0], uv3[1] - uv1[1]];

                    //Then finally calculate the tangent and BItangent
                    const f = 1/(deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1]); //Cross product
                
                    //Our 2 sibling vectors to the normal
                    const tangent = [
                        f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
                        f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
                        f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])
                    ];

                    const bitangent = [
                        f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]),
                        f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]),
                        f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2])
                    ];
                    
                    //Add three copies for each triangle
                    data[index].a_tangent.push(tangent,tangent,tangent);
                    data[index].a_bitangent.push(bitangent,bitangent,bitangent);

                    //StepUVID
                    triangleUVID += 6;
                }
                
                //Flatten and convert to f32 then convert to buffers later
                data[index].a_tangent = new Float32Array(data[index].a_tangent.flat(4));
                data[index].a_bitangent = new Float32Array(data[index].a_bitangent.flat(4));

                //Convert it to buffers
                data[index] = coffeeEngine.renderer.daveshade.buffersFromJSON(data[index]);
            }

            return data;
        },

        fromProjectFile: (src) => {
            const fileReader = new FileReader();
            return new Promise((resolve, reject) => {
                //If the mesh exists in RAM, load it
                if (coffeeEngine.mesh.storage[src]) {
                    resolve(coffeeEngine.mesh.storage[src]);
                    return;
                }

                //If the mesh does not exist load it
                project
                    .getFile(src)
                    .then((file) => {
                        let split = src.split(".");
                        const extension = split[split.length - 1].toLowerCase();
                        const settings = coffeeEngine.mesh.settings[extension] || coffeeEngine.mesh.defaultSettings;

                        fileReader.onload = () => {
                            const stored = new coffeeEngine.mesh.class();
                            coffeeEngine.mesh.storage[src] = stored;

                            if (coffeeEngine.mesh.parsers[extension]) coffeeEngine.mesh.parsers[extension](fileReader.result, stored);
                            //save the points
                            stored.unparsed = {};
                            Object.keys(stored.data).forEach(key => {
                                stored.unparsed[key] = stored.data[key];
                            });
                            stored.data = coffeeEngine.mesh.finalizeAndParse(stored.data);

                            resolve(stored);
                        };

                        //Load the file.
                        if (settings.useBytes) fileReader.readAsArrayBuffer(file);
                        else fileReader.readAsText(file);
                    })
                    .catch(() => {
                        reject("File does not exist");
                    });
            });
        },

        storage: {},
        parsers: {},
        settings: {},
        defaultSettings: {
            useBytes: false,
        },
    };

    //Add our preloading function
    coffeeEngine.preloadFunctions["meshes"] = { function: coffeeEngine.mesh.fromProjectFile, storage: coffeeEngine.mesh.storage };
})();
