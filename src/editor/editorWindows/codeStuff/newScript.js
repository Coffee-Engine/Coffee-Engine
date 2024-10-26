(function () {    
    editor.windows.newScript = class extends editor.windows.base {
        defaults = {
            js: `//${editor.language["editor.window.javascript.commentMessage"]}
class behavior {
    ready() {
        //Code for each frame goes here
        console.log("Hello World!");
    }

    update() {
        //Code for each frame goes here
    }

    //If you want custom draw code
    //Uncomment this
    //draw() {
    //    //Draw Code Here
    //}
}
    
coffeeEngine.registerBehavior("behavior",behavior);`
        }

        minWidth = 400;
        minHeight = 200;

        init(container) {
            this.resizable = false;
            this.title = editor.language["editor.window.createScript"];

            container.style.display = "grid";
            container.style.gridTemplateRows = "66px 66px 66px";

            this.type = document.createElement("select");
            this.type.innerHTML = `
                <option value="js">${editor.language["editor.window.javascript"]} (js)</option>
                <option value="cescr">${editor.language["editor.window.sugarcube"]} (cescr)</option>
            `
            this.type.style.margin = "16px";
            this.type.style.marginLeft = "50px";
            this.type.style.marginRight = "50px";

            this.type.onchange = () => {
                this.path.value = `${this.path.value.split(".")[0]}.${this.type.value}`;
            }

            this.path = document.createElement("input");
            this.path.type = "text";
            this.path.value = "scripts/newScript.js";
            this.path.style.margin = "16px";
            this.path.style.marginLeft = "50px";
            this.path.style.marginRight = "50px";

            this.createButton = document.createElement("button");
            this.createButton.innerHTML = editor.language["engine.generic.done"];
            this.createButton.style.margin = "16px";
            this.createButton.style.marginLeft = "100px";
            this.createButton.style.marginRight = "100px";

            this.createButton.onclick = () => {
                console.log(this.path.value.split("/"));

                if (!project.getFile(this.path.value)) project.setFile(this.path.value, this.defaults[this.type.value],"text/javascript", (path) => {
                    editor.sendFileHook(path.split(".")[1],path);
                    this._dispose();
                });
            }

            container.appendChild(this.type);
            container.appendChild(this.path);
            container.appendChild(this.createButton);
        }
    }
})()
