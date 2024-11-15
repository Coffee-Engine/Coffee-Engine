editor.languageRedirects = {
    "json":"js",
    "cjs":"js",
    "markdown":"md",
}

editor.getLanguageDefFromExtension = (extension) => {
    extension = editor.languageRedirects[extension] || extension;
    //Filter out languages until we find ours
    const language = programmingLanguages.filter((data) => {return data.fileExtension == extension})[0];
    return language || {
        id:"unknown",
        hasTranslation:false,
        useBlocklyEditor: false,
        fileExtension: "",
        defaultBehavior: () => {return ""},
    };
}