(function() {
    const shapes = {
        cube: {
            points: [
                new coffeeEngine.vector4( 1, 1, 1),
                new coffeeEngine.vector4(-1, 1, 1),
                new coffeeEngine.vector4(-1,-1, 1),
                new coffeeEngine.vector4(-1,-1,-1),
                new coffeeEngine.vector4( 1,-1,-1),
                new coffeeEngine.vector4( 1, 1,-1),
                new coffeeEngine.vector4(-1, 1,-1),
                new coffeeEngine.vector4( 1,-1, 1),
            ],
            axis: [
                new coffeeEngine.vector4( 1, 0, 0),
                new coffeeEngine.vector4( 0, 1, 0),
                new coffeeEngine.vector4( 0, 0, 1),
            ]
        }
    }
    
    //Oblique bounding box
    coffeeEngine.SAT.OBB = class extends coffeeEngine.SAT.BaseClass {
        get axis() {
            return ;
        }
        
        constructor() {
            super();

            this.points = shapes.cube;
        }
    }
})()