(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameView = Asteroids.GameView = function (options){
    this.game = options.game;
    this.ctx = options.ctx;
    this.uiCtx = options.uiCtx;

    this.reset();
    this.game.setView(this);
  };

  GameView.prototype.reset = function () {
    this.bindKeyHandlers();
    this.lastBulletFire = (+Date.now());

    this.alphIndex = 0;
    this.nameIndex = 0;
    this.username = [" ", " ", " "];
  };

  GameView.prototype.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!?@#$%_ ";
  GameView.prototype.bindKeyHandlers = function () {
    var ship = this.game.ship;

    this.game.keys = {};
    $(window).on("keydown keyup", function(e) {
      this.game.keys[e.keyCode] = (e.type == 'keydown');
    })
  };
    // onkeydown = onkeyup = function(e){
    //   e = e || event;
    //
    // }

  GameView.prototype.start = function () {
    var that = this;

    this.game.startNew();

    var throttledFire = _.throttle(that.game.ship.fireBullet, 200);

    this.gameFrame = window.setInterval(function() {
      that.drawGame(that.ctx);
      that.drawUI(that.uiCtx);
      that.game.step();
    }, 20);

    this.scoreCounter = window.setInterval(function() {
      that.game.score += 1
    }, 100);

    this.checkKeys = window.setInterval(function() {
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

  GameView.prototype.drawGame = function (ctx) {
    ctx.clearRect(0,0,this.game.DIM_X,this.game.DIM_Y);

    _.each(this.game.allObjects(), function(obj) {
      obj.draw(ctx);
    });

    this.drawUI(this.uiCtx);
  };

  GameView.prototype.drawUI = function (UI) {
    this.drawScore(UI);
    this.drawLives(UI);
  };

  GameView.prototype.drawScore = function (UI) {
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score:" + this.game.score, 790, 50);
  };

  GameView.prototype.drawLives = function (UI) {
    ctx.font = "bold 30px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "#fff";
    ctx.fillText("Lives: ", 10, 50);
    var x = 120;
    var y = 40;

    _.times(this.game.lives, function (UI) {
      var cx = x + (7.5);
      var cy = y + (7.5);

      var rotation = (Math.PI / 180) * 270;
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
      x += 40;
    })
  };

  GameView.prototype.gameOverSeq = function () {
    clearInterval(this.checkKeys);
    clearInterval(this.scoreCounter);
    clearInterval(this.gameFrame);
    this.ctx.clearRect(0,0,this.game.DIM_X,this.game.DIM_Y);
    this.endOfGame();
  };

  GameView.prototype.endOfGame = function () {
    var ui = this.uiCtx;
    ui.font = "bold 100px sans-serif";
    ui.textAlign = "center";
    ui.fillStyle = "#fff";
    ui.fillText("GAME OVER", 400, 100);

    this.getHighScores(ui);
  };

  GameView.prototype.getHighScores = function (ui) {
    var that = this;
    var query = new Parse.Query("GameScore");
    ui.font = "40px sans-serif"
    ui.fillText("Loading high scores...", 400, 300);

    query.descending('score').limit(10).find({
      success: function(results) {
        that.showHighScores(results, ui);
        that.getUsername(ui);
      },
      error: function(error) {
        that.throwError(ui);
      }
    })
  };

  GameView.prototype.showHighScores = function (scores, ui) {
    ui.clearRect(0, 150, 800, 600);
    ui.font = "50px sans-serif"
    ui.textAlign = "left"
    ui.fillText("HIGH SCORES", 10, 170)

    ui.font = "30px sans-serif"

    var y = 200;
    var ranking = 1;
    _.each(scores, function(scoreObj) {
      var score = scoreObj.get('score');
      var username = scoreObj.get('username');
      ui.textAlign = "left";
      ui.fillText(ranking + ". ", 20, y);
      ui.fillText(username + ":", 70, y);
      ui.textAlign = "right";
      ui.fillText(score, 330, y);
      ranking++;
      y += 30
    })
  };

  GameView.prototype.throwError = function (error) {
    ui.clearRect(0, 200, 800, 600);
    ui.font = "30px sans-serif";
    ui.textAlign = "left";
    ui.fillText("Error grabbing high scores :(", 180, 170);
  };

  GameView.prototype.getUsername = function (ui) {
    ui.textAlign = "left";
    ui.font = "30px sans-serif";
    ui.fillText("Your score: " + this.game.score, 400, 170);
    ui.fillText("Enter name with arrow keys.", 400, 240);
    ui.fillText("Submit with enter.", 400, 280);

    ui.font = "50px sans-serif";

    ui.textAlign = "center";

    var that = this;
    var view = this;
    view.namePrint = window.setInterval(function() {
      ui.clearRect(420, 300, 300, 60);
      ui.fillText(view.username[0], 450, 350);
      ui.fillText(view.username[1], 500, 350);
      ui.fillText(view.username[2], 550, 350);
    }, 100);

    var blink = true;
    view.underLine = window.setInterval(function() {
      ui.clearRect(430, 360, 300, 50);
      if (blink) {
        var x = 430 + (view.nameIndex * 50);
        ui.beginPath();
        ui.moveTo(x, 365);
        ui.lineTo(x + 40, 365);
        ui.lineWidth = 5;
        ui.strokeStyle = "#fff";
        ui.stroke();
      }
      blink = !blink
    }, 400);


    view.getKeysTyped = $(window).on('keydown', this.handleTyping.bind(that));
  };


  GameView.prototype.handleTyping = function (e) {
    e = e || event;
    switch (e.keyCode) {
      case 13:
        (this.nameIndex === 2) ? this.submitScore() : this.nameIndex++;
        break;
      case 37:
        if (this.nameIndex > 0) {
          this.nameIndex--;
          this.alphIndex = this.ALPHABET.indexOf(this.username[this.nameIndex]);
        }
        break;
      case 38:
        this.alphIndex++;
        if (this.alphIndex > 32) { this.alphIndex = (this.alphIndex % 32) }
        break;
      case 39:
        if (this.nameIndex < 2) {
          this.nameIndex++;
          this.alphIndex = this.ALPHABET.indexOf(this.username[this.nameIndex]);
        }
        break;
      case 40:
        this.alphIndex--;
        if (this.alphIndex < 0) { this.alphIndex = 32 }
        break;
    };
    this.username[this.nameIndex] = this.currLetter(this.alphIndex);
  };

  GameView.prototype.currLetter = function (idx) {
    return this.ALPHABET[ idx % 32 ];
  };

  GameView.prototype.submitScore = function () {
    window.removeEventListener("keydown", this.handleKeys)
    var username = this.username.join('');
    var score = this.game.score;
    var scoreObj = new Parse.Object("GameScore", {score: score, username: username});
    this.uiCtx.clearRect(400, 130, 800, 600);
    this.uiCtx.font = "20px sans-serif";
    this.uiCtx.fillText("Uploading score...", 600, 300);
    scoreObj.save({success: this.playAgain(this.uiCtx)});
  };

  GameView.prototype.playAgain = function (ui) {
    clearInterval(this.namePrint);
    clearInterval(this.underLine);
    $(window).off("keydown");
    ui.clearRect(400, 130, 800, 600);
    ui.fillText("Score saved!", 600, 250);
    ui.fillText("Play again?", 600, 300);
    ui.fillText("Press enter for new game", 600, 350);
    var that = this;

    var waitForEnter = $(window).on('keydown', function(e) {
      if (e.keyCode === 13) {
        ui.clearRect(0, 0, 800, 600);
        $(window).off("keydown");
        that.reset();
        that.start();
      }
    });
  };


})();
