(function () {
    sugarcube.generator = new Blockly.Generator("sugarcube");

    sugarcube.buildCode = (workspace) => {
        let code = "";

        //Precomp code from every extension;
        for (instanceID in sugarcube.extensionInstances) {
            const instance = sugarcube.extensionInstances[instanceID];

            if (instance.__precompile) {
                code += `${instance[instance.__precompile]()}\n`;
            }
        }
        
        //Our compiled code
        code += `\n${sugarcube.generator.workspaceToCode(workspace)}`;
    }
})();
