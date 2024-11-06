(function() {
    editor.engineScript = class extends HTMLElement {
        connectedCallback() {            
            if (this.hasAttribute("src")) {
                //Fetch the script we need;
                const script = document.createElement("script");
                if (this.hasAttribute("async")) script.async = true;
                fetch(this.getAttribute("src")).then((response) => response.text()).then(text => {
                    if (!text) return;
                    
                    //Add our script
                    script.innerHTML = text;
                });
                document.body.appendChild(script);
            }
        }
    }
    
    customElements.define("engine-script", editor.engineScript);
})();