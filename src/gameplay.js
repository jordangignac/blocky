var gamePlay = function(game) {};
gamePlay.prototype = {
  create: function() {
    /* set background color for game */
    this.game.stage.backgroundColor = '#f0870f';
    /* start p2 physics system and define some physics parameters for the game */
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.friction = 1;
    this.game.physics.p2.gravity.y = 2000;
    this.game.physics.p2.restitution = 0.15;
    /* define global variables for gameplay prototype */
    this.mouseActive = false;
    this.isActive = false;
    this.seconds = 0;
    this.milliseconds = 0;
    this.isRunning = false;
    this.lastBlocks = [];
    /* define p2 physics body for mouse click handling */
    this.mouseBody = new p2.Body();
    this.game.physics.p2.world.addBody(this.mouseBody);
    /* create physics group for all objects in the scene */
    this.objectGroup = this.game.add.physicsGroup(Phaser.Physics.P2JS);
    /* json containing levellist, textlist, and answer key */
    this.gameInfo = this.game.cache.getJSON('gameInfo');
    /* calls functions to create and add UI and game objects to the game world */
    this.createUI();
    this.createObjects();
    /* sets up callback functions for game click and move event handlers */
    this.game.input.onDown.add(this.mouseDown, this);
    this.game.input.onUp.add(this.mouseUp, this);
    this.game.input.addMoveCallback(this.moveCall, this);
  },
  createUI: function() {
    /* create/add description text to top of screen as a reminder of game instructions */
    this.txtDescription = this.game.add.text(15, 10, "Stack the blocks on\nthe platform from\nleast to most harmful.\n", { font: 'bold 60px Montserrat', fill: '#fefefe' });
    /* create/add timer text to middle of the screen to be updated by updateCounter function */
    this.txtTimer = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "0.0", { font: 'bold 150px Montserrat', fill: '#fefefe' });
    this.txtTimer.anchor.set(0.5);
    this.txtTimer.alpha = 0.5;
    /* create/add hint button */
    // this.btnHint = this.game.add.button(this.game.width - 15, 15, 'helpbutton');
    // this.btnHint.scale.setTo(0.12, 0.12);
    // this.btnHint.anchor.setTo(1.0, 0.0);
    /* add tween animations to created UI elements to give pleasant slide in animation */
    // this.game.add.tween(this.btnHint.scale).from( { x: 0.0, y: 0.0 }, 1500, Phaser.Easing.Elastic.Out, true, 1000);
    this.game.add.tween(this.txtDescription).from( { y: -500 }, 2000, Phaser.Easing.Elastic.InOut, true);
    this.game.add.tween(this.txtTimer).from( { y: -500 }, 1500, Phaser.Easing.Elastic.InOut, true);
  },
  createObjects: function() {
    /* create base platform sprite to be used as a starting block, hence having a correct and order property */
    var base = this.game.make.sprite(this.game.world.centerX, this.game.height - 25, 'base');
    base.order = -1;
    base.correct = 1;
    base.anchor.set(0.5);
    base.scale.setTo(0.60, 1.0);
    this.objectGroup.add(base);
    base.body.static = true;
    /* create bottom static world boundary */
    var bottom = this.game.make.sprite(0, this.game.height + 20, 'base');
    bottom.tint = 0x985825;
    bottom.level = true;
    bottom.anchor.set(0);
    bottom.scale.setTo(10, 0.3);
    this.objectGroup.add(bottom);
    bottom.body.static = true;
    /* create top static world boundary */
    var top = this.game.make.sprite(0, -20, 'base');
    top.tint = 0x985825;
    top.level = true;
    top.anchor.set(0);
    top.scale.setTo(10, 0.3);
    this.objectGroup.add(top);
    top.body.static = true;
    /* create left static world boundary */
    var left = this.game.make.sprite(-20, 0, 'base');
    left.tint = 0x985825;
    left.level = true;
    left.anchor.set(0);
    left.scale.setTo(0.10, 20);
    this.objectGroup.add(left);
    left.body.static = true;
    /* create right static world boundary */
    var right = this.game.make.sprite(this.game.width + 20, 0, 'base');
    right.tint = 0x985825;
    right.level = true;
    right.anchor.set(0.5);
    right.scale.setTo(0.10, 20);
    this.objectGroup.add(right);
    right.body.static = true;
    /* loop to create game blocks, can be adjusted for difficulty */
    for (var i=0; i<4; i++) {
      var rand = null; flag = true;
      /* loops until a unique value is randomized for the next block */
      while(flag) {
        flag = false;
        rand = this.game.rnd.integerInRange(0, 7);
        for (var i=0; i<this.lastBlocks.length; i++) {
          if (this.lastBlocks[i] == rand) { flag = true; }
        }
      }
      /* add new randomized block to the list */
      this.lastBlocks.push(rand);
      /* create game block sprite using randomized value and object array */
      var block = this.game.make.sprite(this.game.rnd.integerInRange(100, this.game.width - 100), 100, 'square');
      block.order = this.gameInfo.gameDesc[rand].order;
      block.correct = 0;
      block.anchor.set(0.5);
      block.scale.set(0.55);
      this.objectGroup.add(block);
      /* add an image sprite from the object array to the block sprite, for easy management */
      block.img = this.game.add.sprite(this.game.rnd.integerInRange(100, this.game.width-100), 50, this.gameInfo.gameItems[rand]);
      block.img.anchor.set(0.5, 0.5);
      block.img.scale.set(0.065);
      /* scale the sprite based on image */
      if (this.gameInfo.gameItems[rand] == 'bong'){
        block.img.scale.set(0.075);
      }
      else if (this.gameInfo.gameItems[rand] == 'brownies') {
        block.img.scale.set(0.045);
      }
      /* add a text object to the block property to be used as tooltip */
      block.text = this.game.add.text(block.x, block.y, this.gameInfo.gameDesc[rand].name, { font: 'bold 35px Montserrat', fill: '#fefefe' });
      block.text.align = 'center';
      block.text.anchor.set(0.5);
      block.text.wordWrap = true;
      block.text.wordWrapWidth = block.width * 2.5;
      /* add a background image sprite for the text object above */
      block.textframe = this.game.add.sprite(block.x, block.y, 'rsquare');
      block.textframe.anchor.set(0.5);
      block.textframe.width = block.text.width + 10;
      block.textframe.height = block.text.height + 5;
      /* bring text object to top above frame and other sprites in scene */
      block.text.bringToTop();
      block.text.kill();
      block.textframe.kill();
    }
    /* after all blocks are created set game to running status */
    this.isRunning = true;
  },
  update: function() {
    /* check if game is running before calling any update functions */
    if (this.isRunning) {
      /* call update functions for block images and tint reset */
      this.syncPics();
      this.resetStack();
      /* call check correct function to determine if the entire stack is correct */
      if (this.checkCorrect()){
        /* stop the game from running and stop timer events */
        this.isRunning = false;
        this.game.time.events.stop();
        /* create/add restart button */
        var btnRestart = this.game.add.button(this.game.world.centerX, this.game.height - 150, "restartbutton", this.restart,this);
        btnRestart.anchor.set(0.5);
        btnRestart.scale.setTo(0.5, 0.5);
        /* delete constraint if it happens to still exist */
        this.game.physics.p2.removeConstraint(this.mouseConstraint);
        /* loop through all blocks and destroys parent and child sprites */
        for (var i=0; i<this.objectGroup.children.length; i++) {
          if (!this.objectGroup.children[i].level && this.objectGroup.children[i].order>-1){
            this.objectGroup.children[i].img.destroy();
            this.objectGroup.children[i].text.destroy();
            this.objectGroup.children[i].textframe.destroy();
          }
        }
        /* delete block group when all children have been destroyed */
        this.objectGroup.destroy();
        /* add tween animation to ui elements to slide them in or out */
        this.game.add.tween(this.txtTimer).to( { y: 150 }, 2000, Phaser.Easing.Elastic.InOut, true);
        this.game.add.tween(this.txtTimer).to( { alpha: 1.0 }, 2000, Phaser.Easing.Quartic.Out, true);
        this.game.add.tween(this.txtDescription).to( { y: -500 }, 1000, Phaser.Easing.Elastic.InOut, true);
        this.game.add.tween(btnRestart).from( { y: this.game.height + 150 }, 2000, Phaser.Easing.Elastic.InOut, true, 500);
        // this.game.add.tween(this.btnHint.scale).to( { x: 0.0, y: 0.0 }, 1000, Phaser.Easing.Elastic.In, true);
        this.getTips();
      }
    }
  },
  syncPics: function() {
    /* loops through all block objects and syncs image and tooltip child sprites */
    for (var i=0; i<this.objectGroup.children.length; i++) {
      var element = this.objectGroup.children[i];
      if (!element.body.static) {
        element.img.x = this.objectGroup.children[i].x;
        element.img.y = this.objectGroup.children[i].y;
        element.text.x = element.x;
        element.text.y = element.y - 150;
        element.textframe.x = element.x;
        element.textframe.y = element.y - 150;
        element.textframe.bringToTop();
        element.text.bringToTop();
      }
    }
  },
  checkCorrect: function() {
    var count = 0;
    /* loop through all blocks and check if they are correct, adding to count variable if true */
    for (var i=0; i<this.objectGroup.children.length; i++) {
      var element = this.objectGroup.children[i];
      if (element.correct == 1) { count++; }
    }
    /* if number of correct blocks is equal to block number return true else false */
    if (count == this.objectGroup.children.length - 4) { return true; }
    return false;
  },
  resetStack: function() {
    /* loop through all block objects */
    for (var i=0; i<this.objectGroup.children.length; i++) {
      var element = this.objectGroup.children[i];
      if (!element.body.static) {
        /* set all blocks to incorrect when they are not currently correct, and resets tint */
        element.correct = 0;
        element.tint = 0xfefefe;
      }
      /* calls function to check if blocks are stacked after reset to avoid unwanted tint colors and bugs */
      this.checkStack();
    }
  },
  checkStack: function() {
    /* loops through all blocks in object group */
    for (var i=0; i<this.objectGroup.children.length; i++) {
      var block1 = this.objectGroup.children[i];
      /* only check where block is correct */
      if (block1.correct == 1) {
        /* again loop through objects to check position against other objects */
        for (var t=0; t<this.objectGroup.children.length; t++) {
          var block2 = this.objectGroup.children[t];
          /* apply specific collision area checking if it is not the base platform */
          if (!block1.body.static){
            /* check area above block, if block occupies zone then tint and set as correct */
              if ((block2.y >= (block1.y - (block1.height))) &&
                (block2.y <= block1.y) &&
                (block2.x >= (block1.x - (block1.width/2))) &&
                (block2.x <= (block1.x + (block1.width/2))) &&
                (block2.order >= block1.order)) {
                  block2.correct = 1;
                  block2.tint = 0x985825;
              }
          } else {
            /* check area above base platform block, if block occupies zone then tint and set as correct */
            if ((block2.y >= (block1.y - (block1.height * 2))) &&
              (block2.y <= block1.y) &&
              (block2.x >= (block1.x - (block1.width/2))) &&
              (block2.x <= (block1.x + (block1.width/2))) &&
              (block2.order >= block1.order)) {
                block2.correct = 1;
                block2.tint = 0x985825;
            }
          }
        }
      }
    }
  },
  getTips: function() {
    var lastTips = [];
    var tips = [];
    for (var i=0; i<3; i++) {
      var rand = null; flag = true;
      /* loops until a unique value is randomized for the next block */
      while(flag) {
        flag = false;
        rand = this.game.rnd.integerInRange(0, this.gameInfo.tips.length - 1);
        for (var t=0; t<lastTips.length; t++) {
          if (lastTips[t] == rand) { flag = true; }
        }
      }
      lastTips.push(rand);
      /* create main tip body sprite */
      var body = this.game.add.sprite(this.game.world.centerX, 400, 'tip');
      body.anchor.set(0.5);
      body.scale.set(0.35);
      /* increment location if array isnt empty */
      if (tips.length) {
        body.y = (tips[i-1].y + tips[i-1].height) + 20;
      }
      /* add image as child of body */
      body.img = this.game.add.sprite((body.x - body.width/2) + 90, body.y, this.gameInfo.tips[rand].image);
      body.img.anchor.set(0.5);
      /* set scale based on image, needed because of image size inconsistencies */
      if (rand == 2){
        body.img.scale.setTo(0.04, 0.04);
      }
      else {
        body.img.scale.setTo(0.07, 0.07);
      }
      /* add text as child of body */
      body.txt = this.game.add.text(body.x + 75, body.y, this.gameInfo.tips[rand].message,  { font: '25px Montserrat', fill: '#212121' })
      body.txt.anchor.set(0.5);
      body.txt.wordWrap = true;
      body.txt.wordWrapWidth = 425;
      tips.push(body);
    }
    for (var i=0; i<tips.length; i++) {
      this.game.add.tween(tips[i]).from({ x: this.game.width + 500 }, 1500, Phaser.Easing.Elastic.Out, true, 1500 + (i* 100));
      this.game.add.tween(tips[i].img).from({ x: this.game.width + 500 }, 1500, Phaser.Easing.Elastic.Out, true, 1500 + (i* 100));
      this.game.add.tween(tips[i].txt).from({ x: this.game.width + 500 }, 1500, Phaser.Easing.Elastic.Out, true, 1500 + (i* 100));
    }
    //this.game.add.tween(tips).from({ x: this.game.width + 500 }, 1500, Phaser.Easing.Elastic.Out, true, 1500);
  },
  updateCounter: function() {
    /* checks if game is running before updating game counter, allowing for paused states */
    if (this.isRunning) {
      /* increment milliseconds and use modulus to keep it in the range 0-9 */
      this.milliseconds = (this.milliseconds + 1) % 10;
      /* increment seconds every 10 milliseconds */
      if (this.milliseconds % 10 == 0) { this.seconds++; }
      /* add seconds and milliseconds to timer text with some formatting */
      this.txtTimer.text = this.seconds + '.' + this.milliseconds + 's';
    }
  },
  moveCall: function(pointer) {
    /* set mouse p2 physics body to position of the pointer whenever it moves */
    this.mouseBody.position[0] = this.game.physics.p2.pxmi(pointer.position.x);
    this.mouseBody.position[1] = this.game.physics.p2.pxmi(pointer.position.y);
  },
  mouseUp: function() {
    this.mouseActive = false;
    /* remove physics constraint on mouse up */
    this.game.physics.p2.removeConstraint(this.mouseConstraint);
    /* loops through all game objects and removes tooltips with kill so they can be used again  */
    for (var i=0; i<this.objectGroup.children.length; i++) {
      if (!this.objectGroup.children[i].body.static) {
        this.objectGroup.children[i].text.kill();
        this.objectGroup.children[i].textframe.kill();
      }
    }
  },
  mouseDown: function(pointer) {
    if (this.mouseActive == false) {
      this.mouseActive = true;
      /* get array of clicked bodies at pointer location */
      var bodies = this.game.physics.p2.hitTest(pointer.position);
      /* get coordinates in p2 physics world from pointer position */
      var physicsPos = [this.game.physics.p2.pxmi(pointer.position.x), this.game.physics.p2.pxmi(pointer.position.y)];
      /* if a body has actually been clicked */
      if (bodies.length) {
        /* checks if game is active, if not only starts game timers when block is clicked for the first time */
        if (!this.isActive) {
          this.isActive = true;
          this.game.time.events.start();
          this.game.time.events.loop(Phaser.Timer.SECOND / 10, this.updateCounter, this);
        }
        /* get first body from array since there will only be one possible */
        var clickedBody = bodies[0];
        /* revive tooltip text and frame to disply to player */
        clickedBody.parent.sprite.text.revive();
        clickedBody.parent.sprite.textframe.revive();
        /* add lock constraint to lock clicked body to pointer until mouseup */
        this.mouseConstraint = this.game.physics.p2.createLockConstraint(this.mouseBody, clickedBody, [0,0]);
      }
    }
  },
  restart: function() {
    /* start gametitle game state when gameplay is completed to restart */
    this.game.state.start("GameTitle", true, false);
  }
};
