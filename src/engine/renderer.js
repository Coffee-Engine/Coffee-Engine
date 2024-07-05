(function() {
    //Just set up the renderer. Not much to do here.
    coffeeEngine.renderer = {};
    coffeeEngine.renderer.canvas = document.getElementById("coffeeEngine-canvas");
    coffeeEngine.renderer.daveshade = DaveShade.createInstance(coffeeEngine.renderer.canvas);
})();