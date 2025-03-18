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
            for (submeshID in this.mesh.unparsed) {
                const positions = this.mesh.unparsed[submeshID].a_position;
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
            this.createOctree();
        }

        get mesh() {
            return this.#mesh;
        }

        //To create our octree
        createOctree(min, max, depth) {
            //Empty the tree
            depth = depth || 0;
            if (!(depth >= 0)) this.octree = [];

            
        }
        
        constructor() {
            super();

            this.mesh = null;
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