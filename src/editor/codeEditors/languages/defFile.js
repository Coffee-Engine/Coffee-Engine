//Definition File for showing languages in CE
window.programmingLanguages = [
    {
        id:"javascript",
        hasTranslation:true,
        useBlocklyEditor: false,
        fileExtension: "js",
        //We do a function so that our translations work
        defaultBehavior: () => {
            return `//${editor.language["editor.window.typed.commentMessage"]}
class behavior {
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
    
coffeeEngine.registerBehavior("behavior",behavior);`;
        },
    },
    {
        id:"cappuccino",
        hasTranslation:true,
        useBlocklyEditor: false,
        fileExtension: "cappu",
        //We do a function so that our translations work
        defaultBehavior: () => {
            return `//${editor.language["editor.window.typed.commentMessage"]}
class behavior contains
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

coffeeEngine.registerBehavior("behavior",behavior)`;
        },

        //So we know what to do with our code
        compileFunction:(code) => {
            return cappuccino.compile(code);
        }
    },
    {
        id:"sugarcube",
        hasTranslation:true,
        useBlocklyEditor: true,
        fileExtension: "cescr",
        //Sugarcube's is the most bare bones
        defaultBehavior: () => { return '{"code":{"blocks":{"languageVersion":0,"blocks":[{"type":"events_onStart","id":"ths{fk?x7MsmGG^g`k@I","x":379,"y":140}]}},"variables":{},"customBlocks":{}}'},
        //So we know what to do with our code
        compileFunction:(workspace) => {
            return sugarcube.generator.workspaceToCode(workspace);
        }
    }
]