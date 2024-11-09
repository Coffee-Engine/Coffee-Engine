import { colors, colorLog, toDataUri } from "./helperFunctions.mjs";
import * as exec from "child_process";
import * as fs from "fs";

const ElectronExport = {
    DISPLAY_NAME: `${colors.BackBlue}Electron ${colors.Blue} (Current Platform)`,
    BUILD: (html, buildData) => {
        const tauriConfig = JSON.parse(
            fs.readFileSync("src-tauri/tauri.conf.json", {
                encoding: "utf8",
                flag: "r",
            })
        );

        //build the executable
        //This part is outta my hands
        console.log("Building, this may take a bit");
        exec.execSync("npm run make", (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
        });
        console.log("Build complete");
    },
};

export default ElectronExport;
