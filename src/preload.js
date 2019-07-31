var preload = function(game) {};
preload.prototype = {
  preload: function() {
    /* preload general game UI images */
    this.game.load.image('playbutton', 'src/img/playbtn.png');
    this.game.load.image('helpbutton', 'src/img/helpbtn.png');
    this.game.load.image('restartbutton', 'src/img/repeatbtn.png');
    /* preload gameplay specific images */
    this.game.load.image('base', 'src/img/base.png');
    this.game.load.image('blunt', 'src/img/blunt.png');
    this.game.load.image('bong', 'src/img/bong.png');
    this.game.load.image('brownies', 'src/img/brownies.png');
    this.game.load.image('joint', 'src/img/joint.png');
    this.game.load.image('pipe', 'src/img/pipe.png');
    this.game.load.image('rsquare', 'src/img/rsquare.png');
    this.game.load.image('square', 'src/img/square.png');
    this.game.load.image('vapepen', 'src/img/vapepen.png');
    this.game.load.image('vaporizer', 'src/img/vaporizer.png');
    this.game.load.image('waterbottlebong', 'src/img/waterbottlebong.png');
    this.game.load.image('tip', 'src/img/tip.png');
    this.game.load.json('gameInfo', 'game.json');
  },
  create: function() {
    /* start gametitle state when preload operations are completed */
    this.game.state.start("GameTitle");
  }
};
