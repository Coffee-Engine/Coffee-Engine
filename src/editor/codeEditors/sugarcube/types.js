(function () {
    sugarcube.BlockType = {
        REPORTER: "reporter",

        HAT: "hat",
        PROCEDURE_DEFINITION: "procedure_def",

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

        ANGLE: "__sugarcube_field_motion_Angle",

        STATEMENT: "statement",

        OBJECT: "object",
        ARRAY: "array",
    };

    sugarcube.ArgumentDefaultValues = {
        boolean: false,

        multiline: "Hello\nWorld!",

        number: 0,

        color: "#ff0000",
    };

    sugarcube.ArgumentShadowConversions = {
        string: "__sugarcube_string_reporter",
        multiline: "__sugarcube_multiline_string_reporter",

        number: "__sugarcube_number_reporter",

        color: "__sugarcube_color_reporter",
    };
})();
