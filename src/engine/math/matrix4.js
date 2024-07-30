(function() {
    coffeeEngine.matrix4 = class {
        constructor(contents) {
            this.contents = contents;
        }

        rotationX(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix4([
                [1,0,0,0],
                [0,Math.cos(rad),Math.sin(rad),0],
                [0,-Math.sin(rad),Math.cos(rad),0],
                [0,0,0,1]
            ])
            return this.multiply(rotator);
        }

        rotationY(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix4([
                [Math.cos(rad),0,Math.sin(rad),0],
                [0,1,0,0],
                [-Math.sin(rad),0,Math.cos(rad),0],
                [0,0,0,1]
            ])
            return this.multiply(rotator);
        }

        rotationZ(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix4([
                [Math.cos(rad),Math.sin(rad),0,0],
                [-Math.sin(rad),Math.cos(rad),0,0],
                [0,0,1,0],
                [0,0,0,1]
            ])
            return this.multiply(rotator);
        }

        translate(x,y,z) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix4([
                [1,0,0,x],
                [0,1,0,y],
                [0,0,1,z],
                [0,0,0,1]
            ])
            return this.multiply(rotator);
        }
        /*
        ? Generated the table below using this function
(function(){
    let conglomerated = "";
    for (let row = 0; row < 4; row++) {
        for (let column = 0; column < 4; column++) {
            conglomerated += `this.contents[${row}][0] * matrix.contents[0][${column}] + this.contents[${row}][1] * matrix.contents[1][${column}] + this.contents[${row}][2] * matrix.contents[2][${column}] + this.contents[${row}][3] * matrix.contents[3][${column}],\n`;
        }
    }

    return conglomerated
})()
        ?Is it kinda useless?
        *Yeah

        ?Is it probably faster?
        *probably
        */
        multiply(matrix) {
            //* I am speed
            // prettier-ignore
            return new coffeeEngine.matrix4([
                [this.contents[0][0] * matrix.contents[0][0] + this.contents[0][1] * matrix.contents[1][0] + this.contents[0][2] * matrix.contents[2][0] + this.contents[0][3] * matrix.contents[3][0],
                this.contents[0][0] * matrix.contents[0][1] + this.contents[0][1] * matrix.contents[1][1] + this.contents[0][2] * matrix.contents[2][1] + this.contents[0][3] * matrix.contents[3][1],
                this.contents[0][0] * matrix.contents[0][2] + this.contents[0][1] * matrix.contents[1][2] + this.contents[0][2] * matrix.contents[2][2] + this.contents[0][3] * matrix.contents[3][2],
                this.contents[0][0] * matrix.contents[0][3] + this.contents[0][1] * matrix.contents[1][3] + this.contents[0][2] * matrix.contents[2][3] + this.contents[0][3] * matrix.contents[3][3]],
                [this.contents[1][0] * matrix.contents[0][0] + this.contents[1][1] * matrix.contents[1][0] + this.contents[1][2] * matrix.contents[2][0] + this.contents[1][3] * matrix.contents[3][0],
                this.contents[1][0] * matrix.contents[0][1] + this.contents[1][1] * matrix.contents[1][1] + this.contents[1][2] * matrix.contents[2][1] + this.contents[1][3] * matrix.contents[3][1],
                this.contents[1][0] * matrix.contents[0][2] + this.contents[1][1] * matrix.contents[1][2] + this.contents[1][2] * matrix.contents[2][2] + this.contents[1][3] * matrix.contents[3][2],
                this.contents[1][0] * matrix.contents[0][3] + this.contents[1][1] * matrix.contents[1][3] + this.contents[1][2] * matrix.contents[2][3] + this.contents[1][3] * matrix.contents[3][3]],
                [this.contents[2][0] * matrix.contents[0][0] + this.contents[2][1] * matrix.contents[1][0] + this.contents[2][2] * matrix.contents[2][0] + this.contents[2][3] * matrix.contents[3][0],
                this.contents[2][0] * matrix.contents[0][1] + this.contents[2][1] * matrix.contents[1][1] + this.contents[2][2] * matrix.contents[2][1] + this.contents[2][3] * matrix.contents[3][1],
                this.contents[2][0] * matrix.contents[0][2] + this.contents[2][1] * matrix.contents[1][2] + this.contents[2][2] * matrix.contents[2][2] + this.contents[2][3] * matrix.contents[3][2],
                this.contents[2][0] * matrix.contents[0][3] + this.contents[2][1] * matrix.contents[1][3] + this.contents[2][2] * matrix.contents[2][3] + this.contents[2][3] * matrix.contents[3][3]],
                [this.contents[3][0] * matrix.contents[0][0] + this.contents[3][1] * matrix.contents[1][0] + this.contents[3][2] * matrix.contents[2][0] + this.contents[3][3] * matrix.contents[3][0],
                this.contents[3][0] * matrix.contents[0][1] + this.contents[3][1] * matrix.contents[1][1] + this.contents[3][2] * matrix.contents[2][1] + this.contents[3][3] * matrix.contents[3][1],
                this.contents[3][0] * matrix.contents[0][2] + this.contents[3][1] * matrix.contents[1][2] + this.contents[3][2] * matrix.contents[2][2] + this.contents[3][3] * matrix.contents[3][2],
                this.contents[3][0] * matrix.contents[0][3] + this.contents[3][1] * matrix.contents[1][3] + this.contents[3][2] * matrix.contents[2][3] + this.contents[3][3] * matrix.contents[3][3]]
            ]);
        }

        multiplyVector(vector) {
            const returned = new coffeeEngine.vector4(0,0,0,0);
            // prettier-ignore
            returned.x = vector.x * this.contents[0][0] + vector.y * this.contents[1][0] + vector.z * this.contents[2][0] + vector.w * this.contents[3][0];
            // prettier-ignore
            returned.y = vector.x * this.contents[0][1] + vector.y * this.contents[1][1] + vector.z * this.contents[2][1] + vector.w * this.contents[3][1];
            // prettier-ignore
            returned.z = vector.x * this.contents[0][2] + vector.y * this.contents[1][2] + vector.z * this.contents[2][2] + vector.w * this.contents[3][2];
            // prettier-ignore
            returned.w = vector.x * this.contents[0][3] + vector.y * this.contents[1][3] + vector.z * this.contents[2][3] + vector.w * this.contents[3][3];
            return returned;
        }

        webGLValue() {
            return this.contents.flat(2);
        }
    }

    coffeeEngine.matrix4.identity = () => {
        // prettier-ignore
        return new coffeeEngine.matrix4([
            [1,0,0,0],
            [0,1,0,0],
            [0,0,1,0],
            [0,0,0,1]
        ]);
    }

    coffeeEngine.matrix4.projection = (fov, aspect, near, far) => {
        const fovRad = 1.0 / Math.tan(fov * 0.5 / 180 * 3.141592682);

        const returned = coffeeEngine.matrix4.identity();

        returned.contents[0][0] = aspect * fovRad;
        returned.contents[1][1] = fovRad;
        returned.contents[2][2] = far / (far - near);
        returned.contents[3][2] = (-far * near) / (far - near);
        returned.contents[2][3] = 1;
        returned.contents[3][3] = 0;

        return returned;
    }
})();