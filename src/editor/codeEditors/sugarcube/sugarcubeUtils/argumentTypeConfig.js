(function() {
    sugarcube.ArgumentDefaultValues = {
        boolean: false,

        multiline: "Hello\nWorld!",

        number: 0,

        color: "#ff0000",
    };

    sugarcube.ArgumentTypeConstructors = {
        string: "__sugarcube_string_reporter",
        multiline: "__sugarcube_multiline_string_reporter",
        number: "__sugarcube_number_reporter",
        color: "__sugarcube_color_reporter",
        angle: "__sugarcube_angle_reporter",

        dummy: { type: "input_dummy" },
        reference: { type: "input_value", check: "Reference" },
        array: { type: "input_value", check: "Array" },
        object: { type: "input_value", check: "Object" },
        boolean: { type: "input_value", check: "Boolean" },
        
        statement: (argument, extManager) => {
            return { type: "input_statement", check: argument.nextStatement || extManager.defaultAction }
        },

        image: (argument) => {
            return {
                type: "field_image",
                src: argument.dataURI || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAsCAYAAABloJjNAAAFJ0lEQVRIS6WXeyzkVxTHf7OYMcN4GxKPXa/GY0lQK/5sokmD1QpKitB61CNiG/QRUs9Y4hlRJEITW1EhHkGpDWEjbSrbiIqu1GOjqPd7BzPM6PdOOpMZfrPmp7/k98fce+7nd+4933POHRbF7PGGuRtee7wv8Q5cX87SkPeJiYnJV1paWvf9/Pyk+/v7/LOzs/2lpaWpw8PDx8qM24B8Lpdbb25uHlhTU2McEhKi8n0LCwvJ9vb2pxh8Jp94G9ATsJ9iY2N5DQ0NBnQ7aWlpoTIzMwfhZdBtQE89Pb2x8vJydkpKCk/dscA7ytraWnxxccGFjZTY0XnoxePxRisqKt4Kk38kKSlJ1NHRMXd8fByMsfXrQLaBgcGfQUFBNm1tbWwNA0YVFxdTcODl0dGRjwoQZ9aOMwvBmXE0hcntjI2NRThLPwXQ1NQ018rK6snMzIwpUxixT01NFcGRPDnQUltb+2/AdFxdXdXyZmdnKXd3d9p5yIoqLS39XgZERJsTExOjqqur1W41Li5ODN2xy8rKaIF1dXVUYWFhKwHaIqqvNjc3eXw+X613OJJzXV1dyfr6uh6dUX5+PtXU1PQdAealpaV9gS8YqqP19PRQ8fHxryUSiQCRpAX6+/sfj46OfsYyNDT8LTc391FWVpZa77y8vA6np6e/0dfXrzw5OaEVOnZwihx3Y2Gby5OTk3YeHh60wMHBQSomJub1wcFBiL29/QsUhBtpuLq6SiGYb/DwWQjIFqInsLOzowVCX5fQVwImN318fFqnpqYE1w37+vqo9PT03wF+l4WytDQyMmLv7U1KnerT29tLJSQkrO3t7dlg5svk5OQcukIBhYi6u7ufYssFLA6HM9Dc3BwYFRV1AygQCEQ7OzuJmHhmZGTUC1l9CPncsEMcRMhlUniXSJQ/DwsLq+js7NRXtkRUxa2trSeXl5dmZBzAlbGxMVtPT08VYH9/PwUP57a2th6SCQLUQWD+Cg0NfVBQUECRkgRPxBMTE3PQXDj5Kl4Oi8U6BfweHhVgdHS0eHh4+Fsci0zx8tTzNjMzK0dd8wb8jVgsfg6w8t4eOTo6/rywsGCkTJNKpRQKygXsH2D8H2UgbYSVBuMjIyNr2tvbVY4FdZDKyMiYwnZ95ba39RS53VPUvK9zcnJUPhwQEHA4NDSUicEWRkBE+3ltba1/RESEAogUJIEiv0nKHjMCooovIMKOylqF1CgUhPG1tbX3lN3WaMs6Ojrn0CMHelOsDQ8PF3Z1dWVgoJkp0ApbW0Auk86meBwcHITLy8vkDAaZAj1sbW3HV1ZWjJUXuri4HMzPzwdi7FemQFf03l+Q+Cr1Mjg4WIgsiQesgynQCVEmWlOIWiQSUUiASyTCfbmgGUWZzWafYstcS0tL2brs7Oxz5Pkksun96xmhUZTREf9AAXCvr68nfYMA96DDdwDbvxMQiwJRaH9EpZGiFewi4iS65H5449HIw/9Wke2RftKPV3Yx+r9AdQyVcSYeKi8kRZHWSybAD3Ah+BiFNkAoFFqgDnbgWhx5p6Ag9fKvrq6yUL7uoWRxnZ2dZToE8E46fGJjY5OH3m2EFJQ5hN5Mubm5Qd8iXcYe4rawiTZrgdu/Yi1uWVRlZeUPu7u7MUyBAShZ3Wj0KrcyJyeno8XFxY8AG2cKfIh0e7GxsaGoNFVVVWclJSXr6HJOd9GhFhZdDAwMsHx9fanGxsbzoqIiCbqcD8Zf3QVI1jxGxe7Ev6grSGUaaReNsWV1Kv8X6XkOC2AliDsAAAAASUVORK5CYII=",
                flipRTL: argument.flipRTL || false,
                width: argument.width || 20,
                height: argument.height || 20,
            };
        }
    }
})();