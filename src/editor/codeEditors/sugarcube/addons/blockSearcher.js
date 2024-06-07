(function () {
  /**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   */
  /**
   * A class that provides methods for indexing and searching blocks.
   */
  class BlockSearcher {
    constructor() {
      this.blockCreationWorkspace = new Blockly.Workspace();
      this.trigramsToBlocks = new Map();
    }
    /**
     * Populates the cached map of trigrams to the blocks they correspond to.
     *
     * This method must be called before blockTypesMatching(). Behind the
     * scenes, it creates a workspace, loads the specified block types on it,
     * indexes their types and human-readable text, and cleans up after
     * itself.
     *
     * @param blockTypes A list of block types to index.
     */
    indexBlocks(blockTypes) {
      const blockCreationWorkspace = new Blockly.Workspace();
      blockTypes.forEach((blockType) => {
        const block = blockCreationWorkspace.newBlock(blockType);
        this.indexBlockText(blockType.replaceAll("_", " "), blockType);
        block.inputList.forEach((input) => {
          input.fieldRow.forEach((field) => {
            this.indexDropdownOption(field, blockType);
            this.indexBlockText(field.getText(), blockType);
          });
        });
      });
    }
    /**
     * Check if the field is a dropdown, and index every text in the option
     *
     * @param field We need to check the type of field
     * @param blockType The block type to associate the trigrams with.
     */
    indexDropdownOption(field, blockType) {
      if (field instanceof Blockly.FieldDropdown) {
        field.getOptions(true).forEach((option) => {
          if (typeof option[0] === "string") {
            this.indexBlockText(option[0], blockType);
          } else if ("alt" in option[0]) {
            this.indexBlockText(option[0].alt, blockType);
          }
        });
      }
    }
    /**
     * Filters the available blocks based on the current query string.
     *
     * @param query The text to use to match blocks against.
     * @returns A list of block types matching the query.
     */
    blockTypesMatching(query) {
      return [
        ...this.generateTrigrams(query)
          .map((trigram) => {
            var _a;
            return (_a = this.trigramsToBlocks.get(trigram)) !== null && _a !== void 0 ? _a : new Set();
          })
          .reduce((matches, current) => {
            return this.getIntersection(matches, current);
          })
          .values(),
      ];
    }
    /**
     * Generates trigrams for the given text and associates them with the given
     * block type.
     *
     * @param text The text to generate trigrams of.
     * @param blockType The block type to associate the trigrams with.
     */
    indexBlockText(text, blockType) {
      this.generateTrigrams(text).forEach((trigram) => {
        var _a;
        const blockSet = (_a = this.trigramsToBlocks.get(trigram)) !== null && _a !== void 0 ? _a : new Set();
        blockSet.add(blockType);
        this.trigramsToBlocks.set(trigram, blockSet);
      });
    }
    /**
     * Generates a list of trigrams for a given string.
     *
     * @param input The string to generate trigrams of.
     * @returns A list of trigrams of the given string.
     */
    generateTrigrams(input) {
      const normalizedInput = input.toLowerCase();
      if (!normalizedInput) return [];
      if (normalizedInput.length <= 3) return [normalizedInput];
      const trigrams = [];
      for (let start = 0; start < normalizedInput.length - 3; start++) {
        trigrams.push(normalizedInput.substring(start, start + 3));
      }
      return trigrams;
    }
    /**
     * Returns the intersection of two sets.
     *
     * @param a The first set.
     * @param b The second set.
     * @returns The intersection of the two sets.
     */
    getIntersection(a, b) {
      return new Set([...a].filter((value) => b.has(value)));
    }
  }

  sugarcube.BlockSearcher = BlockSearcher;
})();
