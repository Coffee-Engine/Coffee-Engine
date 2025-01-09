(function () {
    coffeeEngine.vector2 = class {
        #x = 0;
        #y = 0;
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

        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        setter() {}

        add(b) {
            return new coffeeEngine.vector2(this.x + b.x, this.y + b.y);
        }

        sub(b) {
            return new coffeeEngine.vector2(this.x - b.x, this.y - b.y);
        }

        mul(b) {
            return new coffeeEngine.vector2(this.x * b.x, this.y * b.y);
        }

        div(b) {
            return new coffeeEngine.vector2(this.x / b.x, this.y / b.y);
        }

        length() {
            return Math.sqrt(this.lengthSquared());
        }

        lengthSquared() {
            return Math.pow(this.x, 2) + Math.pow(this.y, 2);
        }

        normalize() {
            const length = this.length();
            return this.div({ x: length, y: length });
        }

        dot(b) {
            return this.mul(b).normalize();
        }

        cross() {
            return new coffeeEngine.vector2(this.y, -this.x);
        }

        flip() {
            return new coffeeEngine.vector2(-this.x, -this.y);
        }

        rotate(rad) {
            return new coffeeEngine.vector2(this.y * Math.sin(rad) + this.x * Math.cos(rad), this.y * Math.cos(rad) - this.x * Math.sin(rad));
        }

        webGLValue() {
            return [this.x, this.y];
        }

        __duplicate(to) {
            to.x = this.x;
            to.y = this.y;
        }

        serialize() {
            return { "/-_-PROTOTYPE-_-/": "vector2", value: this.webGLValue() };
        }
    };

    coffeeEngine.vector2.deserialize = (property, data) => {
        if ((!property) instanceof coffeeEngine.vector2) property = new coffeeEngine.vector2(0, 0);
        property.x = Number(data[0]);
        property.y = Number(data[1]);
    };
})();
