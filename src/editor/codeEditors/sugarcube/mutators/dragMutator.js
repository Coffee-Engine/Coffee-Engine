(function () {
  Blockly.Extensions.registerMutator(
    "dragMutator",
    {
      saveExtraState: function () {
        return {
          _isClone_: this._isClone_,
          _shouldDuplicate_: this._shouldDuplicate_,
        };
      },

      loadExtraState: function (state) {
        this._isClone_ = state["_isClone_"];
        this._shouldDuplicate_ = state["_shouldDuplicate_"];
        this.updateShape_();
      },

      mutationToDom: function () {
        if (!this._isClone_) this._shouldDuplicate_ = true;
        // You *must* create a <mutation></mutation> element.
        // This element can have children.
        const container = Blockly.utils.xml.createElement("mutation");
        container.setAttribute("cloneData", JSON.stringify({ _isClone_: this._isClone_, _shouldDuplicate_: this._shouldDuplicate_ }));
        return container;
      },

      domToMutation: function (xmlElement) {
        const parsed = JSON.parse(xmlElement.getAttribute("cloneData"));
        this._isClone_ = parsed._isClone_;
        this._shouldDuplicate_ = parsed._shouldDuplicate_;
        this.updateShape_();
      },

      updateShape_() {},
    },
    undefined
  );
})();
