(function () {
    class node extends coffeeEngine.getNode("Node2D") {
        collisionGroup = "default";

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

        getProperties() {
            // prettier-ignore
            return [
                { name: "name", translationKey: "engine.nodeProperties.Node.name", type: coffeeEngine.PropertyTypes.NAME }, 
                "---",
                { name: "collisionGroup", translationKey: "engine.nodeProperties.Collision.group", items: () => {return Object.keys(coffeeEngine.collisionGroup)}, type: coffeeEngine.PropertyTypes.DROPDOWN},
                "---", 
                { name: "position", translationKey: "engine.nodeProperties.Node.position", type: coffeeEngine.PropertyTypes.VEC2 }, 
                { name: "layer", translationKey: "engine.nodeProperties.Node2D.layer", type: coffeeEngine.PropertyTypes.INT }, 
                { name: "rotation", translationKey: "engine.nodeProperties.Node.rotation", type: coffeeEngine.PropertyTypes.FLOAT, isRadians: true }, 
                { name: "scale", translationKey: "engine.nodeProperties.Node.scale", type: coffeeEngine.PropertyTypes.VEC2 }, 
                "---", 
                { name: "script", translationKey: "engine.nodeProperties.Node.script", type: coffeeEngine.PropertyTypes.FILE, fileType: "cjs,js" }
            ];
        }
    }

    coffeeEngine.registerNode(node, "Collision2D", "Node2D");
})();