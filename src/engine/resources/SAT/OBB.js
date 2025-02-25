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

            this.type = "OBB";
            this.points = shapes.cube.points;
        }

        axis_OBB_OBB(otherOBB) {
            return [
                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[0][0], otherOBB.matrix.contents[0][1], otherOBB.matrix.contents[0][2])),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[0][0], otherOBB.matrix.contents[0][1], otherOBB.matrix.contents[0][2])),
                new coffeeEngine.vector3(this.matrix.contents[2][0], this.matrix.contents[2][1], this.matrix.contents[2][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[0][0], otherOBB.matrix.contents[0][1], otherOBB.matrix.contents[0][2])),
            
                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[1][0], otherOBB.matrix.contents[1][1], otherOBB.matrix.contents[1][2])),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[1][0], otherOBB.matrix.contents[1][1], otherOBB.matrix.contents[1][2])),
                new coffeeEngine.vector3(this.matrix.contents[2][0], this.matrix.contents[2][1], this.matrix.contents[2][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[1][0], otherOBB.matrix.contents[1][1], otherOBB.matrix.contents[1][2])),
            
                new coffeeEngine.vector3(this.matrix.contents[0][0], this.matrix.contents[0][1], this.matrix.contents[0][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[2][0], otherOBB.matrix.contents[2][1], otherOBB.matrix.contents[2][2])),
                new coffeeEngine.vector3(this.matrix.contents[1][0], this.matrix.contents[1][1], this.matrix.contents[1][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[2][0], otherOBB.matrix.contents[2][1], otherOBB.matrix.contents[2][2])),
                new coffeeEngine.vector3(this.matrix.contents[2][0], this.matrix.contents[2][1], this.matrix.contents[2][2]).cross(coffeeEngine.vector3(otherOBB.matrix.contents[2][0], otherOBB.matrix.contents[2][1], otherOBB.matrix.contents[2][2]))
            ]
            
        }
    }
})();