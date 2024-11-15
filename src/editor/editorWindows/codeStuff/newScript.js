(function () {
    editor.windows.newScript = class extends editor.windows.base {
        defaults = {
            js: `//${editor.language["editor.window.typed.commentMessage"]}
class behavior {
    ready() {
        //Code for initilization goes here.
        console.log("Hello World!");
    }

    update(delta) {
        //Code for each frame goes here
    }

    //If you want custom draw code
    //Uncomment this
    //draw() {
    //    //Draw Code Here
    //}
}
    
coffeeEngine.registerBehavior("behavior",behavior);`,
            //Sugarcube
            cescr: '{"code":{"blocks":{"languageVersion":0,"blocks":[{"type":"events_onStart","id":"ths{fk?x7MsmGG^g`k@I","x":379,"y":140}]}},"variables":{},"customBlocks":{}}',
            cappu: `//${editor.language["editor.window.typed.commentMessage"]}
class behavior contains
    function ready()
        //${editor.language["editor.window.typed.initMessage"]}
        console.log("Hello World!")
    end

    function update(delta)
        //${editor.language["editor.window.typed.updateMessage"]}
    end

    //${editor.language["editor.window.typed.drawUncommentMessage"]}
    //function draw()
    //    //${editor.language["editor.window.typed.drawMessage"]}
    //end
end
    
coffeeEngine.registerBehavior("behavior",behavior)`
        };

        minWidth = 400;
        minHeight = 200;

        init(container) {
            console.log(this);
            this.resizable = false;
            this.title = editor.language["editor.window.createScript"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "66px 66px 66px";

            //This dropdown is where we select our programming language
            this.type = document.createElement("select");
            this.type.innerHTML = `
                <option value="js">${editor.language["editor.window.javascript"]} (js)</option>
                <option value="cappu">${editor.language["editor.window.cappuccino"]} (cappu)</option>
                <option value="cescr">${editor.language["editor.window.sugarcube"]} (cescr)</option>
            `;
            this.type.style.margin = "16px";
            this.type.style.marginLeft = "50px";
            this.type.style.marginRight = "50px";

            this.type.onchange = () => {
                this.path.value = `${this.path.value.split(".")[0]}.${this.type.value}`;
            };

            //This is our file path
            this.path = document.createElement("input");
            this.path.type = "text";
            this.path.value = "scripts/newScript.js";
            this.path.style.margin = "16px";
            this.path.style.marginLeft = "50px";
            this.path.style.marginRight = "50px";

            //And this button creates the script
            this.createButton = document.createElement("button");
            this.createButton.innerHTML = editor.language["engine.generic.done"];
            this.createButton.style.margin = "16px";
            this.createButton.style.marginLeft = "100px";
            this.createButton.style.marginRight = "100px";

            this.createButton.onclick = () => {
                //This might be the one reason I actually look for a catch :Skull Emoji:
                project.getFile(this.path.value).catch((reason) => {
                    project.setFile(this.path.value, this.defaults[this.type.value], "text/javascript").then((path) => {
                        editor.sendFileHook(path.split(".")[1], path);
                        this._dispose();
                    });
                });
            };

            container.appendChild(this.type);
            container.appendChild(this.path);
            container.appendChild(this.createButton);
        }
    };
})();
