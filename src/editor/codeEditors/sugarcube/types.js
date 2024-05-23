(function(){
  sugarcube.BlockType = {
    REPORTER: "reporter",

    HAT: "hat",

    BOOLEAN: "boolean",

    COMMAND: "command",

    TERMINAL: "terminal",

    BUTTON: "button",

    LABEL: "label",

    DUPLICATE: "duplicate",

    INLINE: "inline",

    //These two are the same internally
    CONDITIONAL: "conditional",
    LOOP: "conditional"
  }

  sugarcube.ArgumentType = {
    STRING: "string",

    BOOLEAN: "boolean",

    CUSTOM: "custom",

    NUMBER: "number",

    COLOR: "color",

    IMAGE: "image"
  }

  sugarcube.ArgumentShadowConversions = {
    string: "__sugarcube_string_reporter",

    number: "__sugarcube_number_reporter",

    color: "__sugarcube_color_reporter"
  }
})();