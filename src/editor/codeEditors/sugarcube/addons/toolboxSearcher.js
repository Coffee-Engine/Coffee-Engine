(function () {
  /**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   */
  /**
   * A toolbox category that provides a search field and displays matching blocks
   * in its flyout.
   */

  /* eslint-disable @typescript-eslint/naming-convention */
  /**
   * A toolbox category that provides a search field and displays matching blocks
   * in its flyout.
   */
  class ToolboxSearchCategory extends Blockly.ToolboxCategory {
    /**
     * Initializes a ToolboxSearchCategory.
     *
     * @param categoryDef The information needed to create a category in the
     *     toolbox.
     * @param parentToolbox The parent toolbox for the category.
     * @param opt_parent The parent category or null if the category does not have
     *     a parent.
     */
    constructor(categoryDef, parentToolbox, opt_parent) {
      super(categoryDef, parentToolbox, opt_parent);
      this.blockSearcher = new sugarcube.BlockSearcher();
      this.initBlockSearcher();
      this.registerShortcut();
    }
    /**
     * Initializes the search field toolbox category.
     *
     * @returns The <div> that will be displayed in the toolbox.
     */
    createDom_() {
      var _a;
      const dom = super.createDom_();
      this.searchField = document.createElement("input");
      this.searchField.type = "search";
      this.searchField.placeholder = "🔍";
      this.searchField.style.width = "48px";
      this.workspace_.RTL ? (this.searchField.style.marginRight = "8px") : (this.searchField.style.marginLeft = "8px");
      this.searchField.addEventListener("keyup", (event) => {
        if (event.key === "Escape") {
          this.parentToolbox_.clearSelection();
          return true;
        }
        this.matchBlocks();
      });

      (_a = this.rowContents_) === null || _a === void 0 ? void 0 : _a.replaceChildren(this.searchField);
      return dom;
    }
    /**
     * Returns the numerical position of this category in its parent toolbox.
     *
     * @returns The zero-based index of this category in its parent toolbox, or -1
     *    if it cannot be determined, e.g. if this is a nested category.
     */
    getPosition() {
      var _a;
      const categories = ((_a = this.workspace_.options.languageTree) === null || _a === void 0 ? void 0 : _a.contents) || [];
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].kind === ToolboxSearchCategory.SEARCH_CATEGORY_KIND) {
          return i;
        }
      }
      return -1;
    }
    /**
     * Registers a shortcut for displaying the toolbox search category.
     */
    registerShortcut() {
      const shortcut = Blockly.ShortcutRegistry.registry.createSerializedKey(Blockly.utils.KeyCodes.B, [Blockly.utils.KeyCodes.CTRL]);
      Blockly.ShortcutRegistry.registry.register({
        name: ToolboxSearchCategory.START_SEARCH_SHORTCUT,
        callback: () => {
          const position = this.getPosition();
          if (position < 0) return false;
          this.parentToolbox_.selectItemByPosition(position);
          return true;
        },
        keyCodes: [shortcut],
      });
    }
    /**
     * Returns a list of block types that are present in the toolbox definition.
     *
     * @param schema A toolbox item definition.
     * @param allBlocks The set of all available blocks that have been encountered
     *     so far.
     */
    getAvailableBlocks(schema, allBlocks) {
      if ("contents" in schema) {
        schema.contents.forEach((contents) => {
          this.getAvailableBlocks(contents, allBlocks);
        });
      } else if (schema.kind.toLowerCase() === "block") {
        if ("type" in schema && schema.type) {
          allBlocks.add(schema.type);
        }
      }
    }
    /**
     * Builds the BlockSearcher index based on the available blocks.
     */
    initBlockSearcher() {
      var _a, _b;
      const availableBlocks = new Set();
      (_b = (_a = this.workspace_.options.languageTree) === null || _a === void 0 ? void 0 : _a.contents) === null || _b === void 0 ? void 0 : _b.forEach((item) => this.getAvailableBlocks(item, availableBlocks));
      this.blockSearcher.indexBlocks([...availableBlocks]);
    }
    /**
     * Handles a click on this toolbox category.
     *
     * @param e The click event.
     */
    onClick(e) {
      super.onClick(e);
      e.preventDefault();
      e.stopPropagation();
      this.setSelected(this.parentToolbox_.getSelectedItem() === this);
    }
    /**
     * Handles changes in the selection state of this category.
     *
     * @param isSelected Whether or not the category is now selected.
     */
    setSelected(isSelected) {
      super.setSelected(isSelected);
      if (!this.searchField) return;

      if (isSelected) {
        this.searchField.focus();
        this.matchBlocks();
      } else {
        this.searchField.value = "";
        this.searchField.blur();
      }
    }
    /**
     * Filters the available blocks based on the current query string.
     */
    matchBlocks() {
      var _a;
      const query = ((_a = this.searchField) === null || _a === void 0 ? void 0 : _a.value) || "";
      this.flyoutItems_ = query
        ? this.blockSearcher.blockTypesMatching(query).map((blockType) => {
            return {
              kind: "block",
              type: blockType,
            };
          })
        : [];
      if (!this.flyoutItems_.length) {
        this.flyoutItems_.push({
          kind: "label",
          text: query.length < 3 ? "Click Search to search for blocks" : "No matching blocks found",
        });
      }
      this.parentToolbox_.refreshSelection();
    }
    /**
     * Disposes of this category.
     */
    dispose() {
      super.dispose();
      Blockly.ShortcutRegistry.registry.unregister(ToolboxSearchCategory.START_SEARCH_SHORTCUT);
    }
  }
  ToolboxSearchCategory.START_SEARCH_SHORTCUT = "startSearch";
  ToolboxSearchCategory.SEARCH_CATEGORY_KIND = "search";
  Blockly.registry.register(Blockly.registry.Type.TOOLBOX_ITEM, ToolboxSearchCategory.SEARCH_CATEGORY_KIND, ToolboxSearchCategory);

  sugarcube.ToolboxSearchCategory = ToolboxSearchCategory;
})();
