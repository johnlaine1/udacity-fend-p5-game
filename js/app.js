// Enemy class
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    var maxWidth = ctx.canvas.width;
    // Reset x when enemy goes off screen
    if (this.x >= maxWidth) {
        this.x = -150;
    }

    this.x = this.x + (this.speed * dt);
};

// Render the enemy to the screen.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
var Player = function() {
    this.defaultX = 215; // Starting x position.
    this.defaultY = 455; // Starting y position.
    this.x = this.defaultX;
    this.y = this.defaultY;
    this.vDistToMove = 80;
    this.hDistToMove = 100;
    this.wins = 0;
    this.losses = 0;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {

  var rightBorder  = ctx.canvas.width,
      leftBorder   = 0,
      topBorder     = 100,
      bottomBorder   = ctx.canvas.height - 100;

  if (this.x < leftBorder) {this.x += this.hDistToMove;}
  if (this.x > rightBorder) {this.x -= this.hDistToMove;}
  if (this.y > bottomBorder) {this.y -= this.vDistToMove;}
  if (this.y < topBorder) {this.win();}

  this.detectCollision();
};

Player.prototype.win = function() {

  this.wins += 1;
  document.getElementById("wins").textContent = this.wins;
  this.reset();
};

Player.prototype.reset = function() {
    this.x = this.defaultX;
    this.y = this.defaultY;
};

// Check if an enemy to player collision has occured.
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
            self.reset();
        }
    });
};

// Render the player to the screen.
Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


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

// Create the enemies.
// Second value is y axis. 135, 220, adn 300 work pretty well to place
// enemies is correct rows.
var enemy1 = new Enemy(0, 135, 50),
    enemy2 = new Enemy(200, 220, 60),
    enemy3 = new Enemy(400, 300, 70);

var allEnemies = [enemy1, enemy2, enemy3];

// Place the player object in a variable called player
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
