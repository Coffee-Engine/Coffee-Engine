(function() {
    coffeeEngine.vector3 = class {
        constructor(x,y,z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        add(b) {
            return new coffeeEngine.vector3(this.x + b.x, this.y + b.y, this.z + b.z);
        }

        sub(b) {
            return new coffeeEngine.vector3(this.x - b.x, this.y - b.y, this.z - b.z);
        }

        mul(b) {
            return new coffeeEngine.vector3(this.x * b.x, this.y * b.y, this.z * b.z);
        }

        div(b) {
            return new coffeeEngine.vector3(this.x / b.x, this.y / b.y, this.z / b.z);
        }

        length() {
            return Math.sqrt(this.lengthSquared());
        }

        lengthSquared() {
            return Math.pow(this.x,2) + Math.pow(this.y,2) + Math.pow(this.z,2);
        }

        normalize() {
            const length = this.length();
            return this.div({x:length, y:length, z:length});
        }

        dot(b) {
            return this.mul(b).normalize();
        }

        cross() {
            return new coffeeEngine.vector3(this.y,-this.x);
        }

        rotate(rad) {
            return new coffeeEngine.vector3(
                this.y * Math.sin(rad) + this.x * Math.cos(rad),
                this.y * Math.cos(rad) - this.x * Math.sin(rad)
            )
        }

        webGLValue() {
            return [this.x,this.y,this.z]
        }
    }
})();