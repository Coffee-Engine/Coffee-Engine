(function() {
    //Oblique bounding box
    coffeeEngine.SAT.OBB = class extends coffeeEngine.SAT.BaseClass {
        get axis() {
            //Uniformly scale our matrix real quick
            const axis = [
                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2]),
                new coffeeEngine.vector3(this.matrix.contents[2][0], this.matrix.contents[2][1], this.matrix.contents[2][2])
            ];

            //Get each column's scale
            const scale = this.matrix.getScale();

            //Normalize rows to get rotation
            axis[0] = axis[0].div(scale).normalize();
            axis[1] = axis[1].div(scale).normalize();
            axis[2] = axis[2].div(scale).normalize();

            //Return our axis
            return axis;
        }
        
        constructor() {
            super();

            this.collisionType = coffeeEngine.collisionTypes.SAT;
            this.type = "OBB";
            this.points = coffeeEngine.SATShapes.cube.points;
        }

        axis_OBB_OBB(otherOBB) {
            //Get our axis
            const myAxis = this.axis;
            const coAxis = otherOBB.axis;

            // prettier-ignore
            return [
                myAxis[0].cross(coAxis[0]).normalize(), myAxis[1].cross(coAxis[0]).normalize(), myAxis[2].cross(coAxis[0]).normalize(),
                myAxis[0].cross(coAxis[1]).normalize(), myAxis[1].cross(coAxis[1]).normalize(), myAxis[2].cross(coAxis[1]).normalize(),
                myAxis[0].cross(coAxis[2]).normalize(), myAxis[1].cross(coAxis[2]).normalize(), myAxis[2].cross(coAxis[2]).normalize()
            ];
        }

        //Note that the triangle itself isn't a SAT class within itself but data within a class
        axis_OBB_triangle(triangleData) {
            const myAxis = this.axis;

            //Get the cross products of each value
            return [
                //Throw the normal in here for funnies
                triangleData.normal,

                //Then calculate our needed cross products
                myAxis[0].cross(triangleData.edges[0]).normalize(),
                myAxis[0].cross(triangleData.edges[1]).normalize(),
                myAxis[0].cross(triangleData.edges[2]).normalize(),

                myAxis[1].cross(triangleData.edges[0]).normalize(),
                myAxis[1].cross(triangleData.edges[1]).normalize(),
                myAxis[1].cross(triangleData.edges[2]).normalize(),

                myAxis[2].cross(triangleData.edges[0]).normalize(),
                myAxis[2].cross(triangleData.edges[1]).normalize(),
                myAxis[2].cross(triangleData.edges[2]).normalize()
            ];
        }

        getClosestPoint(point) {
            //Set up final result
            let result = this.matrix.getTranslation();
            //Get needed variables
            const axes = this.axis;
            const size = [axes[0].length(),axes[1].length(),axes[2].length()];
            const direction = this.matrix.getTranslation().sub(point);

            for (let axisID=0; axisID<3; axisID++) {
                //Get axis and distance, Normalize
                const axis = axes[axisID].normalize();
                let dist = -direction.dot(axis);

                //Get the distance and resize
                dist = Math.min(size[axisID], Math.max(dist, -size[axisID]));
                result = result.add(axis.mul(dist));
            }

            return result;
        }
    }
})();