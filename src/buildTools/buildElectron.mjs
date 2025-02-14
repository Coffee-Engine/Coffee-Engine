import { colors, colorLog, toDataUri } from "./helperFunctions.mjs";
import * as child from "child_process";
import promisify from "util";

const ElectronExport = {
    DISPLAY_NAME: `${colors.BackBlue}Electron ${colors.Blue} (Current Platform)`,
    BUILD: async (html, buildData) => {
        //build the executable
        //This part is outta my hands
        console.log("Building, this may take a bit");
        child.execSync("npm run make", { stdio: 'inherit' });
        console.log("Build complete!");
    },
};

export default ElectronExport;
