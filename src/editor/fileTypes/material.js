(function () {
    const matEditor = ({panel, refreshListing}) => {
        return {
            getProperties:() => {
                return [
                    {name:"test", type: coffeeEngine.PropertyTypes.VEC3}
                ];
            },
            onPropertyChange:(property, value, node) => {
                
            }
        }
    };

    editor.registerFilePropertyEditor("material", matEditor);
})();
