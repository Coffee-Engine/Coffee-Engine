(function() {
    editor.colorPicker = {
        current: null,
        colorPickerSVG: `
        <svg class="CE_colorPicker" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="127.80309" height="127.80309" viewBox="0,0,127.80309,127.80309">
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
        //Channel 3 and Channel 15
        color = color || "#0000ff";
        let split = coffeeEngine.ColorMath.HexToRGB(color);

        //Create the new panel
        editor.colorPicker.remove();
        const current = document.createElement("div")
        editor.colorPicker.current = current;

        //Set the styles
        current.style.width = `${hasExtensions ? 25 : 20}vw`;
        current.style.height = "auto";
        current.style.aspectRatio = `${hasExtensions ? 5 : 4}/3`;
        current.style.overflow = "hidden";

        //Move the positions
        current.style.position = "absolute";
        current.style.left = `${x}px`;
        current.style.top = `${y}px`;

        //And then the background and border
        current.style.backgroundColor = "var(--background-1)";
        current.style.borderColor = "var(--background-2)";
        current.style.borderWidth = "4px";
        current.style.borderRadius = "16px";
        current.style.borderStyle = "solid";

        //Padding
        current.style.padding = "8px";

        //The Grid
        current.style.display = "grid";
        current.style.gridTemplateColumns = "3fr 1fr" + (hasExtensions ? " 1fr" : "");
        current.style.gap = "4px";
        current.style.zIndex = "10000"

        current.innerHTML = `
        <style>
            .CE_colorPicker {
                height:100%;
                position:relative;

                background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,0,0,1) 100%);

                border-color:var(--background-2);
                border-radius:4px;
                border-width:4px;
                border-style:solid;
            }

            .CE_colorPickerDark {
                width:100%;
                height:100%;
                top:0px;
                left:0px;

                position:absolute;

                margin:0px;
                padding:0px;
                background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
            }

            .CE_precisionDiv {
                height:100%;
                position:relative;

                display:grid;
                grid-template-rows: auto 32px;
                gap: 4px;
            }

            .CE_upperPrecision {
                display:grid;
                grid-template-columns: 0.9fr 1.1fr;
                gap: 2px;
            }

            .CE_hueDiv {
                background-image: linear-gradient(to bottom, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%);

                border-color:var(--background-2);
                border-radius:8px;
                border-width:4px;
                border-style:solid;
            }

            .CE_numInputList {
                display:grid;
                grid-template-rows: 1fr 1fr 1fr 1fr;
                gap: 2px;
            }

            .CE_numInput {
                min-width: 0px;
            }
        </style>
        <div class="CE_colorPicker">
            <div class="CE_colorPickerDark"></div>
        </div>
        <div class="CE_precisionDiv">
            <div class="CE_upperPrecision">
                <div class="CE_hueDiv"></div>
                <div class="CE_numInputList">
                    <input class="CE_numInput" style="color:#ff0000;" value="${split.r}" type="number"></input>
                    <input class="CE_numInput" style="color:#00ff00;" value="${split.g}" type="number"></input>
                    <input class="CE_numInput" style="color:#0000ff;" value="${split.b}" type="number"></input>
                    <input class="CE_numInput" value="${color}" type="text"></input>
                </div>
            </div>

            <button>done</button>
        </div>
        ` + (hasExtensions ? `
        
        ` : "");

        document.body.appendChild(current);
    }

    editor.colorPicker.remove = () => {
        if (editor.colorPicker.current) {
            editor.colorPicker.current.parentElement.removeChild(editor.colorPicker.current);
            delete editor.colorPicker.current;
        }
    }
})();