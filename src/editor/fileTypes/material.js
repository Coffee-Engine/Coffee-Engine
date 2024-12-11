(function () {
    const matEditor = ({panel, refreshListing}) => {
        return {
            getProperties:() => {
                //Get shaders
                let baseShaders = {};
                Object.keys(coffeeEngine.renderer.mainShaders).map((key) => {baseShaders[`${key}.glsl`] = key; return key});

                return [
                    {name:"shader", type: coffeeEngine.PropertyTypes.FILE, fileType: "glsl", systemRoot: { "/____NAMESPACE__IDENTIFIER____/":true, "coffee:": baseShaders, "project:": project.fileSystem }}
                ];
            },
            onPropertyChange:(property, value, node) => {
                console.log(property,value,node);
                if (property.name == "shader") refreshListing();
            }
        }
    };

    editor.registerFilePropertyEditor("material", matEditor);
})();
