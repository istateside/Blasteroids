(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var GameScore = Asteroids.GameScore = Parse.Object.extend("GameScore", {
    initialize: function (options) {
      this.score = options.score;
      this.username = options.username;
    }
  }
}());
