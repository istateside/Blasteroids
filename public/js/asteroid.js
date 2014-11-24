(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function(options) {
    options.color = this.COLOR;
    options.radius = Math.floor((Math.random() * this.MAX_RADIUS) + this.MIN_RADIUS);

    options.pos = options.game.randomPos();
    options.angle = this.randomAngle();

    options.movingX = (Math.random() * 2 - 1) * this.MAX_SPEED;
    options.movingY = (Math.random() * 2 - 1) * this.MAX_SPEED;

    Asteroids.MovingObject.call(this, options);
    this.update();
  };

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.prototype.collideWith = function (obj2) {
    if (obj2 instanceof Asteroids.Ship) {
      obj2.getHit();
    } else if ((obj2 instanceof Asteroids.Asteroid) && (obj2 !== this)) {
      var obj1 = this;
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
    }
  };

  Asteroid.prototype.COLOR = "#875800"
  Asteroid.prototype.MAX_RADIUS = 30;
  Asteroid.prototype.MIN_RADIUS = 15;
  Asteroid.prototype.RADIUS = 15;
  Asteroid.prototype.MAX_SPEED = 2;
  Asteroid.prototype.isWrappable = true;
})();
