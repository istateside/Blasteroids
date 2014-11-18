(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject = function(options) {
    this.game = options.game;

    this.angle = options.angle;
    this.facingX = this.currentDir()[0];
    this.facingY = this.currentDir()[1];

    if (typeof options.movingX === 'undefined') {
      this.movingX = (this.facingX * this.SPEED);
    } else {
      this.movingX = options.movingX;
    }

    if (typeof options.movingY === 'undefined') {
      this.movingY = (this.facingY * this.SPEED);
    } else {
      this.movingY = options.movingY;
    }

    this.pos = options.pos;
    this.radius = options.radius;
    this.color = options.color;
  };

  MovingObject.prototype.toRadians = function (degrees) {
    return (degrees * (Math.PI / 180))
  };

  MovingObject.prototype.directionFromAngle = function (angleRads) {
    return [Math.cos(angleRads), Math.sin(angleRads)];
  };

  MovingObject.prototype.currentDir = function () {
    var rads = this.toRadians(this.angle);
    return [Math.cos(rads), Math.sin(rads)];
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
    ctx.fill();
  };

  MovingObject.prototype.collideWith = function () {
  };

  MovingObject.prototype.isCollidedWith = function (otherObj) {
    return (Asteroids.Util.dist(this.pos, otherObj.pos) < (this.radius + otherObj.radius));
  };

  MovingObject.prototype.move = function () {
    this.pos[0] += this.movingX;
    this.pos[1] += this.movingY;
    this.pos = this.game.wrap(this.pos);
  };

  // returns degrees
  MovingObject.prototype.randomAngle = function () {
    return (Math.random() * 360);
  };

  MovingObject.prototype.remove = function () {
    this.game.remove(this);
  };

  MovingObject.prototype.rotate = function (angle) {
    var angleRads = this.toRadians(angle + this.angle);

    this.facingX = Math.cos(angleRads);
    this.facingY = Math.sin(angleRads);

    this.angle += angle
  };

  MovingObject.prototype.thrust = function(thrustAccel) {
    var newMovingX = this.movingX + thrustAccel * this.currentDir[0];
    var newMovingY = this.movingY + thrustAccel * this.currentDir[1];

    var newVel = this.velocity(newMovingX, newMovingY);
    var oldVel = this.velocity(this.movingX, this.movingY);

    // if (newVel < Ship.MAX_VELOCITY) {
      this.movingX = newMovingX;
      this.movingY = newMovingY;
    // }
  };

  MovingObject.prototype.velocity = function (x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  };
})();
