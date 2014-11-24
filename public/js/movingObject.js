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
    this.mass = options.mass || this.radius;
    this.color = options.color;
  };

  MovingObject.prototype.toRadians = function (degrees) {
    return (degrees * (Math.PI / 180))
  };

  MovingObject.prototype.currentDir = function () {
    var rads = this.toRadians(this.angle);
    return [Math.cos(rads), Math.sin(rads)];
  };

  MovingObject.prototype.directionFromAngle = function (angleRads) {
    return [Math.cos(angleRads), Math.sin(angleRads)];
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

  MovingObject.prototype.couldCollide = function (otherObj) {
    // AABB collision detection, slightly larger than the actual circle.
    return (Asteroids.Util.dist(this.nextPos(), otherObj.nextPos()) < (this.radius + otherObj.radius * 1.5));
  };

  MovingObject.prototype.isCollidedWith = function (otherObj) {
    return (Asteroids.Util.dist(this.nextPos(), otherObj.nextPos()) < (this.radius + otherObj.radius));
  };

  MovingObject.prototype.checkPos = function (ship) {
    var that = this;
    var goodPosition = false;
    while(!goodPosition) {
      goodPosition = true;
      var otherAsteroids = that.game.asteroids;
      _.each(otherAsteroids, function(obj) {
        if ((that !== obj) && (that.couldCollide(obj))) {
          goodPosition = false;

          that.pos = that.game.randomPos();
          that.update();
        }
      })
    }
  };

  MovingObject.prototype.update = function () {
    this.nextX = this.pos[0] + this.movingX;
    this.nextY = this.pos[1] + this.movingY;
  };

  MovingObject.prototype.move = function () {
    this.pos[0] = this.nextX;
    this.pos[1] = this.nextY;
    this.pos = this.game.wrap(this.pos);
  };

  MovingObject.prototype.nextPos = function () {
    return [this.nextX, this.nextY];
  };

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

  MovingObject.prototype.velocity = function (x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  };

  MovingObject.prototype.thrust = function(thrustAccel) {
    var newMovingX = this.movingX + thrustAccel * this.currentDir[0];
    var newMovingY = this.movingY + thrustAccel * this.currentDir[1];
    
    var newVel = this.velocity(newMovingX, newMovingY);
    var oldVel = this.velocity(this.movingX, this.movingY);

    this.movingX = newMovingX;
    this.movingY = newMovingY;
  };
})();
