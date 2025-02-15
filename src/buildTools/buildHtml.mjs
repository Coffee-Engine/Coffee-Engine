import { colors, colorLog, toDataUri } from "./helperFunctions.mjs";
import * as fs from "fs";

const HTMLExport = {
    DISPLAY_NAME: `${colors.Yellow}Single HTML file ${colors.Red}(EXPERIMENTAL)`,
    BUILD: (html, buildData) => {
        //Make a virtual filesystem
        const inRamFS = {};
        fs.readdirSync("src", { recursive: true }).forEach((filePath) => {
            filePath = filePath.replaceAll("\\", "/");
            //Exclude anything from BuildTools, and compilation COMPAT!
            if (filePath.includes("buildTools/") || filePath.includes("htmlCompilationCompat/")) return;

            //Make sure we are including all files, besides HTML and CSS
            if (filePath.includes(".") && !(filePath.includes(".html") || filePath.includes(".css"))) {
                let thing = inRamFS;

                //Break down the path and find the file
                filePath.split("/").forEach((split) => {
                    if (split.includes(".")) {
                        //Log our filepath
                        console.log(`added "src/${filePath}" to internal FS`);
                        thing[split] = toDataUri("src/" + filePath);
                    } else {
                        if (!thing[split]) {
                            thing[split] = {};
                        }
                        thing = thing[split];
                    }
                });
            }
        });

        //Grab our CSS
        const cssStyles = html.match(/<link.*rel="stylesheet".*href=".*".*\/>/g);
        let newHead = '<meta charset="UTF-8" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n<title>Coffee Engine</title>\n';
        cssStyles.forEach((style) => {
            //Find our css file and read, then inject it
            const stylePath = style.replace(/<link.*rel="stylesheet".*href="/, "").replace(/".*\/>/, "");
            let styleFile = fs.readFileSync(`src/${stylePath}`, {
                encoding: "utf8",
                flag: "r",
            });
            newHead += `<style>\n${styleFile}</style>\n`;
            //Notify the compilee
            console.log(`added "src/${stylePath}" to built`);
        });

        //Grab our scripts and get ready to add the new body stuff.
        const scripts = ["htmlCompilationCompat/inEditorFS.js", "htmlCompilationCompat/customDomBehavior.js"];
        scripts.push(...html.match(/<script.*src="[\w\d\s\/.]*".*><\/script>/g));

        //Body building!
        let newBody = `<script>\nwindow.editorFSObject = ${JSON.stringify(inRamFS)}\n</script>\n`;
        scripts.forEach((script) => {
            //Construct our script files
            const scriptPath = script.replace(/<script.*src=\"/, "").replace(/".*><\/script>/, "");
            let scriptFile = fs.readFileSync(`src/${scriptPath}`, {
                encoding: "utf8",
                flag: "r",
            });
            newBody += `<script>\n${scriptFile}\n</script>\n`;
            //Notify the compilee
            console.log(`added "src/${scriptPath}" to built`);
        });

        //Now we construct our html
        html = `<!doctype html><html lang="en"><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,height=device-height, initial-scale=1.0" /><title>Coffee Engine</title><head>${newHead}</head><body>${newBody}</body></html>`;

        //Add our file
        fs.appendFileSync(`out/html/${buildData[0]}_${buildData[1]}.html`, html, (err) => {
            if (err) {
                colorLog("Compilation failed", colors.BackRed);
            } else {
                colorLog("Compilation finished!", colors.BackGreen);
            }
        });
    },
};

export default HTMLExport;
