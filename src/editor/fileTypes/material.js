(function () {
    const matEditor = ({panel, refreshListing}) => {
        return {
            getProperties:() => {
                return [
                    {name:"test", type: coffeeEngine.PropertyTypes.FLOAT}
                ];
            },
            onPropertyChange:(property, value, node) => {
                console.log(property,value,node);
            }
        }
    };

    editor.registerFilePropertyEditor("material", matEditor);
})();
