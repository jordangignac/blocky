var boot = function(game) {};
boot.prototype = {
  init: function() {
    /* set background color of game early to avoid flickering */
    this.game.stage.backgroundColor = "#D4780E";

    /* disable game pause when focus is lost to avoid button click issues with iPad/iOS */
    this.game.stage.disableVisibilityChange = true;

    /* set scale mode to SHOW_ALL to maintain aspect while still showing all content */
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    /* horizontally and vertically align game in page */
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    /* refresh game scale after changes */
    this.scale.refresh();
  },
  create: function() {
    /* invisible text call to make sure web font is loaded */
    var text = this.game.add.text(0, 0, "", {
      font: "bold 100px Montserrat",
      fill: "#fefefe"
    });

    /* start preload game state boot complete */
    this.game.state.start("Preload");
  }
};
