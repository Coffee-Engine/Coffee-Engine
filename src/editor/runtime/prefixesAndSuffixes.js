(function() {
    editor.runtime.prefixes = [
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coffee Engine (Testing)</title>
    <style>
        .coffeeCanvas {
            margin:0px;
            padding:0px;
            position:absolute;
            top:0px;
            left:0px
        }
    </style>
</head>
<body>
    <canvas id="coffeeEngine_MainCanvas" class="coffeeCanvas" width="640" height="480"></canvas>\n`,
    ]

    editor.runtime.suffixes = [
        `</body></html>`
    ]
})()