/*
This file compiles everything into a single html file while adding the essential files.
It also makes an IN RAM filesystem.
So yeah this is just for people who can't/don't want to download the main editor

use node build.mjs
*/

//Import our build tools
import htmlBuilder from "./src/buildTools/buildHtml.mjs";
import tauriBuilder from "./src/buildTools/buildTauri.mjs";
import electronBuilder from "./src/buildTools/buildElectron.mjs";
//Add our build tools here
const buildTools = [htmlBuilder, electronBuilder, tauriBuilder];

import { colors, colorLog } from "./src/buildTools/helperFunctions.mjs";
import * as fs from "fs";
import * as readlineLib from "readline";

const readline = readlineLib.createInterface({
    input: process.stdin,
    output: process.stdout,
});

//Make this a thing.
if (!fs.existsSync("out")) {
    fs.mkdirSync("out");
    fs.mkdirSync("out/html");
}

//Check if the build name exists
if (!fs.existsSync("out/persist.txt")) {
    //If not ask
    colorLog("Enter build name. Will be saved for later.\x1b[0m \n", colors.BackGreen);

    readline.question("\x1b[32m Dev Prefix \x1b[0m: ", (name) => {
        //Save for later builds
        fs.appendFileSync("out/persist.txt", `${name}\n0`, (err) => {
            if (err) {
                colorLog("Name saving failed", colors.BackRed);
            } else {
                colorLog("Name saved", colors.BackGreen);
                build();
            }
        });
    });
} else {
    build();
}

function build() {
    //Get build data
    const buildData = fs
        .readFileSync("out/persist.txt", {
            encoding: "utf8",
            flag: "r",
        })
        .split("\n");

    //Turn the build number into a number
    buildData[1] = Number(buildData[1]);
    buildData[1] += 1;

    //Then save the new build number
    fs.writeFileSync("out/persist.txt", `${buildData[0]}\n${buildData[1]}`, (err) => {
        if (err) {
            colorLog("Data saving failed", colors.BackRed);
        } else {
            colorLog("Data saved", colors.BackGreen);
        }
    });

    colorLog("What would you like to build for?", colors.BackCyan);
    for (let i = 0; i < buildTools.length; i++) {
        const tools = buildTools[i];
        console.log(`[${i}] : ${tools.DISPLAY_NAME}\x1b[0m`);
    }

    readline.question("\x1b[32m Build Type Number \x1b[0m: ", (buildTool) => {
        //Scan for valid stuff
        let typeNumber = Number(buildTool);
        if (isNaN(typeNumber) || !isFinite(typeNumber)) {
            colorLog(`Invalid Index! ${typeNumber}`, colors.BackRed);
            process.exit();
        }

        //Make sure the number is valid.
        if (!buildTools[typeNumber]) {
            colorLog(`Invalid Index! ${typeNumber}`, colors.BackRed);
            process.exit();
        }

        //Notify that the build has started
        colorLog("Build start", colors.Green);
        colorLog(`Build Number ${buildData[1]}`, colors.Cyan);

        //Get the main html file.
        let html = fs.readFileSync("src/index.html", {
            encoding: "utf8",
            flag: "r",
        });

        buildTools[typeNumber].BUILD(html, buildData);

        process.exit();
    });
}
