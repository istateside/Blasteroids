(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function() {
    this.asteroids = [];
    this.bullets = [];
    this.ship = new Asteroids.Ship({
      game: this,
      pos: [this.DIM_X/2, this.DIM_Y/2]
    });
    this.addAsteroids();
  };

  Game.prototype.DIM_X = 800;
  Game.prototype.DIM_Y = 600;
  Game.prototype.NUM_ASTEROIDS = 10;

  Game.prototype.addAsteroids = function () {
    var that = this;
    _.times(this.NUM_ASTEROIDS, function(n){
      that.asteroids.push(new Asteroids.Asteroid(
        {
          game: that
        }
      ))
    })
  };

  Game.prototype.allObjects = function () {
    return []
      .concat(this.asteroids)
      .concat(this.ship)
      .concat(this.bullets);
  };

  Game.prototype.checkCollisions = function () {
    var that = this;

    _.each(that.allObjects(), function (obj1) {
      _.each(that.allObjects(), function (obj2) {
        if (obj1 == obj2) {
          return
        }

        if (obj1.isCollidedWith(obj2)) {
          if (typeof obj2 === 'undefined') {
            debugger
          }
          obj1.collideWith(obj2);
          return
        }
      })
    });
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0,0,this.DIM_X,this.DIM_Y);

    _.each(this.allObjects(), function(obj) {
      obj.draw(ctx);
    })
  };
  Game.prototype.moveObjects = function () {
    _.each(this.allObjects(), function(obj) {
      obj.move();
    })
  };

  Game.prototype.randomPos = function () {
    var x = Math.random() * this.DIM_X;
    var y = Math.random() * this.DIM_Y;
    return [x, y];
  };

  Game.prototype.remove = function (obj) {
    if (obj instanceof Asteroids.Bullet) {
      this.bullets.splice(this.bullets.indexOf(obj), 1);
    } else if (obj instanceof Asteroids.Asteroid) {
      var index = this.asteroids.indexOf(obj);
      this.asteroids[index] = new Asteroids.Asteroid({
        game: this
      });
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.step = function () {
    this.moveObjects();
    this.checkCollisions();
  };

  Game.prototype.wrap = function (pos) {
    return [wrap(pos[0], this.DIM_X), wrap(pos[1], this.DIM_Y)];

    function wrap(coord, max) {
      if (coord < 0) {
        return max - (coord % max);
      } else if (coord > max) {
        return coord % max;
      } else {
        return coord;
      }
    }
  };
})();
