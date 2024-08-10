(function() {
    sugarcube.fields = {
        storage:{}
    };

    sugarcube.fields.makeFromFunction = (extensionID,fieldData,fieldName) => {
        sugarcube.fields.storage[fieldName] = class extends Blockly.Field {
            foreignObject_ = null;

            //Our constructor
            constructor(value, validator) {
                super(value, validator);

                //Make the validator
                if (fieldData.validate) {
                    this.doClassValidation_ = (newValue) => {
                        return sugarcube.extensionInstances[extensionID][fieldData.validate](newValue);
                    }
                }
                
                //If we have a custom render or init function
                if (fieldData.initilize) {
                    this.initView = () => {
                        sugarcube.extensionInstances[extensionID][fieldData.initilize](this);
                        this.updateSize_();
                    }
                }

                if (fieldData.render) {
                    this.render_ = () => {
                        sugarcube.extensionInstances[extensionID][fieldData.render](this.value_, this.textContent_, this);

                        this.textContent_.nodeValue = this.value_;
                        this.updateSize_();
                    }
                }

                if (fieldData.sizeOverride) {
                    switch (typeof fieldData.sizeOverride) {
                        case "string":
                            this.updateSize_ = () => {
                                const newSize = sugarcube.extensionInstances[extensionID][fieldData.sizeOverride](this.value_,this);

                                if (Array.isArray(newSize)) {
                                    this.size_.width = newSize[0];
                                    this.size_.height = newSize[1];
                                    return;
                                }

                                switch (typeof newSize) {
                                    case "object":
                                        this.size_.width = newSize.width || 10;
                                        this.size_.height = newSize.height || 10;
                                        break;

                                    case "number":
                                        this.size_.width = newSize || 10;
                                        this.size_.height = newSize || 10;
                                        break;
                                
                                    default:
                                        break;
                                }
                            }
                            break;

                        case "number":
                            this.updateSize_ = () => {
                                this.size_.width = fieldData.sizeOverride;
                                this.size_.height = fieldData.sizeOverride;
                            }
                            break;

                        case "object":
                            if (Array.isArray(fieldData.sizeOverride)) {
                                this.updateSize_ = () => {
                                    this.size_.width = fieldData.sizeOverride[0];
                                    this.size_.height = fieldData.sizeOverride[1];
                                }
                                break;
                            }

                            this.updateSize_ = () => {
                                this.size_.width = fieldData.sizeOverride.width;
                                this.size_.height = fieldData.sizeOverride.height;
                            }
                            break;
                    
                        default:
                            break;
                    }
                }

                //If we have an editor function
                if (fieldData.editor) {
                    this.showEditor_ = () => {
                        //check if it is a dropdown. if not do not make a dropdown.
                        if (fieldData.isDropdown) {
                            // Create the dropdown HTML                    
                            this.editor_ = sugarcube.extensionInstances[extensionID][fieldData.editor](this,Blockly.DropDownDiv);
        
                            Blockly.DropDownDiv.getContentDiv().appendChild(this.editor_);
        
                            //Set its colors to match the extension colors
                            Blockly.DropDownDiv.setColour(fieldData.color1, fieldData.color2);
                            
                            Blockly.DropDownDiv.showPositionedByField(
                                this, this.widgetDispose_.bind(this));
        
                        }
                        else {
                            // Show our widget
                            Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_.bind(this));
        
                            // Create the widget.
                            let widget = sugarcube.extensionInstances[extensionID][fieldData.editor](this,Blockly.WidgetDiv);                    
                            Blockly.WidgetDiv.getDiv().appendChild(widget);
                        }
                    }
                }
            
                //Make it serialize.
                this.SERIALIZABLE = true;
            }

            createForeignObject_(width,height,offsetX,offsetY) {
                const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                foreignObject.setAttribute("width", width || 100);
                foreignObject.setAttribute("height", height || 100);
                foreignObject.setAttribute("x", offsetX || 0);
                foreignObject.setAttribute("y", offsetY || 0);

                this.fieldGroup_.appendChild(foreignObject);

                this.foreignObject_ = foreignObject;

                return foreignObject
            }

            widgetDispose_() {
                if (!this.editorListeners_) return;
                
                for (let i = this.editorListeners_.length, listener;
                    listener = this.editorListeners_[i]; i--) {
                  Blockly.browserEvents.unbind(listener);
                  this.editorListeners_.pop();
                }
            }
        }
        
        sugarcube.fields.storage[fieldName].fromJson = function(options) {
            const value = Blockly.utils.parsing.replaceMessageReferences(options['value']);
            return new sugarcube.fields.storage[fieldName](value);
        }

        Blockly.fieldRegistry.register(fieldName, sugarcube.fields.storage[fieldName]);
    }
})();