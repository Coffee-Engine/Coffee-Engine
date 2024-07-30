(function () {
  coffeeEngine.inputs = {
    keys: {},
  };

  window.addEventListener("keydown", (event) => {
    coffeeEngine.inputs.keys[event.key] = true;
  });

  window.addEventListener("keyup", (event) => {
    coffeeEngine.inputs.keys[event.key] = false;
  });
})();
