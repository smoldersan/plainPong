
//angular.module('Game', []);
var socket = io.connect();

// Create the canvas
//var canvas = document.createElement("canvas");
var canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");

//ctx.translate(0.5, 0.5);
//canvas.width = 620;
//canvas.height = 480;
//document.body.appendChild(canvas);

GameRenderer.init();

var leftPaddle = null;
var rightPaddle = null;
var ball = null;

var winner = null;
var game = null;

var gameOver = function(looserPaddleSide) {
    winner = looserPaddleSide;
    setTimeout(function() {
        winner = null;
        reset();
    }, 2000);
};

// Update game objects
var update = function (modifier) {

    socket.emit('user:input', keysDown);

};

// Reset the game when the player catches a monster
var reset = function () {
    //leftPaddle = new Paddle(PlayerSide.LEFT);
    //rightPaddle = new Paddle(PlayerSide.RIGHT);
    //
    //ball = new Ball();

    // Throw the monster somewhere on the screen randomly
    //monster.x = 32 + (Math.random() * (canvas.width - 64));
    //monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    if (game !== null) {
        GameRenderer.render();
    }

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
//reset();
main();

socket.on('game:start', function (data) {
    game = data;
});

socket.on('game:update', function (data) {
    game = data;
});