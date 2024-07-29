(function() {
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
    `

    //This will contain the editor's windows
    editor.windowLayer = 0;
    editor.windows = {};

    //this is the base window class
    editor.windows.base = class {

        //Manage our dock status
        #docked = false;
        set docked(value) {
            this.#docked = value;

            if (!value) {
                this.windowDiv.style.position = "absolute";
            }
            else {
                this.windowDiv.style.position = "static";
            }
        }
        get docked() {return this.#docked;}

        //Determines if the window is resizable.
        resizable = true;

        //Window width and height managers
        #width = 128;
        #height = 128;

        set width(value) {
            this.windowDiv.style.width = `${value}px`;
        }
        get width() {return this.#width;}

        set height(value) {
            this.windowDiv.style.height = `${value}px`;
        }
        get height() {return this.#height;}

        #title = "Window";
        set title(value) {
            this.#title = value;
            this.__updateTitle();
        }
        get title() {return this.#title}

        //Have this so we can't repeat the closing animation
        closing = false;

        constructor(title, width, height) {
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
            this.closeButton.onclick = () => {this.dispose()};

            //Make the title have no interaction
            this.titleDiv.style.pointerEvents = "none";
            this.titleDiv.style.userSelect = "none";

            this.TaskBar.appendChild(this.titleDiv);
            this.TaskBar.appendChild(this.closeButton);

            //Update title and apply to window
            this.__updateTitle();
            this.windowDiv.appendChild(this.TaskBar);
        }

        __updateTitle() {
            if (this.titleDiv) this.titleDiv.innerText = this.title;
        }

        __createContentDiv() {
            //Create and define our content div
            this.Content = document.createElement("div");
            this.Content.style.width = "100%";
            this.Content.style.overflow = "auto";
            
            //Add it to the window
            this.windowDiv.appendChild(this.Content);
        }

        __createMoveableWindow() {
            this.TaskBar.onmousedown = (downEvent) => {
                if (this.docked) return;

                editor.windowLayer += 1;
                
                const boundingRect = this.TaskBar.getBoundingClientRect();
                const {width, height} = this.windowDiv.getBoundingClientRect();

                const mouseOffsetX = boundingRect.left - downEvent.clientX;
                const mouseOffsetY = boundingRect.top - downEvent.clientY;

                const edging = (Math.abs(boundingRect.left - downEvent.clientX) <= 2) ||
                (Math.abs(boundingRect.top - downEvent.clientY) <= 2) ||
                (Math.abs((boundingRect.left + width) - downEvent.clientX) <= 4) ||
                (Math.abs((boundingRect.top + height) - downEvent.clientY) <= 4);

                const rightEdging = (Math.abs((boundingRect.left + width) - downEvent.clientX) <= 4);
                const bottomEdging = (Math.abs((boundingRect.top + height) - downEvent.clientY) <= 4);

                this.windowDiv.style.left = `${downEvent.clientX + mouseOffsetX}px`;
                this.windowDiv.style.top = `${downEvent.clientY + mouseOffsetY}px`;
                this.windowDiv.style.zIndex = editor.windowLayer;

                //Clear mouse actions when done;
                this.TaskBar.onmouseup = () => {
                    document.onmousemove = () => {}
                }

                if (edging) {
                    document.onmousemove = (moveEvent) => {
                        if (!this.windowDiv) {
                            document.onmousemove = () => {};
                            return;
                        }
                        this.windowDiv.style.left = `${moveEvent.clientX + mouseOffsetX}px`;
                        this.windowDiv.style.top = `${moveEvent.clientY + mouseOffsetY}px`;
                    }

                    return;
                }

                document.onmousemove = (moveEvent) => {
                    if (!this.windowDiv) {
                        document.onmousemove = () => {};
                        return;
                    }
                    this.windowDiv.style.left = `${moveEvent.clientX + mouseOffsetX}px`;
                    this.windowDiv.style.top = `${moveEvent.clientY + mouseOffsetY}px`;
                }
            }
        }

        //Allow us to destroy the window;
        dispose() {
            if (this.closing) return;
            this.closing = true;
            
            //Now we destory all window objects
            this.windowDiv.onanimationend = () => {
                this.windowDiv.parentElement.removeChild(this.windowDiv);
                delete this.windowDiv;
            }

            this.windowDiv.style.animation = "closeWindow 500ms cubic-bezier(0.65, 0, 0.35, 1) 1";
        }

        //Just for the extensions of this class
        init(Content) {}
    }
})();