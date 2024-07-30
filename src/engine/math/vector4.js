(function () {
  coffeeEngine.vector4 = class {
    constructor(x, y, z, w) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.w = w;
    }

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
  };
})();
