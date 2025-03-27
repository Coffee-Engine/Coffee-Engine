(function() {
    CUGI.types["color"] = (data) => {
        const { target, key } = data;

        //Create our input
        const input = document.createElement("color-picker");
        input.disabled = (typeof data.disabled == "function") ? data.disabled() : data.disabled;
        input.className = `CUGI-Color ${data.extraStyle}`;
        input.value = target[key];

        input.onchange = CUGI.macros.onchange(data, input);

        return input;
    };
})();