(function() {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game = function() {
    this.initializeParse();
    this.asteroids = [];
    this.bullets = [];
  };

  Game.prototype.setView = function (gameView) {
    this.gameView = gameView;
  };

  Game.prototype.DIM_X = 800;
  Game.prototype.DIM_Y = 600;
  Game.prototype.NUM_ASTEROIDS = 15;

  Game.prototype.initializeParse = function() {
    Parse.initialize("j4BxIqVUXdxLVRWizb2umZgWJCPKX2P8TkjJ3xAt", "tSIuvSapiBc278BbrPW8j7YxII79YBMyG4aIjDLO");
  };

  Game.prototype.addAsteroids = function() {
    var that = this;
    this.asteroids = [];
    this.bullets = [];
    _.times(this.NUM_ASTEROIDS, function(n) {
      that.addAsteroid();
      that.checkAsteroids();
    })

  };

  Game.prototype.addAsteroid = function() {
    this.asteroids.push(new Asteroids.Asteroid({
      game: this
    }));
  };

  Game.prototype.addShip = function() {
    this.ship = new Asteroids.Ship({
      game: this,
      pos: [this.DIM_X / 2, this.DIM_Y / 2]
    });
  };

  Game.prototype.allObjects = function() {
    return []
      .concat(this.bullets)
      .concat(this.ship)
      .concat(this.asteroids);
  };

  Game.prototype.checkAsteroids = function() {
    _.each(this.asteroids, function(asteroid) {
      asteroid.checkPos();
    })
  };

  Game.prototype.checkCollisions = function() {
    var that = this;
    var objects = this.allObjects();

    _.each(this.allObjects(), function(obj1) {
      _.each(that.allObjects(), function(obj2) {
        if (obj1 !== obj2) {
          if (obj1.isCollidedWith(obj2)) {
            obj1.collideWith(obj2);
          }
        }
      })
    });
  };

  Game.prototype.checkGameOver = function () {
    if (this.isGameOver()) {
      this.gameView.gameOverSeq();
      return;
    }
  };

  Game.prototype.isGameOver = function() {
    return ((this.lives < 1) || (_.isEmpty(this.asteroids)))
  };

  Game.prototype.moveObjects = function() {
    _.each(this.allObjects(), function(obj) {
      obj.move();
    });
  };

  Game.prototype.updateObjects = function() {
    _.each(this.allObjects(), function(obj) {
      obj.update();
    });
  };

  Game.prototype.randomPos = function() {
    var x = Math.random() * this.DIM_X;
    var y = Math.random() * this.DIM_Y;
    return [x, y];
  };

  Game.prototype.remove = function(obj) {
    if (obj instanceof Asteroids.Bullet) {
      this.bullets.splice(this.bullets.indexOf(obj), 1);
    } else if (obj instanceof Asteroids.Asteroid) {
      var index = this.asteroids.indexOf(obj);
      debugger
      this.asteroids.splice(index, 1);
      this.score += 100;
      this.addAsteroid();
    } else {
      throw "wtf?";
    }
  };

  Game.prototype.startNew = function () {
    this.addAsteroids();
    this.addShip();
    this.score = 0;
    this.lives = 3;
  };

  Game.prototype.step = function() {
    this.updateObjects();
    this.checkCollisions();
    this.moveObjects();
    this.checkGameOver();
  };

  Game.prototype.wrap = function(pos) {
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
