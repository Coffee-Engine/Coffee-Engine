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

    const undockButtonSVG = `<svg style="width:100%; height:100%;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="90.44835" height="88.29252" viewBox="0,0,90.44835,88.29252">
    <g transform="translate(-194.77583,-135.85374)">
        <g fill="none" stroke="currentColor" stroke-width="12" stroke-miterlimit="10">
            <path d="M200.77584,218.14626v-55.93188h55.93188v55.93188z" stroke-linecap="butt" />
            <path d="M220.41786,156.94457v-15.09083h58.80632v60.24354h-16.76759"
                stroke-linecap="round" />
        </g>
    </g>
</svg><!--rotationCenter:45.224165:44.14626000000001-->`;

    const dockButtonSVG = `<svg style="width:100%; height:100%;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="93.05298" height="92.93321" viewBox="0,0,93.05298,92.93321">
    <g transform="translate(-193.47351,-133.5334)">
        <g fill="none" stroke="currentColor" stroke-width="12" stroke-miterlimit="10">
            <path d="M199.50379,180.01514v-40.48174h40.48174v40.48174z" />
            <path d="M199.47351,220.46661v-40.48175h40.48174v40.48175z" />
            <path d="M240.04475,220.43633v-80.84372h40.48174v80.84372z" />
        </g>
    </g>
</svg><!--rotationCenter:46.5264875:46.466595085924865-->`;

    const undockTabSVG = `<svg version="1.1" style="width:100%; height:100%;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="84.52646"
    height="84.52646" viewBox="0,0,84.52646,84.52646">
    <g transform="translate(-197.73677,-137.73677)">
        <g data-paper-data="{&quot;isPaintingLayer&quot;:true}" fill="none" fill-rule="nonzero" stroke-linejoin="miter"
            stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal">
            <path d="M240,188.64118l-32.67937,-17.28236" stroke="currentColor" stroke-width="12" stroke-linecap="round" />
            <path d="M240,188.64118l32.67938,-17.28236" data-paper-data="{&quot;index&quot;:null}" stroke="currentColor"
                stroke-width="12" stroke-linecap="round" />
            <path d="M197.73677,222.26323v-84.52646h84.52646v84.52646z" stroke="none" stroke-width="0"
                stroke-linecap="butt" />
        </g>
    </g>
</svg>
<!--rotationCenter:42.263227662355774:42.263227662355774-->`;

    editor.windows.base = class {
        //Manage our dock status
        dockedColumn = 0;
        #docked = false;
        set docked(value) {
            this.#docked = value;

            if (!value) {
                this.windowDiv.style.position = "absolute";
                this.dockButton.innerHTML = dockButtonSVG;
            } else {
                this.windowDiv.style.position = "static";

                this.windowDiv.style.zIndex = 1;

                this.windowDiv.style.width = "auto";
                this.windowDiv.style.height = "auto";

                //Add our undock button
                this.dockButton.innerHTML = undockButtonSVG;
            }
        }

        get docked() {
            return this.#docked;
        }

        //Determines if the window is resizable.
        resizable = true;
        set closable(value) {
            this.#closable = value;
            if (value) {
                this.closeButton.style.opacity = "100%";
                this.closeButton.style.pointerEvents = "auto";
            } else {
                this.closeButton.style.opacity = "50%";
                this.closeButton.style.pointerEvents = "none";
            }
        }
        get closable() {
            return this.#closable;
        }
        #closable = true;
        set dockable(value) {
            this.#dockable = value;
            if (value) {
                this.dockButton.style.opacity = "100%";
                this.dockButton.style.pointerEvents = "auto";
            } else {
                this.dockButton.style.opacity = "50%";
                this.dockButton.style.pointerEvents = "none";
            }
        }
        get dockable() {
            return this.#dockable;
        }
        #dockable = true;

        //Window width and height managers
        #width = 128;
        #height = 128;
        minWidth = 128;
        minHeight = 128;

        set width(value) {
            this.windowDiv.style.width = `${Math.min(window.innerWidth - this.x, Math.max(value, this.minWidth))}px`;
            this.#width = Math.max(value, this.minWidth);
        }
        get width() {
            return this.#width;
        }

        set height(value) {
            this.windowDiv.style.height = `${Math.min(window.innerHeight - this.y, Math.max(value, this.minHeight)) + editor.taskbarHeight}px`;
            this.#height = Math.max(value, this.minHeight) + editor.taskbarHeight;
        }
        get height() {
            return this.#height - editor.taskbarHeight;
        }

        #x = 0;
        #y = 0;

        set x(value) {
            this.#x = value;
            this.windowDiv.style.left = `${Math.min(window.innerWidth - this.width, Math.max(value, 0))}px`;
        }

        get x() {
            return this.#x;
        }

        set y(value) {
            this.#y = value;
            this.windowDiv.style.top = `${Math.min(window.innerHeight - this.height, Math.max(value, 0))}px`;
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

            this.__addToExistingArray();

            //Add it to the tab list
            this.tabs.push({
                owner: this,
                isPrimary: true,
                content: this.Content,
                isWindow: true,
            });

            this.__CurrentTab = 0;

            this.init(this.Content);
        }

        __addToExistingArray() {
            //Filter
            const serializationList = editor.windows.__Serialization.all;
            let signifierID = Object.keys(serializationList).filter((item) => serializationList[item] == this.constructor);
            if (!signifierID) return;

            //Get our actual title
            signifierID = signifierID[0];

            //Make sure our array exists
            editor.windows.existing[signifierID] = editor.windows.existing[signifierID] || [];

            editor.windows.existing[signifierID].push(this);
        }

        __createTaskBar() {
            this.TaskBar = document.createElement("div");
            this.TaskBar.className = "TaskBar";

            //Just doing this for ease
            this.titleDiv = document.createElement("div");

            //The horrible idiocracies of the dock button
            this.dockButton = document.createElement("button");
            this.dockButton.className = "closeButton";
            this.dockButton.innerHTML = dockButtonSVG;

            this.dockButton.onclick = () => {
                if (this.docked) {
                    editor.dock.undockWindow(this);
                    this.__moveToTop();

                    if (!this.width < 10) this.width = 480;
                    if (!this.height < 10) this.height = 360;
                } else {
                    this.windowDiv.style.opacity = "25%";
                    this.windowDiv.style.pointerEvents = "none";
                    //Our ui call and callback
                    editor.dock.dockWindowUI(this, () => {
                        this.windowDiv.style.opacity = "100%";
                        this.windowDiv.style.pointerEvents = "all";
                    });
                }
            };

            //The fine intricacies of the close button
            this.closeButton = document.createElement("button");
            this.closeButton.className = "closeButton";
            this.closeButton.innerHTML = closeButtonSVG;

            //Do this so the 'this' context doesn't overlap with the button
            this.closeButton.onclick = () => {
                this._dispose();
            };

            this.TaskBar.appendChild(this.titleDiv);
            this.TaskBar.appendChild(this.dockButton);
            this.TaskBar.appendChild(this.closeButton);

            //Make the title have no interaction
            this.titleDiv.style.pointerEvents = "none";
            this.titleDiv.style.userSelect = "none";
            this.titleDiv.style.display = "grid";

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
                    editor.Storage.setStorage("layout", editor.__serializeLayout());
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

                        this.tabs.forEach((tab) => {
                            tab.owner.resized();
                        });
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

                //If we are docked. We check for resizing
                if (this.docked) {
                    if (!edging || !this.resizable) return;
                    const dockedRow = editor.layout.layout[this.dockedColumn].contents.findIndex((element) => this == element.content);

                    //Our directional data and divs
                    // prettier-ignore
                    let leftDiv;
                    let leftData;
                    // prettier-ignore
                    let rightDiv;
                    let rightData;
                    // prettier-ignore
                    let topDiv;
                    let topData;
                    // prettier-ignore
                    let bottomDiv;
                    let bottomData;

                    //"Full size" aka the combined size of both directions
                    let fullSizeX = 1;
                    let fullSizeY = 1;

                    /*
                        Now we calculate the actual sizes and windows we need to grab
                        |    L| R L |R   |
                        |  T  |<M M>|    |
                        |  M  |     |    |
                        |  V  |     |    |
                        ------------------
                        |  ^  |     |    |
                        |  M  |     |    |
                        |  B  |     |    |

                        This is what we are calculating
                    */
                    //Left Right
                    if (leftEdge && this.dockedColumn > 0) {
                        leftDiv = editor.dock.element.children[this.dockedColumn - 1];
                        rightDiv = editor.dock.element.children[this.dockedColumn];
                        leftData = editor.layout.layout[this.dockedColumn - 1];
                        rightData = editor.layout.layout[this.dockedColumn];
                    } else if (rightEdge && this.dockedColumn < editor.dock.element.children.length - 1) {
                        leftDiv = editor.dock.element.children[this.dockedColumn];
                        rightDiv = editor.dock.element.children[this.dockedColumn + 1];
                        leftData = editor.layout.layout[this.dockedColumn];
                        rightData = editor.layout.layout[this.dockedColumn + 1];
                    }
                    if (leftDiv || rightDiv) fullSizeX = (leftData.size + rightData.size) / 100;

                    //Up Down
                    if (topEdge && dockedRow > 0) {
                        topDiv = editor.dock.element.children[this.dockedColumn].children[dockedRow - 1];
                        bottomDiv = editor.dock.element.children[this.dockedColumn].children[dockedRow];
                        topData = editor.layout.layout[this.dockedColumn].contents[dockedRow - 1];
                        bottomData = editor.layout.layout[this.dockedColumn].contents[dockedRow];
                    } else if (bottomEdge && dockedRow < editor.dock.element.children[this.dockedColumn].children.length - 1) {
                        topDiv = editor.dock.element.children[this.dockedColumn].children[dockedRow];
                        bottomDiv = editor.dock.element.children[this.dockedColumn].children[dockedRow + 1];
                        topData = editor.layout.layout[this.dockedColumn].contents[dockedRow];
                        bottomData = editor.layout.layout[this.dockedColumn].contents[dockedRow + 1];
                    }
                    if (topDiv || bottomDiv) fullSizeY = (topData.size + bottomData.size) / 100;

                    //Bounding rects for all of 'em
                    let leftMost = leftDiv ? leftDiv.getBoundingClientRect() : null;
                    let rightMost = rightDiv ? rightDiv.getBoundingClientRect() : null;
                    let topMost = topDiv ? topDiv.getBoundingClientRect() : null;
                    let bottomMost = bottomDiv ? bottomDiv.getBoundingClientRect() : null;

                    document.onmouseup = () => {
                        document.onmousemove = () => {};
                        editor.Storage.setStorage("layout", editor.__serializeLayout());
                    };

                    document.onmousemove = (moveEvent) => {
                        const movedX = moveEvent.clientX;
                        const movedY = moveEvent.clientY;

                        moveEvent.preventDefault();

                        //And do our resizing
                        if (leftDiv || rightDiv) {
                            let percentage = ((movedX - leftMost.left) / (rightMost.right - leftMost.left)) * 100;
                            //Clamp that thing
                            percentage = Math.min(Math.max(percentage, 10), 90);
                            leftData.size = percentage * fullSizeX;
                            rightData.size = (100 - percentage) * fullSizeX;
                            editor.dock.refreshLayout(false);
                        }

                        if (topDiv || bottomDiv) {
                            let percentage = ((movedY - topMost.top) / (bottomMost.bottom - topMost.top)) * 100;
                            //Clamp that thing
                            percentage = Math.min(Math.max(percentage, 10), 90);
                            topData.size = percentage * fullSizeY;
                            bottomData.size = (100 - percentage) * fullSizeY;
                            editor.dock.refreshLayout(false);
                        }
                    };
                    return;
                }

                //Move the window layer
                editor.windowLayer += 1;

                this.windowDiv.style.zIndex = editor.windowLayer;

                //If we aren't edging return
                if (!edging || !this.resizable) return;

                //Clear mouse actions when done;
                document.onmouseup = () => {
                    document.onmousemove = () => {};
                    editor.Storage.setStorage("layout", editor.__serializeLayout());
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

                    this.tabs.forEach((tab) => {
                        tab.owner.resized();
                    });
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

                    //Create the objects on the tab
                    if (tabIndex > 0) {
                        const tabText = document.createElement("p");
                        tabText.innerText = tab.owner.title || tab.tabName || "Unknown Tab";
                        tabText.style.margin = "0px";
                        tabText.style.padding = "0px";

                        //Cool image
                        const detabButton = document.createElement("div");
                        detabButton.innerHTML = undockTabSVG;
                        detabButton.style.aspectRatio = "1";

                        detabButton.onclick = (event) => {
                            event.stopPropagation();

                            //Remove us from the tab propogation and reconstruct, then refresh the taskbar
                            this.tabs.splice(tabIndex, 1);
                            tab.owner.__reconstruct();
                            tab.owner.__moveToTop();

                            if (tab.owner.width < 10) tab.owner.width = 400;
                            if (tab.owner.height < 10) tab.owner.height = 400;

                            tab.content.style.opacity = "100";
                            tab.content.style.zIndex = "1";

                            this.__refreshTaskbar();
                        };

                        //add and configure the tab
                        tabElement.appendChild(tabText);
                        tabElement.appendChild(detabButton);
                    }
                    //If we are the first tab stop us from being dedocked from ourself
                    else {
                        tabElement.innerText = tab.owner.title || tab.tabName || "Unknown Tab";
                    }
                    tabElement.className = "windowTab";

                    tabElement.onclick = (event) => {
                        event.stopPropagation();

                        //Make sure the current tab exists;
                        this.tabs[this.__CurrentTab].content.style.visibility = "hidden";
                        this.tabs[this.__CurrentTab].content.style.zIndex = "0";

                        this.tabs[tabIndex].content.style.visibility = "visible";
                        this.tabs[tabIndex].content.style.zIndex = "1";
                        this.__CurrentTab = tabIndex;
                    };

                    this.titleDiv.appendChild(tabElement);
                }
            } else {
                //clear, add title
                this.titleDiv.style.gridTemplateColumns = "1fr";
                this.titleDiv.innerHTML = "";
                this.titleDiv.innerText = this.title;
            }
        }

        //For organization
        __addTab(tabOrigin, tabName) {
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

                tabOrigin.merged(this);

                //If the window has tabs, include them all
                if (tabOrigin.tabs.length > 1) {
                    for (let index = 1; index < tabOrigin.tabs.length; index += 0) {
                        const tab = tabOrigin.tabs[index];

                        //Yeah really;
                        this.__addTab(tab.owner);

                        //Remove the tab from the tabs list of the current window we are merging. Then make sure that tab def is removed from mem.
                        delete tabOrigin.tabs.splice(index, 1);
                    }
                }
            } else if (tabOrigin instanceof HTMLElement) {
                tabName = tabName || "New Tab";
                content = tabOrigin;
            } else {
                console.error("Trying to merge an invalid window object");
                return;
            }

            this.tabs.push({
                owner: tabOrigin,
                isPrimary: false,
                content: content,
                isWindow: isWindow,
                tabName: tabName,
            });

            //Approved? Maybe?
            if (content.parentElement) content.parentElement.removeChild(content);

            content.style.visibility = "hidden";
            content.style.zIndex = "0";
            this.tabs[this.__CurrentTab].content.style.zIndex = "1";
            this.contentHolder.appendChild(content);
            this.merged(this.tabOrigin);

            this.__refreshTaskbar();
        }

        __removeFromReferences() {
            this.dispose();
            if (this.windowDiv && this.windowDiv.parentElement) this.windowDiv.parentElement.removeChild(this.windowDiv);

            //Handle docked windows
            if (this.docked) {
                if (editor.layout.layout[this.dockedColumn])
                    delete editor.layout.layout[this.dockedColumn].contents.splice(
                        editor.layout.layout[this.dockedColumn].contents.findIndex((element) => this == element.content),
                        1
                    )[0];
                editor.dock.refreshLayout();
            }

            delete this.windowDiv;

            //Now we remove it from our global list of existing window objects
            const serializationList = editor.windows.__Serialization.all;
            let signifierID = Object.keys(serializationList).filter((item) => serializationList[item] == this.constructor);
            if (!signifierID) return;

            //Get our actual title
            signifierID = signifierID[0];

            //Make sure our array exists
            editor.windows.existing[signifierID];

            //Find it and remove it
            const objectIndex = editor.windows.existing[signifierID].indexOf(this);
            editor.windows.existing[signifierID].splice(objectIndex, 1);
        }

        //Allow us to destroy the window;
        _dispose() {
            if (this.closing) return;
            this.closing = true;

            //Now we destory all window objects
            this.windowDiv.onanimationend = () => {
                //Remove our tabs
                if (this.tabs.length > 1) {
                    for (let index = 1; index < this.tabs.length; index++) {
                        const tab = this.tabs[index];
                        if (!tab.isWindow) continue;
                        tab.owner.__removeFromReferences();
                    }
                }
                this.__removeFromReferences();
            };

            if (this.docked) {
                //Remove our tabs
                if (this.tabs.length > 1) {
                    for (let index = 1; index < this.tabs.length; index++) {
                        const tab = this.tabs[index];
                        if (!tab.isWindow) continue;
                        tab.owner.__removeFromReferences();
                    }
                }
                this.__removeFromReferences();
            } else {
                this.windowDiv.style.animation = "closeWindow 500ms cubic-bezier(0.65, 0, 0.35, 1) 1";
            }
        }

        //Makes the window headless for tab stuff
        __deconstruct() {
            //MAKE SURE THESE EXIST!
            if (this.TaskBar.parentElement) this.TaskBar.parentElement.removeChild(this.TaskBar);
            if (this.contentHolder.parentElement) this.contentHolder.parentElement.removeChild(this.contentHolder);
            if (this.windowDiv.parentElement) this.windowDiv.parentElement.removeChild(this.windowDiv);

            return this.Content;
        }

        //For reconstructing from a tab
        __reconstruct() {
            document.body.appendChild(this.windowDiv);
            this.windowDiv.appendChild(this.TaskBar);
            this.windowDiv.appendChild(this.contentHolder);

            //Remove the content from its current parent.
            if (this.Content.parentElement) this.Content.parentElement.removeChild(this.Content);
            this.contentHolder.appendChild(this.Content);

            return this.Content;
        }

        //Just for the extensions of this class
        init(Content) {}
        dispose() {}
        resized() {}
        merged() {}
    };

    editor.windows.__Serialization.register(editor.windows.base, "baseWindow");
})();
