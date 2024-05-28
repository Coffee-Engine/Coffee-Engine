(function () {
  //I'm to lazy to try and extract the zelos renderer so we are replacing it.

  sugarcube.customZelosConstant = class extends Blockly.zelos.ConstantProvider {
    init() {
      super.init();
    }

    shapeFor(connection) {
      let check = connection.getCheck();
      !check && connection.targetConnection && (check = connection.targetConnection.getCheck());
      switch (connection.type) {
        case Blockly.ConnectionType.OUTPUT_VALUE: {
          switch (check[0]) {
            case "Inline": {
              return this.SQUARED;
            }

            default: {
              return super.shapeFor(connection);
            }
          }
        }
        default: {
          return super.shapeFor(connection);
        }
      }
    }
  };

  sugarcube.customZelosRenderer = class extends Blockly.zelos.Renderer {
    makeConstants_() {
      return new sugarcube.customZelosConstant();
    }
  };

  Blockly.blockRendering.register("sugarcube", sugarcube.customZelosRenderer);

  //Prevent zooming
  Blockly.VerticalFlyout.prototype.getFlyoutScale = function () {
    return 0.8;
  };

  //Stolen from clamp :)
  Blockly.VerticalFlyout.prototype.reflowInternal_ = function () {
    this.workspace_.scale = this.getFlyoutScale();
    let flyoutWidth = 0;
    const blocks = this.workspace_.getTopBlocks(false);
    for (let i = 0, block; (block = blocks[i]); i++) {
      let width = block.getHeightWidth().width;
      if (block.outputConnection) {
        width -= this.tabWidth_;
      }
      flyoutWidth = Math.max(flyoutWidth, width);
    }
    for (let i = 0, button; (button = this.buttons_[i]); i++) {
      flyoutWidth = Math.max(flyoutWidth, button.width);
    }
    flyoutWidth += this.MARGIN * 2 + this.tabWidth_;
    flyoutWidth *= this.workspace_.scale;
    flyoutWidth += Blockly.Scrollbar.scrollbarThickness;

    flyoutWidth = Math.max(Math.min(flyoutWidth, 275), 275);

    if (this.width_ !== flyoutWidth) {
      for (let i = 0, block; (block = blocks[i]); i++) {
        if (this.rectMap_.has(block)) {
          this.moveRectToBlock_(this.rectMap_.get(block), block);
        }
      }

      this.width_ = flyoutWidth;
      this.position();
      this.targetWorkspace.resizeContents();
      this.targetWorkspace.recordDragTargets();
    }
  };
})();
