(function() {
    coffeeEngine.SAT = {
        //Making a base class so this can be easily tweaked at any time
        BaseClass: class {
            get axis() {
                //Return an array of vector 3
                return [];
            }

            constructor() {
                //Vector 3s
                this.points = [];
                //Our matrix, this will be inherited from our parent node
                this.matrix = coffeeEngine.matrix4.identity();
            }

            //We need to push in 2 vector 3s for an offset, and axis
            getMin(matrix, axis) {
                //Make a minimum vector
                let min = Infinity;
                //Ain't That Wacky?
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
                //Ain't That Wacky?
                for (const pointID in this.points) {
                    //Convert the point to be multipliable to a matrix
                    const point = matrix.multiplyVector(this.points[pointID].toVector4()).toVector3().dot(axis);

                    //Find the max
                    if (point > max) max = point;
                }

                return max;
            }

            //The real magic happens here
            solve(collider) {
                const result = new coffeeEngine.SAT.SATResult();
                //Immediately fail the SAT test if we detect something fishy.
                if (!collider instanceof coffeeEngine.SAT.BaseClass) return result;

                const combinedAxis = this.axis.concat(collider.axis);
                for (const axisID in combinedAxis) {
                    const axis = combinedAxis[axisID];
                    
                    const myMin = this.getMin(this.matrix, axis);
                    const myMax = this.getMax(this.matrix, axis);

                    const coMin = collider.getMin(collider.matrix, axis);
                    const coMax = collider.getMax(collider.matrix, axis);

                    //If we aren't colliding just send an empty result
                    if (!((coMin <= myMax) && (myMin <= coMax))) return result;
                    //If we are modify the result
                    else {
                        //Find the smallest push distance to escape
                        if (result.pushLength > myMin) {
                            //Inverse it so we push out instead of in
                            result.pushLength = -Math.abs(myMin - coMin);
                            result.pushVector = axis;
                        }
                    }
                }

                //If we are completely sucessful tick the sucessful boolean
                result.successful = true;
                return result;
            }
        },

        //Yes, I think an SATResult class would do us good.
        SATResult: class {
            successful = false;
            //Not an actual vector3
            pushVector = null;
            pushLength = Infinity;
        }
    }
})();