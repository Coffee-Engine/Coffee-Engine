(function () {
    coffeeEngine.matrix3 = class {
        constructor(contents) {
            this.contents = contents;
        }

        rotationX(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix3([
                [1,0,0],
                [0,Math.cos(rad),Math.sin(rad)],
                [0,-Math.sin(rad),Math.cos(rad)]
            ])
            return this.multiply(rotator);
        }

        rotationY(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix3([
                [Math.cos(rad),0,Math.sin(rad)],
                [0,1,0],
                [-Math.sin(rad),0,Math.cos(rad)]
            ])
            return this.multiply(rotator);
        }

        rotationZ(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix3([
                [Math.cos(rad),Math.sin(rad),0],
                [-Math.sin(rad),Math.cos(rad),0],
                [0,0,1]
            ])
            return this.multiply(rotator);
        }

        translate(x, y) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix3([
                [1,0,x],
                [0,1,y],
                [0,0,1]
            ])
            return this.multiply(rotator);
        }

        scale(x, y) {
            const scalor = coffeeEngine.matrix3.identity();
            scalor.contents[0][0] *= x;
            scalor.contents[1][1] *= y;

            return this.multiply(scalor);
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
            return new coffeeEngine.matrix3([
                [this.contents[0][0] * matrix.contents[0][0] + this.contents[0][1] * matrix.contents[1][0] + this.contents[0][2] * matrix.contents[2][0],
                this.contents[0][0] * matrix.contents[0][1] + this.contents[0][1] * matrix.contents[1][1] + this.contents[0][2] * matrix.contents[2][1],
                this.contents[0][0] * matrix.contents[0][2] + this.contents[0][1] * matrix.contents[1][2] + this.contents[0][2] * matrix.contents[2][2],],
                [this.contents[1][0] * matrix.contents[0][0] + this.contents[1][1] * matrix.contents[1][0] + this.contents[1][2] * matrix.contents[2][0],
                this.contents[1][0] * matrix.contents[0][1] + this.contents[1][1] * matrix.contents[1][1] + this.contents[1][2] * matrix.contents[2][1],
                this.contents[1][0] * matrix.contents[0][2] + this.contents[1][1] * matrix.contents[1][2] + this.contents[1][2] * matrix.contents[2][2],],
                [this.contents[2][0] * matrix.contents[0][0] + this.contents[2][1] * matrix.contents[1][0] + this.contents[2][2] * matrix.contents[2][0],
                this.contents[2][0] * matrix.contents[0][1] + this.contents[2][1] * matrix.contents[1][1] + this.contents[2][2] * matrix.contents[2][1],
                this.contents[2][0] * matrix.contents[0][2] + this.contents[2][1] * matrix.contents[1][2] + this.contents[2][2] * matrix.contents[2][2],]
            ]);
        }

        multiplyVector(vector) {
            const returned = new coffeeEngine.vector3(0, 0, 0);
            // prettier-ignore
            returned.x = vector.x * this.contents[0][0] + vector.y * this.contents[1][0] + vector.z * this.contents[2][0];
            // prettier-ignore
            returned.y = vector.x * this.contents[0][1] + vector.y * this.contents[1][1] + vector.z * this.contents[2][1];
            // prettier-ignore
            returned.z = vector.x * this.contents[0][2] + vector.y * this.contents[1][2] + vector.z * this.contents[2][2];
            return returned;
        }

        webGLValue() {
            return this.contents.flat(2);
        }

        serialize() {
            return { "/-_-PROTOTYPE-_-/": "matrix3", value: this.contents };
        }
    };

    coffeeEngine.matrix3.identity = () => {
        // prettier-ignore
        return new coffeeEngine.matrix3([
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ]);
    };

    coffeeEngine.matrix3.deserialize = (data) => {
        return new coffeeEngine.matrix3(data);
    };
})();
