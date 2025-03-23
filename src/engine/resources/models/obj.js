(function () {
    coffeeEngine.mesh.parsers.obj = (contents, meshData) => {
        meshData.data = [];
        meshData.pointCount = [];
        const data = meshData.data;
        const pointCount = meshData.pointCount;

        const hasMaterial = contents.includes("usemtl");

        if (!hasMaterial) {
            data.push({
                a_position: [],
                a_texCoord: [],
                a_color: [],
                a_normal: [],
            });
        }

        const dataHolder = {
            a_position: [],
            a_texCoord: [],
            a_color: [],
            a_normal: [],
        };

        const defaults = {
            a_position: [0, 0, 0, 1],
            a_normal: [0, 0, 0],
            a_texCoord: [0, 0],
        };

        contents.split("\n").forEach((line) => {
            //Split the line into multiple sections
            const split = line.split(" ");

            switch (split[0]) {
                case "v":
                    dataHolder.a_position.push([Number(split[1]), Number(split[2]), Number(split[3])]);
                    break;

                case "vn":
                    dataHolder.a_normal.push([Number(split[1]), Number(split[2]), Number(split[3])]);
                    break;

                case "vt":
                    dataHolder.a_texCoord.push([Number(split[1]) || 0, Number(split[2]) || 0]);
                    break;

                case "usemtl":
                    //Flatten mesh data
                    if (meshData.data.length > 0) {
                        //Flatten em
                        const dataLength = data.length - 1;

                        //Calculate tangent and bitangent
                        data[dataLength].a_position = new Float32Array(data[dataLength].a_position.flat(4));
                        data[dataLength].a_texCoord = new Float32Array(data[dataLength].a_texCoord.flat(4));
                        data[dataLength].a_normal = new Float32Array(data[dataLength].a_normal.flat(4));
                        data[dataLength].a_color = new Float32Array(data[dataLength].a_color.flat(4));
                    }
                    //Add new mesh data
                    data.push({
                        a_position: [],
                        a_texCoord: [],
                        a_color: [],
                        a_normal: [],
                    });
                    pointCount.push(0);
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
                        const dataLength = data.length - 1;
                        data[dataLength].a_position.push([dataHolder.a_position[firstPosition] || defaults.a_position, 1], [dataHolder.a_position[secondPosition] || defaults.a_position, 1], [dataHolder.a_position[thirdPosition] || defaults.a_position, 1]);
                        data[dataLength].a_texCoord.push(dataHolder.a_texCoord[firstUV] || defaults.a_position, dataHolder.a_texCoord[secondUV] || defaults.a_position, dataHolder.a_texCoord[thirdUV] || defaults.a_position);
                        data[dataLength].a_normal.push(dataHolder.a_normal[firstNormal] || defaults.a_position, dataHolder.a_normal[secondNormal] || defaults.a_position, dataHolder.a_normal[thirdNormal] || defaults.a_position);
                        data[dataLength].a_color.push(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);

                        //Update our point count
                        pointCount[pointCount.length - 1] += 3;
                    }
                    break;

                default:
                    break;
            }
        });

        //Flatten em
        const dataLength = data.length - 1;
        data[dataLength].a_position = new Float32Array(data[dataLength].a_position.flat(4));
        data[dataLength].a_texCoord = new Float32Array(data[dataLength].a_texCoord.flat(4));
        data[dataLength].a_normal = new Float32Array(data[dataLength].a_normal.flat(4));
        data[dataLength].a_color = new Float32Array(data[dataLength].a_color.flat(4));
    };
})();
