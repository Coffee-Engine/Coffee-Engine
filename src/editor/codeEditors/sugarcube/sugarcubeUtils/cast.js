(function() {
    sugarcube.cast = {
        toString: (obj) => {
            switch (typeof obj) {
                case "object":
                    return JSON.stringify(obj);
                
                case "undefined":
                    return "";
                
                case "string":
                    return obj;
            
                default:
                    return obj.toString();
            }
        },

        toNumber: (obj) => {
            if (typeof obj == 'number') {
                if (Number.isNaN(obj)) {
                    return 0;
                }
                return obj;
            }
            else {
                const numba = Number(obj);
                if (Number.isNaN(numba)) {
                    return 0;
                }
                return numba;
            }
        },

        toBoolean: (obj) => {
            switch (typeof obj) {
                case "boolean":
                    return obj;

                case "number":
                    return (!obj.isNaN()) && (obj !== 0);

                case "undefined":
                    return false;

                default:
                    return (obj !== undefined)
            }
        }
    }
})();