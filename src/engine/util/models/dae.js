(function () {
    //* for DAE
    const domParser = new DOMParser();
    //? Format [NAME, LENGTH, APPEND]
    const daePrefectures = {
        VERTEX: ["a_position", 3, 1],
        NORMAL: ["a_normal", 3, 0],
        TEXCOORD: ["a_texCoord", 2, 0],
        COLOR: ["a_color", 4, 0],
    };

    //! I can't think of a better name.
    const getFlArrFromSourceEl = (element) => {
        if (!element) return;
        const floatArray = Array.from(element.getElementsByTagName("float_array"))[0];
        if (!floatArray) return;
        return floatArray.innerHTML.split(" ");
    };

    //? The actual parser
    coffeeEngine.mesh.parsers.dae = (contents, meshData) => {
        meshData.data = [];
        meshData.pointCount = [];
        const data = meshData.data;
        const pointCount = meshData.pointCount;
        //                       Serious     serious         silly! :3
        const parsedSubMeshes = { data: {}, pointCount: {}, controllers: {}, materials: {} };
        const DOM = domParser.parseFromString(contents, "text/xml");
        //* Get our geometry
        const geometryLib = DOM.getElementsByTagName("library_geometries")[0];
        const controllerLib = DOM.getElementsByTagName("library_controllers")[0];
        const sceneLib = DOM.getElementsByTagName("library_visual_scenes")[0];
        const materialToSubmesh = {};

        //* Loop through every geometry
        const geometries = Array.from(geometryLib.getElementsByTagName("geometry"));
        geometries.forEach((geometry) => {
            //Get our meshes and start conversion
            const meshes = Array.from(geometry.getElementsByTagName("mesh"));
            meshes.forEach((mesh) => {
                //Get contents
                const pullTable = {
                    a_position: getFlArrFromSourceEl(DOM.getElementById(`${geometry.id}-positions`)),
                    a_normal: getFlArrFromSourceEl(DOM.getElementById(`${geometry.id}-normals`)),
                    a_texCoord: getFlArrFromSourceEl(DOM.getElementById(`${geometry.id}-map-0`)),
                    //? Maybe this is the right way? just an estimation.
                    a_color: getFlArrFromSourceEl(DOM.getElementById(`${geometry.id}-color`)),
                };

                parsedSubMeshes.data[`#${geometry.id}`] = [];
                parsedSubMeshes.pointCount[`#${geometry.id}`] = [];
                parsedSubMeshes.materials[`#${geometry.id}`] = [];

                const currentData = parsedSubMeshes.data[`#${geometry.id}`];
                const currentPointCount = parsedSubMeshes.pointCount[`#${geometry.id}`];
                const currentMaterials = parsedSubMeshes.materials[`#${geometry.id}`];

                const triangles = Array.from(mesh.getElementsByTagName("triangles"));

                triangles.forEach((triangleElement) => {
                    //Expect a silly little error if possible
                    const readPointCount = Number(triangleElement.getAttribute("count")) || 0;

                    if (readPointCount > 2) {
                        //Just add the point count
                        currentPointCount.push(readPointCount * 3);

                        //Add the new data stretch
                        currentData.push({
                            a_position: pullTable.a_position ? [] : new Array(readPointCount * 12).fill(0),
                            a_normal: pullTable.a_normal ? [] : new Array(readPointCount * 9).fill(0),
                            a_texCoord: pullTable.a_texCoord ? [] : new Array(readPointCount * 6).fill(0),
                            a_color: pullTable.a_color ? [] : new Array(readPointCount * 12).fill(1),
                        });

                        //Get the required elements
                        const ordering = [];
                        const orderingEls = Array.from(triangleElement.getElementsByTagName("input"));
                        orderingEls.forEach((inputEl) => {
                            const target = inputEl.getAttribute("semantic");
                            const offset = Number(inputEl.getAttribute("offset")) || 0;

                            //We only support specific attributes so we will make sure that the others have undefined prefecture
                            if (!daePrefectures[target]) ordering.splice(offset, 0, [target, 0, 0]);
                            else ordering.splice(offset, 0, daePrefectures[target]);
                        });

                        //!            VVV Below is peak lazyness VVV
                        const dataIndex = currentData.length - 1;
                        const points = (Array.from(triangleElement.getElementsByTagName("p"))[0] || { innerHTML: "" }).innerHTML.split(" ");
                        for (let pid = 0; pid < points.length; pid++) {
                            const point = Number(points[pid]) || 0;
                            //Modulo the ordering to get the current prefecture of the point
                            const prefecture = ordering[pid % ordering.length];
                            const name = prefecture[0];
                            const length = prefecture[1];
                            const append = prefecture[2];

                            //Add the goods
                            if (currentData[dataIndex][name] && pullTable[name]) {
                                for (let X = point * length; X < point * length + length; X++) {
                                    currentData[dataIndex][name].push(Number(pullTable[name][X]) || 0);
                                }
                                for (let X = 0; X < append; X++) {
                                    currentData[dataIndex][name].push(1);
                                }
                            }
                        }

                        //Now we add the material
                        currentMaterials.push(triangleElement.getAttribute("material") || "");
                    }
                });
            });
        });

        //* if we have controllers loop through those too
        let controllers = [];
        if (controllerLib) controllers = Array.from(controllerLib.getElementsByTagName("controller"));
        controllers.forEach((controller) => {
            const skin = controller.getElementsByTagName("skin")[0];
            if (skin) {
                //We will initilize it with meshID
                parsedSubMeshes.controllers[controller.getAttribute("id")] = { meshID: skin.getAttribute("source") };
            }
        })

        //* create a general purpose mesh parsing function
        const parseMeshFromInstance = (meshID, matrix) => {
            //Loop through sub meshes
            for (const subMesh in parsedSubMeshes.pointCount[meshID]) {
                const materialName = parsedSubMeshes.materials[meshID][subMesh];
                if (!materialToSubmesh[materialName]) {
                    materialToSubmesh[materialName] = data.length;
                    //Add our parsedStuff
                    data.push({
                        a_position: [],
                        a_texCoord: [],
                        a_normal: [],
                        a_color: [],
                    });
                    pointCount.push(0);
                }

                let subMeshIndex = materialToSubmesh[materialName];
    
                //Now we parse our data
                const currentData = parsedSubMeshes.data[meshID][subMesh];
                const currentPositionData = [...currentData.a_position];
                const currentNormalData = [...currentData.a_normal];
                for (let index = 0; index < currentPositionData.length; index += 4) {
                    //Construct a "vector"
                    const vector = {
                        x: currentPositionData[index],
                        y: currentPositionData[index + 1],
                        z: currentPositionData[index + 2],
                        w: currentPositionData[index + 3],
                    };
    
                    //Multiply it
                    const constructed = matrix.multiplyVector(vector);
                    currentPositionData[index] = constructed.x;
                    currentPositionData[index + 1] = constructed.y;
                    currentPositionData[index + 2] = constructed.z;
                    currentPositionData[index + 3] = constructed.w;
                }
    
                for (let index = 0; index < currentNormalData.length; index += 3) {
                    //Construct a "vector"
                    const vector = {
                        x: currentNormalData[index],
                        y: currentNormalData[index + 1],
                        z: currentNormalData[index + 2],
                        w: 0,
                    };
    
                    //Multiply it
                    const constructed = matrix.multiplyVector(vector);
                    currentNormalData[index] = constructed.x;
                    currentNormalData[index + 1] = constructed.y;
                    currentNormalData[index + 2] = constructed.z;
                }
    
                //Convert to float32 arrays
                data[subMeshIndex].a_position.push(...currentPositionData);
                data[subMeshIndex].a_texCoord.push(...currentData.a_texCoord.flat(4));
                data[subMeshIndex].a_normal.push(...currentNormalData);
                data[subMeshIndex].a_color.push(...currentData.a_color.flat(4));
                pointCount[subMeshIndex] += parsedSubMeshes.pointCount[meshID][subMesh];
                //if (currentData.a_position.flat) currentData.a_position = new Float32Array(currentData.a_position.flat(4));
                //if (currentData.a_texCoord.flat) currentData.a_texCoord = new Float32Array();
                //if (currentData.a_normal.flat) currentData.a_normal = new Float32Array(currentData.a_normal.flat(4));
                //if (currentData.a_color.flat) currentData.a_color = new Float32Array();
            }
        }

        //* We are just going to add every scene :troll:
        const scenes = Array.from(sceneLib.getElementsByTagName("visual_scene"));
        scenes.forEach((scene) => {
            const nodes = Array.from(scene.getElementsByTagName("node"));
            nodes.forEach((node) => {
                const matrixEl = Array.from(node.getElementsByTagName("matrix"))[0];
                const mSp = matrixEl.innerHTML.split(" ");
                const matrix = new coffeeEngine.matrix4([
                    [Number(mSp[0]) || 0, Number(mSp[1]) || 0, Number(mSp[2]) || 0, Number(mSp[3]) || 0],
                    [Number(mSp[4]) || 0, Number(mSp[5]) || 0, Number(mSp[6]) || 0, Number(mSp[7]) || 0],
                    [Number(mSp[8]) || 0, Number(mSp[9]) || 0, Number(mSp[10]) || 0, Number(mSp[11]) || 0],
                    [Number(mSp[12]) || 0, Number(mSp[13]) || 0, Number(mSp[14]) || 0, Number(mSp[15]) || 0],
                ]);

                //Instantiate our Geo
                const instanceGeos = Array.from(node.getElementsByTagName("instance_geometry"));
                instanceGeos.forEach((instanceGeo) => {
                    const meshID = instanceGeo.getAttribute("url");
                    parseMeshFromInstance(meshID, matrix);
                });

                //Instantiate armature controllers
                const instanceControllers = Array.from(node.getElementsByTagName("instance_controller"));
                instanceControllers.forEach((instanceController) => {
                    const controllerURL = instanceController.getAttribute("url").replaceAll(/^#/g, "");
                    const controllerData = parsedSubMeshes.controllers[controllerURL];
                    if (controllerData && controllerData.meshID) {
                        //Finally add our mesh (encountered this from plumberfella 64)
                        parseMeshFromInstance(controllerData.meshID, matrix);
                    }
                })
            });
        });

        //Do the final pass
        data.forEach(subMesh => {
            subMesh.a_position = new Float32Array(subMesh.a_position);
            subMesh.a_texCoord = new Float32Array(subMesh.a_texCoord);
            subMesh.a_normal = new Float32Array(subMesh.a_normal);
            subMesh.a_color = new Float32Array(subMesh.a_color);
        });
    };
})();
