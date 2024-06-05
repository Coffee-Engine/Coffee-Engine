(function () {
  sugarcube.BlockType = {
    REPORTER: "reporter",

    HAT: "hat",

    BOOLEAN: "boolean",

    OBJECT: "object",

    //These three are the same internally they are just there for scratch compatibility...
    CONDITIONAL: "command",
    LOOP: "command",
    COMMAND: "command",

    TERMINAL: "terminal",

    BUTTON: "button",

    LABEL: "label",

    DUPLICATE: "duplicate",

    INLINE: "inline",
  };

  sugarcube.ArgumentType = {
    STRING: "string",

    BOOLEAN: "boolean",

    CUSTOM: "custom",

    NUMBER: "number",

    COLOR: "color",

    IMAGE: "image",

    DUMMY: "dummy",

    STATEMENT: "statement",
  };

  sugarcube.ArgumentDefaultValues = {
    boolean: false,

    number: 0,

    color: "#ff0000",
  }

  sugarcube.ArgumentShadowConversions = {
    string: "__sugarcube_string_reporter",

    number: "__sugarcube_number_reporter",

    color: "__sugarcube_color_reporter",
  };
})();
