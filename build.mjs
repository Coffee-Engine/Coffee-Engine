/*
This file compiles everything into a single html file while adding the essential files.
It also makes an IN RAM filesystem.
So yeah this is just for people who can't/don't want to download the main editor

use node build.mjs
*/

//Import our build tools
import htmlBuilder from "./src/buildTools/buildHtml.mjs";
//Add our build tools here
const buildTools = [htmlBuilder];


import {colors, colorLog} from "./src/buildTools/helperFunctions.mjs";
import * as fs from 'fs';
import * as readlineLib from 'readline';

const readline = readlineLib.createInterface({
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
    colorLog("Enter build name. Will be saved for later.\x1b[0m \n",colors.BackGreen);

    readline.question("\x1b[32m Dev Prefix \x1b[0m: ", (name) => {
            //Save for later builds
            fs.appendFileSync("build/persist.txt", `${name}\n0`, (err) => {
            if (err) {
                colorLog("Name saving failed",colors.BackRed);
            } else {
                colorLog("Name saved",colors.BackGreen);
                build();
            }
        });
    });
}
else {
    build();
}

function build() {
    //Get build data
    const buildData = fs.readFileSync("build/persist.txt", {
        encoding: "utf8",
        flag: "r",
    }).split("\n");

    //Turn the build number into a number
    buildData[1] = Number(buildData[1]);
    buildData[1] += 1;

    //Then save the new build number
    fs.writeFileSync("build/persist.txt", `${buildData[0]}\n${buildData[1]}`, (err) => {
        if (err) {
            colorLog("Data saving failed",colors.BackRed);
        } else {
            colorLog("Data saved",colors.BackGreen);
        }
    });
    
    //Notify that the build has started
    colorLog("Build start",colors.Green);
    colorLog(`Build Number ${buildData[1]}`,colors.Cyan);

    //Get the main html file.
    let html = fs.readFileSync("src/editor.html", {
        encoding: "utf8",
        flag: "r",
    });

    buildTools[0].BUILD(html,buildData);

    process.exit();
}