import * as fs from 'fs';

const colors = {
    Black:"\x1b[30m",
    Red:"\x1b[31m",
    Green:"\x1b[32m",
    Yellow:"\x1b[33m",
    Blue:"\x1b[34m",
    Magenta:"\x1b[35m",
    Cyan:"\x1b[36m",
    White:"\x1b[37m",

    BackBlack:"\x1b[30m",
    BackRed:"\x1b[31m",
    BackGreen:"\x1b[32m",
    BackYellow:"\x1b[33m",
    BackBlue:"\x1b[34m",
    BackMagenta:"\x1b[35m",
    BackCyan:"\x1b[36m",
    BackWhite:"\x1b[37m",
};

//Just so we can have our colors setup properly
const colorLog = (content,color) => {
    console.log(`${color}${content}\x1b[0m`);
}

function toDataUri(imgPath) {
    const bitmap = fs.readFileSync(imgPath);
    const base64Image = Buffer.from(bitmap).toString('base64');
    // Get image file extension
    const ext = imgPath.split('.').pop();
    return `data:image/${ext};base64,${base64Image}`;
}

export {colors, colorLog, toDataUri};