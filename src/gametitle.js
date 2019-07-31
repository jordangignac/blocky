var gameTitle = function(game) {};
gameTitle.prototype = {
  create: function() {
    /* set background color for game title screen */
    this.game.stage.backgroundColor = '#D4780E';
    /* create/add silhouette'd logo sprite to display as part of background */
    var imgBackground = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'brownies');
    imgBackground.tint = 0x212121;
    imgBackground.anchor.set(0.5);
    imgBackground.scale.set(0.25);
    imgBackground.alpha = 0.10;
    /* create/add game description text to center of page */
    var txtDescription = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Stack the ways of consuming pot from least on the bottom to most risky on top. Boxes turn brown when they're riskier than everything below them.", { font: 'bold 40px Montserrat', fill: '#fefefe' });
    txtDescription.align = 'center';
    txtDescription.anchor.set(0.5);
    txtDescription.wordWrap = true;
    txtDescription.wordWrapWidth = this.game.width - 100;
    /* create/add game title text */
    var txtTitle = this.game.add.text(this.game.world.centerX, 150, "Blocky-Stack", { font: 'bold 100px Montserrat', fill: '#fefefe' });
    txtTitle.align = 'center';
    txtTitle.anchor.set(0.5);
    /* create/add game start button */
    var btnStart = this.game.add.button(this.game.world.centerX, this.game.height - 150, "playbutton", this.startGame, this);
    btnStart.anchor.set(0.5);
    btnStart.scale.set(0.5);
    /* add tween animations to created game items to give pleasant slide in animation */
    this.game.add.tween(txtTitle).from( { y: -100 }, 1500, Phaser.Easing.Elastic.InOut, true);
    this.game.add.tween(txtDescription.scale).from({ x: 0.0, y: 0.0 }, 1500, Phaser.Easing.Elastic.Out, true);
    this.game.add.tween(btnStart).from( { y: this.game.height + 100 }, 1500, Phaser.Easing.Elastic.InOut, true);
    this.game.add.tween(imgBackground.scale).from({ x: 0.0, y: 0.0 }, 1500, Phaser.Easing.Elastic.Out, true, 250);
  },
  startGame: function() {
    /* start gameplay game state when boot operations are complete */
    this.game.state.start("GamePlay");
  }
};
