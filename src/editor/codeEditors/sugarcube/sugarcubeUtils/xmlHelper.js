(function () {
    const parser = new DOMParser();

    sugarcube.stringToDOM = (xmlString) => {
        return parser.parseFromString(xmlString, "text/xml").childNodes[0];
    };
})();
