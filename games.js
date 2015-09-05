
var PlayerSide = {
    LEFT: 1,
    RIGHT: 2
};
var canvas = {
    width: 620,
    height: 480
};

var games = [];
var userToGameMap = {};

function Paddle(side) {
    this.speed = 256; // movement in pixels per second
    this.width = 10;
    this.height = 100;
    this.x = (side == PlayerSide.LEFT) ? 0 : canvas.width - this.width;
    this.y = (canvas.height - this.height) / 2;
    this.xVelocity = 0;
    this.yVelocity = 0;
}

function Ball() {
    this.radius = 10;
    this.x = canvas.width / 2 - this.radius;
    this.y = canvas.height / 2 - this.radius;
    this.xSpeed = 256; // movement in pixels per second
    this.ySpeed = 0; // movement in pixels per second
    this.width = 2 * this.radius;
    this.height = 2 * this.radius;
}
Ball.prototype.collides = function(rect) {
    return (this.x - this.radius < rect.x + rect.width &&
    this.x + this.radius > rect.x &&
    this.y - this.radius < rect.y + rect.height &&
    this.y + this.radius > rect.y);
};
Ball.prototype.isOutOnLeftSide = function() {
    return this.x - this.radius < 0;
};
Ball.prototype.isOutOnRightSide = function() {
    return this.x + this.radius > canvas.width;
};


Game = function (callback, player1, player2) {
    this.gameUpdateCallback = callback;
    this.player1 = player1;
    this.player2 = player2;
    this.canvas = canvas;
    this.leftPaddle = new Paddle(PlayerSide.LEFT);
    this.rightPaddle = new Paddle(PlayerSide.RIGHT);
    this.ball = new Ball();
    this.winner = null;
};

Game.prototype.reset = function() {
    this.leftPaddle = new Paddle(PlayerSide.LEFT);
    this.rightPaddle = new Paddle(PlayerSide.RIGHT);
    this.ball = new Ball();
    this.winner = null;
};
Game.prototype.getOtherPlayer = function(player) {
    return (player && this.player1 && player.name === player1.name)
        ? this.player1 : this.player2;
};
Game.prototype.updateKeysDown = function(keysDown, user) {
    var paddle = (user.name === this.player1.name)
        ? this.leftPaddle : this.rightPaddle;
    if (38 in keysDown) { // Player holding up
        paddle.yVelocity = -1;
    } else if (40 in keysDown) { // Player holding down
        paddle.yVelocity = 1;
    } else {
        paddle.yVelocity = 0;
    }

    if (37 in keysDown) { // Player holding left
        paddle.xVelocity = -1;
    } else if (39 in keysDown) { // Player holding right
        paddle.xVelocity = 1;
    } else {
        paddle.xVelocity = 0;
    }
};
Game.prototype.update = function(modifier) {
    this.updatePaddle(this.leftPaddle, modifier);
    this.updatePaddle(this.rightPaddle, modifier);

    this.ball.x += this.ball.xSpeed * modifier;
    this.ball.y += this.ball.ySpeed * modifier;

    if (this.ball.collides(this.leftPaddle) || this.ball.collides(this.rightPaddle)) {
        this.ball.xSpeed = -this.ball.xSpeed;
    }

    if (this.winner === null) {
        if (this.ball.isOutOnLeftSide()) {
            this.gameOver(PlayerSide.LEFT)
        } else if (this.ball.isOutOnRightSide()) {
            this.gameOver(PlayerSide.RIGHT)
        }
    }
};
Game.prototype.updatePaddle = function(paddle, modifier) {
    paddle.y += paddle.yVelocity * paddle.speed * modifier;
    paddle.x += paddle.xVelocity * paddle.speed * modifier;
};
Game.prototype.gameOver = function(looserPaddleSide) {
    console.log('game over');

    var game = this;
    game.winner = looserPaddleSide;
    setTimeout(function() {
        game.reset();
    }, 2000);
};
Game.prototype.gameLoop = function(game) {
    var now = Date.now();
    var delta = now - game.then;

    game.update(delta / 1000);

    game.gameUpdateCallback(game);

    //GameRenderer.render();


    game.then = now;

    // Request to do this again ASAP
    //setImmediate(game.gameLoop);
};
Game.prototype.start = function() {
    this.then = Date.now();
    //this.gameLoop(this);

    var game = this;
    setInterval(function(){
        game.gameLoop(game);
    }, 10);
};


// Public

module.exports = {
    Game: Game,
    games: games,
    userToGame:userToGameMap
};