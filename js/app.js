/**
 * Represents an enemy
 * @constructor
 * @param {number} x - The starting x axis position
 * @param {number} y - The starting y axis position
 * @param {number} speed - The speed of the enemy
 */
var Enemy = function(x, y, speed) {
  this.x = x;
  this.y = y;
  this.speed = speed;
  // If you change the sprite here, make sure that it is also in the array
  // that is passes to the Resources.load function in the engine.js file
  // line 169.
  this.sprite = 'images/enemy-bug.png';
};

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
 * Render the enemy to the screen
 */
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Represents a player
 * @constructor
 */
var Player = function() {
  this.defaultX = 200; // Starting x position.
  this.defaultY = 400; // Starting y position.
  this.x = this.defaultX;
  this.y = this.defaultY;
  this.vDistToMove = 85;
  this.hDistToMove = 100;
  this.wins = 0;
  this.losses = 0;
  this.scoreMultiplier = 100;
  // If you change the sprite here, make sure that it is also in the array
  // that is passes to the Resources.load function in the engine.js file
  // line 169.
  this.sprite = 'images/char-pink-girl.png';
};

/**
 * Updates a player's position
 */
Player.prototype.update = function() {
  var rightBorder  = ctx.canvas.width - 25,
      leftBorder   = 0,
      topBorder     = 50,
      bottomBorder   = ctx.canvas.height - 200;

  // This keeps the player on the board and detects a win
  if (this.x < leftBorder) {this.x += this.hDistToMove;}
  if (this.x > rightBorder) {this.x -= this.hDistToMove;}
  if (this.y > bottomBorder) {this.y -= this.vDistToMove;}
  if (this.y < topBorder) {this.win();}

  this.detectCollision();
};

/**
 * Actions to perform when a player wins a game.
 */
Player.prototype.win = function() {
  this.wins += 1;
  this.updateScore();
  document.getElementById("wins").textContent = this.wins;
  this.reset();
};

/**
 * Actions to perform when a player loses a game.
 */
Player.prototype.lose = function() {
  this.losses += 1;
  this.updateScore();
  document.getElementById("losses").textContent = this.losses;
  this.reset();
};

/**
 * Update the player's score.
 */
Player.prototype.updateScore = function() {
  var score = (this.wins - this.losses) * (this.scoreMultiplier);
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
          x: player.x,
          y: player.y
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
 * Render the player to the screen.
 */
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Handle the input from the user.
 * Allowed inputs keys: Up, Down, Left, Right.
 * @param {string} direction - The key that was pressed.
 */
Player.prototype.handleInput = function(direction) {
  switch (direction) {
    case 'left':
        this.x -= this.hDistToMove;
        break;
    case 'right':
        this.x += this.hDistToMove;
        break;
    case 'up':
        this.y -= this.vDistToMove;
        break;
    case 'down':
        this.y += this.vDistToMove;
        break;
  }
};

/**
 * Instantiate the enemy class
 * The second parameter is the y axis. The following works well to place the
 * enemies rows 1-3 respectively: 60, 145, 230.
 */
var enemy1 = new Enemy(0, 60, 200),
    enemy2 = new Enemy(200, 145, 300),
    enemy3 = new Enemy(400, 230, 400);

var allEnemies = [enemy1, enemy2, enemy3];

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
