editor.quickCSS = (element, css) => {
    if (Array.isArray(element)) {
        for (let elID in element) {
            editor.quickCSS(element[elID], css);
        }
    }

    if (!(element instanceof HTMLElement)) return element;

    for (let key in css) {
        element.style[key] = css[key];
    }

    return element;
}