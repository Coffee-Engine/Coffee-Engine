(function() {
    coffeeEngine.SAT = {
        //Making a base class so this can be easily tweaked at any time
        BaseClass: class {
            constructor() {
                //Also vector 3s
                this.axis = [];
                //Vector 3s
                this.points = [];
                //Our matrix, this will be inherited from our parent node
                this.matrix = coffeeEngine.matrix4.identity();
            }

            //We need to push in 2 vector 3s for an offset, and axis
            getMin(matrix, axis) {
                //Make a minimum vector
                let min = Infinity;
                //               Ain't That Wacky? ^^^^^^^^ ^^^^^^^^ ^^^^^^^^
                for (const pointID in this.points) {
                    //Convert the point to be multipliable to a matrix
                    const point = matrix.multiplyVector(this.points[pointID].toVector4()).toVector3().dot(axis);

                    //Find the min
                    if (point < min) min = point;
                }

                return min;
            }

            //We need to push in 2 vector 3s for an offset, and axis
            getMax(matrix, axis) {
                //Make a minimum vector
                let max = -Infinity;
                //               Ain't That Wacky? ^^^^^^^^^ ^^^^^^^^^ ^^^^^^^^^
                for (const pointID in this.points) {
                    //Convert the point to be multipliable to a matrix
                    const point = matrix.multiplyVector(this.points[pointID].toVector4()).toVector3().dot(axis);

                    //Find the min
                    if (point > max) max = point;
                }

                return max;
            }

            //The real magic happens here
            solve(collider) {
                //Immediately fail the SAT test if we detect something fishy.
                if (!collider instanceof coffeeEngine.SAT.BaseClass) return new coffeeEngine.SAT.SATResult();

                const combinedAxis = this.axis.concat(collider.axis);
                for (const axisID in combinedAxis) {
                    const axis = combinedAxis[axisID];
                    
                    const myMin = this.getMin(this.matrix, axis);
                    const myMax = this.getMax(this.matrix, axis);

                    const coMin = collider.getMin(collider.matrix, axis);
                    const coMax = collider.getMax(collider.matrix, axis);
                }
            }
        },

        //Yes, I think an SATResult class would do us good.
        SATResult: class {
            successful = false;
            pushVectors = {};
        }
    }
})();