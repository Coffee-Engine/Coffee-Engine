(function () {
    class node extends coffeeEngine.getNode("Node3D") {
        collisionGroup = "default";

        //For polygonal shapes
        shader = coffeeEngine.renderer.mainShaders.editorShape;

        update(deltaTime, noChildren) {
            super.update(deltaTime, noChildren);
            if (this.collision) this.collision.matrix = this.mixedMatrix;
        }

        //Stop self collisions, and make sure we have a collider
        isColliding(collidee) {
            if (collidee == this || (!collidee instanceof node)) return;
            //Make sure we are in a compatible collision grouping
            if (!coffeeEngine.collisionGroup[collidee.collisionGroup]) return;
            if (!coffeeEngine.collisionGroup[collidee.collisionGroup][this.collisionGroup]) return;

            //Resolve our collisions
            if (this.collision && collidee.collision) {
                const result = this.collision.solve(collidee.collision);
                if (result.successful) return result;
            };
            return;
        }

        detectCollisions(collisionList) {
            this.mixedMatrix = this.parent.mixedMatrix.multiply(this.matrix);
            this.collision.matrix = this.mixedMatrix;
            coffeeEngine.runtime.currentScene.isColliding(this, collisionList);

            return collisionList.length > 0;
        }
        
        editorDisplay(renderer, daveShade, camera, drawID) {}

        draw(renderer, daveShade, camera, drawID) {
            super.draw(renderer, daveShade, camera, drawID);

            //Editor display
            if (coffeeEngine.isEditor) {
                if (editor.lastSelectedNode != this) return;

                this.editorDisplay(renderer, daveShade, camera, drawID);
            }     
        }

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---",
                { name: "collisionGroup", translationKey: "engine.nodeProperties.Collision.group", items: () => {return Object.keys(coffeeEngine.collisionGroup)}, type: coffeeEngine.PropertyTypes.DROPDOWN},
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC3 }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.VEC3, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC3 }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "Collision3D", "Node3D");
})();