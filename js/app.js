
/**
 * Constants
 */
var TILE_WIDTH  = 83; // The width of a tile on the board.
    TILE_HEIGHT = 101; // The height of a tile on the board.

/**
 * Represents a character.
 * @constructor
 * @param {number} x - The initial x coordinate of the character.
 * @param {number} y - The initial y corrdinate of the character.
 */
var Character = function(x, y) {
  this.x = x;
  this.y = y;
};

/**
 * Render the character to the screen
 */
Character.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Represents an enemy
 * This is a subclass of Character
 * @constructor
 * @param {number} x - The starting x axis position
 * @param {number} y - The starting y axis position
 * @param {number} speed - The speed of the enemy
 */
var Enemy = function(x, y, speed) {
  Character.call(this, x, y);
  this.speed = speed;
  // If you change the sprite here, make sure that it is also in the array
  // that is passes to the Resources.load function in the engine.js file
  // line 169.
  this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Update the enemy's position
 * @param {number} dt - a time delta between ticks, helps regulate speed between different systems
 */
Enemy.prototype.update = function(dt) {
  var maxWidth = ctx.canvas.width;

  // Reset x when enemy goes off screen
  if (this.x >= maxWidth) {
      this.x = -150;
  }
  this.x = this.x + (this.speed * dt);
};

/**
 * Represents a player
 * @constructor
 */
var Player = function() {
  Character.call(this);
  this.defaultX = 200; // Starting x position.
  this.defaultY = 400; // Starting y position.
  this.x = this.defaultX;
  this.y = this.defaultY;
  this.wins = 0;
  this.losses = 0;
  this.tokens = 0;
  this.scoreMultiplier = 100;
  this.bonusMultiplier = 1000;
  // If you change the sprite here, make sure that it is also in the array
  // that is passes to the Resources.load function in the engine.js file
  // line 169.
  this.sprite = 'images/char-pink-girl.png';
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/**
 * Updates a player's position
 */
Player.prototype.update = function() {
  var rightBorder  = ctx.canvas.width - 25,
      leftBorder   = -2,
      topBorder     = 50,
      bottomBorder   = ctx.canvas.height - 200;

  // This keeps the player on the board and detects a win
  if (this.x < leftBorder) {this.x += TILE_HEIGHT;}
  if (this.x > rightBorder) {this.x -= TILE_HEIGHT;}
  if (this.y > bottomBorder) {this.y -= TILE_WIDTH;}
  if (this.y < topBorder) {this.win();}

  this.detectCollision();
};

/**
 * Actions to perform when a player wins a game.
 */
Player.prototype.win = function() {
  this.wins += 1;
  this.updateScore();
  this.reset();
};

/**
 * Actions to perform when a player loses a game.
 */
Player.prototype.lose = function() {
  this.losses += 1;
  this.updateScore();
  this.reset();
};

/**
 * Update the player's score.
 */
Player.prototype.updateScore = function() {
  var score = (this.wins - this.losses) * (this.scoreMultiplier);
  score += (this.tokens * this.bonusMultiplier);
  document.getElementById("wins").textContent = this.wins;
  document.getElementById("losses").textContent = this.losses;
  document.getElementById("tokens").textContent = this.tokens;
  document.getElementById("score").textContent = score;
};

/**
 * Actions to take in order to reset the game. This is called when a
 * player wins or loses a game.
 */
Player.prototype.reset = function() {
  this.x = this.defaultX;
  this.y = this.defaultY;
};

/**
 * Detect if a collision between an enemy and player has occured.
 */
Player.prototype.detectCollision = function() {
  var self = this;

  allEnemies.forEach(function(enemy) {
      var enemyPos = {
          radius: 35,
          x: enemy.x,
          y: enemy.y
      };
      var playerPos = {
          radius: 40,
          x: self.x,
          y: self.y
      };
      var dx = enemyPos.x - playerPos.x;
      var dy = enemyPos.y - playerPos.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < enemyPos.radius + playerPos.radius) {
          self.lose();
      }
  });
};

/**
 * Handle the input from the user.
 * Allowed inputs keys: Up, Down, Left, Right.
 * @param {string} direction - The key that was pressed.
 */
Player.prototype.handleInput = function(direction) {
  switch (direction) {
    case 'left':
        this.x -= TILE_HEIGHT;
        break;
    case 'right':
        this.x += TILE_HEIGHT;
        break;
    case 'up':
        this.y -= TILE_WIDTH;
        break;
    case 'down':
        this.y += TILE_WIDTH;
        break;
  }
};

/**
 * Represents the token system.
 * @constructor
 */
var Token = function() {
  this.timer = 0;
  this.interval = 200;
  this.sprite = null;
  this.x = 205;
  this.y = 75;
};

/**
 * This stores all possible x coordinates where a token can be placed.
 */
Token.prototype.xCoordsList = [5, 105, 205, 305, 405];

/**
 * This stores all possible y coordinates where a token can be placed.
 */
Token.prototype.yCoordsList = [75, 155, 240];

/**
 * A list of strings of all possible sprite images.
 */
Token.prototype.spriteList = [
    'images/Star.png',
    'images/Key.png',
    'images/Heart.png'
  ];

/**
 * Update the tokens position.
 * Randomly select a location on the board and place a random token
 */
Token.prototype.update = function() {
  this.timer += 1;

  // Check the timer, if past the interval place a random token
  // in a random location,
  if (this.timer > this.interval) {
    this.sprite = this.spriteList[Math.floor(Math.random() * this.spriteList.length)];
    this.x = this.xCoordsList[Math.floor(Math.random() * this.xCoordsList.length)];
    this.y = this.yCoordsList[Math.floor(Math.random() * this.yCoordsList.length)];

    // Reset the timer.
    this.timer = 0
  }
  this.detectCapture();
};

/**
 * Detect if the player has succesfully captured a token.
 */
Token.prototype.detectCapture = function() {
  var tokenPos = {
    radius: 20,
    x: this.x,
    y: this.y
  };
  var playerPos = {
    radius: 20,
    x: player.x,
    y: player.y
  };
  var dx = tokenPos.x - playerPos.x;
  var dy = tokenPos.y - playerPos.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < tokenPos.radius + playerPos.radius) {
        this.tokenCapture();
    }
};

/**
 * Render the token to the canvas.
 */
Token.prototype.render = function() {
  if (this.sprite !== null) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
};

/**
 * Actions to perform when a token is captured.
 */
Token.prototype.tokenCapture = function() {
  player.tokens += 1;
  player.updateScore();
  this.reset();

};

/**
 * Actions to perform in order to reset the token system.
 */
Token.prototype.reset = function() {
  this.sprite = null;
  this.x = 0;
  this.y = 0;
};

/**
 * Instantiate token object.
 */
var token = new Token();

/**
 * Instantiate the enemy class
 * The second parameter is the y axis. The following works well to place the
 * enemies rows 1-3 respectively: 60, 145, 230.
 */
/*var enemy1 = new Enemy(0, 60, 50),
    enemy2 = new Enemy(200, 145, 75),
    enemy3 = new Enemy(400, 230, 25),
    enemy4 = new Enemy(300, 145, 60);*/

// var allEnemies = [enemy1, enemy2, enemy3, enemy4];

/**
 * Instantiate the player
 */
var player = new Player();

/**
 * This listens for key presses and passes the information on to the
 * handleInput method on the player object.
 */
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

