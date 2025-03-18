(function() {
    //Mesh
    coffeeEngine.SAT.mesh = class extends coffeeEngine.SAT.BaseClass {
        //Our mesh data
        #mesh = null;
        #parsedData = null;
        //The mesh octree
        octree = [];
        octreeCollision = new coffeeEngine.SAT.OBB();
        octreeMaxDepth = 4;

        set mesh(value) {
            //Let's quickly parse the data
            this.#mesh = value;
            this.#parsedData = [];

            //Parse our mesh to prevent rampant calculations while doing collisions.
            for (let submeshID in this.#mesh.unparsed) {
                const positions = this.#mesh.unparsed[submeshID].a_position;
                for (let positionIndex = 0; positionIndex < positions.length; positionIndex+=12) {
                    //Get our points
                    const point1 = new coffeeEngine.vector3(positions[positionIndex], positions[positionIndex+1], positions[positionIndex+2]);
                    const point2 = new coffeeEngine.vector3(positions[positionIndex+4], positions[positionIndex+5], positions[positionIndex+6]);
                    const point3 = new coffeeEngine.vector3(positions[positionIndex+8], positions[positionIndex+9], positions[positionIndex+10]);
    
                    //Calculate edges
                    const edge1 = point2.sub(point1);
                    const edge2 = point3.sub(point2);
                    const edge3 = point1.sub(point3);
    
                    //Calculate normal
                    const normal = edge1.cross(edge2);
    
                    //Add our parsed data to the array;
                    this.#parsedData.push({
                        points:[point1,point2,point3],
                        edges:[edge1,edge2,edge3],
                        normal:normal,

                        //Our min max functions
                        getMin: (axis) => {
                            return Math.min(
                                this.matrix.multiplyVector(point1).toVector3().dot(axis),
                                this.matrix.multiplyVector(point2).toVector3().dot(axis),
                                this.matrix.multiplyVector(point3).toVector3().dot(axis)
                            );
                        },
                        getMax: (axis) => {
                            return Math.max(
                                this.matrix.multiplyVector(point1).toVector3().dot(axis),
                                this.matrix.multiplyVector(point2).toVector3().dot(axis),
                                this.matrix.multiplyVector(point3).toVector3().dot(axis)
                            );
                        }
                    });
                };
            }

            //Then create our octree
            this.createOctree(this.octree, this.#parsedData, this.mesh.lowestBound, this.mesh.highestBound);
        }

        get mesh() {
            return this.#mesh;
        }

        //To create our octree
        createOctree(layer, triangles, min, max, depth) {
            //Get our depth and our next depth
            depth = depth || 0;
            const next = depth + 1;

            //If we are at the bottom root the tree
            if (depth == 0) {
                //Empty the tree
                this.octree = [];
                const center = min.add(max).div(2);
                
                //Order
                this.createOctree(this.octree, triangles, min, center, next); //---
                this.createOctree(this.octree, triangles, center, max, next); //+++
                this.createOctree(this.octree, triangles, new coffeeEngine.vector3( min.x, center.y, center.z), new coffeeEngine.vector3(center.x, max.y, max.z), next); //-++
                this.createOctree(this.octree, triangles, new coffeeEngine.vector3( center.x, min.y, center.z), new coffeeEngine.vector3(max.x, center.y, max.z), next); //+-+
                this.createOctree(this.octree, triangles, new coffeeEngine.vector3( center.x, center.y, min.z), new coffeeEngine.vector3(max.x, max.y, center.z), next); //++-
                this.createOctree(this.octree, triangles, new coffeeEngine.vector3( center.x, min.y, min.z), new coffeeEngine.vector3(min.x, center.y, center.z), next); //+--
                this.createOctree(this.octree, triangles, new coffeeEngine.vector3( min.x, center.y, min.z), new coffeeEngine.vector3(center.x, min.y, center.z), next); //-+-
                this.createOctree(this.octree, triangles, new coffeeEngine.vector3( min.x, min.y, center.z), new coffeeEngine.vector3(center.x, center.y, min.z), next); //--+
                return;
            }

            //if we aren't define our octant
            layer.push({
                matrix: coffeeEngine.matrix4.identity(),
                final: false,
                contents: []
            });
            
            //Set our layer to our newly created layer
            layer = layer[layer.length - 1];
            const center = min.add(max).div(2);
            const scale = max.sub(min).div(2);

            //Get our matrix's transformed
            layer.matrix = layer.matrix.translate(center.x, center.y, center.z).scale(scale.x, scale.y, scale.z);

            //use our layer matrix as our octree matrix
            this.octreeCollision.matrix = layer.matrix;

            //Do collision tests to determine which triangles are within the octants
            const colliding = [];
            for (let triangleID in triangles) {
                if (this.solveTriangleSAT(triangles[triangleID], this.octreeCollision).successful) colliding.push(triangles[triangleID]);
            }

            //If we are at our wits end, stop
            if (depth > this.octreeMaxDepth || colliding.length <= 1) {
                layer.final = true;
                layer.contents = colliding;
            }
            else {
                //If we aren't do it again (Lap depth+1)
                this.createOctree(layer.contents, colliding, min, center, next); //---
                this.createOctree(layer.contents, colliding, center, max, next); //+++
                this.createOctree(layer.contents, colliding, new coffeeEngine.vector3( min.x, center.y, center.z), new coffeeEngine.vector3(center.x, max.y, max.z), next); //-++
                this.createOctree(layer.contents, colliding, new coffeeEngine.vector3( center.x, min.y, center.z), new coffeeEngine.vector3(max.x, center.y, max.z), next); //+-+
                this.createOctree(layer.contents, colliding, new coffeeEngine.vector3( center.x, center.y, min.z), new coffeeEngine.vector3(max.x, max.y, center.z), next); //++-
                this.createOctree(layer.contents, colliding, new coffeeEngine.vector3( center.x, min.y, min.z), new coffeeEngine.vector3(min.x, center.y, center.z), next); //+--
                this.createOctree(layer.contents, colliding, new coffeeEngine.vector3( min.x, center.y, min.z), new coffeeEngine.vector3(center.x, min.y, center.z), next); //-+-
                this.createOctree(layer.contents, colliding, new coffeeEngine.vector3( min.x, min.y, center.z), new coffeeEngine.vector3(center.x, center.y, min.z), next); //--+
            }
        }
        
        constructor() {
            super();
            this.type = "mesh";
        }

        customSolve(result) {
            //Make sure we have a mesh
            if (!(this.mesh instanceof coffeeEngine.mesh.class)) return;
            //W I P
        }

        solveTriangleSAT(triangle, collider) {
            const result = new coffeeEngine.SAT.SATResult();
            //Immediately fail the SAT test if we detect something fishy.
            if (!collider instanceof coffeeEngine.SAT.BaseClass) return result;

            //If not point to point use SAT
            //get the axis types
            let combinedAxis = collider.axis;
            if (collider[`axis_${collider.type}_triangle`]) combinedAxis = combinedAxis.concat(collider[`axis_${collider.type}_triangle`](triangle));
            
            for (const axisID in combinedAxis) {
                const axis = combinedAxis[axisID];
                
                const myMin = triangle.getMin(axis);
                const myMax = triangle.getMax(axis);

                const coMin = collider.getMin(axis);
                const coMax = collider.getMax(axis);

                //If we aren't colliding just send an empty result
                if (!((coMin <= myMax) && (myMin <= coMax))) return result;
                //If we are modify the result
                else {
                    //Find the smallest push distance to escape
                    const pushDir = Math.abs(coMin - myMax) < Math.abs(myMin - coMax);
                    const pushBack = (pushDir) ? coMin-myMax : coMax-myMin;

                    //Then do the math
                    if ((Math.abs(result.pushLength) >= Math.abs(pushBack) && axis.length() > 0) || result.pushLength === null) {
                        //Inverse it so we push out instead of in
                        result.pushLength = -pushBack;
                        result.pushVector = axis;
                    }
                }
            }

            //If we are completely sucessful tick the sucessful boolean
            result.successful = true;
            return result;
        }
    }
})();