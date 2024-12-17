(function () {
    const parser = new DOMParser();

    sugarcube.stringToDOM = (xmlString) => {
        return parser.parseFromString(xmlString, "text/xml").childNodes[0];
    };

    sugarcube.createSVGEL = (elementName) => {
        return document.createElementNS("http://www.w3.org/2000/svg", elementName);
    };

    sugarcube.addElementToWorkspace = (child) => {
        sugarcube.workspace.svgBlockCanvas_.appendChild(child);
    };

    sugarcube.moveWorkspaceElementToTop = (child) => {
        if (child.parentElement) {
            child.parentElement.removeChild(child);
        }
        
        sugarcube.workspace.svgBlockCanvas_.appendChild(child);
    }
})();
