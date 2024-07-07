(function() {
    const demoPlane = {
        a_position: new Float32Array([
            -1,-1,1,1,
            -1,1,1,1,
            1,1,1,1
        ]),
        
        a_color: new Float32Array([
            1,0,0,1,
            0,1,0,1,
            0,0,1,1
        ]),

        a_normal: new Float32Array([
            1,0,0,
            1,0,0,
            1,0,0
        ]),

        a_texCoord: new Float32Array([
            0,0,
            1,0,
            1,1
        ])
    }

    const camera = new coffeeEngine.matrix4([
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ]);

    coffeeEngine.classes.node3D = class extends coffeeEngine.classes.node {
        position = new coffeeEngine.vector3(0);
        rotation = new coffeeEngine.vector3(0);
        matrix = new coffeeEngine.matrix4([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]);

        update(deltaTime) {
            super.update(deltaTime);
        }

        draw() {
            super.draw();
            coffeeEngine.renderer.mainShaders.unlit.setBuffers(demoPlane);
            coffeeEngine.renderer.mainShaders.unlit.uniforms.u_camera.value = camera.contents;
            coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.contents;
            coffeeEngine.renderer.mainShaders.unlit.drawFromBuffers(3);
        }
    }
})();