(function () {
  sugarcube.minimapStorage = {};
  /**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   */
  /**
   * @fileoverview A minimap is a miniature version of your blocks that
   * appears on top of your main workspace. This gives you an overview
   * of what your code looks like, and how it is organized.
   * @author cesarades@google.com (Cesar Ades)
   */
  // Events that should be send over to the minimap from the primary workspace
  const blockEvents = new Set([Blockly.Events.BLOCK_CHANGE, Blockly.Events.BLOCK_CREATE, Blockly.Events.BLOCK_DELETE, Blockly.Events.BLOCK_DRAG, Blockly.Events.BLOCK_MOVE]);
  /**
   * A minimap is a miniature version of your blocks that appears on
   * top of your main workspace. This gives you an overview of what
   * your code looks like, and how it is organized.
   */
  class Minimap {
    /**
     * Constructor for a minimap.
     *
     * @param workspace The workspace to mirror.
     */
    constructor(workspace) {
      this.minimapWorkspace = null;
      this.focusRegion = null;
      this.onMouseMoveWrapper = null;
      this.onMouseDownWrapper = null;
      this.onMouseUpWrapper = null;
      this.minimapWrapper = null;
      this.primaryWorkspace = workspace;
    }
    /**
     * Initialize.
     */
    init() {
      var _a;
      const primaryInjectParentDiv = this.primaryWorkspace.getInjectionDiv().parentNode;
      if (!primaryInjectParentDiv) {
        throw new Error("The workspace must be injected into the page before the minimap can be initalized");
      }
      // Create a wrapper div for the minimap injection.
      this.minimapWrapper = document.createElement("div");
      this.minimapWrapper.id = "minimapWrapper" + this.primaryWorkspace.id;
      this.minimapWrapper.className = "blockly-minimap";
      // Make the wrapper a sibling to the primary injection div.
      primaryInjectParentDiv === null || primaryInjectParentDiv === void 0 ? void 0 : primaryInjectParentDiv.appendChild(this.minimapWrapper);
      // Inject the minimap workspace.
      this.minimapWorkspace = Blockly.inject(this.minimapWrapper.id, {
        // Inherit the layout of the primary workspace.
        rtl: this.primaryWorkspace.RTL,
        // Include the scrollbars so that internal scrolling is enabled and
        // remove direct interaction with the minimap workspace.
        move: {
          scrollbars: true,
          drag: false,
          wheel: false,
        },
        // Remove the scale bounds of the minimap so that it can
        // correctly zoomToFit.
        zoom: {
          maxScale: Infinity,
          minScale: 0,
        },
        readOnly: true,
        theme: this.primaryWorkspace.getTheme(),
        renderer: this.primaryWorkspace.options.renderer,
      });
      (_a = this.minimapWorkspace.scrollbar) === null || _a === void 0 ? void 0 : _a.setContainerVisible(false);
      this.primaryWorkspace.addChangeListener((e) => void this.mirror(e));
      window.addEventListener("resize", () => {
        if (this.minimapWorkspace) {
          this.minimapWorkspace.zoomToFit();
        }
      });
      // The mousedown handler needs to take precedent over other mouse handlers
      // in the workspace, such as the handler that opens comments, which means it
      // needs to be attached in the capture phase. Blockly's built-in event
      // binding does not let us use the capture phase so we reimplement it here.
      const mouseDownFunc = (event) => this.onClickDown(event);
      this.minimapWorkspace.svgGroup_.addEventListener("pointerdown", mouseDownFunc, /* usecapture */ true);
      this.onMouseDownWrapper = [[this.minimapWorkspace.svgGroup_, "pointerdown", mouseDownFunc]];
      // The mouseup binds to the parent container div instead of the minimap
      // because if a drag begins on the minimap and ends outside of it the
      // mousemove should still unbind.
      this.onMouseUpWrapper = Blockly.browserEvents.bind(primaryInjectParentDiv, "mouseup", this, this.onClickUp);
      // Initializes the focus region.
      this.focusRegion = new sugarcube.FocusRegion(this.primaryWorkspace, this.minimapWorkspace);
      this.enableFocusRegion();
    }
    /**
     * Disposes the minimap.
     * Unlinks from all DOM elements and remove all event listeners
     * to prevent memory leaks.
     */
    dispose() {
      if (this.isFocusEnabled()) {
        this.disableFocusRegion();
      }
      if (this.minimapWorkspace) {
        this.minimapWorkspace.dispose();
      }
      Blockly.utils.dom.removeNode(this.minimapWrapper);
      if (this.onMouseMoveWrapper) {
        Blockly.browserEvents.unbind(this.onMouseMoveWrapper);
      }
      if (this.onMouseDownWrapper) {
        Blockly.browserEvents.unbind(this.onMouseDownWrapper);
      }
      if (this.onMouseUpWrapper) {
        Blockly.browserEvents.unbind(this.onMouseUpWrapper);
      }
    }
    /**
     * Creates the mirroring between workspaces. Passes on all desired events
     * to the minimap from the primary workspace.
     *
     * @param event The primary workspace event.
     */
    mirror(event) {
      if (!blockEvents.has(event.type)) {
        return; // Filter out events.
      }
      if (
        event.type === Blockly.Events.BLOCK_CREATE &&
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        event.xml.tagName === "shadow"
      ) {
        return; // Filter out shadow blocks.
      }
      // Run the event in the minimap.
      const json = event.toJson();
      if (this.minimapWorkspace) {
        const duplicate = Blockly.Events.fromJson(json, this.minimapWorkspace);
        duplicate.run(true);
      }
      // Resize and center the minimap.
      // We need to wait for the event to finish rendering to do the zoom.
      Blockly.renderManagement.finishQueuedRenders().then(() => {
        if (this.minimapWorkspace) {
          this.minimapWorkspace.zoomToFit();
        }
      });
    }
    /**
     * Converts the coorindates from a mouse event on the minimap
     * into scroll coordinates for the primary viewport.
     *
     * @param primaryMetrics The metrics from the primary workspace.
     * @param minimapMetrics The metrics from the minimap workspace.
     * @param offsetX The x offset of the mouse event.
     * @param offsetY The y offset of the mouse event.
     * @returns (x, y) primary workspace scroll coordinates.
     */
    static minimapToPrimaryCoords(primaryMetrics, minimapMetrics, offsetX, offsetY) {
      // Gets the coordinate relative to the top left of the minimap content.
      offsetX -= (minimapMetrics.svgWidth - minimapMetrics.contentWidth) / 2;
      offsetY -= (minimapMetrics.svgHeight - minimapMetrics.contentHeight) / 2;
      // Scales the coordinate to the primary workspace.
      const scale = primaryMetrics.contentWidth / minimapMetrics.contentWidth;
      offsetX *= scale;
      offsetY *= scale;
      // Gets the coordinate relative to the top left of the primary content.
      let x = -primaryMetrics.contentLeft - offsetX;
      let y = -primaryMetrics.contentTop - offsetY;
      // Centers the coordinate in the primary viewport.
      x += primaryMetrics.viewWidth / 2;
      y += primaryMetrics.viewHeight / 2;
      return [x, y];
    }
    /**
     * Scrolls the primary workspace viewport based on a minimap event.
     *
     * @param event The minimap browser event.
     */
    primaryScroll(event) {
      const primaryMetrics = this.primaryWorkspace.getMetrics();
      if (this.minimapWorkspace) {
        const minimapMetrics = this.minimapWorkspace.getMetrics();
        if (primaryMetrics && minimapMetrics) {
          const [x, y] = Minimap.minimapToPrimaryCoords(primaryMetrics, minimapMetrics, event.offsetX, event.offsetY);
          this.primaryWorkspace.scroll(x, y);
        }
      }
    }
    /**
     * Updates the primary workspace viewport based on a click in the minimap.
     *
     * @param event The minimap browser event.
     */
    onClickDown(event) {
      if (this.minimapWorkspace) {
        // Stop any other click event handlers in the workspace from handling
        // this event.
        event.stopImmediatePropagation();
        this.onMouseMoveWrapper = Blockly.browserEvents.bind(this.minimapWorkspace.svgGroup_, "mousemove", this, this.onMouseMove);
        this.primaryScroll(event);
      }
    }
    /**
     * Unbinds the minimap mousemove when the mouse is not clicked.
     */
    onClickUp() {
      if (this.onMouseMoveWrapper) {
        Blockly.browserEvents.unbind(this.onMouseMoveWrapper);
        this.onMouseMoveWrapper = null;
      }
    }
    /**
     * Updates the primary workspace viewport based on a drag in the minimap.
     *
     * @param event The minimap browser event.
     */
    onMouseMove(event) {
      this.primaryScroll(event);
    }
    /**
     * Enables the focus region; A highlight of the viewport in the minimap.
     */
    enableFocusRegion() {
      if (this.focusRegion) {
        this.focusRegion.init();
      }
    }
    /**
     * Disables the focus region.
     */
    disableFocusRegion() {
      if (this.focusRegion) {
        this.focusRegion.dispose();
      }
    }
    /**
     * Returns whether the focus region is enabled.
     *
     * @returns True if the focus region is enabled.
     */
    isFocusEnabled() {
      if (this.focusRegion) {
        return this.focusRegion.isEnabled();
      }
      return false;
    }
  }

  sugarcube.minimapStorage.Minimap = Minimap;

  /**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   */
  /**
   * @fileoverview A positionable version of the minimap.
   * @author cesarades@google.com (Cesar Ades)
   */
  const minWidth = 200;
  /**
   * A positionable version of minimap that implements IPositionable.
   */
  class PositionedMinimap extends Minimap {
    /**
     * Constructor for a positionable minimap.
     *
     * @param workspace The workspace to mirror.
     */
    constructor(workspace) {
      super(workspace);
      this.id = "minimap";
      this.margin = 20;
      this.top = 0;
      this.left = 0;
      this.width = 225;
      this.height = 150;
    }
    /**
     * Initialize.
     */
    init() {
      super.init();
      this.primaryWorkspace.getComponentManager().addComponent({
        component: this,
        weight: 3,
        capabilities: [Blockly.ComponentManager.Capability.POSITIONABLE],
      });
      this.primaryWorkspace.resize();
    }
    /**
     * Returns the bounding rectangle of the UI element in pixel units
     * relative to the Blockly injection div.
     *
     * @returns The component’s bounding box.
     */
    getBoundingRectangle() {
      return new Blockly.utils.Rect(this.top, this.top + this.height, this.left, this.left + this.width);
    }
    /**
     * Positions the minimap.
     *
     * @param metrics The workspace metrics.
     * @param savedPositions List of rectangles already on the workspace.
     */
    position(metrics, savedPositions) {
      this.setSize();
      this.setPosition(metrics, savedPositions);
      this.setAttributes();
    }
    /**
     * Sizes the minimap.
     *
     * @internal
     */
    setSize() {
      const viewWidth = this.primaryWorkspace.getMetrics().viewWidth;
      this.width = Math.max(minWidth, viewWidth / 5);
      this.height = (this.width * 2) / 3;
    }
    /**
     * Calculates the position of the minimap over the primary workspace.
     *
     * @param metrics The workspace metrics.
     * @param savedPositions List of rectangles already on the workspace.
     * @internal
     */
    setPosition(metrics, savedPositions) {
      // Aliases.
      const workspace = this.primaryWorkspace;
      const scrollbars = workspace.scrollbar;
      const hasVerticalScrollbars = scrollbars && scrollbars.isVisible() && scrollbars.canScrollVertically();
      const hasHorizontalScrollbars = scrollbars && scrollbars.isVisible() && scrollbars.canScrollHorizontally();
      if (metrics.toolboxMetrics.position === Blockly.TOOLBOX_AT_LEFT || (workspace.horizontalLayout && !workspace.RTL)) {
        // Right edge placement.
        this.left = metrics.absoluteMetrics.left + metrics.viewMetrics.width - this.width - this.margin;
        if (hasVerticalScrollbars && !workspace.RTL) {
          this.left -= Blockly.Scrollbar.scrollbarThickness;
        }
      } else {
        // Left edge placement.
        this.left = this.margin;
        if (hasVerticalScrollbars && workspace.RTL) {
          this.left += Blockly.Scrollbar.scrollbarThickness;
        }
      }
      const startAtBottom = metrics.toolboxMetrics.position === Blockly.TOOLBOX_AT_BOTTOM;
      if (startAtBottom) {
        // Bottom edge placement.
        this.top = metrics.absoluteMetrics.top + metrics.viewMetrics.height - this.height - this.margin;
        if (hasHorizontalScrollbars) {
          // The horizontal scrollbars are always positioned on the bottom.
          this.top -= Blockly.Scrollbar.scrollbarThickness;
        }
      } else {
        // Upper edge placement.
        this.top = metrics.absoluteMetrics.top + this.margin;
      }
      // Check for collision and bump if needed.
      let boundingRect = this.getBoundingRectangle();
      for (let i = 0; i < savedPositions.length; i++) {
        if (boundingRect.intersects(savedPositions[i])) {
          if (startAtBottom) {
            this.top = savedPositions[i].top - this.height - this.margin;
          } else {
            this.top = savedPositions[i].bottom + this.margin;
          }
          // Recheck other savedPositions.
          boundingRect = this.getBoundingRectangle();
          i = -1;
        }
      }
    }
    /**
     * Sets the CSS attribute for the minimap.
     */
    setAttributes() {
      var _a;
      const injectDiv = (_a = this.minimapWorkspace) === null || _a === void 0 ? void 0 : _a.getInjectionDiv();
      if (!injectDiv) {
        return;
      }
      if ((injectDiv === null || injectDiv === void 0 ? void 0 : injectDiv.parentElement) === null) {
        return;
      }
      const style = injectDiv.parentElement.style;
      style.zIndex = "2";
      style.position = "absolute";
      style.width = `${this.width}px`;
      style.height = `${this.height}px`;
      style.top = `${this.top}px`;
      style.left = `${this.left}px`;
      if (this.minimapWorkspace) {
        Blockly.svgResize(this.minimapWorkspace);
      }
    }
  }
  Blockly.Css.register(`
.blockly-minimap {
  box-shadow: 2px 2px 10px grey;
}
`);

  sugarcube.minimapStorage.PositionedMinimap = PositionedMinimap;
})();
