import { colors, colorLog, toDataUri } from "./helperFunctions.mjs";
import * as child from "child_process";

const ElectronExport = {
    DISPLAY_NAME: `${colors.BackBlue}Electron ${colors.Blue} (Current Platform)`,
    BUILD: (html, buildData) => {
        //build the executable
        //This part is outta my hands
        console.log("Building, this may take a bit");
        const process = child.spawn("npm run make", [], { stdio: 'inherit' });

        //process.stdout.on('data', (data) => {
        //    console.log(`G : ${data.toString()}`);
        //});

        //process.stderr.on('data', (data) => {
        //    console.log(`G : ${data.toString()}`);
        //});

        //process.on('exit', (data) => {
        //    console.log(`Build completed with ${data.toString()}`);
        //});
    },
};

export default ElectronExport;
