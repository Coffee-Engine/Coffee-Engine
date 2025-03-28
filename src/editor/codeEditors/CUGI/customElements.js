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

    CUGI.types["key"] = (data) => {
        const { target, key } = data;

        //Create our input
        const input = CUGI.displays.button({ text: target[key],
        onclick: (element) => {
            element.innerText = editor.language["engine.settings.pressAnyKey"];
            const keyDownFunction = (event) => {
                //Stop propogation and prevent the default action
                event.stopPropagation();
                event.preventDefault();

                let value = event.key.toLowerCase();
                input.innerText = value;
                //Hardcoded exception for space The button dissapears if we don't
                if (value == " ") {
                    input.innerText = editor.language["engine.settings.space"];
                    value = "space";
                }

                //Send out the signal
                target[key] = input;
                data.onchange();

                document.removeEventListener("keydown", keyDownFunction);
            };
            document.addEventListener("keydown", keyDownFunction);
        }});

        input.className = "CUGI-Button CUGI-Keybind";

        input.onchange = CUGI.macros.onchange(data, input);

        return input;
    };
})();