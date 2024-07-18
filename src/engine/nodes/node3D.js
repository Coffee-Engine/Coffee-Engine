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

    const camera = coffeeEngine.matrix4.identity();

    coffeeEngine.classes.node3D = class extends coffeeEngine.classes.node {
        position = new coffeeEngine.vector3(0);
        rotation = new coffeeEngine.vector3(0);
        matrix = coffeeEngine.matrix4.identity();

        update(deltaTime) {
            super.update(deltaTime);
            this.matrix = coffeeEngine.matrix4.identity();
            this.matrix = this.matrix.translate(this.position.x,this.position.y,this.position.z);
            
            this.matrix = this.matrix.rotationZ(this.rotation.z);
            this.matrix = this.matrix.rotationX(this.rotation.x);
            this.matrix = this.matrix.rotationY(this.rotation.y);
        }

        draw() {
            super.draw();
            coffeeEngine.renderer.mainShaders.unlit.setBuffers(demoPlane);
            coffeeEngine.renderer.mainShaders.unlit.uniforms.u_camera.value = camera.webGLValue();
            coffeeEngine.renderer.mainShaders.unlit.uniforms.u_model.value = this.matrix.webGLValue();
            coffeeEngine.renderer.mainShaders.unlit.drawFromBuffers(3);
        }
    }
})();