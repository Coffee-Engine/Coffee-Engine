(function () {
    const fileReader = new FileReader();

    editor.windows.markdownReader = class extends editor.windows.base {
        parseMD(code) {
            this.Content.innerHTML = marked.parse(code);

            //Now we need to parse and add our code
            Array.from(this.Content.getElementsByTagName("code")).forEach((codeElement) => {
                //Get our language from the code element
                let lang = codeElement.className.split("-");
                lang.splice(0, 1);

                //Join it back and make sure its lowercase
                lang = lang.join("-").toLowerCase();

                monaco.editor.colorize(codeElement.innerText, editor.languageRedirects[lang] || lang).then((html) => {
                    codeElement.innerHTML = `${html}`;
                });
            });

            //Then we do the same for images but use the local FS to fetch
            Array.from(this.Content.getElementsByTagName("img")).forEach((imageElement) => {
                if (imageElement.src.startsWith("localfile://")) {
                    project.getFile(imageElement.src.replace("localfile://", "")).then((file) => {
                        imageElement.src = window.URL.createObjectURL(file);
                    });
                }
            });
        }
    };

    const openMD = (path) => {
        //Add oru reader window
        const readerWindow = new editor.windows.markdownReader(400, 400);
        readerWindow.x = window.innerWidth / 2 - 200;
        readerWindow.y = window.innerHeight / 2 - 200;
        readerWindow.title = path;
        readerWindow.__moveToTop();

        project.getFile(path).then((file) => {
            fileReader.onload = () => {
                readerWindow.parseMD(fileReader.result);
            };

            fileReader.readAsText(file);
        });
    };

    editor.addFileOpenHook("md", openMD, this);
    editor.addFileOpenHook("markdown", openMD, this);
})();
