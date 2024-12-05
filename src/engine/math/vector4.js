(function () {
    coffeeEngine.vector4 = class {
        #x = 0;
        #y = 0;
        #z = 0;
        #w = 0;
        set x(value) {
            this.#x = value;
            this.setter();
        }
        get x() {
            return this.#x;
        }
        set y(value) {
            this.#y = value;
            this.setter();
        }
        get y() {
            return this.#y;
        }
        set z(value) {
            this.#z = value;
            this.setter();
        }
        get z() {
            return this.#z;
        }
        set w(value) {
            this.#w = value;
            this.setter();
        }
        get w() {
            return this.#w;
        }

        constructor(x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }

        setter() {}

        add(b) {
            return new coffeeEngine.vector4(this.x + b.x, this.y + b.y, this.z + b.z, this.w + b.w);
        }

        sub(b) {
            return new coffeeEngine.vector4(this.x - b.x, this.y - b.y, this.z - b.z, this.w - b.w);
        }

        mul(b) {
            return new coffeeEngine.vector4(this.x * b.x, this.y * b.y, this.z * b.z, this.w * b.w);
        }

        div(b) {
            return new coffeeEngine.vector4(this.x / b.x, this.y / b.y, this.z / b.z, this.w / b.w);
        }

        length() {
            return Math.sqrt(this.lengthSquared());
        }

        lengthSquared() {
            return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2) + Math.pow(this.w, 2);
        }

        normalize() {
            const length = this.length();
            return this.div({ x: length, y: length, z: length, w: length });
        }

        dot(b) {
            return this.mul(b).normalize();
        }

        rotate(matrix) {
            return matrix.mulVector(this);
        }

        webGLValue() {
            return [this.x, this.y, this.z, this.w];
        }

        serialize() {
            return { "/-_-PROTOTYPE-_-/": "vector4", value: this.webGLValue() };
        }
    };

    coffeeEngine.vector4.deserialize = (property, data) => {
        if ((!property) instanceof coffeeEngine.vector4) property = new coffeeEngine.vector4(0, 0, 0, 0);
        property.x = Number(data[0]);
        property.y = Number(data[1]);
        property.z = Number(data[2]);
        property.w = Number(data[3]);
    };
})();
