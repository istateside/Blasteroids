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
  var scale = Util.prototype.scale = function(vec, m) {
    return [vec[0] * m, vec[1] * m];
  };

  var elasticCollision = Util.elasticCollision = function (obj1, obj2) {
    var dx = obj1.nextX - obj2.nextX;
    var dy = obj1.nextY - obj2.nextY;

    var collisionAngle = Math.atan2(dy, dx);

    var speed1 = obj1.velocity(obj1.movingX, obj1.movingY);
    var speed2 = obj2.velocity(obj2.movingX, obj2.movingY);

    var direction1 = Math.atan2(obj1.movingY, obj1.movingX);
    var direction2 = Math.atan2(obj2.movingY, obj2.movingX);

    var velocityX1 = speed1 * Math.cos(direction1 - collisionAngle);
    var velocityY1 = speed1 * Math.sin(direction1 - collisionAngle);
    var velocityX2 = speed2 * Math.cos(direction2 - collisionAngle);
    var velocityY2 = speed2 * Math.sin(direction2 - collisionAngle);

    var mass1 = obj1.mass
    var mass2 = obj2.mass

    var finalVelocityX1 = ((mass1 - mass2) * velocityX1 + (2 * mass2) * velocityX2) / (mass1 + mass2);
    var finalVelocityY1 = velocityY1;
    var finalVelocityX2 = ((mass2 - mass1) * velocityX2 + (2 * mass1) * velocityX1) / (mass1 + mass2);
    var finalVelocityY2 = velocityY2;

    obj1.movingX = Math.cos(collisionAngle) * finalVelocityX1 + Math.cos(collisionAngle + Math.PI/2) * finalVelocityY1;
    obj1.movingY = Math.sin(collisionAngle) * finalVelocityX1 + Math.sin(collisionAngle + Math.PI/2) * finalVelocityY1;
    obj2.movingX = Math.cos(collisionAngle) * finalVelocityX2 + Math.cos(collisionAngle + Math.PI/2) * finalVelocityY2;
    obj2.movingY = Math.sin(collisionAngle) * finalVelocityX2 + Math.sin(collisionAngle + Math.PI/2) * finalVelocityY2;

    obj1.update();
    obj2.update();
  };



})();
