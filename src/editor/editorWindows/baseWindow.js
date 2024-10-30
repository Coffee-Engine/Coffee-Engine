(function () {
    const closeButtonSVG = `
        <svg style="width:100%; height:100%;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="53.16344"
            height="53.16344" viewBox="0,0,53.16344,53.16344">
            <g transform="translate(-213.41828,-153.41828)">
                <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke="currentcolor"
                    stroke-width="12" stroke-linecap="round" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray=""
                    stroke-dashoffset="0" style="mix-blend-mode: normal">
                    <path d="M219.41828,159.41828l41.16344,41.16344" />
                    <path d="M219.41828,200.58172l41.16344,-41.16344" />
                </g>
            </g>
        </svg>
    `;

    //This will contain the editor's windows
    editor.windowLayer = 0;
    editor.windows = {};

    //this is the base window class
    editor.windows.__Serialization ={
        register: (classOBJ,id) => {
            editor.windows.__Serialization.all[id] = classOBJ;
        },

        all:{}
    };

    editor.windows.base = class {
        //Manage our dock status
        dockedColumn = 0;
        #docked = false;
        set docked(value) {
            this.#docked = value;

            if (!value) {
                this.windowDiv.style.position = "absolute";
            } else {
                this.windowDiv.style.position = "static";

                this.windowDiv.style.zIndex = 1;

                this.windowDiv.style.width = "auto";
                this.windowDiv.style.height = "auto";
            }
        }

        get docked() {
            return this.#docked;
        }

        //Determines if the window is resizable.
        resizable = true;

        //Window width and height managers
        #width = 128;
        #height = 128;
        minWidth = 128;
        minHeight = 128;

        set width(value) {
            this.windowDiv.style.width = `${
                Math.min(
                    window.innerWidth - this.x,
                    Math.max(value,this.minWidth)
                )
            }px`;
            this.#width = Math.max(value,this.minWidth);
        }
        get width() {
            return this.#width;
        }

        set height(value) {
            this.windowDiv.style.height = `${
                Math.min(
                    window.innerHeight - this.y,
                    Math.max(value,this.minHeight)
                ) + editor.taskbarHeight
            }px`;
            this.#height = Math.max(value,this.minHeight) + editor.taskbarHeight;
        }
        get height() {
            return this.#height - editor.taskbarHeight;
        }

        #x = 0;
        #y = 0;

        set x(value) {
            this.#x = value;
            this.windowDiv.style.left = `${
                Math.min(
                    window.innerWidth - this.width,
                    Math.max(value,0)
                )
            }px`;
        }

        get x() {
            return this.#x;
        }

        set y(value) {
            this.#y = value;
            this.windowDiv.style.top = `${
                Math.min(
                    window.innerHeight - this.height,
                    Math.max(value,0)
                )
            }px`;
        }

        get y() {
            return this.#y;
        }

        #title = "Window";
        set title(value) {
            this.#title = value;
            this.__updateTitle();
        }
        get title() {
            return this.#title;
        }

        tabs = [];

        //Have this so we can't repeat the closing animation
        closing = false;

        __TabRef;
        __CurrentTab;

        constructor(width, height, title) {
            //Set up variables
            this.windowDiv = document.createElement("div");
            this.windowDiv.className = "window";
            this.windowDiv.style.position = "absolute";

            //Resize the window's defaults
            this.width = width || this.#width;
            this.height = height || this.#height;

            //set the title
            this.title = title || this.#title;

            //Append it to the window div
            editor.currentPage.root.appendChild(this.windowDiv);

            //Create the rest.
            this.__createTaskBar();
            this.__createContentDiv();
            this.__createMoveableWindow();

            //Add it to the tab list
            this.tabs.push({
                owner:this,
                isPrimary:true,
                content: this.Content,
                isWindow:true
            });

            this.__CurrentTab = 0;

            this.init(this.Content);
        }

        __createTaskBar() {
            this.TaskBar = document.createElement("div");
            this.TaskBar.className = "TaskBar";

            //Just doing this for ease
            this.titleDiv = document.createElement("div");
            this.closeButton = document.createElement("button");

            //The fine intricacies of the close button
            this.closeButton.className = "closeButton";
            this.closeButton.innerHTML = closeButtonSVG;

            //Do this so the 'this' context doesn't overlap with the button
            this.closeButton.onclick = () => {
                this._dispose();
            };

            //Make the title have no interaction
            this.titleDiv.style.pointerEvents = "none";
            this.titleDiv.style.userSelect = "none";
            this.titleDiv.style.display = "grid";

            this.TaskBar.appendChild(this.titleDiv);
            this.TaskBar.appendChild(this.closeButton);

            //Update title and apply to window
            this.__updateTitle();
            this.windowDiv.appendChild(this.TaskBar);
        }

        __updateTitle() {
            if (this.tabs.length > 1) {
                if (this.__TabRef) this.__TabRef.innerText = this.title;
            } 

            //Updates for single tabbed windows
            if (this.tabs.length == 1 && this.titleDiv) this.titleDiv.innerText = this.title;
        }

        __createContentDiv() {
            //Create and define our content div
            this.contentHolder = document.createElement("div");
            this.contentHolder.style.width = "100%";
            this.contentHolder.style.overflow = "clip";
            this.contentHolder.style.position = "relative";

            this.Content = document.createElement("div");
            this.Content.style.width = "100%";
            this.Content.style.height = "100%";
            this.Content.style.overflow = "auto";
            this.Content.style.position = "absolute";
            this.Content.style.top = "0px";
            this.Content.style.left = "0px";
            this.Content.style.zIndex = "0";

            //Add it to the window, and the content holder
            this.contentHolder.appendChild(this.Content);
            this.windowDiv.appendChild(this.contentHolder);
        }

        __createMoveableWindow() {
            this.TaskBar.onmousedown = (downEvent) => {
                //If we are docked. We do nothing.
                if (this.docked) return;

                //Move the window layer
                editor.windowLayer += 1;

                //Get bounding box for the window
                const boundingRect = this.TaskBar.getBoundingClientRect();
                const { width, height } = this.windowDiv.getBoundingClientRect();

                //Calculate the correct offsets
                const mouseOffsetX = boundingRect.left - downEvent.clientX;
                const mouseOffsetY = boundingRect.top - downEvent.clientY;

                //Calculate if the mouse is on the edge of the window and what edges it is on
                const rightEdging = Math.abs(boundingRect.left + width - downEvent.clientX) <= 4;
                const bottomEdging = Math.abs(boundingRect.top + height - downEvent.clientY) <= 4;
                const leftEdging = Math.abs(boundingRect.left - downEvent.clientX) <= 4;
                const topEdging = Math.abs(boundingRect.top - downEvent.clientY) <= 4;
                const edging = topEdging || bottomEdging || rightEdging || leftEdging;

                //Move window to initial position and adjust layer accordingly
                this.windowDiv.style.left = `${downEvent.clientX + mouseOffsetX}px`;
                this.windowDiv.style.top = `${downEvent.clientY + mouseOffsetY}px`;
                this.windowDiv.style.zIndex = editor.windowLayer;

                //Clear mouse actions when done;
                document.onmouseup = () => {
                    document.onmousemove = () => {};
                };

                //If we are on the edge use different behavior.
                if (edging && this.resizable) {
                    document.onmousemove = (moveEvent) => {
                        if (!this.windowDiv) {
                            document.onmousemove = () => {};
                            return;
                        }

                        if (rightEdging) {
                            this.width = moveEvent.clientX + mouseOffsetX;
                        } else if (leftEdging) {
                            this.x = moveEvent.clientX + mouseOffsetX;
                            this.width = this.width - moveEvent.movementX;
                        }

                        //I can 100% gaurentee that the width is probably never going to be anything but pixels.
                        if (bottomEdging) {
                            this.height = moveEvent.clientY + mouseOffsetY;
                        } else if (topEdging) {
                            this.y = moveEvent.clientY + mouseOffsetY;
                            this.height = this.#height - moveEvent.movementY;
                        }

                        this.resized();
                    };

                    return;
                }

                //Move window if dragging taskbar
                document.onmousemove = (moveEvent) => {
                    if (!this.windowDiv) {
                        document.onmousemove = () => {};
                        return;
                    }
                    this.x = moveEvent.clientX + mouseOffsetX;
                    this.y = moveEvent.clientY + mouseOffsetY;
                };
            };

            this.windowDiv.onmousedown = (downEvent) => {
                //If we are docked. We do nothing.
                if (this.docked) return;

                //Move the window layer
                editor.windowLayer += 1;

                //Get bounding box for the window
                const boundingRect = this.windowDiv.getBoundingClientRect();
                const { width, height } = boundingRect;

                //Calculate the correct offsets
                const mouseOffsetX = boundingRect.left - downEvent.clientX;
                const mouseOffsetY = boundingRect.top - downEvent.clientY;

                //Calculate if the mouse is on the edge of the window and what edges it is on
                const rightEdge = Math.abs(boundingRect.left + width - downEvent.clientX) <= editor.grabDistance;
                const bottomEdge = Math.abs(boundingRect.top + height - downEvent.clientY) <= editor.grabDistance;
                const leftEdge = Math.abs(boundingRect.left - downEvent.clientX) <= editor.grabDistance;
                const topEdge = Math.abs(boundingRect.top - downEvent.clientY) <= editor.grabDistance;
                const edging = topEdge || bottomEdge || rightEdge || leftEdge;
                
                this.windowDiv.style.zIndex = editor.windowLayer;

                //If we aren't edging return
                if ((!edging) || (!this.resizable)) return;

                //Clear mouse actions when done;
                document.onmouseup = () => {
                    document.onmousemove = () => {};
                };

                //Normal window resize calculations
                document.onmousemove = (moveEvent) => {
                    if (!this.windowDiv) {
                        document.onmousemove = () => {};
                        return;
                    }

                    if (rightEdge) {
                        this.width = this.width + moveEvent.movementX;
                    } else if (leftEdge) {
                        this.x = moveEvent.clientX + mouseOffsetX;
                        this.width = this.width - moveEvent.movementX;
                    }

                    //I can 100% gaurentee that the width is probably never going to be anything but pixels.
                    if (bottomEdge) {
                        this.height = this.height + moveEvent.movementY;
                    } else if (topEdge) {
                        this.y = moveEvent.clientY + mouseOffsetY;
                        this.height = this.height - moveEvent.movementY;
                    }

                    this.resized();
                };
            };
        }

        __moveToTop() {
            editor.windowLayer += 1;
            this.windowDiv.style.zIndex = editor.windowLayer;
        }

        __refreshTaskbar() {
            this.titleDiv.style.pointerEvents = "none";
            this.titleDiv.style.userSelect = "none";
            if (this.tabs.length > 1) {
                this.titleDiv.style.pointerEvents = "all";
                this.titleDiv.style.userSelect = "none";

                //Remove tabs
                this.titleDiv.innerHTML = "";
                this.titleDiv.style.gridTemplateColumns = "1fr ".repeat(this.tabs.length);

                //Loop through tabs and add them
                for (let tabIndex = 0; tabIndex < this.tabs.length; tabIndex++) {
                    const tab = this.tabs[tabIndex];
                    const tabElement = document.createElement("div");
                    tabElement.innerText = tab.owner.title || tab.tabName || "Unknown Tab";
                    tabElement.className = "windowTab";

                    tabElement.onclick = (event) => {
                        event.stopPropagation();

                        //Make sure the current tab exists;
                        this.tabs[this.__CurrentTab].content.style.opacity = "0";
                        this.tabs[this.__CurrentTab].content.style.zIndex = "0";

                        this.tabs[tabIndex].content.style.opacity = "100";
                        this.tabs[tabIndex].content.style.zIndex = "1";
                        this.__CurrentTab = tabIndex;
                    }

                    this.titleDiv.appendChild(tabElement);
                }
            }
            else {
                //clear, add title
                this.titleDiv.innerHTML = "";
                this.titleDiv.innerText = this.title;
            }
        }

        //For organization
        __addTab(tabOrigin,tabName) {
            //Make this variable to store the window contents
            let content;
            let isWindow = false;
            //Fallbacks and handling of different "Tabs"
            if (tabOrigin instanceof editor.windows.base) {
                tabOrigin.__deconstruct();
                tabName = tabName || tabOrigin.title || "New Tab";
                content = tabOrigin.Content;
                isWindow = true;

                tabOrigin.owner = this;
            }
            else if (tabOrigin instanceof HTMLElement) {
                tabName = tabName || "New Tab";
                content = tabOrigin;
            }
            else {
                console.error("Trying to merge an invalid window object");
                return;
            }

            this.tabs.push({
                owner:tabOrigin,
                isPrimary:false,
                content: content,
                isWindow:isWindow,
                tabName: tabName,
            });

            //Approved? Maybe?
            content.parentElement.removeChild(content);

            content.style.opacity = "0";
            content.style.zIndex = "0";
            this.tabs[this.__CurrentTab].content.style.zIndex = "1";
            this.contentHolder.appendChild(content);

            this.__refreshTaskbar();
        }

        //Allow us to destroy the window;
        _dispose() {
            if (this.closing) return;
            this.closing = true;

            //Now we destory all window objects
            this.windowDiv.onanimationend = () => {

                this.dispose();
                this.windowDiv.parentElement.removeChild(this.windowDiv);

                //Handle docked windows
                if (this.docked) {
                    if (editor.layout.layout[this.dockedColumn]) editor.layout.layout[this.dockedColumn].contents.splice(editor.layout.layout[this.dockedColumn].contents.indexOf(this),1);
                    editor.dock.refreshLayout();
                }

                delete this.windowDiv;
            };

            this.windowDiv.style.animation = "closeWindow 500ms cubic-bezier(0.65, 0, 0.35, 1) 1";
        }

        //Makes the window headless for tab stuff
        __deconstruct() {
            this.TaskBar.parentElement.removeChild(this.TaskBar);
            this.windowDiv.parentElement.removeChild(this.windowDiv);

            return this.Content;
        }

        //Just for the extensions of this class
        init(Content) {}
        dispose() {}
        resized() {}
        merged() {}
    };

    editor.windows.__Serialization.register(editor.windows.base,"baseWindow");
})();
