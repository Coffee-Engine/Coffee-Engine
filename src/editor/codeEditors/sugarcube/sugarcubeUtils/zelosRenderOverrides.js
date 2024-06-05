(function () {
  //I'm to lazy to try and extract the zelos renderer so we are replacing it.
  //webhook test
  sugarcube.customZelosConstant = class extends Blockly.zelos.ConstantProvider {
    init() {
      super.init();
    }

    makeObject() {
      const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
  
      function makeMainPath(height, up, right) {
        const xStep = right ? -25 : 25;
        const curveStep = right ? -10 : 10;
        const yStep = (up ? height : -height) / 2;
        
        return `
        m 0 ${up ? -height : height} 
        c 0 0 ${curveStep} ${yStep} ${xStep} ${yStep} 
        c 0 0 ${-curveStep * 2} 0 ${-xStep} ${yStep}
        `;
        //+ Blockly.utils.svgPaths.lineTo(xStep, yStep) + Blockly.utils.svgPaths.lineTo(-xStep, yStep);
        //return Blockly.utils.svgPaths.lineTo(xStep, 0) + Blockly.utils.svgPaths.lineTo(xStep, yStep) + Blockly.utils.svgPaths.lineTo(-xStep, yStep);
      }
  
      return {
        type: this.SHAPES.HEXAGONAL,
        isDynamic: true,
        width(height) {
          const halfHeight = height / 2;
          return halfHeight > maxWidth ? maxWidth : halfHeight;
        },
        height(height) {
          return height;
        },
        connectionOffsetY(connectionHeight) {
          return connectionHeight / 2;
        },
        connectionOffsetX(connectionWidth) {
          return -connectionWidth / 2;
        },
        pathDown(height) {
          return ``;
        },
        pathUp(height) {
          return makeMainPath(height, true, true);
        },
        pathRightDown(height) {
          return makeMainPath(height, true, false);
        },
        pathRightUp(height) {
          return ``;
        },
      };
    }

    OBJECT = this.makeObject();

    shapeFor(connection) {
      let check = connection.getCheck();
      !check && connection.targetConnection && (check = connection.targetConnection.getCheck());
      switch (connection.type) {
        case Blockly.ConnectionType.OUTPUT_VALUE: {
          switch (check[0]) {
            case "Inline": {
              return this.SQUARED;
            }

            case "Object": {
              return this.OBJECT;
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
