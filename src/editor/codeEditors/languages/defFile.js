//Definition File for showing languages in CE
window.programmingLanguages = [
    {
        id: "javascript",
        hasTranslation: true,
        useBlocklyEditor: false,
        fileExtension: "js",
        //We do a function so that our translations work
        defaultBehavior: () => {
            return `//${editor.language["editor.window.typed.commentMessage"]}
class behavior extends coffeeEngine.behavior {
    ready() {
        //${editor.language["editor.window.typed.initMessage"]}
        console.log("Hello World!");
    }

    update(delta) {
        //${editor.language["editor.window.typed.updateMessage"]}
    }

    //${editor.language["editor.window.typed.drawUncommentMessage"]}
    //draw() {
    //    //${editor.language["editor.window.typed.drawMessage"]}
    //}
}
    
coffeeEngine.behaviorManager.register("myBehavior",behavior);`;
        },
    },
    {
        id: "cappuccino",
        hasTranslation: true,
        useBlocklyEditor: false,
        fileExtension: "cappu",
        //We do a function so that our translations work
        defaultBehavior: () => {
            return `//${editor.language["editor.window.typed.commentMessage"]}
class behavior from coffeeEngine.behavior contains
    function ready()
        //${editor.language["editor.window.typed.initMessage"]}
        print("Hello World!")
    end

    function update(delta)
        //${editor.language["editor.window.typed.updateMessage"]}
    end

    //${editor.language["editor.window.typed.drawUncommentMessage"]}
    //function draw()
    //    //${editor.language["editor.window.typed.drawMessage"]}
    //end
end
    
coffeeEngine.behaviorManager.register("myBehavior",behavior);`;
        },

        //So we know what to do with our code
        compileFunction: (code) => {
            return cappuccino.compile(code);
        },
    },
    {
        id: "sugarcube",
        hasTranslation: true,
        useBlocklyEditor: true,
        fileExtension: "cescr",
        //Sugarcube's is the most bare bones
        //Also the most function based
        defaultBehavior: (sugarcubeInheritence) => {
            return (
                '{"code":{"blocks":{"languageVersion":0,"blocks":[{"type":"events_onStart","id":"ths{fk?x7MsmGG^g`k@I","x":379,"y":140}]}},"variables":{},"customBlocks":{},' +
                `"inheritence":${(function () {
                    //inheritence... home
                    let inheritenceTree = [];
                    let currentInheritence = coffeeEngine.nodeRegister[sugarcubeInheritence];
                    inheritenceTree.push(sugarcubeInheritence);
                    while (currentInheritence) {
                        if (coffeeEngine.nodeRegister[currentInheritence[1]]) {
                            inheritenceTree.push(currentInheritence[1]);
                        }
                        currentInheritence = coffeeEngine.nodeRegister[currentInheritence[1]];
                    }
                    console.log(inheritenceTree);
                    return JSON.stringify(inheritenceTree);
                })()}}`
            );
        },
        //So we know what to do with our code
        compileFunction: (workspace) => {
            return sugarcube.generator.workspaceToCode(workspace);
        },
    },
    {
        id: "glslShader",
        hasTranslation: true,
        stopCompileFileCreation: true,
        fileExtension: "glsl",
        //We do a function so that our translations work
        defaultBehavior: () => {
            return `//${editor.language["editor.window.typed.shaderMessage"]}
void vertex() {
    //${editor.language["editor.window.typed.vertexMessage"]}
}

void fragment() {
    //${editor.language["editor.window.typed.fragmentMessage"]}
}`;
        },

        compileFunction: (code, path) => {
            coffeeEngine.renderer.fileToShader(path, true);
            return code;
        }
    },
];
