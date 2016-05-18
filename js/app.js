// Enemy class
var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 50;
    this.height = 35;
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
    this.x = 215;
    this.y = 440;
    this.width = 74;
    this.height = 82;
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {
    // Check for collision.
    allEnemies.forEach(function(enemy) {
        var enemyPos = {
          x: enemy.x,
          y: enemy.y,
          width: enemy.width,
          height: enemy.height
        };
        var playerPos = {
          x: player.x,
          y: player.y,
          width: player.width,
          height: player.height
        };
    if (enemy.x < player.x + player.width &&
        enemy.x + enemy.width > player.x &&
        enemy.y < player.y + player.height &&
        enemy.height + enemy.y > player.y) {

            player.reset();
        }

    });

};

Player.prototype.reset = function() {
    this.x = 215;
    this.y = 440;
}

// Render the player to the screen.
Player.prototype.render = function() {
   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


Player.prototype.handleInput = function(direction) {
    var win      = 125,
        vDist    = 80,
        hDist    = 100,
        maxRight = ctx.canvas.width - 150,
        maxLeft  = 50,
        maxUp    = 5,
        maxDown  = ctx.canvas.height - 200;

    switch (direction) {
        case 'left':
            if (this.x <= maxLeft) {break;}
            this.x -= hDist;
            break;
        case 'right':
            if (this.x >= maxRight) {break;}
            this.x += hDist;
            break;
        case 'up':
            if (this.y <= win) {
                this.reset();
            } else if (this.y <= maxUp) {
                break;
            } else {
                this.y -= vDist;
            }
            break;
        case 'down':
            if (this.y >= maxDown) {break;}
            this.y += vDist;
            break;
    }
};

// Create the enemies.
// Second value is y axis. 60, 145, adn 230 work pretty well to place
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
