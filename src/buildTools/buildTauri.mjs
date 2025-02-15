import { colors, colorLog, toDataUri } from "./helperFunctions.mjs";
import * as child from "child_process";
import * as fs from "fs";
import promisify from "util";

const TauriExport = {
    DISPLAY_NAME: `${colors.Cyan}Tau${colors.Yellow}ri ${colors.Blue} (Current Platform)`,
    BUILD: async (html, buildData) => {
        const tauriConfig = JSON.parse(
            fs.readFileSync("src-tauri/tauri.conf.json", {
                encoding: "utf8",
                flag: "r",
            })
        );

        //Configure the version number
        tauriConfig.version = `0.${buildData[1]}.0`;
        fs.writeFileSync("src-tauri/tauri.conf.json", JSON.stringify(tauriConfig), (err) => {
            if (err) {
                colorLog("Version saving failed", colors.BackRed);
            } else {
                colorLog("Version saved", colors.BackGreen);
            }
        });

        //build the executable
        //This part is outta my hands
        console.log("Building, this may take a bit");
        child.execSync("npm run tauri build", { stdio: 'inherit' });
        console.log("Build complete!");
    },
};

export default TauriExport;
