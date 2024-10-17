import {colors, colorLog, toDataUri} from "./helperFunctions.mjs";
import * as exec from "child_process";
import * as fs from 'fs';

const TuariExport = {
    windows:{
        DISPLAY_NAME:`${colors.Cyan}Tua${colors.Yellow}ri ${colors.Blue}Windows`,
        BUILD: (html, buildData) => {
            //Make a virtual filesystem
            const inRamFS = {};
            fs.readdirSync("src",{recursive:true}).forEach(filePath => {
                filePath = filePath.replaceAll("\\","/");
                //Exclude anything from BuildTools, and compilation COMPAT!
                if (filePath.includes("buildTools/") || filePath.includes("htmlCompilationCompat/")) return;

                if (filePath.includes(".") && !(filePath.includes(".html") || filePath.includes(".css"))) {
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
                    colorLog("Compilation failed",colors.BackRed);
                } else {
                    colorLog("Compilation finished!",colors.BackGreen);
                }
            });
        }  
    },
    linux:{
        DISPLAY_NAME:`${colors.Cyan}Tua${colors.Yellow}ri ${colors.Blue}Windows`,
        BUILD: (html, buildData) => {
            const tauriConfig = JSON.parse(fs.readFileSync("src-tauri/tauri.conf.json", {
                encoding: "utf8",
                flag: "r",
            }));

            //Configure the version number
            tauriConfig.version = `0.${buildData[1]}.0`;
            fs.writeFileSync("src-tauri/tauri.conf.json", JSON.stringify(tauriConfig), (err) => {
                if (err) {
                    colorLog("Version saving failed",colors.BackRed);
                } else {
                    colorLog("Version saved",colors.BackGreen);
                }
            });

            //build the executable
            //This part is outta my hands
            console.log("Building, this may take a bit")
            exec.execSync("npm run tauri build",(err, stdout, stderr) => {
                if (err) {
                 console.error(err);
                 return;
                }
                console.log(stdout);
            });
            console.log("Build complete");
        }  
    }
};


export default TuariExport;