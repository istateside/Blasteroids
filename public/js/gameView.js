(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function (options){
    this.game = options.game;
    this.ctx = options.ctx;
    this.bindKeyHandlers();
    this.lastBulletFire = (+Date.now());
    console.log(this.lastBulletFire);
  };

  GameView.MOVES = {
    "w": [ 0, -1],
    "a": [-1,  0],
    "s": [ 0,  1],
    "d": [ 1,  0],
  };

  GameView.prototype.bindKeyHandlers = function () {
    var ship = this.game.ship;

    this.game.keys = [];
    onkeydown = onkeyup = function(e){
      e = e || event; // to deal with IE
      this.game.keys[e.keyCode] = (e.type == 'keydown');
    }
  };

  GameView.prototype.start = function () {
    var that = this;
    window.setInterval(function() {
      that.game.step();
      that.game.draw(that.ctx);
    }, 20);

    window.setInterval(function() {
      if(that.game.keys['37'] || that.game.keys['65']) {
        that.game.ship.rotate(-5)
      }

      if(that.game.keys['68'] || that.game.keys['39']) {
        that.game.ship.rotate(5)
      }

      if(that.game.keys['87'] || that.game.keys['38']) {
        that.game.ship.thrust(0.1);
      }

      if (that.game.keys['70'] || that.game.keys['32']) {
        var shotDiff = ((+Date.now()) - that.lastBulletFire);
        if (shotDiff > 200) {
          that.lastBulletFire = +Date.now();
          that.game.ship.fireBullet();
        }
      }


    }, 10);
  };

})();
