artimus.translate = (item, context) => {
    return editor.language[`artimus.${context}.${item}`] || item;
}