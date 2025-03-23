(function() {
    //Oblique bounding box
    coffeeEngine.SAT.Circle = class extends coffeeEngine.SAT.BaseClass {
        get point() {
            return this.matrix.getTranslation();
        }
        
        constructor() {
            super();

            this.radius = 1;
            this.collisionType = coffeeEngine.collisionTypes.POINT;
            this.type = "circle";
        }

        pointSolve(myPoint, coPoint) {
            const relative = coPoint.sub(myPoint);
            const direction = new coffeeEngine.vector2(relative.x, relative.y).normalize();
            const distance = Math.min(relative.length(), this.radius / 2);
            return direction.mul(distance).equals(coPoint);
        }
    }
})();