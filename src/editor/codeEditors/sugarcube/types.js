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

    INLINE: "inline",

    REPORTER_ANY: "reporter_any",
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
