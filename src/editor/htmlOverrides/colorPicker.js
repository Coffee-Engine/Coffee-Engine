(function () {
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
        </svg>`,
    };

    editor.colorPicker.create = (x, y, { color, hasExtensions, extensionsReturnAll, hasTranslucency, callback }) => {
        //Channel 3 and Channel 15
        color = color || "#0000ff";
        let split = coffeeEngine.ColorMath.HexToRGB(color);

        let promise = new Promise((resolve, reject) => {
            editor.colorPicker.resolve = resolve;
            editor.colorPicker.reject = reject;
        });

        //Create the new panel
        editor.colorPicker.remove();
        const current = document.createElement("div");
        editor.colorPicker.current = current;

        //Set the styles
        current.style.width = `${hasExtensions ? 37.5 : 30}vh`;

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
        current.style.zIndex = "10000";

        current.innerHTML =
            `
        <style>
            .CE_colorPicker {
                --hue: 45deg;

                height:100%;
                position:relative;

                background: linear-gradient(90deg, rgba(255,255,255,1) 0%, HSL(var(--hue),100%,50%) 100%);

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
                grid-template-columns: ${hasTranslucency ? "0.5fr 0.5fr 1fr" : "0.9fr 1.1fr"};
                gap: 2px;
            }

            .CE_hueDiv {
                background-image: linear-gradient(to bottom, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 17%, rgb(0, 255, 0) 33%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66%, rgb(255, 0, 255) 83%, rgb(255, 0, 0) 100%);

                border-color:var(--background-2);
                border-radius:8px;
                border-width:4px;
                border-style:solid;

                position:relative;
            }

            .CE_transDiv {
                background-image: linear-gradient(0deg, rgba(var(--red), var(--green), var(--blue),0) 0%, rgba(var(--red), var(--green), var(--blue),1) 100%), url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA7SURBVDhPY+jp6fmPDU+YMAFMHz58GC/GaQAMY9OEjEcNGBQGYBNExtgMBWFYOiHbABgeNWDgDej5DwDMHvW3lMqyQQAAAABJRU5ErkJggg==);

                border-color:var(--background-2);
                border-radius:8px;
                border-width:4px;
                border-style:solid;

                position:relative;
            }

            .CE_numInputList {
                display:grid;
                grid-template-rows: 1fr 1fr 1fr 1fr;
                gap: 2px;
            }

            .CE_scrubber {
                width:2vh;
                aspect-ratio:1;
                position:absolute;

                background-color:var(--background-1);

                border-color:var(--background-3);
                border-radius:50%;
                border-width:4px;
                border-style:solid;
            }

            .CE_numInput {
                min-width: 0px;
            }

            .ce_extensionHolder {
                height:100%;
                background-color:var(--background-2);
                position:static;    

                overflow-y:scroll;

                display:grid;
                grid-template-columns: 1fr 1fr;
            }

            .ce_extensionColorPreset {
                --extColor: #ffffff;
                background-color:var(--extColor);
                /*
                width:75%;
                */
                margin:12.5%;
                aspect-ratio:1;

                border-radius:50%;
                border-width:0px;
                border-style:solid;
                border-color:var(--text-1);

                transition: all 150ms;
            }

            .ce_extensionColorPreset:hover {
                border-width:4px;
            }
        </style>
        <div id="ce_colorBG" class="CE_colorPicker">
            <div class="CE_colorPickerDark"></div>
            <div id="ce_SVScrubber" class="CE_scrubber" style="transform:translate(-50%,-50%);"></div>
        </div>
        <div class="CE_precisionDiv">
            <div class="CE_upperPrecision">
                <div id="ce_hueBG" class="CE_hueDiv">
                    <div id="ce_HScrubber" class="CE_scrubber" style="transform:translate(-50%,-50%); left:50%;"></div>
                </div>
                ${
                    hasTranslucency
                        ? `
                <div id="ce_transBG" class="CE_transDiv">
                    <div id="ce_transScrubber" class="CE_scrubber" style="transform:translate(-50%,-50%); left:50%;"></div>
                </div>
                    `
                        : ""
                }
                <div class="CE_numInputList">
                    <input id="ce_redChannel" class="CE_numInput" style="color:#ff0000;" value="${split.r}" type="number"></input>
                    <input id="ce_greenChannel" class="CE_numInput" style="color:#00ff00;" value="${split.g}" type="number"></input>
                    <input id="ce_blueChannel" class="CE_numInput" style="color:#0000ff;" value="${split.b}" type="number"></input>
                    <input id="ce_hexChannel" class="CE_numInput" value="${color}" type="text"></input>
                </div>
            </div>

            <button id="doneButton">${editor.language["engine.generic.done"]}</button>
        </div>
        ` +
            (hasExtensions
                ? `
        <div class="ce_extensionHolder" id="ce_extensionHolder"></div>
        `
                : "");

        document.body.appendChild(current);

        //Our inputs and values that change
        const redInput = document.getElementById("ce_redChannel");
        const greenInput = document.getElementById("ce_greenChannel");
        const blueInput = document.getElementById("ce_blueChannel");

        const hexInput = document.getElementById("ce_hexChannel");
        const colorBackground = document.getElementById("ce_colorBG");
        const hueBackground = document.getElementById("ce_hueBG");

        //Grab out scrubbers
        const HueScrubber = document.getElementById("ce_HScrubber");
        const ValSatScrubber = document.getElementById("ce_SVScrubber");

        //Transparency stuff
        const transBackground = document.getElementById("ce_transBG");
        const transScrubber = document.getElementById("ce_transScrubber");

        //Done button
        const doneButton = document.getElementById("doneButton");

        //An update function we can call
        const updateColors = (multiColor) => {
            const HSV = coffeeEngine.ColorMath.RGBToHSV(split);

            //Adjust the backgrounds
            colorBackground.style.setProperty("--hue", `${HSV.h}`);
            if (hasTranslucency) transBackground.style.setProperty("--red", `${split.r}`);
            if (hasTranslucency) transBackground.style.setProperty("--green", `${split.g}`);
            if (hasTranslucency) transBackground.style.setProperty("--blue", `${split.b}`);

            //Move the scrubbers
            if (HSV.h < 0) {
                HSV.h += 360;
            }
            HueScrubber.style.top = `${(HSV.h / 3.6) % 100}%`;

            ValSatScrubber.style.top = `${(1 - HSV.v) * 100}%`;
            ValSatScrubber.style.left = `${HSV.s * 100}%`;
            ValSatScrubber.style.backgroundColor = coffeeEngine.ColorMath.RGBtoHex(split);

            if (hasTranslucency) transScrubber.style.top = `${((255 - HSV.a) / 2.55) % 100}%`;

            //Set the inputs
            redInput.value = split.r;
            greenInput.value = split.g;
            blueInput.value = split.b;

            hexInput.value = coffeeEngine.ColorMath.RGBtoHex(split);

            if (callback) {
                if (multiColor) callback(multiColor[0], multiColor[1], multiColor[2], multiColor[3], multiColor[4]);
                else callback(hexInput.value);
            }
        };

        if (hasExtensions) {
            const extensionHolder = document.getElementById("ce_extensionHolder");
            Object.keys(sugarcube.blocklyTheme.blockStyles).forEach((extensionID) => {
                const button = document.createElement("div");

                button.className = "ce_extensionColorPreset";

                button.style.setProperty("--extColor", sugarcube.blocklyTheme.blockStyles[extensionID].colourIdentifier);

                button.onclick = () => {
                    const result = extensionsReturnAll ? [sugarcube.blocklyTheme.blockStyles[extensionID].colourPrimary, sugarcube.blocklyTheme.blockStyles[extensionID].colourSecondary, sugarcube.blocklyTheme.blockStyles[extensionID].colourTertiary, sugarcube.blocklyTheme.blockStyles[extensionID].colourQuaternary, sugarcube.blocklyTheme.blockStyles[extensionID].colourQuinary, sugarcube.blocklyTheme.blockStyles[extensionID].useBlackWhiteFields, sugarcube.blocklyTheme.blockStyles[extensionID].colourIdentifier] : coffeeEngine.ColorMath.HexToRGB(sugarcube.blocklyTheme.blockStyles[extensionID].colourIdentifier);
                    if (!result) return;

                    //Split it
                    split = extensionsReturnAll ? result[0] : result;
                    updateColors(extensionsReturnAll ? result : null);
                };

                extensionHolder.appendChild(button);
            });
        }

        //Simple input controls
        redInput.onchange = () => {
            split.r = redInput.value;
            updateColors();
        };

        greenInput.onchange = () => {
            split.g = greenInput.value;
            updateColors();
        };

        blueInput.onchange = () => {
            split.b = blueInput.value;
            updateColors();
        };

        hexInput.onchange = () => {
            if (hexInput.value.length == 4 || hexInput.value.length == 7) {
                const result = coffeeEngine.ColorMath.HexToRGB(hexInput.value);
                if (!result) return;

                split = result;
                updateColors();
            }
        };

        //Now for the scrubbers
        HueScrubber.onmousedown = () => {
            //Events
            let upEvent,
                moveEvent = null;

            upEvent = () => {
                document.removeEventListener("mouseup", upEvent);
                document.removeEventListener("mousemove", moveEvent);
            };

            moveEvent = (event) => {
                const rect = hueBackground.getBoundingClientRect();

                const HSV = coffeeEngine.ColorMath.RGBToHSV(split);

                HSV.h = ((event.clientY - rect.top) / rect.height) * 360;
                HSV.h = Math.min(Math.max(HSV.h, 0), 359) % 360;
                split = coffeeEngine.ColorMath.HSVToRGB(HSV);

                updateColors();
            };

            document.addEventListener("mouseup", upEvent);
            document.addEventListener("mousemove", moveEvent);
        };

        //Our translucency
        if (hasTranslucency)
            transScrubber.onmousedown = () => {
                //Events
                let upEvent,
                    moveEvent = null;

                upEvent = () => {
                    document.removeEventListener("mouseup", upEvent);
                    document.removeEventListener("mousemove", moveEvent);
                };

                moveEvent = (event) => {
                    const rect = transBackground.getBoundingClientRect();

                    const HSV = coffeeEngine.ColorMath.RGBToHSV(split);

                    HSV.a = 255 - ((event.clientY - rect.top) / rect.height) * 255;
                    HSV.a = Math.min(Math.max(HSV.a, 0), 255);
                    split = coffeeEngine.ColorMath.HSVToRGB(HSV);

                    updateColors();
                };

                document.addEventListener("mouseup", upEvent);
                document.addEventListener("mousemove", moveEvent);
            };

        ValSatScrubber.onmousedown = () => {
            //Events
            let upEvent,
                moveEvent = null;

            upEvent = () => {
                document.removeEventListener("mouseup", upEvent);
                document.removeEventListener("mousemove", moveEvent);
            };

            moveEvent = (event) => {
                const rect = colorBackground.getBoundingClientRect();

                const HSV = coffeeEngine.ColorMath.RGBToHSV(split);

                HSV.v = (event.clientY - rect.top) / rect.height;
                HSV.v = Math.min(Math.max(1 - HSV.v, 0), 1);

                HSV.s = (event.clientX - rect.left) / rect.width;
                HSV.s = Math.min(Math.max(HSV.s, 0), 1);

                split = coffeeEngine.ColorMath.HSVToRGB(HSV);

                updateColors();
            };

            document.addEventListener("mouseup", upEvent);
            document.addEventListener("mousemove", moveEvent);
        };

        doneButton.onclick = () => {
            editor.colorPicker.resolve(coffeeEngine.ColorMath.RGBtoHex(split));
            editor.colorPicker.remove();
        };

        updateColors();

        return promise;
    };

    editor.colorPicker.remove = () => {
        if (editor.colorPicker.current) {
            editor.colorPicker.current.parentElement.removeChild(editor.colorPicker.current);
            if (editor.colorPicker.resolve) {
                editor.colorPicker.resolve();
            }
            delete editor.colorPicker.current;
        }
    };

    //Bad html class. Might be cool
    editor.colorPicker.class = class extends HTMLElement {
        static observedAttributes = ["color", "disabled", "translucency", "size"];

        #color = "#ffffff";
        translucency = false;

        set color(value) {
            this.#color = value;

            this.style.backgroundColor = this.#color;
        }

        get color() {
            return this.#color;
        }

        set value(value) {
            this.color = value;
        }

        get value() {
            return this.color;
        }

        disabled = false;

        constructor() {
            super();

            this.onmouseenter = () => {
                if (this.disabled) {
                    this.style.borderColor = "var(--background-2)";
                } else {
                    this.style.borderColor = "var(--text-3)";
                }
            };

            this.onmouseleave = () => {
                this.style.borderColor = "var(--background-3)";
            };

            this.onclick = (event) => {
                if (this.disabled) return;

                editor.colorPicker.create(event.clientX, event.clientY, {
                    hasExtensions: this.hasAttribute("hasExtensions"),
                    color: this.color,
                    hasTranslucency: this.translucency,
                    callback: (color) => {
                        this.color = color;
                        if (this.onchange) {
                            this.onchange();
                        }
                    },
                });
            };
        }

        connectedCallback() {
            if (this.getAttribute("color")) {
                this.color = this.getAttribute("color");
            }

            this.style.display = "relative";
            this.style.borderColor = "var(--background-3)";
            this.style.borderWidth = "4px";
            this.style.borderRadius = "50%";
            this.style.borderStyle = "solid";
            this.style.aspectRatio = "1";

            this.style.width = `auto`;
            this.style.height = `2rem`;

            this.style.minWidth = "8px";
            this.style.minHeight = "8px";

            this.style.aspectRatio = "1";

            this.style.backgroundColor = this.color;

            this.style.transition = "all 150ms";
        }
    };

    customElements.define("color-picker", editor.colorPicker.class);
})();
