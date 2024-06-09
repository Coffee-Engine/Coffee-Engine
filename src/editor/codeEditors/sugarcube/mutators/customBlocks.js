(function () {
  Blockly.Extensions.registerMutator(
    "dragMutator",
    {
      saveExtraState: function () {},

      loadExtraState: function (state) {},

      mutationToDom: function () {
        if (!this.isInFlyout) this._shouldDuplicate_ = true;
        // You *must* create a <mutation></mutation> element.
        // This element can have children.
        const container = Blockly.utils.xml.createElement("mutation");
        container.setAttribute("customBlockData", JSON.stringify(this.customBlockData));
        return container;
      },

      domToMutation: function (xmlElement) {},

      updateShape_() {},
    },
    undefined
  );
})();
