(function() {
    sugarcube.fields.makeFromDef({
        color1:document.body.style.getPropertyValue("--background-1"),
        color2:document.body.style.getPropertyValue("--background-2"),
    },"SugarCube_Color")
})();