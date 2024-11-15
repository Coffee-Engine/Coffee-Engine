marked.use({
    name: 'heading',
    renderer: {
        image: ({ href }) => {
            if (project.fileExists(href)) return `<img src="localFile://${href}"></img>`;

            return `<img src="${href}"></img>`
        }
    }
});