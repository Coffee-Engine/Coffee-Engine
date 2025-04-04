(function() {
    //Oblique bounding box
    coffeeEngine.SAT.retangle = class extends coffeeEngine.SAT.BaseClass {
        get axis() {
            //Uniformly scale our matrix real quick
            const axis = [
                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2])
            ];

            //Get each column's scale
            const scale = this.matrix.getScale();

            //Normalize rows to get rotation
            axis[0] = axis[0].div(scale).normalize();
            axis[1] = axis[1].div(scale).normalize();

            //Return our axis
            return axis;
        }
        
        constructor() {
            super();

            this.collisionType = coffeeEngine.collisionTypes.SAT;
            this.type = "retangle";
            this.points = coffeeEngine.SATShapes.cube.points;
        }

        axis_retangle_retangle(otherRectangle) {
            //Get our axis
            const myAxis = this.axis;
            const coAxis = otherRectangle.axis;

            // prettier-ignore
            return [
                myAxis[0].cross(coAxis[0]).normalize(), myAxis[1].cross(coAxis[0]).normalize(),
                myAxis[0].cross(coAxis[1]).normalize(), myAxis[1].cross(coAxis[1]).normalize()
            ];
        }

        axis_retangle_OBB(otherRectangle) {
            //Get our axis
            const myAxis = this.axis;
            const coAxis = otherRectangle.axis;

            // prettier-ignore
            return [
                myAxis[0].cross(coAxis[0]).normalize(), myAxis[1].cross(coAxis[0]).normalize(),
                myAxis[0].cross(coAxis[1]).normalize(), myAxis[1].cross(coAxis[1]).normalize()
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