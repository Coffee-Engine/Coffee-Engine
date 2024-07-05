(function() {
    coffeeEngine.matrix4 = class {
        constructor(contents) {
            this.contents = Float32Array(contents);
        }

        identity() {
            return new coffeeEngine.matrix4([
                1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1
            ]);
        }

        rotationX(rad) {
            const rotator = new coffeeEngine.matrix4([
                1,0,0,0,
                0,Math.cos(rad),Math.sin(rad),0,
                0,-Math.sin(rad),Math.cos(rad),0,
                0,0,0,1
            ])
            return this.multiply(rotator);
        }

        rotationY(rad) {
            const rotator = new coffeeEngine.matrix4([
                Math.cos(rad),0,Math.sin(rad),0,
                0,1,0,0,
                -Math.sin(rad),0,Math.cos(rad),0,
                0,0,0,1
            ])
            return this.multiply(rotator);
        }

        rotationZ(rad) {
            const rotator = new coffeeEngine.matrix4([
                Math.cos(rad),Math.sin(rad),0,0,
                -Math.sin(rad),Math.cos(rad),0,0,
                0,0,1,0,
                0,0,0,1
            ])
            return this.multiply(rotator);
        }

        translate(x,y,z) {
            const rotator = new coffeeEngine.matrix4([
                1,0,0,x,
                0,1,0,y,
                0,0,1,z,
                0,0,0,1
            ])
            return this.multiply(rotator);
        }

        multiply(matrix) {
            //* Screw it, for loop
            const returned = new coffeeEngine.matrix4([
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0
            ]);

            for (let row = 0; row < 4; row++) {
                for (let column = 0; column < 4; column++) {
                    returned.contents[row][column] = this.contents[row][0] * matrix.contents[0][column] + 
                    this.contents[row][1] * matrix.contents[1][column] + 
                    this.contents[row][2] * matrix.contents[2][column] + 
                    this.contents[row][3] * matrix.contents[3][column];
                }
            }

            return returned;
        }

        multiplyVector(vector) {
            const returned = new coffeeEngine.vector4(0,0,0,0);
            returned.x = vector.x * this.contents[0][0] + vector.y * this.contents[1][0] + vector.z * this.contents[2][0] + vector.w * this.contents[3][0];
            returned.y = vector.x * this.contents[0][1] + vector.y * this.contents[1][1] + vector.z * this.contents[2][1] + vector.w * this.contents[3][1];
            returned.z = vector.x * this.contents[0][2] + vector.y * this.contents[1][2] + vector.z * this.contents[2][2] + vector.w * this.contents[3][2];
            returned.w = vector.x * this.contents[0][3] + vector.y * this.contents[1][3] + vector.z * this.contents[2][3] + vector.w * this.contents[3][3];
            return returned;
        }
    }
})();