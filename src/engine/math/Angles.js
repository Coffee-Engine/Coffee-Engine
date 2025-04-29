(function() {
    //? Precalc, division is slow
    const radianMagicNumber = (Math.PI/180);
    const degreeMagicNumber = (180/Math.PI);
    coffeeEngine.deg2Rad = deg => deg * radianMagicNumber;
    coffeeEngine.rad2Deg = rad => rad * degreeMagicNumber;
})();