(function () {
    //I'm to lazy to try and extract the zelos renderer so we are replacing it.
    sugarcube.BlockShapes = {};

    sugarcube.customZelosConstant = class extends Blockly.zelos.ConstantProvider {
        init() {
            //Our constant overrider
            const keys = Object.keys(sugarcube.constantOverrides);
            keys.forEach((key) => {
                this[key] = sugarcube.constantOverrides[key];
            });

            super.init();

            sugarcube.BlockShapes.Object = this.makeObject();
            sugarcube.BlockShapes.Reference = this.makeCoolShape();
            sugarcube.BlockShapes.branch = this.makeSwitchNotch();
            sugarcube.BlockShapes.Array = this.SQUARED;
            sugarcube.BlockShapes.Field_ReporterAcceptance = this.SQUARED;
        }

        makeObject() {
            const maxWidth = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;

            function makeShape(height, up, right) {
                var halfHeight = height / 2;
                halfHeight = halfHeight > halfHeight ? maxWidth : halfHeight;
                right = right ? -1 : 1;
                height = ((up ? -1 : 1) * height) / 2;
                return `
          c ${-right * 7.5} 0 0 ${height} ${-right * 25} ${height}
          c ${right * 25} 0 ${right * 17.5} ${height} ${right * 25} ${height}
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
          l ${-right * 30} 0
          c 0 0 ${right * 15} ${height} ${right * 10} ${height}
          c 0 0 ${right * 5} 0 ${-right * 10} ${height}
          l ${right * 30} 0
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
                    height /= 1.5;
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

        makeFunkyNotch() {
            const nW = this.NOTCH_WIDTH / 36;
            const nW2 = nW * 2;
            const nW3 = nW * 3;
            const nW4 = nW * 4;
            const nW12 = nW * 12;

            const nH = this.NOTCH_HEIGHT / 8;
            const nH2 = nH * 2;
            const nH4 = nH * 4;
            const nH12 = nH * 12;
            return {
                type: 5,
                width: this.NOTCH_WIDTH,
                height: this.NOTCH_HEIGHT,
                pathLeft: ` c ${nW2} 0 ${nW3} ${nH} ${nW4} ${nH2} l ${nW4} ${nH4} c ${nW} ${nH} ${nW4} -${nH12} ${nW4} ${nH2} h ${nW12} c 0 -${nH12} ${nW3} -${nH} ${nW4} -${nH2} l ${nW4} -${nH4} c ${nW} -${nH} ${nW2} -${nH2} ${nW4} -${nH2} `,
                pathRight: ` c -${nW2} 0 -${nW3} ${nH} -${nW4} ${nH2} l -${nW4} ${nH4} c -${nW} ${nH} -${nW4} -${nH12} -${nW4} ${nH2} h -${nW12} c 0 -${nH12} -${nW3} -${nH} -${nW4} -${nH2} l -${nW4} -${nH4} c -${nW} -${nH} -${nW2} -${nH2} -${nW4} -${nH2} `,
            }
        }

        makeSwitchNotch() {
            const nW = this.NOTCH_WIDTH / 36;
            const nH = this.NOTCH_HEIGHT / 8;

            const nW0_5 = nW * 0.5;
            const nW0_6 = nW * 0.6667;
            const nW1_3 = nW * 1.3333;
            const nW1_5 = nW * 1.5;
            const nW2 = nW * 2;
            const nW6 = nW * 6;

            const nH1_3 = nH * 1.3333;
            const nH2_6 = nH * 2.6667;
            const nH2 = nH * 2;
            const nH4 = nH * 4;

            return {
                type: 5,
                width: nW * 32,
                height: this.NOTCH_HEIGHT,
                pathLeft: `c ${nW} 0 ${nW1_5} ${nH} ${nW2} ${nH2} l ${nW2} ${nH4} c ${nW0_5} ${nH} ${nW} ${nH2} ${nW2} ${nH2} h ${nW6} c ${nW} 0 ${nW1_5} -${nH} ${nW2} -${nH2} c ${nW0_6} -${nH1_3} ${nW} -${nH4} ${nW2} -${nH4} c ${nW} 0 ${nW1_3} ${nH2_6} ${nW2} ${nH4} c ${nW0_5} ${nH} ${nW} ${nH2} ${nW2} ${nH2} h ${nW6} c ${nW} 0 ${nW1_5} -${nH} ${nW2} -${nH2} l ${nW2} -${nH4} c ${nW0_5} -${nH} ${nW} -${nH2} ${nW2} -${nH2}`,
                pathRight: `c -${nW} 0 -${nW1_5} ${nH} -${nW2} ${nH2} l -${nW2} ${nH4} c -${nW0_5} ${nH} -${nW} ${nH2} -${nW2} ${nH2} h -${nW6} c -${nW} 0 -${nW1_5} -${nH} -${nW2} -${nH2} c -${nW0_6} -${nH1_3} -${nW} -${nH4} -${nW2} -${nH4} c -${nW} 0 -${nW1_3} ${nH2_6} -${nW2} ${nH4} c -${nW0_5} ${nH} -${nW} ${nH2} -${nW2} ${nH2} h -${nW6} c ${nW} 0 -${nW1_5} -${nH} -${nW2} -${nH2} l -${nW2} -${nH4} c -${nW0_5} -${nH} -${nW} -${nH2} -${nW2} -${nH2}`,
            }
        }

        shapeFor(connection) {
            let check = connection.getCheck();
            !check && connection.targetConnection && (check = connection.targetConnection.getCheck());

            //The N E T H E R
            if (!check) return super.shapeFor(connection);
            if (sugarcube.BlockShapes[check[0]]) {
                return sugarcube.BlockShapes[check[0]]
            }
            else {
                return super.shapeFor(connection);
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
