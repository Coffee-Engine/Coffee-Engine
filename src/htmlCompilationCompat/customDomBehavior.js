(function() {
    //Probably a better way to do this somewhere...
    //I don't know though
    const observer = new MutationObserver(() => {
        Array.from(document.body.getElementsByTagName("img")).forEach(img => {
            console.log(img);
            const src = img.getAttribute("src");
            if (!(
                src.startsWith("http://") || 
                src.startsWith("https://") ||
                src.startsWith("data:image/")
            )) {
                console.log(img.src);
                img.src = window.editorFS.find(src);
            }
        });
    })
    observer.observe(document.body,{childList: true})
})();