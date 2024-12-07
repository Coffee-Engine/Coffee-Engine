(function () {
    const matEditor = (propertyPanel) => {
        return [
            {name:"test", type: coffeeEngine.PropertyTypes.VEC3}
        ]
    };

    editor.registerFilePropertyEditor("material", matEditor);
})();
