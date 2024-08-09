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
        return Blockly.Extensions.registerMutator(mutatorName,
            {
                saveExtraState: function () {
                    this.editedState = sugarcube.extensionInstances[extensionID][serialize](this.editedState, this) || {};
                    return this.editedState;
                },

                loadExtraState: function (state) {
                    this.editedState = state || {};
                    this.editedState = sugarcube.extensionInstances[extensionID][deserialize](this.editedState, this) || {};
                },

                mutationToDom: function () {
                    this.editedState = sugarcube.extensionInstances[extensionID][serialize](this.editedState, this) || {};
                    const container = Blockly.utils.xml.createElement("mutationData");
                    container.setAttribute("storedData", sugarcube.mutators.stringifyItem(this.editedState));
                    return container;
                },

                domToMutation: function (xmlElement) {
                    this.editedState = sugarcube.mutators.parseItem(xmlElement.getAttribute("storedData")) || {};
                    this.editedState = sugarcube.extensionInstances[extensionID][deserialize](this.editedState, this) || {};
                },
            },
            undefined);
        }
})();