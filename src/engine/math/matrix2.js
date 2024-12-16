(function () {
    coffeeEngine.matrix2 = class {
        constructor(contents) {
            this.contents = contents;
        }

        rotation(rad) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix2([
                [Math.cos(rad),Math.sin(rad)],
                [-Math.sin(rad),Math.cos(rad)]
            ])
            return this.multiply(rotator);
        }

        //The most pathetic translation function
        translate(x) {
            // prettier-ignore
            const rotator = new coffeeEngine.matrix2([
                [1,x],
                [0,1],
            ])
            return this.multiply(rotator);
        }

        scale(x) {
            const scalor = coffeeEngine.matrix2.identity();
            scalor.contents[0][0] *= x;

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
            return new coffeeEngine.matrix2([
                [this.contents[0][0] * matrix.contents[0][0] + this.contents[0][1] * matrix.contents[1][0],
                this.contents[0][0] * matrix.contents[0][1] + this.contents[0][1] * matrix.contents[1][1],],
                [this.contents[1][0] * matrix.contents[0][0] + this.contents[1][1] * matrix.contents[1][0],
                this.contents[1][0] * matrix.contents[0][1] + this.contents[1][1] * matrix.contents[1][1],]
            ]);
        }

        multiplyVector(vector) {
            const returned = new coffeeEngine.vector2(0, 0, 0);
            // prettier-ignore
            returned.x = vector.x * this.contents[0][0] + vector.y * this.contents[1][0];
            // prettier-ignore
            returned.y = vector.x * this.contents[0][1] + vector.y * this.contents[1][1];
            return returned;
        }

        webGLValue() {
            return this.contents.flat(2);
        }

        serialize() {
            return { "/-_-PROTOTYPE-_-/": "matrix2", value: this.contents };
        }
    };

    coffeeEngine.matrix2.identity = () => {
        // prettier-ignore
        return new coffeeEngine.matrix2([
            [1,0],
            [0,1]
        ]);
    };

    coffeeEngine.matrix2.deserialize = (data) => {
        return new coffeeEngine.matrix2(data);
    };
})();
