/*
This file compiles everything into a single html file while adding the essential files.
It also makes an IN RAM filesystem.
So yeah this is just for people who can't/don't want to download the main editor
*/
const fs = require("fs");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

//Make this a thing.
if (!fs.existsSync("build")) {
    fs.mkdirSync("build");
    fs.mkdirSync("build/output");
}

//Check if the build name exists
if (!fs.existsSync("build/persist.txt")) {
    //If not ask
    console.log("Enter build name.\nWill be saved for later.\n");

    readline.question("Dev Prefix : ", (name) => {
            //Save for later builds
            fs.appendFileSync("build/persist.txt", `${name}\n0`, (err) => {
            if (err) {
                console.log("Name saving failed");
            } else {
                console.log("Name saved");
                build();
            }
        });
    });
}
else {
    build();
}

function toDataUri(imgPath) {
    const bitmap = fs.readFileSync(imgPath);
    const base64Image = Buffer.from(bitmap).toString('base64');
    // Get image file extension
    const ext = imgPath.split('.').pop();
    return `data:image/${ext};base64,${base64Image}`;
}

function build() {
    //Get build data
    const buildData = fs.readFileSync("build/persist.txt", {
        encoding: "utf8",
        flag: "r",
    }).split("\n");

    //Make a virtual filesystem
    const inRamFS = {};
    fs.readdirSync("src",{recursive:true}).forEach(filePath => {
        filePath = filePath.replaceAll("\\","/");
        if (filePath.includes(".") && !(filePath.includes(".js") || filePath.includes(".html") || filePath.includes(".css"))) {
            let thing = inRamFS;
            filePath.split("/").forEach(split => {
                console.log(split);
                if (split.includes(".")) {
                    thing[split] = toDataUri("src/"+filePath);
                } 
                else {
                    if (!thing[split]) {
                        console.log(split);
                        thing[split] = {};
                    }
                    thing = thing[split];
                }
            })
        }
    });

    //Turn the build number into a number
    buildData[1] = Number(buildData[1]);
    buildData[1] += 1;

    //Then save the new build number
    fs.writeFileSync("build/persist.txt", `${buildData[0]}\n${buildData[1]}`, (err) => {
        if (err) {
            console.log("Name saving failed");
        } else {
            console.log("Name saved");
        }
    });
    
    //Notify that the build has started
    console.log("Build start");
    console.log(`Build Number ${buildData[1]}`);

    //Get the main html file.
    let html = fs.readFileSync("src/editor.html", {
        encoding: "utf8",
        flag: "r",
    });

    //Grab our CSS
    const cssStyles = html.match(/<link.*rel="stylesheet".*href=".*".*\/>/g);
    let newHead = "<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n<title>Coffee Engine</title>\n";
    cssStyles.forEach(style => {
        const stylePath = style.replace(/<link.*rel="stylesheet".*href="/,"").replace(/".*\/>/,"");
        let styleFile = fs.readFileSync(`src/${stylePath}`, {
            encoding: "utf8",
            flag: "r",
        });
        newHead += `<style>\n${styleFile}</style>\n`;
    })

    //Grab our scripts and get ready to add the new body stuff.
    const scripts = ["htmlCompilationCompat/inEditorFS.js","htmlCompilationCompat/customDomBehavior.js"];
    scripts.push(...html.match(/<script.*src="[\w\d\s\/.]*".*><\/script>/g));

    //Body building!
    let newBody = `<script>\nwindow.editorFSObject = ${JSON.stringify(inRamFS)}\n</script>\n`;
    scripts.forEach(script => {
        const scriptPath = script.replace(/<script.*src=\"/,"").replace(/".*><\/script>/,"");
        let scriptFile = fs.readFileSync(`src/${scriptPath}`, {
            encoding: "utf8",
            flag: "r",
        });

        newBody += `<script>\n${scriptFile}\n</script>\n`
    })

    html = html.replaceAll(/<body>[\w\d\s\n\t."'<>\/=!\-]*<\/body>/g,`<body>\n${newBody}</body>`).replaceAll(/<head>[\w\d\s\n\t."'<>\/=!\-+:;,=]*<\/head>/g,`<head>${newHead}</head>`);

    fs.appendFileSync(`build/output/${buildData[0]}_${buildData[1]}.html`, html, (err) => {
        if (err) {
            console.log("Compilation failed");
        } else {
            console.log("Compilation finished!");
        }
    });

    process.exit();
}