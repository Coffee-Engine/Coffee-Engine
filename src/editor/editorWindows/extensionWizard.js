(function() {
    editor.windows.extensionWizard = class extends editor.windows.base {
        minWidth = 400;
        minHeight = 400;

        nameRegex = /([^A-Za-z_123456789\-])/g

        extensionData = {
            extensionName: "",
            authorName: "",
            version: "",

            hasScript: true,
            hasEditorScript: false,
            hasNode: false,
            hasSugarcubeBlocks: false,
            hasWindow: false,
        }

        //Just a macro to quickly create coffee translation data
        quickCreateTranslation(page) {
            return {
                preprocess: (item) => {
                    item.text = editor.language[`editor.window.extensionWizard.${page}.${item.key}`] || item.key;

                    if (item.type == "string") item.placeholder = editor.language[`editor.window.extensionWizard.${page}.${item.key}.placeholder`] || item.placeholder || "";

                    return item;
                }
            };
        }

        //This is so that we can get our pages on init.
        get pages() {
            return [
                (container) => {
                    const beginningSpawl = document.createElement("p");
                    beginningSpawl.innerText = editor.language["editor.window.extensionWizard.firstPage"];
                    container.appendChild(beginningSpawl);
                },

                (container) => {
                    container.appendChild(CUGI.createList([
                        {target: this.extensionData, key: "extensionName", type: "string", placeholder: "Extension"},
                        {target: this.extensionData, key: "authorName", type: "string", placeholder: "Author"},
                        "---",
                        {target: this.extensionData, key: "version", type: "string", placeholder: "1.0.0"},
                    ], this.quickCreateTranslation("secondPage")));
                },
                
                (container) => {
                    const beginningSpawl = document.createElement("p");
                    beginningSpawl.innerText = editor.language["editor.window.extensionWizard.thirdPage"];
                    container.appendChild(beginningSpawl);

                    container.appendChild(CUGI.createList([
                        {target: this.extensionData, key: "hasScript", type: "boolean"},
                        {target: this.extensionData, key: "hasEditorScript", type: "boolean"},
                        {target: this.extensionData, key: "hasNode", type: "boolean"},
                        {target: this.extensionData, key: "hasSugarcubeBlocks", type: "boolean"},
                        {target: this.extensionData, key: "hasWindow", type: "boolean"},
                    ], this.quickCreateTranslation("thirdPage")));
                }
            ];
        }

        init(contents) {
            //Yeah
            this.progress = 0;
            contents.style.overflow = "hidden";
            
            //Create our window contents
            this.dockable = false;
            this.resizable = false;
            contents.style.display = "grid";
            contents.style.gridTemplateRows = "64px auto 24px";

            this.title = editor.language["editor.window.extensionWizard"];

            this.topArea = document.createElement("div");
            this.topArea.style.width = "100%";
            this.topArea.style.display = "grid";
            this.topArea.style.gridTemplateRows = "56px 8px";
            this.topArea.style.backgroundColor = "var(--background-2)";
            contents.appendChild(this.topArea);

            this.infoContainer = document.createElement("div");
            this.infoContainer.style.width = "100%";
            this.infoContainer.style.display = "flex";
            this.topArea.appendChild(this.infoContainer);

            //Create Salem.svg;
            this.ourWizard = document.createElement("img");
            this.ourWizard.src = coffeeEngine.wizardImage;
            this.ourWizard.style.height = "100%";
            this.infoContainer.appendChild(this.ourWizard);

            this.progressBar = document.createElement("div");
            this.progressBar.className = "progressBar";
            this.topArea.appendChild(this.progressBar);

            this.progressBarInner = document.createElement("div");
            this.progressBarInner.className = "progressBar-inner";
            this.progressBar.appendChild(this.progressBarInner);

            this.inputContainer = document.createElement("div");
            contents.appendChild(this.inputContainer);

            //Displays the controls for the popup
            this.controlContainer = document.createElement("div");
            this.controlContainer.style.display = "flex";
            this.controlContainer.style.flexDirection = "row-reverse";
            contents.appendChild(this.controlContainer);
            
            //The next button
            this.nextButton = document.createElement("button");
            this.nextButton.style.height = "100%";
            this.nextButton.innerText = editor.language["editor.window.extensionWizard.next"];
            this.nextButton.onclick = () => {
                if (this.pages[this.progress + 1]) {
                    this.progressMenu(1);
                }
                else this.createExtension();
            }

            //The previous button
            this.previousButton = document.createElement("button");
            this.previousButton.style.height = "100%";
            this.previousButton.innerText = editor.language["editor.window.extensionWizard.previous"];
            this.previousButton.onclick = () => {this.progressMenu(-1)}

            //Add the buttons to the control container
            this.controlContainer.appendChild(this.nextButton);
            this.controlContainer.appendChild(this.previousButton);

            this.progressMenu(0);
        }

        progressMenu(value) {
            if (this.pages[this.progress + value]) {
                this.inputContainer.innerHTML = "";
                this.progress += value;
                this.pages[this.progress](this.inputContainer);
                this.progressBarInner.style.setProperty("--progress", `${((this.progress + 1) / this.pages.length) * 100}%`);
            }
        }

        //The actual creation stuff
        async createExtension() {
            const extensionJSON = {
                "author": this.extensionData.authorName || "author",
                "name": this.extensionData.extensionName || "extension",
                "version": this.extensionData.version || "1.0.0",
                "scripts": [],
                "editorScripts": [],
            }

            const fsName = extensionJSON.name.replaceAll(this.nameRegex, "_");
            const loadedText = editor.language["editor.window.extensionWizard.logText"].replace("[name]", extensionJSON.name)

            //If we have an engine script generate it
            if (this.extensionData.hasScript) {
                extensionJSON.scripts.push("engine.js");
                await project.setFile(
                    `extensions/${fsName}/engine.js`, 
                    editor.extensionTemplates.EngineScript(extensionJSON.name, loadedText), 
                    "application/text"
                );
            }
            
            //If we have an editor script generate it
            if (this.extensionData.hasEditorScript) {
                extensionJSON.editorScripts.push("editor.js");
                await project.setFile(
                    `extensions/${fsName}/editor.js`, 
                    editor.extensionTemplates.EditorScript(extensionJSON.name, loadedText), 
                    "application/text"
                );
            }
            
            //If we have a node
            if (this.extensionData.hasNode) {
                extensionJSON.scripts.push("node.js");
                await project.setFile(
                    `extensions/${fsName}/node.js`, 
                    editor.extensionTemplates.Node(), 
                    "application/text"
                );
            }
            
            //If we have sugarcube blocks add the script
            if (this.extensionData.hasSugarcubeBlocks) {
                extensionJSON.editorScripts.push("sugarcubeExt.js");
                await project.setFile(
                    `extensions/${fsName}/sugarcubeExt.js`, 
                    editor.extensionTemplates.SugarcubeBlocks(`${extensionJSON.author.replaceAll(this.nameRegex, "_")}_${fsName}`, extensionJSON.name), 
                    "application/text"
                );
            }
            
            //If we have an editor script generate it
            if (this.extensionData.hasWindow) {
                extensionJSON.editorScripts.push("window.js");
                await project.setFile(
                    `extensions/${fsName}/window.js`, 
                    editor.extensionTemplates.Window(), 
                    "application/text"
                );
            }

            await project.setFile(
                `extensions/${fsName}/extension.json`, 
                JSON.stringify(extensionJSON)
                .replaceAll(",", ",\n")
                .replaceAll("{", "{\n")
                .replaceAll("}", "\n}") 
                .replaceAll("[", "[\n") 
                .replaceAll("]", "\n]"), 
                "application/text"
            );

            //Make sure we load the extension
            await project.extensions.checkForExtensions();

            this._dispose();
        }
    }
})()