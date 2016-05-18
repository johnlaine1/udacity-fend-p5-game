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
    // Reset x when enemy goes off screen
    if (this.x >= ctx.canvas.width) {
        this.x = -150;
    }

    this.x = this.x + (this.speed * dt);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
var Player = function() {
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {};
Player.prototype.render = function() {};
Player.prototype.handleInput = function() {};

// Create the enemies.
// Second value is y axis. 60, 145, adn 230 work pretty well to place
// enemies is correct rows.
var enemy1 = new Enemy(0, 60, 50),
    enemy2 = new Enemy(200, 145, 60),
    enemy3 = new Enemy(400, 230, 70);

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
