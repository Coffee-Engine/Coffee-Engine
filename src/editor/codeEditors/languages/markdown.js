//Loading js into monaco
(function () {
    monaco.languages.register({ id: "md" });

    monaco.languages.setMonarchTokensProvider("md", {
        defaultToken: "",
        tokenPostfix: ".md",

        // escape codes
        control: /[\\`*_\[\]{}()#+\-\.!]/,
        noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
        escapes: /\\(?:@control)/,

        // escape codes for javascript/CSS strings
        jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,

        // non matched elements
        empty: ["area", "base", "basefont", "br", "col", "frame", "hr", "img", "input", "isindex", "link", "meta", "param"],

        tokenizer: {
            root: [
                // markdown tables
                [/^\s*\|/, "@rematch", "@table_header"],

                // headers (with #)
                [/^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/, ["white", "keyword", "keyword", "keyword"]],

                // headers (with =)
                [/^\s*(=+|\-+)\s*$/, "keyword"],

                // headers (with ***)
                [/^\s*((\*[ ]?)+)\s*$/, "meta.separator"],

                // quote
                [/^\s*>+/, "comment"],

                // list (starting with * or number)
                [/^\s*([\*\-+:]|\d+\.)\s/, "keyword"],

                // code block (4 spaces indent)
                [/^(\t|[ ]{4})[^ ].*$/, "string"],

                // code block (3 tilde)
                [/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/, { token: "string", next: "@codeblock" }],

                // github style code blocks (with backticks and language)
                [/^\s*```\s*((?:\w|[\/\-#])+).*$/, { token: "string", next: "@codeblockgh", nextEmbedded: "$1" }],

                // github style code blocks (with backticks but no language)
                [/^\s*```\s*$/, { token: "string", next: "@codeblock" }],

                // markup within lines
                { include: "@linecontent" },
            ],

            table_header: [
                { include: "@table_common" },
                [/[^\|]+/, "identifier"], // table header
            ],

            table_body: [{ include: "@table_common" }, { include: "@linecontent" }],

            table_common: [
                [/\s*[\-:]+\s*/, { token: "keyword", switchTo: "table_body" }], // header-divider
                [/^\s*\|/, "comment.doc.keyword"], // opening |
                [/^\s*[^\|]/, "@rematch", "@pop"], // exiting
                [/^\s*$/, "@rematch", "@pop"], // exiting
                [
                    /\|/,
                    {
                        cases: {
                            "@eos": "keyword", // closing |
                            "@default": "keyword", // inner |
                        },
                    },
                ],
            ],

            codeblock: [
                [/^\s*~~~\s*$/, { token: "string", next: "@pop" }],
                [/^\s*```\s*$/, { token: "string", next: "@pop" }],
                [/.*$/, "comment.doc.keyword"],
            ],

            // github style code blocks
            codeblockgh: [
                [/```\s*$/, { token: "string", next: "@pop", nextEmbedded: "@pop" }],
                [/[^`]+/, "comment.doc.keyword"],
            ],

            linecontent: [
                // escapes
                [/&\w+;/, "string.escape"],
                [/@escapes/, "escape"],

                // various markup
                [/\b__([^\\_]|@escapes|_(?!_))+__\b/, "string"],
                [/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/, "string"],
                [/\b_[^_]+_\b/, "string"],
                [/\*([^\\*]|@escapes)+\*/, "string"],
                [/`([^\\`]|@escapes)+`/, "comment.doc.keyword"],

                // links
                [/\{+[^}]+\}+/, "delimiter.bracket"],
                [/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/, ["string", "", "string"]],
                [/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, "string"],

                // or html
                { include: "html" },
            ],

            // Note: it is tempting to rather switch to the real HTML mode instead of building our own here
            // but currently there is a limitation in Monarch that prevents us from doing it: The opening
            // '<' would start the HTML mode, however there is no way to jump 1 character back to let the
            // HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,
            // we cannot correctly tokenize it in that mode yet.
            html: [
                // html tags
                [/<(\w+)\/>/, "keyword"],
                [
                    /<(\w+)(\-|\w)*/,
                    {
                        cases: {
                            "@empty": { token: "keyword", next: "@tag.$1" },
                            "@default": { token: "keyword", next: "@tag.$1" },
                        },
                    },
                ],
                [/<\/(\w+)(\-|\w)*\s*>/, { token: "keyword" }],

                [/<!--/, "comment", "@comment"],
            ],

            comment: [
                [/[^<\-]+/, "comment.doc"],
                [/-->/, "comment", "@pop"],
                [/<!--/, "string.invalid"],
                [/[<\-]/, "comment.doc"],
            ],

            // Almost full HTML tag matching, complete with embedded scripts & styles
            tag: [
                [/[ \t\r\n]+/, "white"],
                [/(type)(\s*=\s*)(")([^"]+)(")/, ["type.identifier", "delimiter", "string", { token: "string", switchTo: "@tag.$S2.$4" }, "string"]],
                [/(type)(\s*=\s*)(')([^']+)(')/, ["type.identifier", "delimiter", "string", { token: "string", switchTo: "@tag.$S2.$4" }, "string"]],
                [/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/, ["type.identifier", "delimiter", "string"]],
                [/\w+/, "type.identifier"],
                [/\/>/, "keyword", "@pop"],
                [
                    />/,
                    {
                        cases: {
                            "$S2==style": {
                                token: "keyword",
                                switchTo: "embeddedStyle",
                                nextEmbedded: "text/css",
                            },
                            "$S2==script": {
                                cases: {
                                    $S3: {
                                        token: "keyword",
                                        switchTo: "embeddedScript",
                                        nextEmbedded: "$S3",
                                    },
                                    "@default": {
                                        token: "keyword",
                                        switchTo: "embeddedScript",
                                        nextEmbedded: "text/javascript",
                                    },
                                },
                            },
                            "@default": { token: "keyword", next: "@pop" },
                        },
                    },
                ],
            ],

            embeddedStyle: [
                [/[^<]+/, ""],
                [/<\/style\s*>/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
                [/</, ""],
            ],

            embeddedScript: [
                [/[^<]+/, ""],
                [/<\/script\s*>/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
                [/</, ""],
            ],
        },
    });
})();
