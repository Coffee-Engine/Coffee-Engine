(function() {
    editor.colorPicker = {
        current: null,
        colorPickerSVG: `
        <svg style="width:100%; height:100%; margin:0px; padding:0px; border-radius:4px;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="127.80309" height="127.80309" viewBox="0,0,127.80309,127.80309">
            <defs>
                <linearGradient x1="176.09846" y1="180" x2="303.90154" y2="180" gradientUnits="userSpaceOnUse" id="color-1">
                <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ff0000"/>
                </linearGradient>

                <linearGradient x1="240" y1="243.90154" x2="240" y2="116.09846" gradientUnits="userSpaceOnUse" id="color-2">
                <stop offset="0" stop-color="#000000"/>
                <stop offset="1" stop-color="#000000" stop-opacity="0"/>
                </linearGradient>
            </defs>
            <g transform="translate(-176.09846,-116.09846)">
                <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero" stroke="#000000" stroke-width="0" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">
                    <path d="M176.09846,243.90154v-127.80309h127.80309v127.80309z" fill="url(#color-1)"/>
                    <path d="M303.90154,243.90154h-127.80309v-127.80309h127.80309z" fill="url(#color-2)"/>
                </g>
            </g>
        </svg>`
    };

    editor.colorPicker.create = (x,y,{ color, hasExtensions }) => {
        //Create the new panel
        editor.colorPicker.remove();
        const current = document.createElement("div")
        editor.colorPicker.current = current;

        //Set the styles
        current.style.width = `${hasExtensions ? 25 : 20}vw`;
        current.style.height = "auto";
        current.style.aspectRatio = `${hasExtensions ? 5 : 4}/3`;

        //Move the positions
        current.style.position = "absolute";
        current.style.left = `${x}px`;
        current.style.top = `${y}px`;

        //And then the background and border
        current.style.backgroundColor = "var(--background-1)";
        current.style.borderColor = "var(--background-2)";
        current.style.borderWidth = "2px";
        current.style.borderRadius = "16px";
        current.style.borderStyle = "solid";

        current.style.display = "flex";

        if (hasExtensions) {
        }
        else {
            //Create the BG
            const brightnessSatAdjuster = document.createElement("div");
            {
                brightnessSatAdjuster.innerHTML = editor.colorPicker.colorPickerSVG;

                //Size it
                brightnessSatAdjuster.style.height = "80%";
                brightnessSatAdjuster.style.marginTop = "7.5%";
                brightnessSatAdjuster.style.marginLeft = "7.5%";
                brightnessSatAdjuster.style.padding = "0px";

                brightnessSatAdjuster.style.position = "relative";

                brightnessSatAdjuster.style.aspectRatio = "1";

                brightnessSatAdjuster.style.borderColor = "var(--background-2)";
                brightnessSatAdjuster.style.borderWidth = "4px";
                brightnessSatAdjuster.style.borderRadius = "8px";
                brightnessSatAdjuster.style.borderStyle = "solid";

                //off tha dome!
                const picker = document.createElement("div");
                picker.style.backgroundColor = "var(--background-2)";
                picker.style.borderColor = "var(--background-3)";
                picker.style.borderWidth = "2px";
                picker.style.borderRadius = "50%";
                picker.style.borderStyle = "solid";
                //Sizing
                picker.style.width = "16px";
                picker.style.height = "16px";
                picker.style.transform = "translate(-50%,-50%)";
                //Positional
                picker.style.position = "absolute";
                picker.style.top = "0px";
                picker.style.left = "0px";
                picker.style.zIndex = "100000";

                brightnessSatAdjuster.appendChild(picker);
            }

            //The Universe
            const verticalHolder = document.createElement("div");
            verticalHolder.style.marginTop = "7.5%";
            verticalHolder.style.height = "80%";

            const hueAdjuster = document.createElement("div");
            {
                //Wowee
                hueAdjuster.style.backgroundImage = "linear-gradient(to bottom, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%)"
                
                //The stuff
                hueAdjuster.style.height = "80%";
                hueAdjuster.style.margin = "0%";
                hueAdjuster.style.marginLeft = "2.5%";
                hueAdjuster.style.marginRight = "2.5%";
                hueAdjuster.style.marginBottom = "0%";
                hueAdjuster.style.padding = "0px";
                hueAdjuster.style.aspectRatio = "1/5";

                hueAdjuster.style.borderColor = "var(--background-2)";
                hueAdjuster.style.borderWidth = "4px";
                hueAdjuster.style.borderRadius = "8px";
                hueAdjuster.style.borderStyle = "solid";

                hueAdjuster.style.position = "relative";
            }

            const closeButton = document.createElement("button");
            {
                closeButton.innerText = "Done";
                closeButton.style.height = "20%";
                closeButton.style.width = "100%";
                closeButton.style.margin = "0px";
                closeButton.style.padding = "0px";

                closeButton.onclick = () => {
                    editor.colorPicker.remove();
                }
            }

            current.appendChild(brightnessSatAdjuster);
            current.appendChild(verticalHolder);
            verticalHolder.appendChild(hueAdjuster);
            verticalHolder.appendChild(closeButton);
        }

        document.body.appendChild(current);
    }

    editor.colorPicker.remove = () => {
        if (editor.colorPicker.current) {
            editor.colorPicker.current.parentElement.removeChild(editor.colorPicker.current);
            delete editor.colorPicker.current;
        }
    }
})();