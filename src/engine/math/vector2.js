(function() {
    coffeeEngine.vector2 = class {
        constructor(x,y) {
            this.x = x;
            this.y = y;
        }

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
            return Math.pow(this.x,2) + Math.pow(this.y,2);
        }

        normalize() {
            const length = this.length();
            return this.div({x:length, y:length});
        }

        dot(b) {
            return this.mul(b).normalize();
        }

        cross() {
            return new coffeeEngine.vector2(this.y,-this.x);
        }

        rotate(rad) {
            return new coffeeEngine.vector2(
                this.y * Math.sin(rad) + this.x * Math.cos(rad),
                this.y * Math.cos(rad) - this.x * Math.sin(rad)
            );
        }

        webGLValue() {
            return [this.x,this.y];
        }
    }
})();