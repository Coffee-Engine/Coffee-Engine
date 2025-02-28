(function () {
    coffeeEngine.vector3 = class {
        #x = 0;
        #y = 0;
        #z = 0;
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

        constructor(x, y, z) {
            this.x = x;
            this.y = typeof y == "undefined" ? x : y;
            this.z = typeof z == "undefined" ? x : z;
        }

        setter() {}

        add(b) {
            return new coffeeEngine.vector3(this.x + b.x, this.y + b.y, this.z + b.z);
        }

        sub(b) {
            return new coffeeEngine.vector3(this.x - b.x, this.y - b.y, this.z - b.z);
        }

        mul(b) {
            if (typeof b == "number") return new coffeeEngine.vector3(this.x * b, this.y * b, this.z * b); 
            return new coffeeEngine.vector3(this.x * b.x, this.y * b.y, this.z * b.z);
        }

        div(b) {
            if (typeof b == "number") return new coffeeEngine.vector3(this.x / b, this.y / b, this.z / b); 
            return new coffeeEngine.vector3(this.x / b.x, this.y / b.y, this.z / b.z);
        }

        length() {
            return Math.sqrt(this.lengthSquared());
        }

        lengthSquared() {
            return Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2);
        }

        normalize() {
            const length = this.length();
            return this.div({ x: length, y: length, z: length });
        }

        dot(b) {
            const multiplied = this.mul(b);
            return multiplied.x + multiplied.y + multiplied.z;
        }

        cross(b) {
            return new coffeeEngine.vector3(this.y * b.z - this.z * b.y, this.z * b.x - this.x * b.z, this.x * b.y - this.y * b.x);
        }

        flip() {
            return new coffeeEngine.vector3(-this.x, -this.y, -this.z);
        }

        rotate(yaw, pitch, roll) {
            const returned = new coffeeEngine.vector3(this.z * Math.sin(yaw) + this.x * Math.cos(yaw), this.y, this.z * Math.cos(yaw) - this.x * Math.sin(yaw));

            returned.y = returned.z * Math.sin(pitch) + returned.y * Math.cos(pitch);
            returned.z = returned.z * Math.cos(pitch) - returned.y * Math.sin(pitch);

            returned.x = returned.y * Math.sin(roll) + returned.x * Math.cos(roll);
            returned.y = returned.y * Math.cos(roll) - returned.x * Math.sin(roll);

            return returned;
        }

        webGLValue() {
            return [this.x, this.y, this.z];
        }

        __duplicate(to) {
            to.x = this.x;
            to.y = this.y;
            to.z = this.z;
        }

        serialize() {
            return { "/-_-PROTOTYPE-_-/": "vector3", value: this.webGLValue() };
        }

        toVector4() {
            return new coffeeEngine.vector4(this.x, this.y, this.z, 1);
        }
    };

    coffeeEngine.vector3.deserialize = (property, data) => {
        if ((!property) instanceof coffeeEngine.vector3) property = new coffeeEngine.vector3(0, 0, 0, 0);
        property.x = Number(data[0]);
        property.y = Number(data[1]);
        property.z = Number(data[2]);
    };
})();
