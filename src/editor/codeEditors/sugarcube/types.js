(function () {
    sugarcube.BlockType = {
        REPORTER: "reporter",

        HAT: "hat",

        BOOLEAN: "boolean",

        OBJECT: "object",
        ARRAY: "array",

        //These three are the same internally they are just there for scratch compatibility...
        CONDITIONAL: "command",
        LOOP: "command",
        COMMAND: "command",

        TERMINAL: "terminal",

        BUTTON: "button",

        LABEL: "label",

        DUPLICATE: "duplicate",

        REPORTER_ANY: "reporter_any",

        FIELD_REPORTERACCEPTANCE: "Field_ReporterAcceptance",

        REFERENCE: "reference",
    };

    sugarcube.ArgumentType = {
        STRING: "string",
        MULTILINE: "multiline",

        BOOLEAN: "boolean",

        CUSTOM: "custom",

        NUMBER: "number",

        COLOR: "color",

        IMAGE: "image",

        DUMMY: "dummy",

        ANGLE: "angle",

        STATEMENT: "statement",

        OBJECT: "object",
        ARRAY: "array",

        REFERENCE: "reference",

        HOLE: "hole",
    };
})();
