(function () {
  //I'm to lazy to try and extract the zelos renderer so we are replacing it.
  
  sugarcube.customZelosConstant = class extends Blockly.zelos.ConstantProvider {
    init() {
      super.init();
    }

    makeObject() {
      const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;

      function makeShape(height, up, right) {
        var halfHeight = height / 2;
        halfHeight = halfHeight > halfHeight ? maxWidth : halfHeight;
        right = right ? -1 : 1;
        height = ((up ? -1 : 1) * height) / 2;
        return `
          c 0 0 0 ${height} ${-right * 25} ${height}
          c 0 0 ${right * 25} 0 ${right * 25} ${height}
        `;
      }

      return {
        type: this.SHAPES.HEXAGONAL,
        isDynamic: true,
        width(height) {
          height /= 2;
          return height > maxWidth ? maxWidth : height;
        },
        height(height) {
          return height;
        },
        connectionOffsetY(height) {
          return height / 2;
        },
        connectionOffsetX(height) {
          return -height;
        },
        pathDown(height) {
          return makeShape(height, false, false);
        },
        pathUp(height) {
          return makeShape(height, true, false);
        },
        pathRightDown(height) {
          return makeShape(height, false, true);
        },
        pathRightUp(height) {
          return makeShape(height, false, true);
        },
      };
    }
    
    makeArray() {
      const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;

      function makeShape(height, up, right) {
        var halfHeight = height / 2;
        halfHeight = halfHeight > halfHeight ? maxWidth : halfHeight;
        right = right ? -1 : 1;
        height = ((up ? -1 : 1) * height) / 2;
        return `
          l ${-right * 15} 0
          c 0 0 ${right * 15} ${height} ${right * 10} ${height}
          c 0 0 ${right * 5} 0 ${-right * 10} ${height}
          l ${right * 15} 0
        `;
      }

      return {
        type: this.SHAPES.HEXAGONAL,
        isDynamic: true,
        width(height) {
          height /= 2;
          return height > maxWidth ? maxWidth : height;
        },
        height(height) {
          return height;
        },
        connectionOffsetY(height) {
          return height / 2;
        },
        connectionOffsetX(height) {
          return -height;
        },
        pathDown(height) {
          return makeShape(height, false, false);
        },
        pathUp(height) {
          return makeShape(height, true, false);
        },
        pathRightDown(height) {
          return makeShape(height, false, true);
        },
        pathRightUp(height) {
          return makeShape(height, false, true);
        },
      };
    }

    makeCoolShape() {
      const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;

      function makeShape(height, up, right) {
        var halfHeight = height / 2;
        halfHeight = halfHeight > halfHeight ? maxWidth : halfHeight;
        right = right ? -1 : 1;
        height = ((up ? -1 : 1) * height) / 2;
        return `
          c 0 0 ${right * 15} 0 ${-right * 25} ${height} 
          c 0 0 0 ${height} ${right * 25} ${height}
        `;
      }

      return {
        type: this.SHAPES.HEXAGONAL,
        isDynamic: true,
        width(height) {
          height /= 2;
          return height > maxWidth ? maxWidth : height;
        },
        height(height) {
          return height;
        },
        connectionOffsetY(height) {
          return height / 2;
        },
        connectionOffsetX(height) {
          return -height;
        },
        pathDown(height) {
          return makeShape(height, false, false);
        },
        pathUp(height) {
          return makeShape(height, true, false);
        },
        pathRightDown(height) {
          return makeShape(height, false, true);
        },
        pathRightUp(height) {
          return makeShape(height, false, true);
        },
      };
    }


    OBJECT = this.makeObject();
    ARRAY = this.makeArray();

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

            case "Array": {
              return this.ARRAY;
            }

            default: {
              return super.shapeFor(connection);
            }
          }
        }
        case Blockly.ConnectionType.INPUT_VALUE: {
          if (!check) return super.shapeFor(connection);
          switch (check[0]) {
            case "Object": {
              return this.OBJECT;
            }

            case "Array": {
              return this.ARRAY;
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
