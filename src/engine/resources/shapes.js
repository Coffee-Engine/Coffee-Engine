coffeeEngine.shapes = {
    plane: {
        a_position: new Float32Array(
            [
                -1,-1,1,1,
                -1,1,1,1,
                1,-1,1,1,

                -1,1,1,1,
                1,-1,1,1,
                1,1,1,1,
            ]
        ),

        a_texCoord: new Float32Array(
            [
                0,1,
                0,0,
                1,1,

                0,0,
                1,1,
                1,0,
            ]
        ),

        a_color: new Float32Array(
            [
                1,1,1,1,
                1,1,1,1,
                1,1,1,1,

                1,1,1,1,
                1,1,1,1,
                1,1,1,1,
            ]
        ),

        a_normal: new Float32Array(
            [
                0,0,1,
                0,0,1,
                0,0,1,

                0,0,1,
                0,0,1,
                0,0,1,
            ]
        ),
    }
}