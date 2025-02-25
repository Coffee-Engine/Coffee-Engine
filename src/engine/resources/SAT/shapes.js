(function() {
    const shapes = {
        cube: {
            points: [
                new coffeeEngine.vector3( 1, 1, 1),
                new coffeeEngine.vector3(-1, 1, 1),
                new coffeeEngine.vector3(-1,-1, 1),
                new coffeeEngine.vector3(-1,-1,-1),
                new coffeeEngine.vector3( 1,-1,-1),
                new coffeeEngine.vector3( 1, 1,-1),
                new coffeeEngine.vector3(-1, 1,-1),
                new coffeeEngine.vector3( 1,-1, 1),
            ],
            axis: [
                new coffeeEngine.vector3( 1, 0, 0),
                new coffeeEngine.vector3( 0, 1, 0),
                new coffeeEngine.vector3( 0, 0, 1),
            ]
        }
    }
})()