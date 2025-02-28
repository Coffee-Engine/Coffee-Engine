(function() {
    //Oblique bounding box
    coffeeEngine.SAT.OBB = class extends coffeeEngine.SAT.BaseClass {
        get axis() {
            return [
                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2]),
                new coffeeEngine.vector3(this.matrix.contents[2][0], this.matrix.contents[2][1], this.matrix.contents[2][2])
            ];
        }
        
        constructor() {
            super();

            this.collisionType = coffeeEngine.collisionTypes.SAT;
            this.type = "OBB";
            this.points = coffeeEngine.SATShapes.cube.points;
        }

        axis_OBB_OBB(otherOBB) {
            return [
                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[0][0], otherOBB.matrix.contents[0][1], otherOBB.matrix.contents[0][2])),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[0][0], otherOBB.matrix.contents[0][1], otherOBB.matrix.contents[0][2])),
                new coffeeEngine.vector3(this.matrix.contents[2][0], this.matrix.contents[2][1], this.matrix.contents[2][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[0][0], otherOBB.matrix.contents[0][1], otherOBB.matrix.contents[0][2])),

                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[1][0], otherOBB.matrix.contents[1][1], otherOBB.matrix.contents[1][2])),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[1][0], otherOBB.matrix.contents[1][1], otherOBB.matrix.contents[1][2])),
                new coffeeEngine.vector3(this.matrix.contents[2][0], this.matrix.contents[2][1], this.matrix.contents[2][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[1][0], otherOBB.matrix.contents[1][1], otherOBB.matrix.contents[1][2])),

                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[2][0], otherOBB.matrix.contents[2][1], otherOBB.matrix.contents[2][2])),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[2][0], otherOBB.matrix.contents[2][1], otherOBB.matrix.contents[2][2])),
                new coffeeEngine.vector3(this.matrix.contents[2][0], this.matrix.contents[2][1], this.matrix.contents[2][2]).cross(new coffeeEngine.vector3(otherOBB.matrix.contents[2][0], otherOBB.matrix.contents[2][1], otherOBB.matrix.contents[2][2]))
            ]
            
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