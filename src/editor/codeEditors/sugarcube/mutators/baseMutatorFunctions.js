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
    sugarcube.mutators.makeFromFunction = (id,serialize,deserialize) => {
        let editedState = {};
        return {
            saveExtraState: () => {
                return editedState;
            },

            loadExtraState: (state) => {
                editedState = state;
            },

            mutationToDom: () => {
                if (!this._isClone_) this._shouldDuplicate_ = true;
                // You *must* create a <mutation></mutation> element.
                // This element can have children.
                const container = Blockly.utils.xml.createElement("mutationData");
                container.setAttribute("cloneData", sugarcube.mutators.stringifyItem(editedState));
                return container;
            },

            domToMutation: (xmlElement) => {
                editedState = sugarcube.mutators.parseItem(xmlElement.getAttribute("mutationData"));
            },
        }
    }
})();