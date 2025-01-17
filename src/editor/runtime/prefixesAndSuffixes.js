(function() {
    editor.runtime.prefixes = [
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coffee Engine (Testing)</title>
</head>
<body>
    <canvas id="coffeeEngine_MainCanvas" width="640" height="480"></canvas>\n`,
    ]

    editor.runtime.suffixes = [
        `</body></html>`
    ]
})()