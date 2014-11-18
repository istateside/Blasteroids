(function() {
  if (typeof Asteroids === 'undefined') {
    window.Asteroids = {};
  }

  var Bullet = Asteroids.Bullet = function(options) {
    options.radius = this.RADIUS;
    options.color = this.COLOR;

    Asteroids.MovingObject.call(this, options);
  };

  Asteroids.Util.inherits(Bullet, Asteroids.MovingObject);

  Bullet.prototype.RADIUS = 2;
  Bullet.prototype.COLOR = "#ff0000";
  Bullet.prototype.SPEED = 15;

  Bullet.prototype.collideWith = function (obj) {
    if (obj instanceof Asteroids.Asteroid) {
      obj.remove();
      this.remove();
    }
  };

  Bullet.prototype.move = function () {
    this.pos[0] += this.movingX;
    this.pos[1] += this.movingY;
  };

  Bullet.prototype.isWrappable = false;
}());
