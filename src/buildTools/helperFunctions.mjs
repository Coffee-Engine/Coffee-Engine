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

//Stolen from https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types
//Want to make this use as little 3rd party libraries as possible
//And I'm only including fileTypes I THINK will get compiled into an html build
const extensionToType = {
    jpeg:"image/jpeg",
    jpg:"image/jpeg",
    gif:"image/gif",
    bmp:"image/bmp",
    apng:"image/apng",
    avif:"image/avif",
    ico:"image/vnd.microsoft.icon",
    png:"image/png",
    tif:"image/tiff",
    tiff:"image/tiff",
    webp:"image/webp",
    svg:"image/svg+xml",

    js:"text/javascript",
    json:"application/json",
    zip:"application/zip",

    htm:"text/html",
    html:"text/html",

    aac:"audio/aac",
    mp3:"audio/mpeg",
    ogg:"audio/ogg",
    opus:"audio/ogg",
    wav:"audio/wav",

    mp4:"video/mp4",
    webm:"video/webm",
}

function toDataUri(imgPath) {
    const bitmap = fs.readFileSync(imgPath);
    const base64Image = Buffer.from(bitmap).toString('base64');
    // Get image file extension
    const ext = imgPath.split('.').pop();
    //If you don't have a valid excuse we will say you are a jpeg
    return `data:${extensionToType[ext.toLowerCase()] || "image/jpeg"};base64,${base64Image}`;
}

export {colors, colorLog, toDataUri};