!function($) {
    var mapCenterX      = 40.7142, 
        mapCenterY      = -74.006, 
        zoom            = 13,       // Map zoom
        numMarks        = 10,       // Number of markers to drop
        initDelay       = 300,      // Delay to drop the first marker
        bounceDuration  = 1500,     // Marker bouncing duration
        bounceHeight    = 750,      // Marker bouncing height
        totalDuration   = 1000,     // Total duration of dropping markers in ms
        easingType      = "linear", // 'linear', 'easeInExpo', or 'easeOutExpo'
        n               = numMarks, // Temp counter
        map, tStart;

    // Create a map
    map = L.map('map').setView([mapCenterX, mapCenterY], zoom);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: zoom, minZoom:zoom }).addTo(map);

    // Drop markers
    tStart = (new Date()).getTime();
    while (n-- > 0) {
        // Wrap the dropMarker function in another anonymous function for IE.
        // See https://developer.mozilla.org/en-US/docs/DOM/window.setTimeout#Callback_arguments
        setTimeout( function () {
            dropMarker(map, 
                rand(map.getBounds().getSouthWest().lat, map.getBounds().getNorthEast().lat), 
                rand(map.getBounds().getSouthWest().lng, map.getBounds().getNorthEast().lng), 
                true, bounceDuration, bounceHeight)
        }, initDelay + easeFuncFactory(easingType)(
            0, totalDuration * (numMarks - n) / numMarks, 0, 1000, totalDuration) - ((new Date()).getTime() - tStart));
    }

    /**
     * Return a easing function given a type string.
     * If unknown type string, return the linear function as default.
     */
    function easeFuncFactory(type) {
        var easing = {
            // x: value, t: current time, b: beginning value, 
            // c: change in value, d: duration
            linear: function (x, t, b, c, d) {
                return c * (t / d) + b;
            }, 
            easeInExpo: function (x, t, b, c, d) {
                return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
            },
            easeOutExpo: function (x, t, b, c, d) {
                return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
            }
        };
        return easing[type] || easing.linear;
    }

    /**
     * Drop a marker on a given map with bouncing effect.
     */
    function dropMarker(map, lat, lng, bounce, bounceDuration, bounceHeight) {
        L.marker([lat, lng], { 
            bounceOnAdd: bounce, 
            bounceOnAddDuration: bounceDuration, 
            bounceOnAddHeight: bounceHeight
        }).addTo(map);
    }

    /**
     * Returns a random number between min and max.
     */
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

}(jQuery);

