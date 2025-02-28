(function() {
    //Oblique bounding box
    coffeeEngine.SAT.Sphere = class extends coffeeEngine.SAT.BaseClass {
        get point() {
            return this.matrix.getTranslation();
        }
        
        constructor() {
            super();

            this.radius = 1;
            this.collisionType = coffeeEngine.collisionTypes.POINT;
            this.type = "sphere";
        }

        pointSolve(myPoint, coPoint) {
            const direction = coPoint.sub(myPoint).normalize();
            const distance = Math.min(coPoint.sub(myPoint).length(), this.radius);
            return direction.mul(distance).equals(coPoint);
        }
    }
})();