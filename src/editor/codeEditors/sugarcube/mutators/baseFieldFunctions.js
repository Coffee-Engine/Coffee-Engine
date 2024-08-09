(function() {
    sugarcube.fields = {
        storage:{}
    };

    sugarcube.fields.makeFromFunction = (extensionID,{color1, color2},createFunction,customRender,initilize,validate,isDropdown,fieldName) => {
        sugarcube.fields.storage[fieldName] = class extends Blockly.Field {
            //Our constructor
            constructor(value, validator) {
                super(value, validator);

                //Make the validator
                if (validate) {
                    this.doClassValidation_ = (newValue) => {
                        return sugarcube.extensionInstances[extensionID][validate](newValue);
                    }
                }
                
                //If we have a custom render or init function
                if (initilize) {
                    this.initView = () => {
                        sugarcube.extensionInstances[extensionID][initilize](this);
                    }
                }

                if (customRender) {
                    this.render_ = () => {
                        sugarcube.extensionInstances[extensionID][customRender](this.value_, this.textContent_, this);

                        this.textContent_.nodeValue = this.value_;
                        this.updateSize_();
                    }
                }

                //If we have an editor function
                if (createFunction) {
                    this.showEditor_ = () => {
                        //check if it is a dropdown. if not do not make a dropdown.
                        if (isDropdown) {
                            // Create the dropdown HTML                    
                            this.editor_ = sugarcube.extensionInstances[extensionID][createFunction](this,Blockly.DropDownDiv);
        
                            Blockly.DropDownDiv.getContentDiv().appendChild(this.editor_);
        
                            //Set its colors to match the extension colors
                            Blockly.DropDownDiv.setColour(color1, color2);
                            
                            Blockly.DropDownDiv.showPositionedByField(
                                this, this.widgetDispose_.bind(this));
        
                        }
                        else {
                            // Show our widget
                            Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, this.widgetDispose_.bind(this));
        
                            // Create the widget.
                            let widget = sugarcube.extensionInstances[extensionID][createFunction](this,Blockly.WidgetDiv);                    
                            Blockly.WidgetDiv.getDiv().appendChild(widget);
                        }
                    }
                }
            
                //Make it serialize.
                this.SERIALIZABLE = true;
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