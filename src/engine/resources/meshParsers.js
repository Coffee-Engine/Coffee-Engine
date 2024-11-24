(function() {
    coffeeEngine.mesh.parsers = {
        obj: (contents, meshData) => {
            console.log(contents);

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
                            Number(split[3]),
                        ]);
                        break;

                    case "f":
                        console.log(split);
                        break;
                
                    default:
                        break;
                }
            });

            console.log(dataHolder);
        }
    }
})();