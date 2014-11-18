(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util = function() {};

  var inherits = Util.inherits = function (subClass, superClass) {
    function Surrogate() {};
    Surrogate.prototype = superClass.prototype;
    subClass.prototype = new Surrogate();
  };

  // Normalize the length of the vector, maintaining direction.
  var dir = Util.dir = function (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  };

  // Distance between two coordinates.
  var dist = Util.dist = function(pos1, pos2) {
    return  Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  };

  // Gets the length of a vector (aka magnitude, speed)
  var norm = Util.norm = function (vec) {
    return Util.dist([0,0], vec);
  };

  // Return a random direction * length
  var randomVec = Util.randomVec = function (length) {
    var deg = 2 * Math.PI * Math.random();

    return scale([Math.sin(deg), Math.cos(deg)], length);
  };

  // Scale the length of a vector by a given magnitude
  var scale = Util.scale = function(vec, m) {
    return [vec[0] * m, vec[1] * m];
  };





})();
