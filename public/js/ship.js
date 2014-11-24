
(function() {
  if (typeof Asteroids === 'undefined') {
    window.Asteroids = {};
  }

  var Ship = Asteroids.Ship = function(options) {
    options.radius = this.RADIUS;
    options.color = this.COLOR;

    options.angle = 270;

    options.movingX = 0;
    options.movingY = 0;

    Asteroids.MovingObject.call(this, options);
  }

  Asteroids.Util.inherits(Ship, Asteroids.MovingObject);

  Ship.prototype.RADIUS = 15;
  Ship.prototype.COLOR = "#fff";

  Ship.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    var x = this.pos[0];
    var y = this.pos[1];

    var cx = x + (7.5);
    var cy = y + (7.5);

    var rotation = (Math.PI / 180) * this.angle;

    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();

    ctx.moveTo(15, 0);
    ctx.lineTo(-15, -15);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-15, 15);
    ctx.lineTo(15, 0);
    ctx.fill();

    ctx.rotate(rotation * -1);
    ctx.translate(-x, -y);
  };

  Ship.prototype.fireBullet = function () {
    this.game.bullets.push(new Asteroids.Bullet({
      pos: this.pos,
      angle: this.angle,
      game: this.game
    }))
  };

  Ship.prototype.getHit = function () {
    this.game.lives--
    this.relocate();
  };

  Ship.prototype.relocate = function () {
    this.pos = this.game.randomPos();
    this.checkPos();

    this.movingX = 0;
    this.movingY = 0;
    this.update();
  };

  Ship.prototype.thrust = function(thrustAccel) {
    var newMovingX = this.movingX + thrustAccel * this.facingX;
    var newMovingY = this.movingY + thrustAccel * this.facingY;

    var newVel = this.velocity(newMovingX, newMovingY);
    var oldVel = this.velocity(this.movingX, this.movingY);
    if (newVel < this.MAX_VELOCITY) {
      this.movingX = newMovingX;
      this.movingY = newMovingY;
    }
  };

  Ship.prototype.isWrappable = true;
  Ship.prototype.MAX_VELOCITY = 7;
}());
