editor.fileTypeDefs = [
    {
        id: "blank",
        fileExtension: "txt",
        contents: "",
        hasTranslation: true,
    },
    {
        id: "json",
        fileExtension: "json",
        contents: "{}",
        hasTranslation: true,
    },
    {
        id: "material",
        fileExtension: "material",
        contents: "{}",
        hasTranslation: true,
    }
];

editor.findFileTypeFromExtension = (extension) => {
    //Filter out languages until we find ours
    const fileType = editor.fileTypeDefs.filter((data) => {
        return data.fileExtension == extension;
    })[0];

    return (
        fileType || {
            id: "unknown",
            contents: "",
            fileExtension: "",
            hasTranslation: false,
        }
    );
}