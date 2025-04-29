(function() {
    const reloadImage = `<svg version="1.1" style="width:1.25em;height:1.25em;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="46.85387" height="46.85387" viewBox="0,0,46.85387,46.85387">
    <g transform="translate(-216.57306,-156.57307)">
        <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill-rule="nonzero"
            stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray=""
            stroke-dashoffset="0" style="mix-blend-mode: normal">
            <path
                d="M239.20211,187.98208c0,0 10.21495,1.64284 10.63282,-10.01692c0.47333,-13.20706 -14.47158,-10.25932 -16.01712,-9.70501c-4.90367,1.75872 -7.74575,5.51869 -7.74575,5.51869c1.80375,-5.80032 7.21393,-10.01186 13.60776,-10.01186c7.86902,0 14.24811,6.3791 14.24811,14.24811c0,7.86902 -6.3791,14.24811 -14.24811,14.24811c-0.15807,0 -0.31553,-0.00257 -0.47236,-0.00768z"
                fill="currentColor" stroke="currentColor" stroke-width="2.5" />
            <path d="M240.07056,196.23302l-6.14157,-6.14157l6.14157,-6.14157z" fill="currentColor"
                stroke="currentColor" stroke-width="0.5" />
            <path d="M216.57307,203.42695v-46.85387h46.85387v46.85387z" fill="none" stroke="none"
                stroke-width="NaN" />
        </g>
    </g>
</svg><!--rotationCenter:23.426934999999986:23.42692500000001-->`;

    //Project settings specific
    const createExtensionElement = (data, internalName) => {
        //Create our needed elements
        const container = document.createElement("div");

        const infoContainer = document.createElement("div");
        const extName = document.createElement("p");
        const extExtra = document.createElement("p");

        const reload = document.createElement("button");
        const remove = document.createElement("button");

        //Add our classes
        container.className = "CUGI-Extension";
        reload.className = "CUGI-ExtensionReload";
        remove.className = "CUGI-ExtensionRemove";

        infoContainer.className = "CUGI-ExtensionDetail";
        extName.className = "CUGI-ExtensionName";
        extExtra.className = "CUGI-ExtensionName CUGI-ExtensionAuthor";

        //Add our text
        extName.innerText = data.name;
        extExtra.innerText = editor.language["engine.projectSettings.extensions.extensionInfo"].replace("[Author]", data.author).replace("[Version]", data.version);

        reload.innerHTML = reloadImage;
        remove.innerText = "X";

        //Removal
        remove.onclick = () => {
            if (container.parentElement) container.parentElement.removeChild(container);
            //Dispose of our extension, make sure to remove tailing / when deleting folder.
            data.object.disposeExtension();
            project.deleteFile(data.object.path.replaceAll(/\/$/g, ""));
        }

        reload.onclick = () => {
            data.object.reloadExtension();
        }

        //Append our child elements
        container.appendChild(remove);
        container.appendChild(reload);
        container.appendChild(infoContainer);

        infoContainer.append(extName);
        infoContainer.append(extExtra);

        return container;
    }

    CUGI.displays["extensions"] = () => {
        //Create the broadcast container
        const container = document.createElement("div");
        container.className = "CUGI-PropertyHolder CUGI-ExtensionContainer";

        //Create our text
        const text = document.createElement("p");
        text.innerText = editor.language["engine.projectSettings.extensions"];

        //Append our new elements
        container.appendChild(text);
        
        //Create our buttons
        for (let extension in project.extensions.storage) {
            container.appendChild(createExtensionElement(project.extensions.storage[extension], extension));
        }

        return container;
    }
})();