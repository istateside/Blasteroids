(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Asteroid = Asteroids.Asteroid = function(options) {
    options.color = this.COLOR;
    options.radius = (Math.random() * 20) + this.RADIUS;

    options.pos = options.game.randomPos();

    options.angle = this.randomAngle();

    options.movingX = (Math.random() * 2 - 1) * this.MAX_SPEED;
    options.movingY = (Math.random() * 2 - 1) * this.MAX_SPEED;

    Asteroids.MovingObject.call(this, options);
  };

  Asteroids.Util.inherits(Asteroid, Asteroids.MovingObject);

  Asteroid.prototype.collideWith = function (otherObj) {
    if (otherObj instanceof Asteroids.Ship) {
      otherObj.relocate();
    }
  };

  Asteroid.prototype.COLOR = "#875800"
  Asteroid.prototype.RADIUS = 15;
  Asteroid.prototype.MAX_SPEED = 2;
  Asteroid.prototype.isWrappable = true;
})();
