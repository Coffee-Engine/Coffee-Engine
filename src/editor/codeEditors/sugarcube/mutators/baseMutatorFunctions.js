(function() {
    //Storage for mutators
    sugarcube.mutators = {};

    //Our auto-serialization shiz;
    sugarcube.mutators.stringifyItem = (item) => {
        //Just so we can support more types
        switch (typeof item) {
            case "object":
                return JSON.stringify(item);

            case "function":
                return `mutatedStringedFunction_${item.toString()}`;

            case "undefined":
                return "";
        
            default:
                return item;
        }
    }

    sugarcube.mutators.parseItem = (item) => {
        //If it is a json parse it.
        if (JSON.parse(item)) {
            return JSON.parse(item);
        }

        //If we are a string check for a function
        switch (typeof item) {
            case "string":
                if (item.startsWith("mutatedStringedFunction_")) {
                    return Function(item.replace("mutatedStringedFunction_",""));
                }

                return item;
        
            default:
                return item;
        }
    }

    //Our easy creation function
    sugarcube.mutators.makeFromFunction = (extensionID,serialize,deserialize,mutatorName) => {
        let editedState = {};
        return Blockly.Extensions.registerMutator(mutatorName,
            {
                saveExtraState: function () {
                    editedState = sugarcube.extensionInstances[extensionID][serialize](editedState, this) || {};
                    return editedState;
                },

                loadExtraState: function (state) {
                    editedState = state || {};
                    editedState = sugarcube.extensionInstances[extensionID][deserialize](editedState, this) || {};
                },

                mutationToDom: function () {
                    editedState = sugarcube.extensionInstances[extensionID][serialize](editedState, this) || {};
                    const container = Blockly.utils.xml.createElement("mutationData");
                    container.setAttribute("storedData", sugarcube.mutators.stringifyItem(editedState));
                    return container;
                },

                domToMutation: function (xmlElement) {
                    editedState = sugarcube.mutators.parseItem(xmlElement.getAttribute("storedData")) || {};
                    editedState = sugarcube.extensionInstances[extensionID][deserialize](editedState, this) || {};
                },
            });
        }
})();