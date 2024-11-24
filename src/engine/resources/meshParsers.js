(function() {
    coffeeEngine.mesh.parsers = {
        obj: (contents, meshData) => {

            meshData.data = []

            const dataHolder = {
                a_position:[],
                a_texCoord:[],
                a_color:[],
                a_normal:[],
            }

            contents.split("\n").forEach(line => {
                //Split the line into multiple sections
                const split = line.split(" ");

                switch (split[0]) {
                    case "v":
                        dataHolder.a_position.push([
                            Number(split[1]),
                            Number(split[2]),
                            Number(split[3]),
                        ]);
                        break;

                    case "vn":
                        dataHolder.a_normal.push([
                            Number(split[1]),
                            Number(split[2]),
                            Number(split[3]),
                        ]);
                        break;

                    case "vt":
                        dataHolder.a_texCoord.push([
                            Number(split[1]),
                            Number(split[2]),
                        ]);
                        break;

                    case "usemtl":
                        meshData.data.push({
                            a_position:[],
                            a_texCoord:[],
                            a_color:[],
                            a_normal:[],
                        });
                        meshData.pointCount.push(0);
                        break;

                    case "f":
                        //Get the first point
                        let [firstPosition, firstUV, firstNormal] = split[1].split("/");
                        firstPosition = Number(firstPosition) - 1;
                        firstUV = Number(firstUV) - 1;
                        firstNormal = Number(firstNormal) - 1;

                        //Loop through each vertex
                        for (let index = 2; index < split.length - 1; index++) {
                            //Get the other points of the triangle
                            let [secondPosition, secondUV, secondNormal] = split[index].split("/");
                            secondPosition = Number(secondPosition) - 1;
                            secondUV = Number(secondUV) - 1;
                            secondNormal = Number(secondNormal) - 1;

                            let [thirdPosition, thirdUV, thirdNormal] = split[index + 1].split("/");
                            thirdPosition = Number(thirdPosition) - 1;
                            thirdUV = Number(thirdUV) - 1;
                            thirdNormal = Number(thirdNormal) - 1;

                            //Push our data
                            meshData.data[meshData.data.length - 1].a_position.push(
                                [dataHolder.a_position[firstPosition],1],
                                [dataHolder.a_position[secondPosition],1],
                                [dataHolder.a_position[thirdPosition],1]
                            );

                            meshData.data[meshData.data.length - 1].a_texCoord.push(
                                dataHolder.a_texCoord[firstUV],
                                dataHolder.a_texCoord[secondUV],
                                dataHolder.a_texCoord[thirdUV]
                            );
                            
                            meshData.data[meshData.data.length - 1].a_normal.push(
                                dataHolder.a_normal[firstNormal],
                                dataHolder.a_normal[secondNormal],
                                dataHolder.a_normal[thirdNormal]
                            );

                            meshData.data[meshData.data.length - 1].a_color.push(
                                1,1,1,1,
                                1,1,1,1,
                                1,1,1,1
                            );

                            //Update our point count
                            meshData.pointCount[meshData.pointCount.length - 1] += 3;
                        }
                        break;
                
                    default:
                        break;
                }
            });

            //Flatten em
            meshData.data[meshData.data.length - 1].a_position = new Float32Array(meshData.data[meshData.data.length - 1].a_position.flat(4));
            meshData.data[meshData.data.length - 1].a_texCoord = new Float32Array(meshData.data[meshData.data.length - 1].a_texCoord.flat(4));
            meshData.data[meshData.data.length - 1].a_normal = new Float32Array(meshData.data[meshData.data.length - 1].a_normal.flat(4));
            meshData.data[meshData.data.length - 1].a_color = new Float32Array(meshData.data[meshData.data.length - 1].a_color.flat(4));
        }
    }
})();